import { z } from 'zod';

export interface Timestamps {
    createdAt: number;
    updatedAt: number;
}

export const timestampsSchema = z.object({
    createdAt: z.number(),
    updatedAt: z.number(),
}).openapi("Timestamps")
    .default(() => ({
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }))