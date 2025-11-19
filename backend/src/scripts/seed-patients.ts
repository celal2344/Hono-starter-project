import type { CreatePatient } from '../modules/patient/schemas/patient.js';
import { auth } from '../utils/auth/auth.js';
import { logger } from '../utils/logger.js';
import { databaseConnection, getPatientCollection } from '../utils/mongodb/mongo.js';

// Helper function to generate Turkish ID (TC Kimlik No)
function generateTurkishID(): string {
    // First 9 digits: first digit cannot be 0
    const first9 = Math.floor(Math.random() * 900000000) + 100000000;
    const first9Str = first9.toString();
    const digits = first9Str.split('').map(d => parseInt(d, 10));
    
    // Calculate 10th digit (checksum): weighted sum of first 9 digits mod 10
    // Formula: (1×d1 + 2×d2 + 3×d3 + 4×d4 + 5×d5 + 6×d6 + 7×d7 + 8×d8 + 9×d9) mod 10
    const weightedSum = digits.reduce((sum, digit, index) => sum + (digit * (index + 1)), 0);
    const digit10 = weightedSum % 10;
    
    // Calculate 11th digit (checksum): weighted sum of first 10 digits mod 10
    // Formula: (1×d1 + 2×d2 + ... + 9×d9 + 10×d10) mod 10
    const weightedSum10 = weightedSum + (digit10 * 10);
    const digit11 = weightedSum10 % 10;
    
    return first9Str + digit10.toString() + digit11.toString();
}

// Helper function to generate passport number
function generatePassportNumber(seed: number): string {
    // Generate a random alphanumeric passport number
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    const length = 8 + (seed % 3); // 8-10 characters
    let passport = '';
    for (let i = 0; i < length; i++) {
        passport += chars[Math.floor(Math.random() * chars.length)];
    }
    return passport;
}

// Generate identifiers: mix of Turkish ID and passport numbers
function generateIdentifier(index: number, useTurkishID: boolean): string {
    if (useTurkishID) {
        return generateTurkishID();
    } else {
        return generatePassportNumber(index);
    }
}

const mockPatients: CreatePatient[] = [
    {
        name: "John",
        surname: "Doe",
        gender: "male",
        birthDate: 19900101,
        identifier: generateIdentifier(1, true), // Turkish ID
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
        identifier: generateIdentifier(2, false), // Passport
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
        identifier: generateIdentifier(3, true), // Turkish ID
        country: "Egypt",
        ethnicity: "Middle Eastern",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Yuki",
        surname: "Tanaka",
        gender: "female",
        birthDate: 19880310,
        identifier: generateIdentifier(4, false), // Passport
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
        identifier: generateIdentifier(5, true), // Turkish ID
        country: "Canada",
        ethnicity: "African American",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Emma",
        surname: "Wilson",
        gender: "female",
        birthDate: 19870822,
        identifier: generateIdentifier(6, false), // Passport
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
        identifier: generateIdentifier(7, true), // Turkish ID
        country: "India",
        ethnicity: "South Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Michael",
        surname: "O'Brien",
        gender: "male",
        birthDate: 19820928,
        identifier: generateIdentifier(8, false), // Passport
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
        identifier: generateIdentifier(9, true), // Turkish ID
        country: "China",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Sofia",
        surname: "Rossi",
        gender: "female",
        birthDate: 19910418,
        identifier: generateIdentifier(10, false), // Passport
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
        identifier: generateIdentifier(11, true), // Turkish ID
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
        identifier: generateIdentifier(12, false), // Passport
        country: "Saudi Arabia",
        ethnicity: "Middle Eastern",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Lars",
        surname: "Andersen",
        gender: "male",
        birthDate: 19860912,
        identifier: generateIdentifier(13, true), // Turkish ID
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
        identifier: generateIdentifier(14, false), // Passport
        country: "Ghana",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Roberto",
        surname: "Silva",
        gender: "male",
        birthDate: 19970618,
        identifier: generateIdentifier(15, true), // Turkish ID
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
        identifier: generateIdentifier(16, false), // Passport
        country: "Singapore",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Hans",
        surname: "Mueller",
        gender: "male",
        birthDate: 19831117,
        identifier: generateIdentifier(17, true), // Turkish ID
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
        identifier: generateIdentifier(18, false), // Passport
        country: "Nigeria",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Pavel",
        surname: "Novak",
        gender: "male",
        birthDate: 19910908,
        identifier: generateIdentifier(19, true), // Turkish ID
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
        identifier: generateIdentifier(20, false), // Passport
        country: "India",
        ethnicity: "South Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Jean-Pierre",
        surname: "Dubois",
        gender: "male",
        birthDate: 19781203,
        identifier: generateIdentifier(21, true), // Turkish ID
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
        identifier: generateIdentifier(22, false), // Passport
        country: "Poland",
        ethnicity: "Slavic",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "James",
        surname: "Mitchell",
        gender: "male",
        birthDate: 19880416,
        identifier: generateIdentifier(23, true), // Turkish ID
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
        identifier: generateIdentifier(24, false), // Passport
        country: "Pakistan",
        ethnicity: "South Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Carlos",
        surname: "Rodriguez",
        gender: "male",
        birthDate: 19840322,
        identifier: generateIdentifier(25, true), // Turkish ID
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
        identifier: generateIdentifier(26, false), // Passport
        country: "Sweden",
        ethnicity: "Scandinavian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Kwame",
        surname: "Mensah",
        gender: "male",
        birthDate: 19870728,
        identifier: generateIdentifier(27, true), // Turkish ID
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
        identifier: generateIdentifier(28, false), // Passport
        country: "Argentina",
        ethnicity: "Latino",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Raj",
        surname: "Singh",
        gender: "male",
        birthDate: 19891111,
        identifier: generateIdentifier(29, true), // Turkish ID
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
        identifier: generateIdentifier(30, false), // Passport
        country: "New Zealand",
        ethnicity: "Caucasian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Hassan",
        surname: "Farah",
        gender: "male",
        birthDate: 19930918,
        identifier: generateIdentifier(31, true), // Turkish ID
        country: "Somalia",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Sakura",
        surname: "Yamamoto",
        gender: "female",
        birthDate: 19960201,
        identifier: generateIdentifier(32, false), // Passport
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
        identifier: generateIdentifier(33, true), // Turkish ID
        country: "Chile",
        ethnicity: "Latino",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Anya",
        surname: "Petrov",
        gender: "female",
        birthDate: 19920512,
        identifier: generateIdentifier(34, false), // Passport
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
        identifier: generateIdentifier(35, true), // Turkish ID
        country: "South Korea",
        ethnicity: "Asian",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Elias",
        surname: "Virtanen",
        gender: "male",
        birthDate: 19880719,
        identifier: generateIdentifier(36, false), // Passport
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
        identifier: generateIdentifier(37, true), // Turkish ID
        country: "Iran",
        ethnicity: "Middle Eastern",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "William",
        surname: "Brown",
        gender: "male",
        birthDate: 19810613,
        identifier: generateIdentifier(38, false), // Passport
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
        identifier: generateIdentifier(39, true), // Turkish ID
        country: "South Africa",
        ethnicity: "African",
        documentState: { isCanceled: false, cancelledAt: null }
    },
    {
        name: "Elena",
        surname: "Popescu",
        gender: "female",
        birthDate: 19970215,
        identifier: generateIdentifier(40, false), // Passport
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
