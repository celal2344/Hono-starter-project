import { createPatientSchema, patientSchema, updatePatientRequestSchema } from "@/modules/patient/schemas/patient.js";
import { queryParamsSchema } from "@/utils/schemas/request.js";
import { ErrorSchema, paginatedResponseSchema, successResponseSchema } from "@/utils/schemas/response.js";
import { createRoute, z } from '@hono/zod-openapi';
import { zValidator } from "@hono/zod-validator";

export const createPatientRoute = createRoute({
    method: 'post',
    path: '/',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createPatientSchema,
                },
            },
        },
    },
    middleware: [
        zValidator("json", createPatientSchema.strict(), (result, c) => {
            if (!result.success) {
                const errors = result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                return c.json({
                    code: 400,
                    message: 'Validation failed',
                    errors: errors,
                }, 400);
            }
            return undefined;
        })
    ],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: successResponseSchema(createPatientSchema),
                },
            },
            description: 'Successfully created patient',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Validation error',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Server error',
        },
    },
});

export const listPatientsRoute = createRoute({
    method: 'get',
    path: '/',
    request: {
        query: queryParamsSchema
    },
    middleware: [
        zValidator("query", queryParamsSchema.strict(), (result, c) => {
            if (!result.success) {
                const errors = result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                return c.json({
                    code: 400,
                    message: 'Validation failed',
                    errors: errors,
                }, 400);
            }
            return undefined;
        })
    ],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: paginatedResponseSchema(patientSchema),
                },
            },
            description: 'Successfully retrieved patients list',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Server error',
        },
    },
});

export const getPatientByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: z.object({
            id: z.string().min(1).openapi({ example: '507f1f77bcf86cd799439011', description: 'Patient ID' })
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: successResponseSchema(patientSchema),
                },
            },
            description: 'Successfully retrieved patient',
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Patient not found',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Server error',
        },
    },
});

export const updatePatientRoute = createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
        params: z.object({
            id: z.string().min(1).openapi({ example: '507f1f77bcf86cd799439011', description: 'Patient ID' })
        }),
        body: {
            content: {
                'application/json': {
                    schema: updatePatientRequestSchema,
                },
            },
        },
    },
    middleware: [
        zValidator("json", updatePatientRequestSchema, (result, c) => {
            if (!result.success) {
                const errors = result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                return c.json({
                    code: 400,
                    message: 'Validation failed',
                    errors: errors,
                }, 400);
            }
            return undefined;
        })
    ],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: successResponseSchema(patientSchema),
                },
            },
            description: 'Successfully updated patient',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Validation error',
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Patient not found',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Server error',
        },
    },
});

export const cancelPatientRoute = createRoute({
    method: 'post',
    path: '/{id}/cancel',
    request: {
        params: z.object({
            id: z.string().min(1).openapi({ example: '507f1f77bcf86cd799439011', description: 'Patient ID' })
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: successResponseSchema(patientSchema),
                },
            },
            description: 'Successfully cancelled patient',
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Patient not found',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorSchema,
                },
            },
            description: 'Server error',
        },
    },
});