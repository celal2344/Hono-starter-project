import { logger } from '../utils/logger.js';
import { env } from '../utils/env.js';

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  image: string;
  callbackURL: string;
  rememberMe: boolean;
  role: 'nurse' | 'doctor';
}

const NURSE_USER: SignUpPayload = {
  name: 'test-nurse',
  email: 'testn@test.com',
  password: '12345678',
  image: '',
  callbackURL: '',
  rememberMe: true,
  role: 'nurse',
};

const DOCTOR_USER: SignUpPayload = {
  name: 'test-doctor',
  email: 'testd@test.com',
  password: '12345678',
  image: '',
  callbackURL: '',
  rememberMe: true,
  role: 'doctor',
};

async function waitForServer(maxAttempts = 30, delayMs = 1000): Promise<boolean> {
  const baseUrl = `http://localhost:${env.PORT}`;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: 'HEAD',
      });
      logger.info({ module: 'seed-users' }, `Server is ready after ${attempt} attempts`);
      return true;
    } catch (error) {
      logger.debug(
        { module: 'seed-users', attempt, maxAttempts },
        `Waiting for server to be ready...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  
  return false;
}

async function createUser(user: SignUpPayload): Promise<boolean> {
  const baseUrl = `http://localhost:${env.PORT}`;
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      logger.info(
        { module: 'seed-users', email: user.email },
        `✅ Successfully created user: ${user.name}`
      );
      return true;
    } else if (response.status === 400 || response.status === 409) {
      // User might already exist
      const errorData = await response.text();
      logger.info(
        { module: 'seed-users', email: user.email, status: response.status },
        `ℹ️  User ${user.name} may already exist: ${errorData}`
      );
      return true; // Not a critical error
    } else {
      const errorData = await response.text();
      logger.error(
        { module: 'seed-users', email: user.email, status: response.status, error: errorData },
        `❌ Failed to create user: ${user.name}`
      );
      return false;
    }
  } catch (error) {
    logger.error(
      { module: 'seed-users', email: user.email, error },
      `❌ Error creating user: ${user.name}`
    );
    return false;
  }
}

async function seedInitialUsers() {
  logger.info({ module: 'seed-users' }, '🌱 Starting initial users seeding...');

  // Wait for server to be ready
  const serverReady = await waitForServer();
  if (!serverReady) {
    logger.error({ module: 'seed-users' }, '❌ Server did not become ready in time');
    process.exit(1);
  }

  // Create nurse user
  logger.info({ module: 'seed-users' }, '👨‍⚕️ Creating nurse user...');
  await createUser(NURSE_USER);

  // Create doctor user
  logger.info({ module: 'seed-users' }, '👨‍⚕️ Creating doctor user...');
  await createUser(DOCTOR_USER);

  logger.info({ module: 'seed-users' }, '✅ Initial users seeding completed!');
}

seedInitialUsers().catch((error) => {
  logger.error({ module: 'seed-users', error }, '❌ Fatal error during user seeding');
  process.exit(1);
});

