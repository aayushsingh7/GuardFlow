import { Router } from "express";
import OrganizationControllers from "../controllers/organization.controller.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
const orgRoutes = Router();
const orgController = new OrganizationControllers();

orgRoutes.put("/register", orgController.register);
orgRoutes.post("/login", orgController.login);
orgRoutes.get("/auth", authenticateJWT, orgController.authenticateOrg);
orgRoutes.delete("/logout", orgController.logout);

export default orgRoutes;
