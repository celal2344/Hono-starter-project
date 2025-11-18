import { type InferResponseType, type InferRequestType } from 'hono/client'
import type { client } from './api-client'

export type PatientListResponse = InferResponseType<typeof client.patient.$get, 200>
export type PatientResponse = InferResponseType<typeof client.patient[':id']["$get"], 200>
export type CreatePatientRequest = InferRequestType<typeof client.patient.$post>['json']
export type CreatePatientResponse = InferResponseType<typeof client.patient.$post, 200>

export type Patient = PatientResponse['data']
export type PatientList = PatientListResponse['data']

export type PatientQueryParams = {
  page: number,
  size: number,
  sortBy: string,
  order: 'ASC' | 'DESC',
  filters: string
}
