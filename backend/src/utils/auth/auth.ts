import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { openAPI } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';
import { env } from '../env.js';


const mongoClient = new MongoClient(env.MONGODB_URI);
await mongoClient.connect();
const db = mongoClient.db(env.DB_NAME);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: mongoClient
    }),
    secret: env.BETTER_AUTH_SECRET || '',
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
    },
    trustedOrigins: [env.FRONTEND_URL],
    socialProviders: {},
    plugins: [
        openAPI({
            disableDefaultReference: false,
            path: "/auth/reference",
            theme: "purple"
        }),
    ],
    user: {
        collectionName: 'users',
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "nurse",
                input: true,
            }
        }
    },
});