import { createFileRoute, redirect } from '@tanstack/react-router'
import DataGridDemo from '@/features/patient/components/crud'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') {
      return
    }
    
    const session = await authClient.getSession()
    console.log(session)
    if (!session.data) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: App,
})

function App() {  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage patient records</p>
        </div>
        
        <DataGridDemo />
      </div>
    </div>
  )
}
