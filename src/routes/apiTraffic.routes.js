import { Router } from "express";
import ApiTrafficController from "../controllers/apiTraffic.controller.js";
const apiRoutes = Router();
const apiTrafficController = new ApiTrafficController();

apiRoutes.post("/add", apiTrafficController.addTraffic);
apiRoutes.get("/overview", apiTrafficController.getTrafficOverivew);
apiRoutes.get("/routes-overview", apiTrafficController.getRoutesTraffic);
apiRoutes.get("/hourly", apiTrafficController.getHourTraffic);
apiRoutes.get("/route", apiTrafficController.getRouteTraffic);

export default apiRoutes;
