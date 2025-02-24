
// src/components/auth/ProtectedRoute.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      toast.error('Debes iniciar sesión para acceder a esta página')
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}