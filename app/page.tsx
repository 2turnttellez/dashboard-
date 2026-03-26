import { DashboardLayout } from '@/components/dashboard-layout'
import { ContentDashboard } from '@/components/content-dashboard'

export default function Home() {
  return (
    <DashboardLayout>
      <ContentDashboard />
    </DashboardLayout>
  )
}
