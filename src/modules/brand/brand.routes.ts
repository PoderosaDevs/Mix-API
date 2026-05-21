import { Router } from "express";
import { BrandController } from "./brand.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";

const marcaRoutes = Router();
const marcaController = new BrandController();

marcaRoutes.post(
  "/", 
  ensureAuthenticated, 
  ensureRole(["ADMIN", "GERENTE"]), 
  (req, res) => marcaController.handleCreate(req, res)
);

marcaRoutes.get(
  "/", 
  ensureAuthenticated, 
  (req, res) => marcaController.handleList(req, res)
);

marcaRoutes.get(
  "/:id", 
  ensureAuthenticated, 
  (req, res) => marcaController.handleShow(req, res)
);

marcaRoutes.put(
  "/:id", 
  ensureAuthenticated, 
  ensureRole(["ADMIN", "GERENTE"]), 
  (req, res) => marcaController.handleUpdate(req, res)
);

marcaRoutes.delete(
  "/:id", 
  ensureAuthenticated, 
  ensureRole(["ADMIN"]), 
  (req, res) => marcaController.handleDelete(req, res)
);

export { marcaRoutes };