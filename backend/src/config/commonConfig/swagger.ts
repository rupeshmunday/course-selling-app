import path from 'path';

export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'This is the API documentation for the app',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
        ],
    },
    apis: [
        path.join(__dirname, '../../routes/*.ts'),
        path.join(__dirname, '../../routes/**/*.ts')
    ], // Points to route files and nested route files
};