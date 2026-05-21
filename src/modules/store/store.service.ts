import { prisma } from "../../lib/prisma";
import * as crypto from "crypto";

export interface CreateStoreDTO {
  nome: string;
  localizacao?: string;
}

export class StoreService {
  async create(data: CreateStoreDTO) {
    const storeToken = crypto.randomBytes(20).toString("hex");
    return await prisma.loja.create({
      data: {
        nome: data.nome,
        localizacao: data.localizacao,
        token: storeToken,
      },
    });
  }

  async findAll() {
    return await prisma.loja.findMany({
      include: {
        gerente: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        mixes: true,
        _count: {
          select: {
            mixes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findMixesByStoreId(lojaId: string) {
    const atribuições = await prisma.lojaMixAtribuido.findMany({
      where: { lojaId },
      include: {
        mix: {
          include: {
            marca: true,
          },
        },
        itens: true,
      },
    });

    return atribuições.map((atribuicao) => ({
      id: atribuicao.id,
      lojaId: atribuicao.lojaId,
      mixProdutoId: atribuicao.mixProdutoId,
      nome: atribuicao.mix.nome,
      marca: atribuicao.mix.marca?.nome || "SEM MARCA",
      itens: atribuicao.itens.map((item) => ({
        id: item.id,
        atribuicaoId: item.atribuicaoId,
        produtoId: item.produtoId,
        nomeProduto: item.nomeProduto,
        estoqueAtual: item.estoqueAtual,
        estoqueDesejado: item.estoqueDesejado,
      })),
    }));
  }

  async update(id: string, data: Partial<CreateStoreDTO>) {
    return await prisma.loja.update({
      where: { id },
      data: {
        nome: data.nome,
        localizacao: data.localizacao,
      },
    });
  }

  async delete(id: string) {
    return await prisma.loja.delete({
      where: { id },
    });
  }

  async findById(id: string) {
    return await prisma.loja.findUnique({
      where: { id },
      include: {
        gerente: true,
        mixes: {
          include: {
            mix: true,
          },
        },
      },
    });
  }
}