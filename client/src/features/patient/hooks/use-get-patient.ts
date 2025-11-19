import { useQuery } from '@tanstack/react-query'
import { DetailedError, parseResponse } from 'hono/client'
import { client } from '@/lib/api-client'

export const useGetPatient = (patientId: string) => {
  return useQuery({
    queryFn: async () => {
      const data = await parseResponse(client.patient[':id'].$get({
        param: { id: patientId },
      })).catch((error: DetailedError) => {
        throw new Error(`Failed to fetch patient: ${error.message}`)
      })
      return data
    },
    queryKey: ['patients', 'detail', patientId],
    enabled: !!patientId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

