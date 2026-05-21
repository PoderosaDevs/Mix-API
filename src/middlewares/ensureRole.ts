import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export function ensureRole(niveisPermitidos: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Busca exatamente o campo injetado pelo middleware anterior
      const userId = (req as any).user_id;

      if (!userId) {
        return res.status(401).json({ mensagem: "Sessão inválida ou expirada" });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
      });

      if (!usuario) {
        return res.status(401).json({ mensagem: "Usuário não encontrado no sistema" });
      }

      if (!niveisPermitidos.includes(usuario.cargo)) {
        return res.status(403).json({ mensagem: "Acesso negado: nível de permissão insuficiente" });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno ao validar permissão" });
    }
  };
}