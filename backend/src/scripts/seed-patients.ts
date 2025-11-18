import type { CreatePatient } from '../modules/patient/schemas/patient.js';
import { auth } from '../utils/auth/auth.js';
import { logger } from '../utils/logger.js';
import { databaseConnection, getPatientCollection } from '../utils/mongodb/mongo.js';

// Generate unique identifiers using timestamp
const timestamp = Date.now();

const mockPatients: CreatePatient[] = [
    {
        name: "John",
        surname: "Doe",
        gender: "male",
        birthDate: 19900101,
        identifier: `ID${timestamp}-001`,
        country: "USA",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Jane Doe",
                relation: "Wife",
                contactNumber: "+1 555 0101"
            }
        ]
    },
    {
        name: "Maria",
        surname: "Garcia",
        gender: "female",
        birthDate: 19850515,
        identifier: `ID${timestamp}-002`,
        country: "Spain",
        ethnicity: "Hispanic",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Carlos Garcia",
                relation: "Husband",
                contactNumber: "+34 600 123456"
            }
        ]
    },
    {
        name: "Ahmed",
        surname: "Hassan",
        gender: "male",
        birthDate: 19920720,
        identifier: `ID${timestamp}-003`,
        country: "Egypt",
        ethnicity: "Middle Eastern",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Yuki",
        surname: "Tanaka",
        gender: "female",
        birthDate: 19880310,
        identifier: `ID${timestamp}-004`,
        country: "Japan",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Hiro Tanaka",
                relation: "Brother",
                contactNumber: "+81 90 1234 5678"
            },
            {
                name: "Akiko Tanaka",
                relation: "Mother",
                contactNumber: "+81 90 8765 4321"
            }
        ]
    },
    {
        name: "Samuel",
        surname: "Johnson",
        gender: "male",
        birthDate: 19951205,
        identifier: `ID${timestamp}-005`,
        country: "Canada",
        ethnicity: "African American",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Emma",
        surname: "Wilson",
        gender: "female",
        birthDate: 19870822,
        identifier: `ID${timestamp}-006`,
        country: "United Kingdom",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Oliver Wilson",
                relation: "Son",
                contactNumber: "+44 7700 900123"
            }
        ]
    },
    {
        name: "Priya",
        surname: "Sharma",
        gender: "female",
        birthDate: 19930614,
        identifier: `ID${timestamp}-007`,
        country: "India",
        ethnicity: "South Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Michael",
        surname: "O'Brien",
        gender: "male",
        birthDate: 19820928,
        identifier: `ID${timestamp}-008`,
        country: "Ireland",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Sarah O'Brien",
                relation: "Wife",
                contactNumber: "+353 85 123 4567"
            }
        ]
    },
    {
        name: "Li",
        surname: "Chen",
        gender: "other",
        birthDate: 19981103,
        identifier: `ID${timestamp}-009`,
        country: "China",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Sofia",
        surname: "Rossi",
        gender: "female",
        birthDate: 19910418,
        identifier: `ID${timestamp}-010`,
        country: "Italy",
        ethnicity: "Mediterranean",
        documentState: { isCanceled: true, cancelledAt: null },
        companionInfo: [
            {
                name: "Marco Rossi",
                relation: "Father",
                contactNumber: "+39 333 1234567"
            }
        ]
    },
    {
        name: "Dmitri",
        surname: "Volkov",
        gender: "male",
        birthDate: 19890225,
        identifier: `ID${timestamp}-011`,
        country: "Russia",
        ethnicity: "Slavic",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Anastasia Volkova",
                relation: "Sister",
                contactNumber: "+7 916 123 4567"
            }
        ]
    },
    {
        name: "Fatima",
        surname: "Al-Rahman",
        gender: "female",
        birthDate: 19940707,
        identifier: `ID${timestamp}-012`,
        country: "Saudi Arabia",
        ethnicity: "Middle Eastern",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Lars",
        surname: "Andersen",
        gender: "male",
        birthDate: 19860912,
        identifier: `ID${timestamp}-013`,
        country: "Denmark",
        ethnicity: "Scandinavian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Ingrid Andersen",
                relation: "Wife",
                contactNumber: "+45 20 12 34 56"
            },
            {
                name: "Erik Andersen",
                relation: "Son",
                contactNumber: "+45 20 98 76 54"
            }
        ]
    },
    {
        name: "Aisha",
        surname: "Nkrumah",
        gender: "female",
        birthDate: 19920330,
        identifier: `ID${timestamp}-014`,
        country: "Ghana",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Roberto",
        surname: "Silva",
        gender: "male",
        birthDate: 19970618,
        identifier: `ID${timestamp}-015`,
        country: "Brazil",
        ethnicity: "Latino",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Isabella Silva",
                relation: "Mother",
                contactNumber: "+55 11 98765 4321"
            }
        ]
    },
    {
        name: "Mei",
        surname: "Wong",
        gender: "female",
        birthDate: 19990824,
        identifier: `ID${timestamp}-016`,
        country: "Singapore",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Hans",
        surname: "Mueller",
        gender: "male",
        birthDate: 19831117,
        identifier: `ID${timestamp}-017`,
        country: "Germany",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Greta Mueller",
                relation: "Wife",
                contactNumber: "+49 170 123 4567"
            }
        ]
    },
    {
        name: "Chioma",
        surname: "Okafor",
        gender: "female",
        birthDate: 19960502,
        identifier: `ID${timestamp}-018`,
        country: "Nigeria",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Pavel",
        surname: "Novak",
        gender: "male",
        birthDate: 19910908,
        identifier: `ID${timestamp}-019`,
        country: "Czech Republic",
        ethnicity: "Slavic",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Jana Novakova",
                relation: "Partner",
                contactNumber: "+420 777 123 456"
            }
        ]
    },
    {
        name: "Amara",
        surname: "Patel",
        gender: "other",
        birthDate: 20000115,
        identifier: `ID${timestamp}-020`,
        country: "India",
        ethnicity: "South Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Jean-Pierre",
        surname: "Dubois",
        gender: "male",
        birthDate: 19781203,
        identifier: `ID${timestamp}-021`,
        country: "France",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Marie Dubois",
                relation: "Wife",
                contactNumber: "+33 6 12 34 56 78"
            },
            {
                name: "Louis Dubois",
                relation: "Son",
                contactNumber: "+33 6 98 76 54 32"
            }
        ]
    },
    {
        name: "Nadia",
        surname: "Kowalski",
        gender: "female",
        birthDate: 19930521,
        identifier: `ID${timestamp}-022`,
        country: "Poland",
        ethnicity: "Slavic",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "James",
        surname: "Mitchell",
        gender: "male",
        birthDate: 19880416,
        identifier: `ID${timestamp}-023`,
        country: "Australia",
        ethnicity: "Caucasian",
        documentState: { isCanceled: true, cancelledAt: null },
        companionInfo: [
            {
                name: "Emily Mitchell",
                relation: "Sister",
                contactNumber: "+61 412 345 678"
            }
        ]
    },
    {
        name: "Zara",
        surname: "Khan",
        gender: "female",
        birthDate: 19950809,
        identifier: `ID${timestamp}-024`,
        country: "Pakistan",
        ethnicity: "South Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Carlos",
        surname: "Rodriguez",
        gender: "male",
        birthDate: 19840322,
        identifier: `ID${timestamp}-025`,
        country: "Mexico",
        ethnicity: "Latino",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Gabriela Rodriguez",
                relation: "Wife",
                contactNumber: "+52 55 1234 5678"
            }
        ]
    },
    {
        name: "Linnea",
        surname: "Svensson",
        gender: "female",
        birthDate: 19981014,
        identifier: `ID${timestamp}-026`,
        country: "Sweden",
        ethnicity: "Scandinavian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Kwame",
        surname: "Mensah",
        gender: "male",
        birthDate: 19870728,
        identifier: `ID${timestamp}-027`,
        country: "Ghana",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Ama Mensah",
                relation: "Mother",
                contactNumber: "+233 24 123 4567"
            }
        ]
    },
    {
        name: "Isabella",
        surname: "Fernandez",
        gender: "female",
        birthDate: 19940627,
        identifier: `ID${timestamp}-028`,
        country: "Argentina",
        ethnicity: "Latino",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Raj",
        surname: "Singh",
        gender: "male",
        birthDate: 19891111,
        identifier: `ID${timestamp}-029`,
        country: "India",
        ethnicity: "South Asian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Simran Singh",
                relation: "Wife",
                contactNumber: "+91 98765 43210"
            },
            {
                name: "Arjun Singh",
                relation: "Brother",
                contactNumber: "+91 87654 32109"
            }
        ]
    },
    {
        name: "Olivia",
        surname: "Thompson",
        gender: "female",
        birthDate: 20010305,
        identifier: `ID${timestamp}-030`,
        country: "New Zealand",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Hassan",
        surname: "Farah",
        gender: "male",
        birthDate: 19930918,
        identifier: `ID${timestamp}-031`,
        country: "Somalia",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Sakura",
        surname: "Yamamoto",
        gender: "female",
        birthDate: 19960201,
        identifier: `ID${timestamp}-032`,
        country: "Japan",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Kenji Yamamoto",
                relation: "Father",
                contactNumber: "+81 90 9876 5432"
            }
        ]
    },
    {
        name: "Diego",
        surname: "Morales",
        gender: "male",
        birthDate: 19850804,
        identifier: `ID${timestamp}-033`,
        country: "Chile",
        ethnicity: "Latino",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Anya",
        surname: "Petrov",
        gender: "female",
        birthDate: 19920512,
        identifier: `ID${timestamp}-034`,
        country: "Ukraine",
        ethnicity: "Slavic",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Viktor Petrov",
                relation: "Husband",
                contactNumber: "+380 67 123 4567"
            }
        ]
    },
    {
        name: "Kim",
        surname: "Park",
        gender: "other",
        birthDate: 19990923,
        identifier: `ID${timestamp}-035`,
        country: "South Korea",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Elias",
        surname: "Virtanen",
        gender: "male",
        birthDate: 19880719,
        identifier: `ID${timestamp}-036`,
        country: "Finland",
        ethnicity: "Scandinavian",
        documentState: { isCanceled: true, cancelledAt: null },
        companionInfo: [
            {
                name: "Aino Virtanen",
                relation: "Sister",
                contactNumber: "+358 40 123 4567"
            }
        ]
    },
    {
        name: "Leila",
        surname: "Hosseini",
        gender: "female",
        birthDate: 19941026,
        identifier: `ID${timestamp}-037`,
        country: "Iran",
        ethnicity: "Middle Eastern",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "William",
        surname: "Brown",
        gender: "male",
        birthDate: 19810613,
        identifier: `ID${timestamp}-038`,
        country: "USA",
        ethnicity: "African American",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Angela Brown",
                relation: "Wife",
                contactNumber: "+1 555 0199"
            },
            {
                name: "Marcus Brown",
                relation: "Son",
                contactNumber: "+1 555 0198"
            }
        ]
    },
    {
        name: "Thabo",
        surname: "Dlamini",
        gender: "male",
        birthDate: 19900430,
        identifier: `ID${timestamp}-039`,
        country: "South Africa",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Elena",
        surname: "Popescu",
        gender: "female",
        birthDate: 19970215,
        identifier: `ID${timestamp}-040`,
        country: "Romania",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null },
        companionInfo: [
            {
                name: "Adrian Popescu",
                relation: "Brother",
                contactNumber: "+40 722 123 456"
            }
        ]
    }
];

async function seedPatients() {
    try {
        await databaseConnection.connectToDatabase();
        logger.info({ module: "seed-patients" }, 'Starting patient seeding...');

        const collection = getPatientCollection();

        // Add timestamps to each patient (note: cancellation moved to documentState)
        const patientsWithTimestamps = mockPatients.map(patient => ({
            ...patient,
            timestamps: {
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        }));

        const result = await collection.insertMany(patientsWithTimestamps);

        logger.info({
            module: "seed-patients",
            insertedCount: result.insertedCount,
            insertedIds: Object.values(result.insertedIds).map(id => id.toString())
        }, `Successfully inserted ${result.insertedCount} mock patients`);

        console.log(`✅ Successfully inserted ${result.insertedCount} mock patients into the database`);
    } catch (error) {
        logger.error({ module: "seed-patients", error }, 'Error seeding patients');
        console.error('❌ Error seeding patients:', error);
        throw error;
    } finally {
        await databaseConnection.closeDatabaseConnection();
    }
}

seedPatients()
    .then(() => {
        console.log('✅ Seeding completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    });
