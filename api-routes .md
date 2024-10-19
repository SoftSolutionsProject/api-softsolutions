# Rotas da API

## Rotas de Inscrição
Base path: `/inscricoes`

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Inscreve um usuário em um curso/módulo |
| GET | `/:idUser` | Obtém todas as inscrições de um usuário específico |
| DELETE | `/:idUser/cursos/:idModulo` | Cancela a inscrição de um usuário em um curso específico |

**Detalhes:**
- POST `/`: Requer `_idModulo` e `_idUser` no body
- Verifica duplicidade de inscrição
- Status da inscrição começa como 0

## Rotas de Usuário
Base path: `/usuarios`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/:idUser` | Obtém informações do perfil do usuário |
| PUT | `/:idUser` | Atualiza informações do perfil do usuário |

**Modelos de Dados:**

### Usuário
- `_idUser`: Number (único)
- `tipo`: String (administrador/aluno)
- `nomeUsuario`: String
- `cpfUsuario`: Number (único)
- `senha`: String
- `email`: String (único)
- `telefone`: String (opcional)
- `endereco`: Object
  - `rua`
  - `numero`
  - `bairro`
  - `cidade`
  - `estado`
  - `pais`
- `localizacao`: Object (GeoJSON Point)

### Inscrição
- `statusInscricao`: Number (default: 0)
- `_idModulo`: Number
- `_idUser`: Number
- `dataInscricao`: Date (automático)

**Observação:** Existe um índice único para `_idUser` e `_idModulo` na coleção de inscrições para prevenir duplicatas.
