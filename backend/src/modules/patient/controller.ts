import { cancelPatientRoute, createPatientRoute, getPatientByIdRoute, listPatientsRoute, updatePatientRoute } from "@/modules/patient/routes.js";
import { createPatientService, getPatientByIdService, listPatientsService, updatePatientService } from "@/modules/patient/service.js";
import { logger } from "@/utils/logger.js";
import { OpenAPIHono } from "@hono/zod-openapi";


export const patientController = new OpenAPIHono()
  .openapi(createPatientRoute,
    async (c) => {
      try {
        const body = c.req.valid("json");
        return c.json(await createPatientService(body), 200);
      } catch (error) {
        logger.error({ module: "patientController", error: error }, 'Error creating patient');
        return c.json({
          code: 500,
          message: 'Failed to create patient'
        }, 500);
      }
    }
  )
  .openapi(listPatientsRoute,
    async (c) => {
      try {
        const query = c.req.valid("query")
        return c.json(await listPatientsService(query), 200);
      } catch (error) {
        logger.error({ module: "patientController", error: error }, 'Error listing patients');
        return c.json({
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to list patients'
        }, 500);
      }
    }
  )
  .openapi(getPatientByIdRoute,
    async (c) => {
      try {
        const { id } = c.req.param();
        const patient = await getPatientByIdService(id);

        if (!patient) {
          return c.json({
            code: 404,
            message: 'Patient not found'
          }, 404);
        }

        return c.json(patient, 200);
      } catch (error) {
        logger.error({ module: "patientController", error: error }, 'Error getting patient by id');
        return c.json({
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to get patient'
        }, 500);
      }
    }
  )
  .openapi(updatePatientRoute,
    async (c) => {
      try {
        const { id } = c.req.param();
        const body = c.req.valid("json");
        const patient = await updatePatientService(id, body);

        if (!patient) {
          return c.json({
            code: 404,
            message: 'Patient not found'
          }, 404);
        }

        return c.json(patient, 200);
      } catch (error) {
        logger.error({ module: "patientController", error: error }, 'Error updating patient');
        return c.json({
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to update patient'
        }, 500);
      }
    }
  )

  .openapi(cancelPatientRoute,
    async (c) => {
      try {
        const { id } = c.req.param();
        const patient = await updatePatientService(id, { documentState: { isCanceled: true, cancelledAt: Date.now() } });

        if (!patient) {
          return c.json({
            code: 404,
            message: 'Patient not found'
          }, 404);
        }

        return c.json(patient, 200);
      } catch (error) {
        logger.error({ module: "patientController", error: error }, 'Error cancelling patient');
        return c.json({
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to cancel patient'
        }, 500);
      }
    }
  )
