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
    queryKey: ['patients', params?.page, params?.size, params?.sortBy, params?.order, params?.filters],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30, 
  })
}
