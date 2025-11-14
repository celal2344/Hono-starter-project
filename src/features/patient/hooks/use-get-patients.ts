import { useQuery } from '@tanstack/react-query'
import type { PatientQueryParams } from '@/lib/api-types'
import { DetailedError, parseResponse } from 'hono/client'
import { client } from '@/lib/api-client'

export const useGetPatients = (params?: Partial<PatientQueryParams>) => {
  return useQuery({
    queryFn: async () => {
        const data = await parseResponse(client.patient.$get({
          query: {
            page: params?.page,
            size: params?.size,
            sortBy: params?.sortBy,
            order: params?.order?.toUpperCase() as 'ASC' | 'DESC' | undefined,
            filters: params?.filters,
          },
        })).catch((error: DetailedError) => {
          throw new Error(`Failed to fetch patients: ${error.message}`)
        })
        return data
    },
    queryKey: ['patients',"list", params],
    staleTime: 1000 * 60 * 5,
  })
}

export const useGetPatient = (patientId: string) => {
  return useQuery({
    queryFn: async () => {
      const res = await parseResponse(client.patient[':id'].$get({
        param: { id: patientId },
      })).catch((error: DetailedError) => {
        throw new Error(`Failed to fetch patient: ${error.message}`)
      })

      return res.data
    },
    queryKey: ['patients', 'detail', patientId],
    staleTime: 1000 * 60 * 5,
  })
}
