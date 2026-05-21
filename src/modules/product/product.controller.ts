// import { Request, Response } from "express";
// import { ProductService } from "./product.service";

// export class ProductController {
//   private productService = new ProductService();

//   async handleCreate(req: Request, res: Response) {
//     const product = await this.productService.create(req.body);
//     return res.status(201).json(product);
//   }

//   async handleList(req: Request, res: Response) {
//     const products = await this.productService.findAll();
//     return res.json(products);
//   }

//   async handleUpdate(req: Request, res: Response) {
//     const { id } = req.params;
//     const product = await this.productService.update(id as string, req.body);
//     return res.json(product);
//   }

//   async handleDelete(req: Request, res: Response) {
//     const { id } = req.params;
//     await this.productService.delete(id as string);
//     return res.status(204).send();
//   }

//   async handleShow(req: Request, res: Response) {
//     const { id } = req.params;
//     const product = await this.productService.findById(id as string);
//     return res.json(product);
//   }
// }