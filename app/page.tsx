import { Suspense } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ContentDashboard } from '@/components/content-dashboard'

export default function Home() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="flex items-center justify-center py-12">Cargando dashboard...</div>}>
        <ContentDashboard />
      </Suspense>
    </DashboardLayout>
  )
}
