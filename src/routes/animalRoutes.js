import { Router } from "express";
import AnimalController from "../controllers/animalController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = Router();

// Rotas públicas
router.get("/", AnimalController.getAll);
router.get("/:id", AnimalController.getById);

// Rotas protegidas (somente admin pode acessar)
router.post("/", authMiddleware, upload.array("images", 5), AnimalController.create);
router.put("/:id", authMiddleware, upload.array("images", 5), AnimalController.update);
router.patch("/:id/adopt", authMiddleware, AnimalController.markAsAdopted);
router.delete("/:id", authMiddleware, AnimalController.delete);

export default router;
