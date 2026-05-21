import { Router } from "express";
import { usuarioRoutes } from "./modules/user/user.routes";
import { lojaRoutes } from "./modules/store/store.routes";
import { marcaRoutes } from "./modules/brand/brand.routes";
// import { produtoRoutes } from "./modules/product/product.routes";
import { mixProdutoRoutes } from "./modules/productMix/productMix.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", usuarioRoutes);
routes.use("/stores", lojaRoutes);
routes.use("/brands", marcaRoutes);
// routes.use("/products", produtoRoutes);
routes.use("/mixes", mixProdutoRoutes);

export { routes };