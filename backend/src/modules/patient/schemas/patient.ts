import { documentStateSchema } from '@/utils/mongodb/document-state.js';
import { timestampsSchema } from '@/utils/mongodb/timestamps.js';
import { z } from '@hono/zod-openapi';
import type { ObjectId } from 'mongodb';

export const createPatientSchema = z.object({
    name: z.string().min(2).openapi({ example: "John" }),
    surname: z.string().min(2).openapi({ example: "Doe" }),
    gender: z.enum(["male", "female", "other"]).openapi({ example: "male" }),
    birthDate: z.number().openapi({ example: 19900101 }),
    identifier: z.string().openapi({ example: "ID12345" }),
    country: z.string().min(2).openapi({ example: "USA" }),
    ethnicity: z.string().min(2).openapi({ example: "Caucasian" }),
    companionInfo: z.array(
        z.object({
            name: z.string().min(2),
            relation: z.string().min(2),
            contactNumber: z.string().min(5),
        })
    ).optional(),
    documentState: documentStateSchema,
}).openapi("CreatePatient");

export const patientDocumentSchema = createPatientSchema.extend({
    timestamps: timestampsSchema
}).openapi("PatientDocument");

export const updatePatientRequestSchema = createPatientSchema.partial().openapi("UpdatePatientRequest");
export const updatePatientDocumentSchema = patientDocumentSchema.partial().openapi("UpdatePatient");

export const patientSchema = patientDocumentSchema.extend({
    _id: z.custom<ObjectId>((val) => {
        return val && typeof val === 'object' && 'toHexString' in val;
    }, "Invalid ObjectId")
        .transform((val) => val.toString())
        .openapi({ type: 'string', example: '507f1f77bcf86cd799439011' })
});


export type Patient = z.infer<typeof patientSchema>;
export type CreatePatient = z.infer<typeof createPatientSchema>;
export type UpdatePatient = z.infer<typeof updatePatientDocumentSchema>;
export type PatientDocument = z.infer<typeof patientDocumentSchema>;