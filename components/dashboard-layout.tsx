'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutGrid,
  BarChart3,
  Calendar,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react'

const navigation = [
  { name: 'Contenido', href: '/', icon: LayoutGrid },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
  { name: 'Menu Digital', href: '/menu', icon: UtensilsCrossed },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202026-02-18%20170850-ixaGUk17kLoFMHlwNXEuDQRHlZXVGX.png"
            alt="Mr Burro Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold text-[#926c15]">
            Mr Burro
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#926c15]/20 text-[#926c15]'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-[#926c15]')} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-border/50">
          <form action="/api/auth/logout" method="POST" onSubmit={(e) => {
            e.preventDefault();
            import('@/app/actions/auth').then(m => m.logout());
          }}>
            <button 
              type="submit" 
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
