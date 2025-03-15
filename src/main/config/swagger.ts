import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Outsera API',
      version: '1.0.0',
      description: 'API para gerenciamento de filmes do Golden Raspberry Awards',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Suporte',
        url: 'https://github.com/felixezequiel/outsera',
        email: 'felixezequiel48@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: ['./src/main/routes/**/*.ts'], // Caminho para os arquivos com anotações
};

export const swaggerSpec = swaggerJsdoc(options); 