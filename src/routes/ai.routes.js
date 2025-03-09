import { Router } from "express";
import AIController from "../controllers/ai.controller.js";
const aiRoutes = Router();
const aiController = new AIController();

aiRoutes.put("/chat", aiController.aiChat);
aiRoutes.get("/traffic-summary", aiController.getSummary);

export default aiRoutes;
