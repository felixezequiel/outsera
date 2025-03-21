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
git clone https://github.com/felixezequiel/outsera
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

> **Importante:** O servidor estar parado porque é utilizado supertest para testar as chamadas de API

Para rodar os testes de integração:
```bash
npm run test
```

Para rodar os testes em modo watch (útil durante o desenvolvimento):
```bash
npm run test:watch
```

## 📊 Cobertura de Testes

Os testes cobrem:
- Criação de filmes
- Atualização de filmes
- Deleção de filmes
- Validações de dados
- Busca por ano
- Busca de vencedores
- Importação de CSV
- Tratamento de erros
- Cálculo de intervalos entre prêmios

Para verificar a cobertura atual:
```bash
npm run test:coverage
```

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
├── domain/         # Entidades e regras de negócio fundamentais
├── application/    # Use cases e regras de aplicação
├── data/          # Interfaces de repositórios e abstrações
├── infra/         # Implementações concretas (DB, frameworks, etc)
├── presentation/  # Controllers, presenters e adaptadores de UI
├── main/          # Configuração, composição e bootstrap
└── tests/         # Testes de integração
```

### Camadas

1. **Domain**: Contém apenas entidades e regras de negócio fundamentais
   - Entidades (Movie, Producer, etc.)
   - Interfaces base do domínio
   - Regras de negócio invariantes

2. **Application**: Implementa os casos de uso da aplicação
   - Use cases específicos
   - Regras de negócio da aplicação
   - Orquestração entre entidades

3. **Data**: Define contratos para acesso a dados
   - Interfaces de repositórios
   - DTOs
   - Contratos de serviços

4. **Infrastructure**: Implementações concretas
   - Repositórios
   - Serviços externos
   - Frameworks e bibliotecas

5. **Presentation**: Interface com o usuário
   - Controllers
   - Presenters
   - Adaptadores de API

6. **Main**: Composição e configuração
   - Factories
   - Configurações
   - Bootstrap da aplicação

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

## 🐛 Problemas Conhecidos

Se você encontrar algum problema ao rodar o projeto ou os testes, verifique:

1. Se todas as dependências foram instaladas
2. Se a porta 3000 não está em uso
3. Se a versão do Node.js é compatível

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
