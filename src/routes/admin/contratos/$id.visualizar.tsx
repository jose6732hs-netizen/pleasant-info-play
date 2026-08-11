import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/contratos/$id/visualizar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/contratos/$id/visualizar"!</div>
}
