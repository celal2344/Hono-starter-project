import { createFileRoute, redirect } from '@tanstack/react-router'
import DataGridDemo from '@/features/patient/components/crud'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: App,
})

function App() {  
  return (
    <div className="text-center">
      <DataGridDemo />
    </div>
  )
}
