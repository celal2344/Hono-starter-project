import { z } from '@hono/zod-openapi';

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        data: dataSchema,
    }).openapi('SuccessResponse');

export const ErrorSchema = z.object({
    code: z.number().openapi({
        example: 400,
    }),
    message: z.string().openapi({
        example: 'Bad Request',
    }),
}).openapi("ErrorResponse")

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        data: z.array(itemSchema),
        pagination: paginationSchema,
    }).openapi('PaginatedResponse');

export const paginationSchema = z.object({
    page: z.number().int().positive().optional().openapi({ example: 1 }),
    size: z.number().int().positive().optional().openapi({ example: 10 }),
    sortBy: z.string().optional().openapi({ example: 'timestamps.createdAt' }),
    order: z.enum(['ASC', 'DESC']).optional().openapi({ example: 'ASC' }),
    total: z.number().int().nonnegative().optional().openapi({ example: 100 }),
    totalPages: z.number().int().nonnegative().optional().openapi({ example: 10 }),
}).openapi('ResponsePagination');


export type SuccessResponseType<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof successResponseSchema<T>>>;
export type ErrorResponseType = z.infer<typeof ErrorSchema>;
export type PaginatedResponseType<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof paginatedResponseSchema<T>>>;