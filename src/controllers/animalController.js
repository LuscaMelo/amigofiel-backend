import { PrismaClient } from '@prisma/client';

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
            const animal = await prisma.animal.create({
                data: req.body,
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
            const animal = await prisma.animal.update({
                where: { id: req.params.id },
                data: req.body,
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

    // Deletar um animal
    async delete(req, res) {
        try {
            await prisma.animal.delete({
                where: { id: req.params.id },
            });
            res.status(204).json({
                success: true,
                message: "Animal removido com sucesso",
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
