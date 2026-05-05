# Busca Semantica - Visao Geral para Avaliacao

## Objetivo
Este documento descreve como a funcionalidade de busca semantica foi implementada no projeto, com foco em:
- arquitetura;
- fluxo ponta a ponta;
- pontos de codigo;
- operacao e manutencao.

## Resumo executivo
A busca semantica combina:
- **busca textual indexada** (Meilisearch);
- **processamento de linguagem natural** para entrada por voz (normalizacao + tokenizacao + classificacao de intencao);
- **reuso do mesmo motor de busca textual** para ambos os canais (texto e voz).

Em termos praticos:
1. Usuario pesquisa por texto ou fala;
2. API transforma a entrada em query de busca;
3. Meilisearch retorna documentos de curso/aula ranqueados;
4. Frontend exibe resultados e metadados da interpretacao da voz.

---

## Arquitetura (backend)

### Modulo principal
- Modulo: `SearchModule`
- Arquivo: `backend/api-softsolutions/src/modules/search.module.ts`

Responsabilidades:
- registrar controller da busca;
- injetar services de NLP e Meilisearch;
- injetar use cases de busca textual e por voz.

### API HTTP
- Controller: `SearchController`
- Arquivo: `backend/api-softsolutions/src/interfaces/http/controllers/search.controller.ts`

Endpoints:
- `GET /search/text-search?q=...`
- `POST /search/voice`
- `POST /search/reindex`

### Use Cases
- `SearchTextUseCase`
  - Arquivo: `backend/api-softsolutions/src/application/use-cases/search/search-text.use-case.ts`
  - Funcao: delega a consulta ao `MeilisearchService`.

- `SearchVoiceUseCase`
  - Arquivo: `backend/api-softsolutions/src/application/use-cases/search/search-voice.use-case.ts`
  - Funcao:
    - classificar intencao da frase;
    - montar query final;
    - executar busca textual;
    - devolver metadados da interpretacao (tokens, stems, intent, confidence, rankings).

### NLP (intencao semantica)
- Service: `IntentClassifierService`
- Arquivo: `backend/api-softsolutions/src/infrastructure/search/nlp/intent-classifier.service.ts`

Pipeline aplicado:
1. normaliza texto (minusculo, remove acentos/pontuacao);
2. tokeniza (`natural.WordTokenizer`);
3. remove stopwords (portugues + stopwords customizadas);
4. aplica stem (`PorterStemmerPt`);
5. classifica com `BayesClassifier`.

Intencoes treinadas:
- `buscar_curso`
- `buscar_aula`
- `buscar_professor`
- `buscar_categoria`
- `pesquisar`

Fallback:
- intencao `desconhecida` quando confianca abaixo do threshold (`0.35`).

### Motor de busca
- Service: `MeilisearchService`
- Arquivo: `backend/api-softsolutions/src/infrastructure/search/meilisearch/meilisearch.service.ts`

Pontos importantes:
- indice: `softsolutions`;
- configuracao de campos pesquisaveis, exibiveis, filtraveis e ordenaveis;
- sinonimos configurados (ex.: `js <-> javascript`, `frontend <-> front-end`);
- stopwords configuradas;
- consulta com limite de 10 hits;
- protecao para query vazia ou falha no Meilisearch (retorna `[]`).

### Indexacao (curso + aula)
- Service: `MeilisearchIndexerService`
- Arquivo: `backend/api-softsolutions/src/infrastructure/search/meilisearch/meilisearch-indexer.service.ts`

Como funciona:
- carrega cursos com relacoes `modulos` e `aulas`;
- cria documentos de dois tipos:
  - `tipo: curso` (`id: curso-{id}`);
  - `tipo: aula` (`id: aula-{id}`);
- agrega campos de contexto (`conteudo`, `tags`, `categoria`, `professor`, `modulo`, etc.);
- faz replace completo no indice (`deleteAllDocuments` + `addDocuments`).

Contrato de documento:
- Interface `SearchItem`
- Arquivo: `backend/api-softsolutions/src/infrastructure/search/interfaces/search-item.interface.ts`

---

## Fluxo funcional (ponta a ponta)

## 1) Busca textual
1. Front chama `GET /search/text-search?q=...`;
2. `TextSearchQueryDto` valida (`string`, nao vazia, max 200);
3. `SearchTextUseCase` executa `MeilisearchService.search(query)`;
4. API retorna `{ results: SearchItem[] }`.

Arquivo DTO:
- `backend/api-softsolutions/src/infrastructure/search/dtos/text-search-query.dto.ts`

