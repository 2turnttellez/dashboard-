'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { UtensilsCrossed } from 'lucide-react'

// Note: React 19 / Next.js uses useActionState, fallback to basic UI handling if necessary
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#926c15]/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#926c15]/5 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl relative z-10 overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#926c15] to-transparent opacity-50" />
        
        <CardHeader className="space-y-4 pt-8 pb-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/50 border border-border shadow-inner">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202026-02-18%20170850-ixaGUk17kLoFMHlwNXEuDQRHlZXVGX.png"
              alt="Mr Burro Logo"
              width={56}
              height={56}
              className="rounded-xl drop-shadow-md"
              priority
            />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Bienvenido a Mr. Burro
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Inicia sesión en tu panel de administración.
            </CardDescription>
          </div>
        </CardHeader>
        
        <form action={formAction}>
          <CardContent className="space-y-5 px-8 pb-8">
            <div className="space-y-2">
               <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre de Usuario</Label>
               <Input 
                 id="username" 
                 name="username" 
                 placeholder="Ingresa tu usuario" 
                 required 
                 autoComplete="username"
                 className="h-11 bg-secondary/30 border-border focus-visible:ring-[#926c15] transition-colors"
               />
            </div>
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contraseña</Label>
               </div>
               <Input 
                 id="password" 
                 name="password" 
                 type="password" 
                 required 
                 autoComplete="current-password"
                 className="h-11 bg-secondary/30 border-border focus-visible:ring-[#926c15] transition-colors"
               />
            </div>
            
            {state?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-sm text-red-500 font-medium text-center">{state.error}</p>
              </div>
            )}
            
            <Button 
               type="submit" 
               className="w-full h-11 bg-[#926c15] hover:bg-[#926c15]/90 text-white font-semibold text-sm shadow-md transition-transform active:scale-[0.98]"
               disabled={isPending}
            >
              {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </CardContent>
        </form>
      </Card>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center items-center gap-2 opacity-60">
        <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Mr. Burro Dashboard</span>
      </div>
    </div>
  )
}
