import { createFileRoute } from '@tanstack/react-router'
import DataGridDemo from '@/features/patient/components/crud'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <DataGridDemo />
    </div>
  )
}
