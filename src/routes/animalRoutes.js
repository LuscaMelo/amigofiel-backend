import { Router } from "express";
import AnimalController from "../controllers/AnimalController.js";

const router = Router();

router.get("/", AnimalController.getAll);
router.get("/:id", AnimalController.getById);
router.post("/", AnimalController.create);
router.put("/:id", AnimalController.update);
router.delete("/:id", AnimalController.delete);

export default router;