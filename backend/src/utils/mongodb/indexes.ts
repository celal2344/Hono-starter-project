import type { PatientDocument } from '@/modules/patient/schemas/patient.js';
import { Collection } from 'mongodb';

export async function initializePatientIndexes(
    patientCollection: Collection<PatientDocument>
): Promise<void> {
    await Promise.all([
        patientCollection.createIndex(
            { identifier: 1 },
            { unique: true, name: 'identifier_unique' }
        ),
        patientCollection.createIndex(
            { name: 1, surname: 1 },
            { name: 'name_surname_idx' }
        ),
        patientCollection.createIndex(
            { birthDate: 1 },
            { name: 'birthDate_idx' }
        ),
        patientCollection.createIndex(
            { country: 1 },
            { name: 'country_idx' }
        ),
        patientCollection.createIndex(
            { 'timestamps.createdAt': -1 },
            { name: 'timestamps_createdAt_idx' }
        )
    ]);
}

