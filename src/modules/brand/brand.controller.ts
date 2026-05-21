import { Request, Response } from "express";
import { BrandService } from "./brand.service";

export class BrandController {
  private brandService = new BrandService();

  constructor() {
    this.handleCreate = this.handleCreate.bind(this);
    this.handleList = this.handleList.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleCreate(req: Request, res: Response) {
    try {
      const brand = await this.brandService.create(req.body);
      return res.status(201).json(brand);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleList(req: Request, res: Response) {
    try {
      const brands = await this.brandService.findAll();
      return res.json(brands);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao listar marcas" });
    }
  }

  async handleShow(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const brandId = Array.isArray(id) ? id[0] : id;

      if (!brandId) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const brand = await this.brandService.findById(brandId);

      if (!brand) {
        return res.status(404).json({ error: "Marca não encontrada" });
      }

      return res.json(brand);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao buscar marca" });
    }
  }

  async handleUpdate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const brandId = Array.isArray(id) ? id[0] : id;

      if (!brandId) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const brand = await this.brandService.update(brandId, req.body);
      return res.json(brand);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const brandId = Array.isArray(id) ? id[0] : id;

      if (!brandId) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await this.brandService.delete(brandId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}