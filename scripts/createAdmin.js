import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('09RJREdv70i3', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@amigofiel.com.br' },
            update: {},
            create: {
                name: 'Lucas',
                email: 'admin@amigofiel.com.br',
                password: hashedPassword,
                role: 'admin',
            },
        });

        console.log('Administrador criado:', admin);
    } catch (error) {
        console.error('Erro ao criar o administrador:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
