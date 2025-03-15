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

## 📚 Documentação da API

A documentação completa da API, incluindo todos os endpoints disponíveis e o sistema de versionamento, pode ser encontrada no arquivo [API.md](API.md).

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
