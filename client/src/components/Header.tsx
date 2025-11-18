import { useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Activity, LogOut, User } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  console.log(session?.session)
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
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-blue-600/95 supports-[backdrop-filter]:to-blue-700/95">
      <div className="flex h-16 items-center justify-between px-6 w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm">
            <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Healthcare Portal</h1>
            <p className="text-xs text-blue-100">Patient Management System</p>
          </div>
        </div>
        {session && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white">{session.user.name}</div>
                <div className="text-xs text-blue-100 capitalize">
                  {/* @ts-expect-error - role exists on user */}
                  {session.user.role || 'User'}
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
