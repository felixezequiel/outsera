# Outsera API

API para gerenciamento de filmes, com suporte a múltiplas versões.

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

3. Configure as variáveis de ambiente copiando o arquivo `.env.example` para `.env`

4. Execute o servidor:
```bash
npm run dev
```

## Versionamento da API

A API suporta múltiplas versões que podem ser acessadas de duas formas:

### 1. Via URL Path

```
GET http://localhost:3000/api/v1/movies
GET http://localhost:3000/api/v2/movies
```

### 2. Via Header

```
GET http://localhost:3000/api/movies
Accept-Version: v1
```

ou

```
GET http://localhost:3000/api/movies
Accept-Version: v2
```

Se nenhuma versão for especificada, a API utilizará a versão mais recente (atualmente v2).

## Endpoints

### Versão 1 (v1)

#### Filmes

- `GET /api/v1/movies` - Lista todos os filmes
- `POST /api/v1/movies` - Cria um novo filme
  ```json
  {
    "title": "Nome do Filme",
    "year": 2024,
    "studios": "Estúdio",
    "producers": "Produtor",
    "winner": false
  }
  ```
- `POST /api/v1/movies/import` - Importa filmes via CSV
  - Enviar arquivo CSV via multipart/form-data
  - Campo: `file`
  - Formato: CSV com delimitador ";"
  - Colunas: title;year;studios;producers;winner

### Versão 2 (v2)

Atualmente idêntica à v1, preparada para futuras atualizações.

#### Filmes

- `GET /api/v2/movies` - Lista todos os filmes
- `POST /api/v2/movies` - Cria um novo filme
- `POST /api/v2/movies/import` - Importa filmes via CSV

## Formato do CSV para Importação

O arquivo CSV deve seguir o seguinte formato:

```csv
title;year;studios;producers;winner
Filme A;2020;Estúdio A;Produtor A;yes
Filme B;2021;Estúdio B;Produtor B;no
```

- Delimitador: ponto e vírgula (;)
- Campo winner: "yes" para vencedor, qualquer outro valor para não vencedor
- Tamanho máximo do arquivo: 10MB
- Tipo de arquivo: text/csv

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