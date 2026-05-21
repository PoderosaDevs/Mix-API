import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";

export class UserService {
  async create(data: any) {
    const senhaHash = await hash(data.senha, 8);

    return await prisma.usuario.create({
      data: {
        ...data,
        senha: senhaHash,
      },
    });
  }

  async findAll() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        criadoEm: true,
      },
    });
  }

  async findById(id: string) {
    return await prisma.usuario.findUnique({ 
      where: { id },
      include: {
        mixes: true
      }
    });
  }

  async update(id: string, data: any) {
    const usuarioExists = await prisma.usuario.findUnique({ where: { id } });

    if (!usuarioExists) {
      throw new Error("Usuário não encontrado");
    }

    if (data.senha) {
      data.senha = await hash(data.senha, 8);
    }

    return await prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const usuarioExists = await prisma.usuario.findUnique({ where: { id } });

    if (!usuarioExists) {
      throw new Error("Usuário não encontrado");
    }

    return await prisma.usuario.delete({
      where: { id },
    });
  }
}