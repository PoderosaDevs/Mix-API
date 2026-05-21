import { Router } from "express";
import { ProductMixController } from "./productMix.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";

const mixProdutoRoutes = Router();
const mixProdutoController = new ProductMixController();

mixProdutoRoutes.post(
  "/", 
  ensureAuthenticated, 
  ensureRole(["ADMIN", "GERENTE"]), 
  (req, res) => mixProdutoController.handleCreate(req, res)
);

mixProdutoRoutes.get(
  "/", 
  ensureAuthenticated, 
  ensureRole(["ADMIN", "GERENTE"]), 
  (req, res) => mixProdutoController.handleGetAll(req, res)
);

mixProdutoRoutes.post(
  "/atribuir",
  ensureAuthenticated,
  ensureRole(["ADMIN", "GERENTE"]),
  (req, res) => mixProdutoController.handleAssignToStore(req, res)
);

mixProdutoRoutes.get(
  "/:id", 
  ensureAuthenticated, 
  ensureRole(["ADMIN", "GERENTE"]), 
  (req, res) => mixProdutoController.handleGetById(req, res)
);

mixProdutoRoutes.put(
  "/:id", 
  ensureAuthenticated, 
  ensureRole(["ADMIN", "GERENTE"]), 
  (req, res) => mixProdutoController.handleUpdate(req, res)
);

mixProdutoRoutes.delete(
  "/:id", 
  ensureAuthenticated, 
  ensureRole(["ADMIN"]), 
  (req, res) => mixProdutoController.handleDelete(req, res)
);

export { mixProdutoRoutes };