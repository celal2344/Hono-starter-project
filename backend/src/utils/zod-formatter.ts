import type z from "zod";

export const formatZodError = (error: z.ZodError): string => {
    return error.issues
        .map(issue => `Field '${issue.path.join('.')}': ${issue.message}`)
        .join('; ');
};