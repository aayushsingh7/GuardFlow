import { Router } from "express";
import ReportController from "../controllers/report.controller.js";
const reportRoutes = Router();
const reportController = new ReportController();

reportRoutes.post("/add", reportController.addScanReport);
reportRoutes.get("/", reportController.getScanReports);
reportRoutes.get("/latest-report", reportController.getScanReport);

export default reportRoutes;
