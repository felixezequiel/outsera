# Outsera API

API RESTful para gerenciamento de filmes, desenvolvida com Node.js, TypeScript, Express e Prisma, seguindo os princípios da Clean Architecture.

## 💻 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (normalmente vem com o Node.js)

Não é necessário instalar nenhum banco de dados, pois a aplicação utiliza SQLite em memória.

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/outsera-api.git
cd outsera-api
```

2. Instale as dependências:
```bash
npm install
```

3. Gere o cliente Prisma:
```bash
npm run prisma:generate
```

## ⚙️ Configuração

A aplicação usa as seguintes variáveis de ambiente (já configuradas com valores padrão):

- `PORT`: Porta onde a aplicação irá rodar (padrão: 3000)
- `DATABASE_URL`: URL do banco de dados (já configurado para usar SQLite em memória)

## 🏃‍♂️ Rodando a aplicação

1. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

2. Ou em modo produção:
```bash
npm run build
npm start
```

A API estará disponível em `http://localhost:3000`

## 🧪 Testes

### Executando os testes de integração

```bash
npm test
```

Para executar os testes em modo watch:
```bash
npm run test:watch
```

Para gerar relatório de cobertura:
```bash
npm run test:coverage
```

### Sobre os testes

- Os testes utilizam um banco de dados SQLite em memória
- O banco é limpo antes e depois de cada teste
- São testadas todas as operações CRUD
- Inclui testes de importação do arquivo CSV
- Validações de regras de negócio são testadas

## 📝 Endpoints da API

### Filmes

- `GET /api/movies`: Lista todos os filmes
- `POST /api/movies`: Cria um novo filme
  ```json
  {
    "title": "Nome do Filme",
    "year": 2020,
    "studios": "Estúdio",
    "producers": "Produtor",
    "winner": false
  }
  ```
- `POST /api/movies/import`: Importa filmes via arquivo CSV
  - Envie um arquivo CSV usando `multipart/form-data`
  - Campo do arquivo: `file`
  - Formato do CSV:
    ```csv
    year;title;studios;producers;winner
    2020;Nome do Filme;Estúdio;Produtor;yes
    ```
  - Limite de arquivo: 10MB
  - Processamento em lotes de 100 registros
  - Validações:
    - Arquivo deve ser CSV
    - Campos obrigatórios: title, year, studios, producers
    - Campo winner aceita "yes" ou "no"

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
- Documentação detalhada

## 📊 Cobertura de Testes

Os testes cobrem:
- Criação de filmes
- Validações de dados
- Busca por ano
- Busca de vencedores
- Importação de CSV
- Tratamento de erros

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 