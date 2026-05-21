import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  async handle(req: Request, res: Response) {
    const { email, senha } = req.body;
    const authService = new AuthService();

    try {
      const result = await authService.execute({ email, senha });
      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ mensagem: err.message });
    }
  }
}