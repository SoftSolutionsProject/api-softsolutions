import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'SoftSolutions API',
      version: '1.0.0',
      description: 'API para gerenciamento de usuários e inscrições em cursos na plataforma SoftSolutions',
      contact: {
        name: 'Equipe SoftSolutions',
        email: 'contato@softsolutions.com',
      },
    },
    servers: [
      {
        url: 'https://soft-solutions-chi.vercel.app/',
        description: 'Servidor',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.ts', './models/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log(`Documentação Swagger disponível em http://localhost:${process.env.PORT}/api-docs`);

};
