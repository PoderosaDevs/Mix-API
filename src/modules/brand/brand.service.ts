import { prisma } from "../../lib/prisma";

export class BrandService {
  async create(data: { nome: string }) {
    const normalizedName = data.nome.trim();

    const brandExists = await prisma.marca.findFirst({
      where: {
        nome: normalizedName
      },
    });

    if (brandExists) {
      throw new Error("Já existe uma marca cadastrada com este nome.");
    }

    return await prisma.marca.create({
      data: {
        nome: normalizedName,
      },
    });
  }

  async findAll() {
    return await prisma.marca.findMany({
      include: {
        _count: {
          select: { 
            mixes: true 
          }
        }
      },
      orderBy: { 
        nome: 'asc' 
      }
    });
  }

  async findById(id: string) {
    return await prisma.marca.findUnique({
      where: { id },
      include: {
        mixes: true,
        _count: {
          select: { 
            mixes: true 
          }
        }
      }
    });
  }

  async update(id: string, data: { nome: string }) {
    const brandExists = await prisma.marca.findFirst({
      where: {
        nome: data.nome.trim(),
        NOT: { id }
      }
    });

    if (brandExists) {
      throw new Error("Já existe outra marca com este nome.");
    }

    return await prisma.marca.update({
      where: { id },
      data: {
        nome: data.nome.trim()
      }
    });
  }

  async delete(id: string) {
    const mixUsingBrand = await prisma.mixProduto.findFirst({
      where: { marcaId: id }
    });

    if (mixUsingBrand) {
      throw new Error("Não é possível excluir uma marca vinculada a perfis de mix.");
    }

    return await prisma.marca.delete({
      where: { id }
    });
  }
}