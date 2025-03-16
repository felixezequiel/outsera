# Documentação da API

## Controle de Versão

A API suporta múltiplas versões que podem ser acessadas de duas formas:

### 1. Via URL Path (Recomendado)

```
GET http://localhost:3000/api/v1/movies
GET http://localhost:3000/api/v2/movies
```

### 2. Via Header

```
GET http://localhost:3000/api/movies
Accept-Version: v1
```

## Endpoints

### Versão 1 (v1)

#### GET /api/v1/movies

Lista todos os filmes cadastrados.

**Parâmetros de Query:**
- `year` (opcional): Filtra filmes por ano
- `winner` (opcional): Filtra filmes vencedores (true/false)

**Resposta (200):**
```json
[
  {
    "id": "uuid",
    "title": "Nome do Filme",
    "year": 2024,
    "studios": "Estúdio",
    "producers": "Produtor",
    "winner": false
  }
]
```

#### POST /api/v1/movies

Cria um novo filme.

**Body:**
```json
{
  "title": "Nome do Filme",
  "year": 2024,
  "studios": "Estúdio",
  "producers": "Produtor",
  "winner": false
}
```

**Resposta (201):**
```json
{
  "id": "uuid",
  "title": "Nome do Filme",
  "year": 2024,
  "studios": "Estúdio",
  "producers": "Produtor",
  "winner": false
}
```

**Erros:**
- 409: Título duplicado
- 422: Ano inválido

#### POST /api/v1/movies/import

Importa filmes via arquivo CSV.

**Headers:**
- Content-Type: multipart/form-data

**Body:**
- `file`: Arquivo CSV

**Formato do CSV:**
```csv
title;year;studios;producers;winner
Filme A;2020;Estúdio A;Produtor A;yes
Filme B;2021;Estúdio B;Produtor B;no
```

**Regras do CSV:**
- Delimitador: ponto e vírgula (;)
- Campo winner: "yes" para vencedor, qualquer outro valor para não vencedor
- Tamanho máximo: 10MB
- Tipo: text/csv

**Resposta (200):**
```json
{
  "message": "X filmes importados com sucesso"
}
```

**Erros:**
- 400: Arquivo inválido ou formato incorreto
- 422: Dados inválidos no CSV

#### GET /api/v1/movies/producer-award-intervals

Retorna os produtores com maior e menor intervalo entre dois prêmios consecutivos.

**Resposta (200):**
```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

#### PUT /api/v1/movies/{id}

Atualiza um filme existente.

**Parâmetros de URL:**
- `id`: UUID do filme a ser atualizado

**Body:**
```json
{
  "title": "Nome do Filme",
  "year": 2024,
  "studios": "Estúdio",
  "producers": "Produtor",
  "winner": false
}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "title": "Nome do Filme",
  "year": 2024,
  "studios": "Estúdio",
  "producers": "Produtor",
  "winner": false,
  "createdAt": "2024-03-16T20:00:00.000Z",
  "updatedAt": "2024-03-16T20:30:00.000Z"
}
```

**Erros:**
- 400: Dados inválidos no corpo da requisição
- 404: Filme não encontrado
- 409: Já existe um filme com o mesmo título
- 422: Erro de validação (ano inválido ou título em branco)

#### DELETE /api/v1/movies/{id}

Remove um filme existente.

**Parâmetros de URL:**
- `id`: UUID do filme a ser removido

**Resposta (204):**
Sem conteúdo

**Erros:**
- 404: Filme não encontrado

### Versão 2 (v2)

A versão 2 da API atualmente mantém os mesmos endpoints da v1, preparada para futuras atualizações:

- GET /api/v2/movies
- POST /api/v2/movies
- POST /api/v2/movies/import
- PUT /api/v2/movies/{id}
- DELETE /api/v2/movies/{id}

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "error": "Mensagem descritiva do erro"
}
```

### Códigos de Status

- 200: Sucesso
- 201: Recurso criado
- 400: Requisição inválida
- 409: Conflito (ex: recurso duplicado)
- 422: Erro de validação
- 500: Erro interno do servidor

## Limites e Restrições

- Tamanho máximo de arquivo CSV: 10MB
- Anos válidos: até o ano atual
- Campos obrigatórios: title, year, studios, producers
- Campo winner é opcional, default false 