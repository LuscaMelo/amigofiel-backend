import { Router } from "express";
import AnimalController from "../controllers/animalController.js"
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", AnimalController.getAll);
router.get("/:id", AnimalController.getById);
router.post("/", authMiddleware, AnimalController.create);
router.put("/:id", authMiddleware, AnimalController.update);
router.patch("/:id/adopt", authMiddleware, AnimalController.markAsAdopted);
router.delete("/:id", authMiddleware, AnimalController.delete);

export default router;