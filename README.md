# 🧠 API SoftSolutions

> Backend utilizando NestJS com Clean Architecture e TypeORM.

## 📚 Documentação

- [📘 Swagger API Docs](http://localhost:4000/api) – Documentação interativa da API

---

## 🚀 Como Executar

### ⚙️ Pré-requisitos

- **Node.js** >= 18.x
- **Docker** >= 20.x
- **Docker Compose** >= 2.x

---

### 🐳 Execução com Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd api-softsolutions-develop
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o .env com suas credenciais e configurações
   ```

3. **Suba os containers**
   ```bash
   docker-compose up -d --build
   ```

4. **Execute as migrações no banco**
   ```bash
   docker-compose exec api npm run typeorm:migrate
   ```

5. **Acesse a aplicação**
   - **Swagger**: http://localhost:4000/api

---

### 💻 Execução local sem Docker

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd api-softsolutions-develop
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   ```bash
   cp .env.example .env
   # Edite com as variáveis locais de banco e porta
   ```

4. **Execute as migrações**
   ```bash
   npm run typeorm:migrate
   ```

5. **Inicie o servidor**
   ```bash
   npm run start:dev
   ```

---

## 🐋 Comandos Docker úteis

```bash
docker-compose up -d --build        # Subir os containers
docker-compose down                 # Parar os containers
docker-compose logs -f              # Ver os logs em tempo real
docker-compose exec api bash        # Acessar o shell do container da API
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Modo desenvolvimento
npm run start:debug      # Modo debug

# Produção
npm run build            # Compilar
npm run start:prod       # Executar produção

# Banco de Dados (TypeORM)
npm run typeorm:generate # Gerar migração
npm run typeorm:migrate  # Executar migrações
npm run typeorm:revert   # Reverter última migração

# Testes
npm run test             # Testes unitários
npm run test:watch       # Testes com watch mode
npm run test:cov         # Cobertura de testes

# Lint e Format
npm run lint             # Verificação de código
npm run format           # Formatação de código
```

---

## 🌍 Produção

- **Swagger**: http://localhost:4000/api

---

## 🧰 Tecnologias Utilizadas

- **Framework**: [NestJS](https://nestjs.com)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT
- **Validação**: class-validator
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker & Docker Compose
- **Testes**: Jest
- **Arquitetura**: Clean Architecture
- **CI/CD**: GitHub Actions

---

## 📂 Estrutura do Projeto

```bash
src/
├── main.ts               # Ponto de entrada da aplicação
├── app.module.ts         # Módulo raiz do NestJS
├── application/          # Casos de uso e regras de negócio
├── domain/               # Entidades, enums e interfaces 
├── infra/                # Implementações de repositórios, controllers, banco, serviços externos
│   ├── controllers/      # Controllers HTTP
│   ├── database/         # Configuração e entidades do banco de dados
│   ├── repositories/     # Implementações dos repositórios
│   └── ...               # Outros módulos de infraestrutura
└── config/               # Configurações globais do projeto 

```

---