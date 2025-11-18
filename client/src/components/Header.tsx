import { useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Header() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged out successfully')
            navigate({ to: '/login' })
          },
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <>
      <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Healthcare Portal</h1>
        </div>
        {session?.user && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="font-medium">{session.user.name}</div>
              <div className="text-gray-300 capitalize">
                {/* @ts-expect-error - role exists on user */}
                {session.user.role || 'User'}
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-gray-700"
            >
              Logout
            </Button>
          </div>
        )}
      </header>
    </>
  )
}
