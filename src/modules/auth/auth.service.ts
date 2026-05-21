import { prisma } from "../../lib/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class AuthService {
  async execute({ email, senha }: any) {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new Error("Email ou senha incorretos");
    }

    const senhaMatch = await compare(senha, usuario.senha);

    if (!senhaMatch) {
      throw new Error("Email ou senha incorretos");
    }

    const token = sign(
      { cargo: usuario.cargo },
      "SECRET_KEY_PROVISORIA",
      {
        subject: usuario.id,
        expiresIn: "1d",
      }
    );

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
      },
      token,
    };
  }
}