import type { PatientDocument } from '@/modules/patient/schemas/patient.js';
import { env } from '@/utils/env.js';
import { Collection, Db, MongoClient } from 'mongodb';
import { logger } from '../logger.js';
import { initializePatientIndexes } from './indexes.js';

interface DatabaseConnection {
    connectToDatabase(): Promise<Db>;
    closeDatabaseConnection(): Promise<void>;
    getDb(): Db;
    getPatientCollection(): Collection<PatientDocument>;
}

class MongoDatabaseConnection implements DatabaseConnection {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connectToDatabase(): Promise<Db> {
        if (this.db) {
            return this.db;
        }
        try {
            this.client = new MongoClient(env.MONGODB_URI);
            await this.client.connect();
            this.db = this.client.db(env.DB_NAME);
            await initializePatientIndexes(this.getPatientCollection());
            logger.info({ module: "mongodb" }, 'Connected to MongoDB');
            return this.db;
        } catch (error) {
            logger.error({ module: "mongodb", error }, 'Failed to connect to MongoDB');
            throw error;
        }
    }

    async closeDatabaseConnection(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            logger.info({ module: "mongodb" }, 'MongoDB connection closed');
        }
    }

    getDb(): Db {
        if (!this.db) {
            throw new Error('Database not connected. Call connectToDatabase first.');
        }
        return this.db;
    }

    getPatientCollection(): Collection<PatientDocument> {
        return this.getDb().collection<PatientDocument>('patients');
    }


}

export const getDb = async (): Promise<Db> => {
    const databaseConnection = new MongoDatabaseConnection();
    return databaseConnection.connectToDatabase();
}
export const databaseConnection = new MongoDatabaseConnection();
export const getPatientCollection = (): Collection<PatientDocument> => databaseConnection.getPatientCollection();
