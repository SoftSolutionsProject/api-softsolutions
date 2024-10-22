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

## Endpoints

### Rotas de Inscrição
Base: `/inscricoes`

#### Criar Inscrição
```
POST /inscricoes
```
Cria uma nova inscrição em um curso.

**Corpo da Requisição:**
```json
{
  "_idModulo": Number,
  "_idUser": Number
}
```

**Respostas:**
- Sucesso (201):
```json
{
  "statusInscricao": 0,
  "_idModulo": Number,
  "_idUser": Number,
  "dataInscricao": Date
}
```
- Erro (400): `{ "message": "Usuário já está inscrito neste módulo." }`
- Erro (500): `{ "message": "Erro ao se inscrever no curso", "error": Error }`

#### Obter Inscrições do Usuário
```
GET /inscricoes/:idUser
```
Recupera todas as inscrições de um usuário específico.

**Parâmetros:**
- `idUser`: ID do usuário (Number)

**Respostas:**
- Sucesso (200): Array de objetos de inscrição
- Erro (404): `{ "message": "Nenhuma inscrição encontrada para este usuário." }`
- Erro (500): `{ "message": "Erro ao obter inscrições", "error": Error }`

#### Cancelar Inscrição
```
DELETE /inscricoes/:idUser/cursos/:idModulo
```
Cancela uma inscrição específica em um curso.

**Parâmetros:**
- `idUser`: ID do usuário (Number)
- `idModulo`: ID do curso/módulo (Number)

**Respostas:**
- Sucesso (200): `{ "message": "Inscrição cancelada com sucesso" }`
- Erro (404): `{ "message": "Inscrição não encontrada" }`
- Erro (500): `{ "message": "Erro ao cancelar a inscrição", "error": Error }`

### Rotas de Usuário
Base: `/usuarios`

#### Obter Perfil do Usuário
```
GET /usuarios/:idUser
```
Recupera informações do perfil do usuário.

**Parâmetros:**
- `idUser`: ID do usuário (Number)

**Respostas:**
- Sucesso (200): Objeto do usuário
- Erro (404): `{ "message": "Usuário não encontrado" }`
- Erro (500): `{ "message": "Erro ao obter o usuário", "error": Error }`

#### Atualizar Perfil do Usuário
```
PUT /usuarios/:idUser
```
Atualiza informações do perfil do usuário.

**Parâmetros:**
- `idUser`: ID do usuário (Number)

**Corpo da Requisição:** Campos do usuário a serem atualizados

**Respostas:**
- Sucesso (200): Objeto do usuário atualizado
- Erro (404): `{ "message": "Usuário não encontrado" }`
- Erro (400): `{ "message": "Erro ao atualizar o usuário", "error": Error }`

## Modelos de Dados

### Esquema do Usuário
```javascript
{
  _idUser: {
    type: Number,
    required: true,
    unique: true
  },
  tipo: {
    type: String,
    enum: ['administrador', 'aluno'],
    required: true
  },
  nomeUsuario: {
    type: String,
    required: true
  },
  cpfUsuario: {
    type: Number,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefone: String,
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    estado: String,
    pais: String
  },
  localizacao: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number]
  }
}
```

### Esquema de Inscrição
```javascript
{
  statusInscricao: {
    type: Number,
    required: true,
    default: 0
  },
  _idModulo: {
    type: Number,
    required: true
  },
  _idUser: {
    type: Number,
    required: true
  },
  dataInscricao: {
    type: Date,
    default: Date.now
  }
}
```

**Observação:** A coleção de inscrições possui um índice único composto em `{_idUser: 1, _idModulo: 1}` para prevenir inscrições duplicadas.

## Tratamento de Erros
Todos os endpoints seguem um formato consistente de resposta de erro:
```javascript
{
  message: String,  // Mensagem de erro legível
  error: Error      // Informações detalhadas do erro (apenas em desenvolvimento)
}
```

## Entregas do Projeto

### 1ª Entrega de Desenvolvimento Web - 15 de Outubro

**Objetivo**: Desenvolvimento de uma API REST na arquitetura MVC, utilizando MongoDB e integração com o frontend.

**Requisitos**:
1. A aplicação deverá ser hospedada no GitHub e ter sua documentação descrita no arquivo README. Não esqueça de incluir o nome dos integrantes do grupo.
2. Desenvolvimento de uma API RESTful completa que permita a realização das operações básicas: GET, POST, PUT e DELETE. Cada operação deve ser mapeada para as rotas apropriadas no servidor.
3. Utilização da arquitetura MVC para o desenvolvimento da aplicação.
4. A aplicação deverá conter obrigatoriamente um microsserviço.
5. A aplicação deverá ser hospedada em uma plataforma de nuvem, por exemplo: Vercel.

### 2ª Entrega de Desenvolvimento Web - 19 de Novembro

**Objetivo**: Expansão da API REST, utilizando a arquitetura MVC e integração com o frontend.

**Requisitos**:
1. A aplicação deverá ser hospedada no GitHub e ter sua documentação descrita no arquivo README. Não esqueça de incluir o nome dos integrantes do grupo.
2. Desenvolvimento de uma API RESTful completa que permita a realização das operações básicas: GET, POST, PUT e DELETE. Cada operação deve ser mapeada para as rotas apropriadas no servidor.
3. Utilização da arquitetura MVC para o desenvolvimento da aplicação.
4. A aplicação deverá conter obrigatoriamente um microsserviço.
5. A aplicação deverá ser hospedada em uma plataforma de nuvem, por exemplo: Vercel.
6. API documentada utilizando uma das ferramentas de documentação apresentadas em aula, como Postman ou Swagger.
7. Implementação de um sistema de login com autenticação de usuários.
8. Implementação de um sistema de proteção das rotas, utilizando autenticação através de token, API key ou outros métodos.
9. Desenvolvimento da interface do usuário utilizando o conceito de SPA (Single Page Application), podendo ser utilizado o framework de preferência do grupo (Angular, React, etc.).
10. Realização de testes unitários, através do framework Jest.
11. A entrega deverá ser feita através da tarefa disponibilizada na plataforma TEAMS. Certifique-se de incluir o nome de todos os integrantes do grupo no README do projeto e o link da aplicação para facilitar a identificação dos colaboradores, assim como o link da API pública, se houver.
