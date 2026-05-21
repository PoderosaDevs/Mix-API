import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token ausente" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(token, "SECRET_KEY_PROVISORIA") as IPayload;
    
    // Injetando no req para os próximos middlewares usarem
    (req as any).user_id = sub;

    return next();
  } catch (err) {
    return res.status(401).json({ mensagem: "Token inválido" });
  }
}