import { z } from 'zod';


export const documentStateSchema = z.object({
    isCanceled: z.boolean().default(false).openapi({ example: false }),
    cancelledAt: z.number().nullable().default(null).openapi({ example: null }),
}).openapi("DocumentState")
    .default(() => ({
        isCanceled: false,
        cancelledAt: null
    }))