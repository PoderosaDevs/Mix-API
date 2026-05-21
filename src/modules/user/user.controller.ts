import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  private userService = new UserService();

  async handleCreate(req: Request, res: Response) {
    const user = await this.userService.create(req.body);
    return res.status(201).json(user);
  }

  async handleList(req: Request, res: Response) {
    const users = await this.userService.findAll();
    return res.json(users);
  }

  async handleShow(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = await this.userService.findById(id);
    return res.json(user);
  }

  async handleUpdate(req: Request, res: Response) {
    const id = req.params.id as string;
    try {
      const user = await this.userService.update(id, req.body);
      return res.json(user);
    } catch (err: any) {
      return res.status(404).json({ mensagem: err.message });
    }
  }

  async handleDelete(req: Request, res: Response) {
    const id = req.params.id as string;
    try {
      await this.userService.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ mensagem: err.message });
    }
  }
}