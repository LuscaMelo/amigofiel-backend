import express from 'express';
import cors from 'cors';
import animalRoutes from './routes/animalRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Configurando as rotas
app.use('/animals', animalRoutes);
app.use('/auth', authRoutes);

export default app;

