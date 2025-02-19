import express from "express";
import animalRoutes from "./routes/animalRoutes.js";

const app = express();

app.use(express.json());
app.use("/animais", animalRoutes);

export default app;
