// import { prisma } from "../../lib/prisma";
// import { UploadService } from "../../services/cloudinary.service";

// export class ProductService {
//   private uploadService = new UploadService();

//   async create(data: {
//     nome: string;
//     sku: string;
//     marcaId: string;
//     descricao?: string;
//     imagem?: string;
//     preco?: number;
//   }) {
//     let imageUrl = data.imagem;

//     if (data.imagem && data.imagem.startsWith("data:image")) {
//       imageUrl = await this.uploadService.uploadImage(data.imagem);
//     }

//     return await prisma.produto.create({
//       data: {
//         nome: data.nome,
//         sku: data.sku,
//         marcaId: data.marcaId,
//         descricao: data.descricao,
//         imagem: imageUrl,
//         preco: data.preco?.toString(),
//       },
//     });
//   }

//   async update(
//     id: string,
//     data: {
//       nome?: string;
//       sku?: string;
//       marcaId?: string;
//       descricao?: string;
//       imagem?: string;
//       preco?: number;
//     }
//   ) {
//     let imageUrl = data.imagem;

//     if (data.imagem && data.imagem.startsWith("data:image")) {
//       imageUrl = await this.uploadService.uploadImage(data.imagem);
//     }

//     return await prisma.produto.update({
//       where: { id },
//       data: {
//         nome: data.nome,
//         sku: data.sku,
//         marcaId: data.marcaId,
//         descricao: data.descricao,
//         imagem: imageUrl,
//         preco: data.preco !== undefined ? data.preco.toString() : undefined,
//       },
//     });
//   }

//   async findAll() {
//     return await prisma.produto.findMany({
//       include: { marca: true },
//       orderBy: { criadoEm: "desc" },
//     });
//   }

//   async findById(id: string) {
//     return await prisma.produto.findUnique({
//       where: { id },
//       include: { marca: true },
//     });
//   }

//   async delete(id: string) {
//     return await prisma.produto.delete({
//       where: { id },
//     });
//   }
// }