## 2) Busca por voz
1. Front captura fala via Web Speech API;
2. Front envia texto para `POST /search/voice`;
3. `VoiceSearchRequestDto` valida (`string`, nao vazia, max 500);
4. `SearchVoiceUseCase`:
   - classifica intencao (`IntentClassifierService`);
   - escolhe query final (`filteredTokens` ou `normalizedText`);
   - chama busca textual;
5. Retorno inclui:
   - `intent`, `confidence`, `rankings`;
   - `searchQuery`, `querySource`, `matchedTerms`;
   - `results`.

Arquivos DTO:
- `backend/api-softsolutions/src/infrastructure/search/dtos/voice-search-request.dto.ts`
- `backend/api-softsolutions/src/infrastructure/search/dtos/voice-search-response.dto.ts`

## 3) Reindexacao
1. Endpoint `POST /search/reindex`;
2. Controller chama `MeilisearchIndexerService.reindexCursosEAulas()`;
3. indice e reconstruido com dados atuais de cursos/aulas.

---

## Integracao com frontend

### Service Angular
- Arquivo: `frontend/src/app/_service/busca.service.ts`

Metodos:
- `buscarTexto(query)` -> `GET /search/text-search`
- `buscarPorVoz(text)` -> `POST /search/voice`

Tipos:
- Arquivo: `frontend/src/app/_service/busca.types.ts`

### Componente de busca semantica
- Arquivo: `frontend/src/app/busca-semantica/busca-semantica.component.ts`
- Template: `frontend/src/app/busca-semantica/busca-semantica.component.html`

Capacidades:
- busca por texto;
- reconhecimento de voz com `window.SpeechRecognition/webkitSpeechRecognition`;
- exibicao de metadados da busca por voz:
  - intencao detectada;
  - confianca;
  - query final aplicada.

Rota:
- `frontend/src/app/app.routes.ts`
- path: `/busca-semantica`

---

## Dados e inicializacao

Reindexacao automatica no bootstrap de ambiente Docker:
- Script: `backend/api-softsolutions/scripts/bootstrap.sh`
- Sequencia:
  - aguarda API;
  - roda migrations;
  - roda seed;
  - chama `POST /search/reindex`.

Seed especifico do Meilisearch (utilitario adicional):
- Arquivo: `backend/api-softsolutions/src/seeds/meili.seed.ts`

---

## Qualidade e testes

Testes existentes no backend:
- `search.controller.spec.ts`
- `search-voice.use-case.spec.ts`
- `search-text.use-case.spec.ts`
- `meilisearch.service.spec.ts`
- `meilisearch-indexer.service.spec.ts`
- `intent-classifier.service.spec.ts`

Cobertura validada nesses testes:
- roteamento e resposta de endpoints;
- composicao de query por intencao;
- comportamento com fallback;
- indexacao de cursos/aulas e cenarios sem dados;
- robustez de inicializacao/consulta do Meilisearch.

---

## Mapa rapido de implementacoes

Backend:
- Controller: `backend/api-softsolutions/src/interfaces/http/controllers/search.controller.ts`
- Module: `backend/api-softsolutions/src/modules/search.module.ts`
- Use case texto: `backend/api-softsolutions/src/application/use-cases/search/search-text.use-case.ts`
- Use case voz: `backend/api-softsolutions/src/application/use-cases/search/search-voice.use-case.ts`
- NLP: `backend/api-softsolutions/src/infrastructure/search/nlp/intent-classifier.service.ts`
- Meilisearch client/config: `backend/api-softsolutions/src/infrastructure/search/meilisearch/meilisearch.service.ts`
- Indexador: `backend/api-softsolutions/src/infrastructure/search/meilisearch/meilisearch-indexer.service.ts`
- DTO texto: `backend/api-softsolutions/src/infrastructure/search/dtos/text-search-query.dto.ts`
- DTO voz request: `backend/api-softsolutions/src/infrastructure/search/dtos/voice-search-request.dto.ts`
- DTO voz response: `backend/api-softsolutions/src/infrastructure/search/dtos/voice-search-response.dto.ts`
- Contrato documento: `backend/api-softsolutions/src/infrastructure/search/interfaces/search-item.interface.ts`

Frontend:
- Service HTTP: `frontend/src/app/_service/busca.service.ts`
- Tipos: `frontend/src/app/_service/busca.types.ts`
- Componente: `frontend/src/app/busca-semantica/busca-semantica.component.ts`
- View: `frontend/src/app/busca-semantica/busca-semantica.component.html`
- Rota: `frontend/src/app/app.routes.ts`
