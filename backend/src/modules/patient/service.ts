import { getPatientByIdRepository, listPatientsRepository, savePatientRepository, updatePatientRepository } from "@/modules/patient/repository.js";
import { patientSchema, type CreatePatient, type UpdatePatient } from "@/modules/patient/schemas/patient.js";
import { logger } from "@/utils/logger.js";
import { parsePaginationResponseQuery } from "@/utils/mongodb/query.js";
import type { QueryParamsType } from "@/utils/schemas/request.js";
import type { PaginatedResponseType, SuccessResponseType } from "@/utils/schemas/response.js";


export const createPatientService = async (patientData: CreatePatient): Promise<SuccessResponseType<typeof patientSchema>> => {
    try {
        const createdPatient = await savePatientRepository(patientData);

        return { data: createdPatient };
    } catch (err) {
        logger.error({ module: "patientService", error: err }, 'Error in createPatientService');
        throw err;
    }
};

export const listPatientsService = async (query: QueryParamsType): Promise<PaginatedResponseType<typeof patientSchema>> => {
    try {
        const patientsResponse = await listPatientsRepository(query);

        const pagination = parsePaginationResponseQuery(query, patientsResponse.total);
        logger.info({ module: "patientService", pagination }, 'Pagination info in listPatientsService');
        return { data: patientsResponse.patients, pagination };
    } catch (err) {
        logger.error({ module: "patientService", error: err }, 'Error in listPatientsService');
        throw err;
    }
};

export const getPatientByIdService = async (id: string): Promise<SuccessResponseType<typeof patientSchema> | null> => {
    try {
        const patient = await getPatientByIdRepository(id);

        if (!patient) {
            return null;
        }

        return { data: patient };
    } catch (err) {
        logger.error({ module: "patientService", error: err }, 'Error in getPatientByIdService');
        throw err;
    }
};

export const updatePatientService = async (id: string, patientData: UpdatePatient): Promise<SuccessResponseType<typeof patientSchema> | null> => {
    try {
        const updatedPatient = await updatePatientRepository(id, patientData);

        if (!updatedPatient) {
            return null;
        }

        return { data: updatedPatient };
    } catch (err) {
        logger.error({ module: "patientService", error: err }, 'Error in updatePatientService');
        throw err;
    }
};