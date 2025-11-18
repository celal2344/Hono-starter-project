import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from 'hono/pretty-json';
import { patientController } from './modules/patient/controller.js';
import { auth } from './utils/auth/auth.js';
import configureOpenAPI from './utils/configure-open-api.js';
import { env } from './utils/env.js';
import { logger } from './utils/logger.js';
import { databaseConnection } from './utils/mongodb/mongo.js';


export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  };
};

export const app = new OpenAPIHono<HonoEnv>()
  .use(prettyJSON())
  .use(
    "*",
    cors({
      origin: ["http://localhost:3000", "http://localhost:8080"], // for local development
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )

  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      await next();
      return;
    }
    c.set("user", session.user);
    c.set("session", session.session);
    await next();
  })

  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })

  .get('/auth-schema.json', async (c) => {
    try {
      const schema = await auth.api.generateOpenAPISchema();
      return c.json(schema);
    } catch (error) {
      logger.error({ module: 'openapi', error }, 'Failed to generate auth schema');
      return c.json({ error: 'Failed to generate auth schema' }, 500);
    }
  })

  //Protected Routes
  .route("/patient", patientController)

  .onError((err, c) => {
    console.error("Global Error:", err);
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    return c.json({ success: false, error: "Internal Server Error" }, 500);
  })

  .notFound((c) => {
    return c.json({ success: false, error: "Not Found" }, 404);
  });

export type AppType = typeof app;

// @ts-expect-error 
configureOpenAPI(app);

await databaseConnection.connectToDatabase();

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  () => {
    logger.info({ module: "server" }, `🚀 Server is running`);
  }
);
