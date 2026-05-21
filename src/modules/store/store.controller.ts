import { Request, Response } from "express";
import { StoreService } from "./store.service";

export class StoreController {
  private storeService = new StoreService();

  constructor() {
    this.handleCreate = this.handleCreate.bind(this);
    this.handleList = this.handleList.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleListMixesByStore = this.handleListMixesByStore.bind(this);
  }

  async handleCreate(req: Request, res: Response) {
    try {
      const store = await this.storeService.create(req.body);
      return res.status(201).json(store);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar loja" });
    }
  }

  async handleList(req: Request, res: Response) {
    try {
      const stores = await this.storeService.findAll();
      return res.json(stores);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar lojas" });
    }
  }

  async handleListMixesByStore(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({ error: "ID inválido" });
      }
      const mixes = await this.storeService.findMixesByStoreId(id);
      return res.json(mixes);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao buscar mixes da loja" });
    }
  }

  async handleUpdate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({ error: "ID inválido" });
      }
      const store = await this.storeService.update(id, req.body);
      return res.json(store);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar loja" });
    }
  }

  async handleDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({ error: "ID inválido" });
      }

      await this.storeService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar loja" });
    }
  }
}