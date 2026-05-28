# 🔥 API REST

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
| [Zod](https://zod.dev/)                                          | Validação de variáveis de ambiente    |
| [dotenv](https://github.com/motdotla/dotenv)                     | Carregamento de variáveis de ambiente |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | Padronização e formatação de código   |
| [tsx](https://github.com/privatenumber/tsx)                      | Execução de TypeScript sem build      |

---

## 📂 Estrutura do Projeto

```
api-rest/
├── db/
│   ├── migrations/          # Migrations do banco de dados
│   └── db.sqlite            # Arquivo do banco SQLite
├── src/
│   ├── env/
│   │   └── index.ts         # Validação de variáveis de ambiente com Zod
│   ├── database.ts          # Configuração e instância do Knex
│   └── server.ts            # Ponto de entrada da aplicação
├── .env                     # Variáveis de ambiente (não versionado)
├── .env.exemple             # Exemplo de variáveis de ambiente
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
DATABASE_URL=
PORT=3000
```

| Variável       | Descrição                                                  | Padrão       |
| -------------- | ---------------------------------------------------------- | ------------ |
| `NODE_ENV`     | Ambiente de execução (`development`, `test`, `production`) | `production` |
| `DATABASE_URL` | URL de conexão com o banco de dados                        | —            |
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

## 📜 Scripts Disponíveis

| Comando               | Descrição                                                   |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | Inicia o servidor em modo de desenvolvimento com hot-reload |
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

| Coluna       | Tipo          | Descrição                        |
| ------------ | ------------- | -------------------------------- |
| `id`         | UUID          | Identificador único da transação |
| `title`      | TEXT          | Título da transação              |
| `amount`     | DECIMAL(10,2) | Valor da transação               |
| `session_id` | —             | ID de sessão do usuário          |
| `created_at` | TIMESTAMP     | Data e hora de criação           |

As migrations estão localizadas em `db/migrations/` e são gerenciadas pelo Knex CLI.

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
