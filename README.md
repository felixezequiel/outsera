# Outsera API

API para gerenciamento de filmes, com suporte a múltiplas versões.

## 💻 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (normalmente vem com o Node.js)
- Git

Não é necessário instalar nenhum banco de dados, pois a aplicação utiliza SQLite em memória.

## 🚀 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/outsera-api.git
cd outsera-api
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## ⚡ Testes

### Executando os Testes de Integração

Para rodar os testes de integração:
```bash
npm run test
```

Para rodar os testes com cobertura:
```bash
npm run test:coverage
```

Para rodar os testes em modo watch (útil durante o desenvolvimento):
```bash
npm run test:watch
```

### Estrutura dos Testes

Os testes de integração estão localizados em `src/tests/integration` e cobrem:
- Criação de filmes (`/movies`)
- Listagem e filtros (`/movies?year=&winner=`)
- Importação de CSV (`/movies/import`)
- Intervalos entre prêmios (`/movies/producer-award-intervals`)
- Tratamento de erros e validações

## 📚 Documentação da API

### Swagger UI

A API possui documentação interativa através do Swagger UI. Para acessá-la:

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse no navegador:
```
http://localhost:3000/api-docs
```

No Swagger UI você pode:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente pela interface
- Ver exemplos de requisição e resposta
- Verificar os códigos de status possíveis

### Documentação Detalhada

Para uma documentação mais detalhada da API, incluindo todos os endpoints disponíveis e o sistema de versionamento, consulte o arquivo [API.md](API.md).

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture:

```
src/
├── domain/         # Regras de negócio e entidades
├── data/          # Interfaces de repositórios
├── infra/         # Implementações (banco de dados, etc)
├── presentation/  # Controllers e presenters
├── main/          # Configuração e composição
└── tests/         # Testes de integração
```

## 🔍 Características

- Clean Architecture
- SOLID Principles
- Banco em memória (SQLite)
- Tratamento de erros padronizado
- Testes de integração
- TypeScript
- Prisma ORM
- Express
- Swagger UI para documentação interativa
- Documentação detalhada

## 📊 Cobertura de Testes

Os testes cobrem:
- Criação de filmes
- Validações de dados
- Busca por ano
- Busca de vencedores
- Importação de CSV
- Tratamento de erros
- Cálculo de intervalos entre prêmios

> **Importante:** O servidor estar parado

Para verificar a cobertura atual:
```bash
npm run test:coverage
```

## 🐛 Problemas Conhecidos

Se você encontrar algum problema ao rodar o projeto ou os testes, verifique:

1. Se todas as dependências foram instaladas
2. Se a porta 3000 não está em uso
3. Se a versão do Node.js é compatível

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
