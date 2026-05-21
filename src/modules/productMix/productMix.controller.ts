import { Request, Response } from "express";
import { ProductMixService } from "./productMix.service";

export class ProductMixController {
  private productMixService = new ProductMixService();

  constructor() {
    this.handleCreate = this.handleCreate.bind(this);
    this.handleGetAll = this.handleGetAll.bind(this);
    this.handleGetById = this.handleGetById.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAssignToStore = this.handleAssignToStore.bind(this);
    this.handleUpdateStoreStock = this.handleUpdateStoreStock.bind(this);
  }

  async handleCreate(req: Request, res: Response) {
    try {
      const { nome, marcaId, itens } = req.body;
      const criadorId = (req as any).user_id;

      if (!criadorId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const mix = await this.productMixService.createMix({
        nome,
        marcaId,
        criadorId: String(criadorId),
        itens,
      });

      return res.status(201).json(mix);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleGetAll(req: Request, res: Response) {
    try {
      const mixes = await this.productMixService.getAllMixes();
      return res.json(mixes);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao listar mixes" });
    }
  }

  async handleGetById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mixId = Array.isArray(id) ? id[0] : id;

      if (!mixId) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const mix = await this.productMixService.getMixById(mixId);

      if (!mix) {
        return res.status(404).json({ error: "Mix não encontrado" });
      }

      return res.json(mix);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao buscar mix" });
    }
  }

  async handleUpdate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mixId = Array.isArray(id) ? id[0] : id;

      if (!mixId) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const mix = await this.productMixService.updateMix(mixId, req.body);
      return res.json(mix);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mixId = Array.isArray(id) ? id[0] : id;

      if (!mixId) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await this.productMixService.deleteMix(mixId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleAssignToStore(req: Request, res: Response) {
    try {
      const { lojaId, mixIds, mixId, gerenteId } = req.body;

      if (!lojaId) {
        return res.status(400).json({ error: "O ID da loja é obrigatório" });
      }

      const idsParaAtribuir = Array.isArray(mixIds) 
        ? mixIds 
        : (mixId ? [mixId] : []);

      const result = await this.productMixService.assignToStore({
        lojaId,
        mixIds: idsParaAtribuir,
        gerenteId: gerenteId ?? null
      });

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleUpdateStoreStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { itens } = req.body;

      const atribuicaoId = Array.isArray(id) ? id[0] : id;

      if (!atribuicaoId) {
        return res.status(400).json({ error: "ID de atribuição inválido" });
      }

      const result = await this.productMixService.updateStoreStock(atribuicaoId, itens);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}