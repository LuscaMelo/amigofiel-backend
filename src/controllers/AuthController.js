import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verifica se o usuário existe
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Credenciais inválidas",
                });
            }

            // Compara a senha fornecida com a senha criptografada do banco
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Credenciais inválidas",
                });
            }

            // Gera um token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            res.status(200).json({
                success: true,
                message: "Login realizado com sucesso",
                token,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erro ao autenticar usuário",
                error: error.message,
            });
        }
    },
};

export default AuthController;
