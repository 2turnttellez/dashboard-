import { DashboardLayout } from '@/components/dashboard-layout'
import { OrdersDashboard } from '@/components/orders-dashboard'

export default function PedidosPage() {
  return (
    <DashboardLayout>
      <OrdersDashboard />
    </DashboardLayout>
  )
}
