import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const AnimalController = {

    // Obter todos os animais
    async getAll(req, res) {
        try {
            const animals = await prisma.animal.findMany();
            res.status(200).json({
                success: true,
                message: "Animais encontrados com sucesso",
                data: animals,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erro ao buscar os animais",
                error: error.message,
            });
        }
    },

    // Obter um animal por ID
    async getById(req, res) {
        try {
            const animal = await prisma.animal.findUnique({
                where: { id: req.params.id },
            });
            if (!animal) {
                return res.status(404).json({
                    success: false,
                    message: "Animal não encontrado",
                });
            }
            res.status(200).json({
                success: true,
                message: "Animal encontrado",
                data: animal,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erro ao buscar o animal",
                error: error.message,
            });
        }
    },

    // Criar um novo animal
    async create(req, res) {
        try {
            const { name, type, gender, size, age, description, neutered, adopted } = req.body;

            const animalData = {
                name,
                type,
                gender,
                size,
                age: Number(age),
                description,
                neutered: Boolean(neutered),
                adopted: Boolean(adopted),
                images: req.files.map(file => `uploads/${file.filename}`)
            };

            const animal = await prisma.animal.create({
                data: animalData,
            });

            res.status(201).json({
                success: true,
                message: "Animal criado com sucesso",
                data: animal,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erro ao criar o animal",
                error: error.message,
            });
        }
    },

    // Atualizar um animal
    async update(req, res) {
        try {
            const { name, type, gender, size, age, description, neutered, adopted, images } = req.body;

            const animalData = {
                name,
                type,
                gender,
                size,
                age: Number(age),
                description,
                neutered: Boolean(neutered),
                adopted: Boolean(adopted),
                images
            };

            const animal = await prisma.animal.update({
                where: { id: req.params.id },
                data: animalData,
            });
            res.status(200).json({
                success: true,
                message: "Animal atualizado com sucesso",
                data: animal,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "Animal não encontrado",
                error: error.message,
            });
        }
    },

    // Apagar animal e suas imagens
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Buscar o animal no banco para obter as imagens
            const animal = await prisma.animal.findUnique({
                where: { id },
            });

            if (!animal) {
                return res.status(404).json({
                    success: false,
                    message: "Animal não encontrado",
                });
            }

            // Obtendo o diretório raiz do projeto (onde está uploads/)
            const rootDir = path.resolve();

            // Excluir as imagens do sistema de arquivos
            animal.images.forEach(image => {
                const imageFileName = path.basename(image);
                const imagePath = path.join(rootDir, 'uploads', imageFileName);

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });

            // Excluir o animal do banco de dados
            await prisma.animal.delete({
                where: { id },
            });

            res.status(200).json({
                success: true,
                message: "Animal removido com sucesso",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erro ao remover o animal",
                error: error.message,
            });
        }
    },

    // Marcar animal como adotado
    async markAsAdopted(req, res) {
        try {
            const { id } = req.params;

            const animal = await prisma.animal.update({
                where: { id },
                data: { adopted: true },
            });

            res.status(200).json({
                success: true,
                message: "Animal marcado como adotado",
                data: animal,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "Animal não encontrado",
                error: error.message,
            });
        }
    }

};

export default AnimalController;
