-- CreateEnum
CREATE TYPE "CargoUsuario" AS ENUM ('OPERADOR', 'GERENTE', 'ADMIN');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" "CargoUsuario" NOT NULL DEFAULT 'OPERADOR',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixProduto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadorId" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MixProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemMixTemplate" (
    "id" TEXT NOT NULL,
    "mixProdutoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemMixTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loja" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "gerenteId" TEXT,
    "localizacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LojaMixAtribuido" (
    "id" TEXT NOT NULL,
    "lojaId" TEXT NOT NULL,
    "mixProdutoId" TEXT NOT NULL,
    "atribuidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LojaMixAtribuido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemMixEstoque" (
    "id" TEXT NOT NULL,
    "atribuicaoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "estoqueAtual" INTEGER NOT NULL DEFAULT 0,
    "estoqueDesejado" INTEGER NOT NULL DEFAULT 0,
    "ultimaAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemMixEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nome_key" ON "Marca"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "MixProduto_nome_key" ON "MixProduto"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Loja_token_key" ON "Loja"("token");

-- CreateIndex
CREATE UNIQUE INDEX "LojaMixAtribuido_lojaId_mixProdutoId_key" ON "LojaMixAtribuido"("lojaId", "mixProdutoId");

-- AddForeignKey
ALTER TABLE "MixProduto" ADD CONSTRAINT "MixProduto_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MixProduto" ADD CONSTRAINT "MixProduto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemMixTemplate" ADD CONSTRAINT "ItemMixTemplate_mixProdutoId_fkey" FOREIGN KEY ("mixProdutoId") REFERENCES "MixProduto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loja" ADD CONSTRAINT "Loja_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LojaMixAtribuido" ADD CONSTRAINT "LojaMixAtribuido_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LojaMixAtribuido" ADD CONSTRAINT "LojaMixAtribuido_mixProdutoId_fkey" FOREIGN KEY ("mixProdutoId") REFERENCES "MixProduto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemMixEstoque" ADD CONSTRAINT "ItemMixEstoque_atribuicaoId_fkey" FOREIGN KEY ("atribuicaoId") REFERENCES "LojaMixAtribuido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
