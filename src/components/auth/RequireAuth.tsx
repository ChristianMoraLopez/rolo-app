
// src/components/auth/RequireAuth.tsx
import { useState, useEffect } from 'react'


interface RequireAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  fallback 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    setIsAuthenticated(!!user)
  }, [])

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div className="text-center py-4">
        <p className="text-foreground/60">
          Debes iniciar sesión para realizar esta acción
        </p>
      </div>
    )
  }

  return <>{children}</>
}