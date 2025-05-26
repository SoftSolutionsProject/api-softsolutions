# Etapa 1 - Build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2 - Produção
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
