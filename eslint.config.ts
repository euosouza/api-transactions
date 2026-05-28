import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Executa o Prettier como regra do ESLint (pega aspas, semi, etc.)
      "prettier/prettier": "error",

      // Proibir any explícito (força tipagem correta)
      "@typescript-eslint/no-explicit-any": "error",

      // Não usar await em valor que não é Promise
      "@typescript-eslint/await-thenable": "error",

      // Forçar retorno consistente em funções async
      "@typescript-eslint/require-await": "error",

      // Preferir nullish coalescing (??) ao invés de ||
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // Preferir optional chaining (?.) ao invés de &&
      "@typescript-eslint/prefer-optional-chain": "warn",

      // Não usar type assertion desnecessário
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      // Variáveis não usadas (com exceção de _prefixadas)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },

  // Desliga regras do ESLint que conflitam com Prettier (quotes, semi, indent, etc.)
  prettierConfig,

  { ignores: ["node_modules/", "dist/", "coverage/"] },
);
