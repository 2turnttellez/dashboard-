'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  // Hardcoded authentication check as requested
  if (username === 'EMILIANO' && password === 'MRBURRO2005') {
    // We try/catch around cookies() to handle Next v14 vs v15 API signatures smoothly
    try {
      const cookieStore: any = cookies()
      if (typeof cookieStore.then === 'function') {
        ;(await cookieStore).set('mr_burro_auth', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        })
      } else {
        cookieStore.set('mr_burro_auth', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        })
      }
    } catch (e) {
      console.error('Error setting cookie', e)
    }
    
    redirect('/')
  } else {
    return { error: 'Las credenciales son incorrectas. Intenta nuevamente.' }
  }
}

export async function logout() {
  try {
    const cookieStore: any = cookies()
    if (typeof cookieStore.then === 'function') {
      ;(await cookieStore).delete('mr_burro_auth')
    } else {
      cookieStore.delete('mr_burro_auth')
    }
  } catch (e) {
    console.error('Error deleting cookie', e)
  }
  
  redirect('/login')
}
