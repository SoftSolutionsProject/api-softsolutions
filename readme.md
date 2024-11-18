# Backend - SoftSolutions

Este é o backend da aplicação **SoftSolutions**, uma plataforma de cursos online.

## Integrantes do Grupo

- Caio Henrique Rodrigues, RA 3011392323041
- Lucas Salvador Notaro, RA 3011392323004
- Rafael da Costa Castro, RA 3011392323007


# Documentação da API

## Visão Geral
Esta API fornece endpoints para gerenciar inscrições em cursos e perfis de usuários. A API é construída usando Node, Express.js e MongoDB.

## URL Base
- Desenvolvimento: `http://localhost:3000/api`
- Produção: `https://softsolutions.onrender.com/api/`

## CORS
A API está configurada para aceitar requisições das seguintes origens:
- `http://localhost:4200`
- `https://softsol-softsolutions-projects.vercel.app`
- `https://softsol.vercel.app`


## Pré-requisitos

1. **Node.js** - Certifique-se de ter o Node.js instalado.  
2. **MongoDB** - Certifique-se de que o MongoDB está rodando localmente ou use uma URI de conexão remota.  
3. **Dependências** - Assegure-se de ter instalado todas as dependências do projeto.

## Instalação

1. Clone o repositório:  
   ``` git clone https://github.com/SoftSolutionsProject/SoftSolutions.git   ```

2. Navegue até o diretório `backend`:  
   ``` cd SoftSolutions/backend   ```

3. Instale as dependências do projeto:  
   ``` npm install   ```

## Configuração

1. Configure as variáveis de ambiente no arquivo `.env`:

   ```
   MONGO_URI=<sua-uri-mongo>  
   MONGO_TEST_URI=<uri-para-teste>  
   JWT_SECRET=<sua-chave-secreta>  
   PORT=3000 
    ```

2. Verifique se o arquivo `tsconfig.json` está configurado corretamente para o compilador TypeScript.  

## Executando o Projeto

1. Para rodar o servidor em modo de desenvolvimento:  
   ``` npm run dev   ```

2. Para rodar os testes:  
   ``` npm test   ```

3. Para compilar o TypeScript:  
   ``` npm run build   ```

4. Para rodar o servidor com código compilado:  
   ``` npm start   ```

## Acesso à Documentação

A documentação da API está disponível via Swagger em:  
``` http://localhost:3000/api-docs   ```

## Estrutura dos Testes
- **Testes de Controladores**: Localizados em `__tests__/controllers`.  
- **Testes de Serviços**: Localizados em `__tests__/services`.  