# Etapa 1: Build
FROM node:24-slim AS builder

WORKDIR /app

# Copie apenas arquivos de dependências e configs para instalar dependências
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm ci

# Copie o restante do código (src, etc.)
COPY . .

# Compile o projeto (TypeScript puro)
RUN npx tsc --project tsconfig.build.json

# Etapa 2: Produção
FROM node:24-slim

WORKDIR /app

# Copie apenas os arquivos de dependências necessários
COPY package*.json ./
RUN npm ci --omit=dev

# Copie apenas o build final da etapa anterior
COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Comando para rodar em produção
CMD ["node", "dist/main.js"]
