import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

export const openAPIObjectConfig = {
    openapi: "3.1.0",
    info: {
        version: "1.0.0",
        title: "Healthcare API",
        description: "Comprehensive API for healthcare management system with authentication",
    },
    servers: [
        {
            url: "http://localhost:3001",
            description: "Local Development Server",
        },
    ],
    externalDocs: {
        description: "Find out more about Healthcare API",
        url: "https://www.example.com",
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Enter your JWT token from Better Auth",
            },
        },
    },
};

export default function configureOpenAPI(app: OpenAPIHono) {
    // Generate OpenAPI specification for the main API
    app.doc('/openapi.json', openAPIObjectConfig);

    app.get(
        '/docs',
        Scalar({
            theme: 'purple',
            layout: 'modern',
            pageTitle: 'Healthcare API Documentation',
            sources: [
                { url: '/openapi.json', title: 'Main API' },
                { url: '/auth-schema.json', title: 'Authentication API (Better Auth)' },
            ],
        })
    );
}