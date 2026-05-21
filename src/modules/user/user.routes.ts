import { Router } from "express";
import { UserController } from "./user.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";

const usuarioRoutes = Router();
const usuarioController = new UserController();

usuarioRoutes.post("/", (req, res) => usuarioController.handleCreate(req, res));

usuarioRoutes.get(
  "/", 
  ensureAuthenticated, 
  ensureRole(["ADMIN", "GERENTE"]), 
  (req, res) => usuarioController.handleList(req, res)
);

usuarioRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureRole(["ADMIN", "GERENTE"]),
  (req, res) => usuarioController.handleShow(req, res)
);

usuarioRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureRole(["ADMIN"]),
  (req, res) => usuarioController.handleUpdate(req, res)
);

usuarioRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureRole(["ADMIN"]),
  (req, res) => usuarioController.handleDelete(req, res)
);

export { usuarioRoutes };