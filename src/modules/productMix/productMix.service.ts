import { prisma } from "../../lib/prisma";

export interface CreateMixDTO {
  nome: string;
  marcaId: string;
  criadorId: string;
  itens: {
    produtoId: string;
    nomeProduto: string;
  }[];
}

export interface AssignToStoreDTO {
  lojaId: string;
  mixIds: string[];
  gerenteId?: string | null;
}

export class ProductMixService {
  private storeMixService = new StoreMixService();

  async getAllMixes() {
    try {
      return await prisma.mixProduto.findMany({
        include: {
          marca: true,
          criador: { select: { id: true, nome: true } },
          itens: true,
          _count: { select: { itens: true, lojas: true } }
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("[GET_ALL_MIXES_ERROR]:", error);
      throw error;
    }
  }

  async createMix(data: CreateMixDTO) {
    try {
      return await prisma.mixProduto.create({
        data: {
          nome: data.nome,
          marcaId: data.marcaId,
          criadorId: data.criadorId,
          itens: {
            create: data.itens.map((item) => ({
              produtoId: item.produtoId,
              nomeProduto: item.nomeProduto,
            })),
          },
        },
        include: {
          itens: true,
          marca: true
        },
      });
    } catch (error) {
      console.error("[CREATE_MIX_ERROR]:", error);
      throw error;
    }
  }

  async getMixById(id: string) {
    try {
      return await prisma.mixProduto.findUnique({
        where: { id },
        include: {
          itens: true,
          marca: true,
          criador: { select: { nome: true } }
        }
      });
    } catch (error) {
      console.error(`[GET_MIX_BY_ID_ERROR] ID ${id}:`, error);
      throw error;
    }
  }

  async updateMix(id: string, data: Partial<CreateMixDTO>) {
    try {
      return await prisma.$transaction(async (tx) => {
        if (data.itens) {
          await tx.itemMixTemplate.deleteMany({
            where: { mixProdutoId: id }
          });
        }

        return await tx.mixProduto.update({
          where: { id },
          data: {
            nome: data.nome,
            marcaId: data.marcaId,
            itens: data.itens ? {
              create: data.itens.map((item) => ({
                produtoId: item.produtoId,
                nomeProduto: item.nomeProduto,
              })),
            } : undefined,
          },
          include: {
            itens: true
          },
        });
      });
    } catch (error) {
      console.error(`[UPDATE_MIX_ERROR] ID ${id}:`, error);
      throw error;
    }
  }

  async deleteMix(id: string) {
    try {
      return await prisma.mixProduto.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`[DELETE_MIX_ERROR] ID ${id}:`, error);
      throw error;
    }
  }

  async assignToStore(data: AssignToStoreDTO) {
    return await this.storeMixService.processarAtribuicaoCompleta(data);
  }

  async assignMixToStore(lojaId: string, mixId: string) {
    return await this.storeMixService.atribuirMixALoja(lojaId, mixId);
  }

  async updateStoreStock(atribuicaoId: string, itens: any[]) {
    return await this.storeMixService.atualizarValoresEstoque(atribuicaoId, itens);
  }
}

export class StoreMixService {
  async processarAtribuicaoCompleta({ lojaId, mixIds, gerenteId }: AssignToStoreDTO) {
    try {
      return await prisma.$transaction(async (tx) => {
        if (gerenteId !== undefined) {
          await tx.loja.update({
            where: { id: lojaId },
            data: { gerenteId: gerenteId }
          });
        }

        const mixesAtuais = await tx.lojaMixAtribuido.findMany({
          where: { lojaId },
          select: { mixProdutoId: true }
        });

        const idsAtuais = mixesAtuais.map(m => m.mixProdutoId);
        const idsParaAdicionar = mixIds.filter(id => !idsAtuais.includes(id));

        for (const mixId of idsParaAdicionar) {
          const template = await tx.mixProduto.findUnique({
            where: { id: mixId },
            include: { itens: true }
          });

          if (template) {
            await tx.lojaMixAtribuido.create({
              data: {
                lojaId,
                mixProdutoId: mixId,
                itens: {
                  create: template.itens.map(item => ({
                    produtoId: item.produtoId,
                    nomeProduto: item.nomeProduto,
                    estoqueAtual: 0,
                    estoqueDesejado: 0
                  }))
                }
              }
            });
          }
        }

        return await tx.loja.findUnique({
          where: { id: lojaId },
          include: { mixes: true, gerente: true }
        });
      });
    } catch (error) {
      console.error("[PROCESSAR_ATRIBUICAO_COMPLETA_ERROR]:", error);
      throw error;
    }
  }

  async atribuirMixALoja(lojaId: string, mixId: string) {
    try {
      const existe = await prisma.lojaMixAtribuido.findUnique({
        where: {
          lojaId_mixProdutoId: { lojaId, mixProdutoId: mixId }
        }
      });

      if (existe) return existe;

      const template = await prisma.mixProduto.findUnique({
        where: { id: mixId },
        include: { itens: true }
      });

      if (!template) throw new Error("Mix Template não encontrado");

      return await prisma.lojaMixAtribuido.create({
        data: {
          lojaId,
          mixProdutoId: mixId,
          itens: {
            create: template.itens.map(item => ({
              produtoId: item.produtoId,
              nomeProduto: item.nomeProduto,
              estoqueAtual: 0,
              estoqueDesejado: 0
            }))
          }
        },
        include: {
          itens: true,
          loja: true,
          mix: true
        }
      });
    } catch (error) {
      console.error("[ATRIBUIR_MIX_ERROR]:", error);
      throw error;
    }
  }

  async atualizarValoresEstoque(atribuicaoId: string, itens: { produtoId: string, atual: number, ideal: number }[]) {
    try {
      const updates = itens.map(item =>
        prisma.itemMixEstoque.updateMany({
          where: {
            atribuicaoId,
            produtoId: item.produtoId
          },
          data: {
            estoqueAtual: item.atual,
            estoqueDesejado: item.ideal
          }
        })
      );

      return await prisma.$transaction(updates);
    } catch (error) {
      console.error("[UPDATE_ESTOQUE_ERROR]:", error);
      throw error;
    }
  }
}