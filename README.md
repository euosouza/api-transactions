# 🔥 API REST — Transações Financeiras

API RESTful construída com **Fastify**, **TypeScript**, **Knex** e **SQLite** — com foco em simplicidade, tipagem forte e boas práticas de desenvolvimento.

---

## 📋 Requisitos

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9
- SQLite3

---

## 🚀 Tecnologias

| Tecnologia                                                       | Finalidade                            |
| ---------------------------------------------------------------- | ------------------------------------- |
| [Fastify](https://fastify.dev/)                                  | Framework HTTP de alta performance    |
| [TypeScript](https://www.typescriptlang.org/)                    | Tipagem estática                      |
| [Knex.js](https://knexjs.org/)                                   | Query builder e migrations            |
| [SQLite3](https://www.sqlite.org/)                               | Banco de dados relacional embutido    |
| [Zod](https://zod.dev/)                                          | Validação de schemas e variáveis      |
| [@fastify/cookie](https://github.com/fastify/fastify-cookie)     | Gerenciamento de cookies (session)    |
| [dotenv](https://github.com/motdotla/dotenv)                     | Carregamento de variáveis de ambiente |
| [Vitest](https://vitest.dev/)                                    | Framework de testes E2E               |
| [Supertest](https://github.com/ladjs/supertest)                  | Testes de integração HTTP             |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | Padronização e formatação de código   |
| [tsx](https://github.com/privatenumber/tsx)                      | Execução de TypeScript sem build      |

---

## 📂 Estrutura do Projeto

```
api-rest/
├── db/
│   ├── migrations/          # Migrations do banco de dados
│   └── db.sqlite            # Arquivo do banco SQLite
├── postman/
│   └── api-transactions.postman_collection.json  # Coleção Postman
├── src/
│   ├── env/
│   │   └── index.ts         # Validação de variáveis de ambiente com Zod
│   ├── middlewares/
│   │   └── check-session-id.middleware.ts  # Middleware de autenticação por cookie
│   ├── routes/
│   │   └── transactions.routes.ts          # Rotas do recurso transactions
│   ├── app.ts               # Configuração da instância Fastify
│   ├── database.ts          # Configuração e instância do Knex
│   └── server.ts            # Ponto de entrada da aplicação
├── test/
│   └── exemple.spec.ts      # Testes E2E das rotas
├── .env                     # Variáveis de ambiente (não versionado)
├── .env.exemple             # Exemplo de variáveis de ambiente
├── .env.test                # Variáveis de ambiente para testes
├── knexfile.ts              # Configuração do Knex CLI
├── tsconfig.json            # Configuração do TypeScript
├── eslint.config.ts         # Configuração do ESLint
└── package.json
```

---

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd api-rest
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.exemple .env
```

Edite o `.env`:

```env
NODE_ENV=development
DATABASE_URL=./db/db.sqlite
PORT=3000
```

| Variável       | Descrição                                                  | Padrão       |
| -------------- | ---------------------------------------------------------- | ------------ |
| `NODE_ENV`     | Ambiente de execução (`development`, `test`, `production`) | `production` |
| `DATABASE_URL` | Caminho ou URL de conexão com o banco de dados             | —            |
| `PORT`         | Porta em que o servidor irá escutar                        | `3000`       |

### 4. Execute as migrations

```bash
npm run knex -- migrate:latest
```

### 5. Inicie o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## 📡 Endpoints

Todas as rotas estão prefixadas em `/transactions`.

### `POST /transactions` — Criar transação

Cria uma nova transação. Gera automaticamente um cookie de sessão (`sessionId`) se não existir.

- **Body (JSON)**

  ```json
  {
    "title": "Salário",
    "amount": 5000,
    "type": "credit"
  }
  ```

  | Campo    | Tipo                     | Descrição                                     |
  | -------- | ------------------------ | --------------------------------------------- |
  | `title`  | `string`                 | Título da transação                           |
  | `amount` | `number`                 | Valor da transação (sempre positivo)          |
  | `type`   | `"credit"` \| `"debit"` | Crédito soma; débito é armazenado como negativo |

- **Respostas**

  | Status | Descrição              |
  | ------ | ---------------------- |
  | `201`  | Transação criada       |
  | `400`  | Body inválido          |

---

### `GET /transactions` — Listar transações

Retorna todas as transações da sessão atual. Requer cookie `sessionId`.

- **Resposta `200`**

  ```json
  {
    "transactions": [
      {
        "id": "uuid",
        "title": "Salário",
        "amount": 5000,
        "session_id": "uuid",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

---

### `GET /transactions/:id` — Buscar transação por ID

Retorna uma única transação pelo `id`. Requer cookie `sessionId`.

- **Parâmetros de rota**

  | Parâmetro | Tipo   | Descrição             |
  | --------- | ------ | --------------------- |
  | `id`      | `UUID` | ID da transação       |

- **Resposta `200`**

  ```json
  {
    "id": "uuid",
    "title": "Salário",
    "amount": 5000,
    "session_id": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
  ```

---

### `GET /transactions/summary` — Sumário financeiro

Retorna o saldo total das transações da sessão (créditos - débitos). Requer cookie `sessionId`.

- **Resposta `200`**

  ```json
  {
    "amount": 3500.00
  }
  ```

---

### `PUT /transactions/:id` — Atualizar transação

Atualiza o título, valor e tipo de uma transação existente.

- **Parâmetros de rota**

  | Parâmetro | Tipo   | Descrição       |
  | --------- | ------ | --------------- |
  | `id`      | `UUID` | ID da transação |

- **Body (JSON)**

  ```json
  {
    "title": "Salário atualizado",
    "amount": 6000,
    "type": "credit"
  }
  ```

- **Respostas**

  | Status | Descrição               |
  | ------ | ----------------------- |
  | `204`  | Atualizado com sucesso  |
  | `400`  | Body ou params inválidos |

---

### `DELETE /transactions/:id` — Deletar transação

Remove uma transação pelo `id`.

- **Parâmetros de rota**

  | Parâmetro | Tipo   | Descrição       |
  | --------- | ------ | --------------- |
  | `id`      | `UUID` | ID da transação |

- **Respostas**

  | Status | Descrição             |
  | ------ | --------------------- |
  | `204`  | Deletado com sucesso  |
  | `400`  | Parâmetro inválido    |

---

## 🧪 Testes

O projeto possui testes **E2E** (end-to-end) com **Vitest** e **Supertest**, cobrindo todos os endpoints.

### Executar testes

```bash
npm test
```

### Suíte de testes (`test/exemple.spec.ts`)

| Rota                            | Cenário testado                                            |
| ------------------------------- | ---------------------------------------------------------- |
| `POST /transactions`            | Criação de uma transação com status `201`                  |
| `GET /transactions`             | Listagem das transações da sessão com status `200`         |
| `GET /transactions/:id`         | Busca de uma transação por ID com status `200`             |
| `GET /transactions/summary`     | Saldo total calculado corretamente                         |
| `DELETE /transactions/:id`      | Exclusão de transação com status `204`                     |
| `PUT /transactions/:id`         | Atualização de transação com status `204`                  |

> Antes de cada teste, as migrations são revertidas e reaplicadas para garantir um banco limpo.

---

## 📬 Coleção Postman

Uma coleção Postman com todos os endpoints está disponível em:

```
postman/api-transactions.postman_collection.json
```

Para usar:

1. Abra o **Postman**
2. Clique em **Import**
3. Selecione o arquivo `api-transactions.postman_collection.json`
4. Execute as requisições com o servidor rodando em `http://localhost:3000`

> **Dica:** Comece pelo `POST /transactions` — ele define automaticamente o cookie de sessão para as demais requisições.

---

## 📜 Scripts Disponíveis

| Comando               | Descrição                                                   |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | Inicia o servidor em modo de desenvolvimento com hot-reload |
| `npm test`            | Executa os testes E2E com Vitest                            |
| `npm run lint`        | Analisa o código com ESLint                                 |
| `npm run lint:fix`    | Corrige automaticamente problemas de lint                   |
| `npm run lint:strict` | Lint sem permitir nenhum warning                            |
| `npm run format`      | Formata o código com Prettier                               |
| `npm run check`       | Verifica tipos (TypeScript) + lint                          |
| `npm run knex`        | Executa comandos do Knex CLI (ex: migrations)               |

### Exemplos de uso do Knex CLI

```bash
# Executar todas as migrations pendentes
npm run knex -- migrate:latest

# Reverter a última migration
npm run knex -- migrate:rollback

# Reverter todas as migrations
npm run knex -- migrate:rollback --all

# Criar uma nova migration
npm run knex -- migrate:make nome-da-migration

# Verificar status das migrations
npm run knex -- migrate:status
```

---

## 🗄️ Banco de Dados

O projeto utiliza **SQLite** com **Knex.js** como query builder.

### Tabelas

#### `transactions`

| Coluna       | Tipo          | Descrição                                              |
| ------------ | ------------- | ------------------------------------------------------ |
| `id`         | UUID          | Identificador único da transação                       |
| `title`      | TEXT          | Título da transação                                    |
| `amount`     | DECIMAL(10,2) | Valor da transação (positivo = crédito, negativo = débito) |
| `session_id` | TEXT          | ID de sessão do usuário (via cookie)                   |
| `created_at` | TIMESTAMP     | Data e hora de criação                                 |

As migrations estão localizadas em `db/migrations/` e são gerenciadas pelo Knex CLI.

---

## 🔐 Autenticação por Sessão

A API utiliza **cookies** para identificar o usuário. Ao criar a primeira transação, um cookie `sessionId` é gerado automaticamente e associado às transações criadas.

- As rotas de **leitura** (`GET`) exigem que o cookie `sessionId` esteja presente.
- As rotas de **escrita** (`POST`, `PUT`, `DELETE`) utilizam o cookie quando disponível.
- O middleware `checkSessionId` rejeita requisições sem cookie com `401 Unauthorized`.

---

## 🛠️ Desenvolvimento

### Padrões de Código

O projeto usa **ESLint** com **Prettier** para garantir consistência no código:

- **Aspas duplas** em strings
- **Semicolons** obrigatórios
- Comprimento máximo de linha: **150 caracteres**

Para verificar e corrigir antes de commitar:

```bash
npm run check
npm run lint:fix
npm run format
```

### TypeScript

Configuração com modo estrito habilitado (`strict: true`), incluindo:

- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `verbatimModuleSyntax`
- `isolatedModules`

---

## 📄 Licença

ISC
