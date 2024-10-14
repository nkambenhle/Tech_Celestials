 // swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'MongoDB API',
        version: '1.0.0',
        description: 'API documentation for MongoDB collections'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server'
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = setupSwagger;

