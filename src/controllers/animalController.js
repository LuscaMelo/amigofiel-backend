import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import path from 'path';
import cloudinary from "../config/cloudinary.js";

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

    // Criar um animal
    async create(req, res) {
        try {
            const { name, type, gender, size, age, description, neutered, adopted } = req.body;

            let uploadedImages = [];

            // Upload de imagens para o Cloudinary
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const url = await uploadToCloudinary(file.buffer);
                    uploadedImages.push(url);
                }
            }

            const animal = await prisma.animal.create({
                data: {
                    name,
                    type,
                    gender,
                    size,
                    age: Number(age),
                    description,
                    neutered: neutered === "true",
                    adopted: adopted === "true",
                    images: uploadedImages
                },
            });

            res.status(201).json({
                success: true,
                message: "Animal criado com sucesso",
                data: animal,
            });

        } catch (error) {
            console.log(error);
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

            // Remover imagens do Cloudinary
            if (animal.images && animal.images.length > 0) {
                const deletePromises = animal.images.map(url => {
                    const publicId = url.split("/").pop().split(".")[0]; // pega o nome sem extensão
                    return cloudinary.uploader.destroy(`amigo-fiel/${publicId}`);
                });

                await Promise.all(deletePromises);
            }


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
    },

};

export default AnimalController;
