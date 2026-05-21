import { Router } from "express";
import { StoreController } from "./store.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";

const lojaRoutes = Router();
const lojaController = new StoreController();

lojaRoutes.post(
  "/", 
  ensureAuthenticated, 
  ensureRole(["ADMIN"]), 
  (req, res) => lojaController.handleCreate(req, res)
);

lojaRoutes.get(
  "/", 
  ensureAuthenticated, 
  (req, res) => lojaController.handleList(req, res)
);

// Rota solicitada: retorna os mixes vinculados a uma loja específica
lojaRoutes.get(
  "/mixes/:id", 
  ensureAuthenticated, 
  (req, res) => lojaController.handleListMixesByStore(req, res)
);

lojaRoutes.put(
  "/:id", 
  ensureAuthenticated, 
  ensureRole(["ADMIN"]), 
  (req, res) => lojaController.handleUpdate(req, res)
);

lojaRoutes.delete(
  "/:id", 
  ensureAuthenticated, 
  ensureRole(["ADMIN"]), 
  (req, res) => lojaController.handleDelete(req, res)
);

export { lojaRoutes };