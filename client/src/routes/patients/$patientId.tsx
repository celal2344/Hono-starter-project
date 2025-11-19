import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import PatientDetailsPage from '@/features/patient/components/patient-details-page'

export const Route = createFileRoute('/patients/$patientId')({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') {
      return
    }
    
    const session = await authClient.getSession()
    if (!session.data) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: PatientDetailsRoute,
})

function PatientDetailsRoute() {
  const { patientId } = Route.useParams()
  
  return <PatientDetailsPage patientId={patientId} />
}

