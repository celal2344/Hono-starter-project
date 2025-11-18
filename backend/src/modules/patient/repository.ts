import { logger } from "@/utils/logger.js";
import { getPatientCollection } from "@/utils/mongodb/mongo.js";
import { buildAggregationPipeline } from "@/utils/mongodb/query.js";
import { validateArray } from "@/utils/mongodb/validateArray.js";
import type { QueryParamsType } from "@/utils/schemas/request.js";
import { formatZodError } from "@/utils/zod-formatter.js";
import { ObjectId } from "mongodb";
import { patientDocumentSchema, patientSchema, type CreatePatient, type Patient, type UpdatePatient } from "./schemas/patient.js";


export const savePatientRepository = async (patientData: CreatePatient): Promise<Patient> => {
    const { data, error } = patientDocumentSchema.safeParse(patientData);
    if (error) {
        logger.error({ module: "patientRepository", error }, 'Patient document validation failed');
        throw new Error('Invalid patient data');
    }
    try {
        const result = await getPatientCollection().insertOne(data);

        logger.info({ module: "patientRepository", insertedId: result.insertedId.toString(), patient: data }, 'Patient inserted successfully');
        return {
            ...data,
            _id: result.insertedId.toString()
        };
    } catch (err) {
        logger.error({ module: "patientRepository", error: err }, 'Error saving patient to database');
        throw err;
    }
}

export const listPatientsRepository = async (query: QueryParamsType): Promise<{
    patients: Patient[];
    total: number;
}> => {
    try {
        logger.info({ module: "patientRepository", query }, 'Listing patients with query');
        const { pipeline, filters } = buildAggregationPipeline(query);

        const documents = await getPatientCollection().aggregate(pipeline).toArray();

        const patients = validateArray(documents, patientSchema);

        const total = await getPatientCollection().countDocuments(filters);

        logger.info({ module: "patientRepository", count: patients.length, total }, 'Patients retrieved successfully');
        return {
            patients,
            total
        };
    } catch (err) {
        logger.error({ module: "patientRepository", error: err }, 'Error retrieving patients from database');
        throw err;
    }
}

export const getPatientByIdRepository = async (id: string): Promise<Patient | null> => {
    try {
        if (!ObjectId.isValid(id)) {
            logger.warn({ module: "patientRepository", id }, 'Invalid ObjectId format');
            return null;
        }

        const document = await getPatientCollection().findOne({ _id: new ObjectId(id), 'documentState.isCanceled': { $ne: true }, 'documentState.cancelledAt': { $eq: null } });

        if (!document) {
            logger.info({ module: "patientRepository", id }, 'Patient not found');
            return null;
        }

        const { data, error } = patientSchema.safeParse({
            ...document,
            _id: document._id
        });
        if (error) {
            logger.error({ module: "patientRepository", id, error: formatZodError(error) }, 'Patient document validation failed');
            return null;
        }
        logger.info({ module: "patientRepository", id }, 'Patient retrieved successfully');
        return data;
    } catch (err) {
        logger.error({ module: "patientRepository", error: err, id }, 'Error retrieving patient from database');
        throw err;
    }
};

export const updatePatientRepository = async (id: string, patientData: UpdatePatient): Promise<Patient | null> => {
    try {
        if (!ObjectId.isValid(id)) {
            logger.warn({ module: "patientRepository", id }, 'Invalid ObjectId format');
            return null;
        }

        logger.info({ module: "patientRepository", id, patientData }, 'Updating patient with data');
        const updateFields = Object.fromEntries(
            Object.entries(patientData).filter(([key, value]) => value !== undefined && key !== 'timestamps')
        );

        const updateData = {
            ...updateFields,
            'timestamps.updatedAt': Date.now()
        };

        const result = await getPatientCollection().findOneAndUpdate(
            { _id: new ObjectId(id), 'documentState.isCanceled': { $eq: false }, 'documentState.cancelledAt': { $eq: null } },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            logger.info({ module: "patientRepository", id }, 'Patient not found for update');
            return null;
        }

        const { data, error } = patientSchema.safeParse({
            ...result,
            _id: result._id
        });
        if (error) {
            logger.error({ module: "patientRepository", id, error: formatZodError(error) }, 'Patient document validation failed after update');
            return null;
        }
        logger.info({ module: "patientRepository", id }, 'Patient updated successfully');
        return data;
    } catch (err) {
        logger.error({ module: "patientRepository", error: err, id }, 'Error updating patient in database');
        throw err;
    }
};