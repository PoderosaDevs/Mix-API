// import { Router } from "express";
// import { ProductController } from "./product.controller";
// import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
// import { ensureRole } from "../../middlewares/ensureRole";

// const produtoRoutes = Router();
// const produtoController = new ProductController();

// produtoRoutes.post(
//   "/", 
//   ensureAuthenticated, 
//   ensureRole(["ADMIN", "GERENTE"]), 
//   (req, res) => produtoController.handleCreate(req, res)
// );

// produtoRoutes.get(
//   "/", 
//   ensureAuthenticated, 
//   (req, res) => produtoController.handleList(req, res)
// );

// produtoRoutes.get(
//   "/:id", 
//   ensureAuthenticated, 
//   (req, res) => produtoController.handleShow(req, res)
// );

// produtoRoutes.put(
//   "/:id", 
//   ensureAuthenticated, 
//   ensureRole(["ADMIN", "GERENTE"]), 
//   (req, res) => produtoController.handleUpdate(req, res)
// );

// produtoRoutes.delete(
//   "/:id", 
//   ensureAuthenticated, 
//   ensureRole(["ADMIN"]), 
//   (req, res) => produtoController.handleDelete(req, res)
// );

// export { produtoRoutes };