FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ormconfig.migration.ts ./
RUN npm install

COPY . .

RUN npm run build
RUN npm prune --production


FROM node:20

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/ormconfig.migration.ts ./ormconfig.migration.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json

RUN sed -i 's/\r$//' ./scripts/bootstrap.sh ./scripts/await-for-api.sh && \
    chmod +x ./scripts/bootstrap.sh ./scripts/await-for-api.sh

EXPOSE 4000

CMD ["node", "dist/src/main.js"]