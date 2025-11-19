import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/api-client'
import z from 'zod'

const companionSchema = z.object({
  name: z.string().min(2),
  relation: z.string().min(2),
  contactNumber: z.string().regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, "Invalid contact number format"),
})

const patientFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other']),
  birthdate: z.number().int().positive(),
  identifier: z
    .string()
    .min(1, 'Identifier is required')
    .refine(
      (val) => {
        const turkishIdRegex = /^\d{11}$/
        const passportRegex = /^[A-Z0-9]{6,9}$/i
        return turkishIdRegex.test(val) || passportRegex.test(val)
      },
      {
        message: 'Must be a valid Turkish ID (11 digits) or Passport number (6-9 alphanumeric characters)',
      }
    ),
  country: z.string().min(1, 'Country is required'),
  ethnicity: z.string().min(1, 'Ethnicity is required'),
  companionInfo: z.array(companionSchema).optional(),
})

export type PatientFormData = z.infer<typeof patientFormSchema>


export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: PatientFormData) => {
      const res = await client.patient.$post({
        json: {
          name: formData.firstName,
          surname: formData.lastName,
          gender: formData.gender,
          birthDate: formData.birthdate,
          identifier: formData.identifier,
          country: formData.country,
          ethnicity: formData.ethnicity,
          companionInfo: formData.companionInfo || [],
        }
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Failed to create patient')
      }
      
      return await res.json()
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['patients'] })
    },
  })
}

export const useUpdatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      patientId,
      patientData,
    }: {
      patientId: string
      patientData: Partial<PatientFormData>
    }) => {
      const payload: Record<string, any> = {}
      
      if (patientData.firstName !== undefined) payload.name = patientData.firstName
      if (patientData.lastName !== undefined) payload.surname = patientData.lastName
      if (patientData.gender !== undefined) payload.gender = patientData.gender
      if (patientData.birthdate !== undefined) payload.birthDate = patientData.birthdate
      if (patientData.identifier !== undefined) payload.identifier = patientData.identifier
      if (patientData.country !== undefined) payload.country = patientData.country
      if (patientData.ethnicity !== undefined) payload.ethnicity = patientData.ethnicity
      if (patientData.companionInfo !== undefined) payload.companionInfo = patientData.companionInfo

      const res = await client.patient[':id'].$patch({
        param: { id: patientId },
        json: payload,
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Failed to update patient')
      }
      
      return await res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({
        queryKey: ['patients', 'detail', variables.patientId],
      })
    },
  })
}

export const useCancelPatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patientId: string) => {
      const res = await client.patient[':id']['cancel'].$post({
        param: { id: patientId },
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Failed to cancel patient')
      }
      
      return await res.json()
    },
    onSuccess: (_, patientId) => {
      queryClient.refetchQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({
        queryKey: ['patients', 'detail', patientId],
      })
    },
  })
}

export const useDeletePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (_patientId: string) => {
      // TODO: Implement when backend endpoint is available
      throw new Error('Delete patient endpoint not implemented yet')
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['patients'] })
    },
  })
}
