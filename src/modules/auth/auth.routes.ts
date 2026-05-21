import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", (req, res) => authController.handle(req, res));

export { authRoutes };