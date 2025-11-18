import { logger } from "@/utils/logger.js";
import type { z } from "@hono/zod-openapi";
import type { Document } from "mongodb";
import { formatZodError } from "../zod-formatter.js";

export const validateArray = <T>(documents: Document[], schema: z.ZodSchema<T>,): T[] => {
    const validItems: T[] = [];
    const invalidItems: Array<{ doc: Document; error: string }> = [];

    documents.forEach((doc) => {
        const result = schema.safeParse(doc);
        if (result.success) {
            validItems.push(result.data);
        } else {
            invalidItems.push({
                doc: doc,
                error: formatZodError(result.error)
            });
        }
    });

    if (invalidItems.length > 0) {
        logger.error({
            invalidCount: invalidItems.length,
            totalCount: documents.length,
            invalidItems
        }, 'Some documents failed validation and were excluded');
    }

    return validItems;
};