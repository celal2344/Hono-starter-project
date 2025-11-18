import { z } from '@hono/zod-openapi';

export const queryParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    size: z.coerce.number().int().positive().default(20),
    sortBy: z.string().default("timestamps.createdAt"),
    order: z.enum(['ASC', 'DESC']).default("ASC"),
    filters: z.string().default("{}")
}).openapi("ListQueryParams").strict()

export type QueryParamsType = z.infer<typeof queryParamsSchema>;