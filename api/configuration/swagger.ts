export const swaggerDocument = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kaban Library API',
      version: '1.0.0',
      description: 'A simple Express Kaban Library API'
    },
    servers: [
      {
        url: 'http://localhost:8907'
      }
    ]
  },
  apis: ['./routes/*.ts']
}
