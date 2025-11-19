import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import Header from '../components/Header'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

function RootComponent() {
  const router = useRouterState()
  const currentPath = router.location.pathname
  
  // Don't show header on auth pages
  const isAuthPage = currentPath === '/login' || currentPath === '/signup'
  
  return (
    <>
    <div className="isolate">
      {!isAuthPage && <Header />}
      <Outlet />
      </div>
    </>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})
