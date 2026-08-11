import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/contratos/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/contratos/$id"!</div>
}
