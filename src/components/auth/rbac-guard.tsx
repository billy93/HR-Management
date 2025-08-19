'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UserRole } from '@prisma/client'

interface RBACGuardProps {
  children: React.ReactNode
  requiredRoles: UserRole[]
  redirectTo?: string
  fallback?: React.ReactNode
}

export function RBACGuard({ 
  children, 
  requiredRoles, 
  redirectTo = '/unauthorized',
  fallback = null 
}: RBACGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    const userRole = session.user.role as UserRole
    if (!requiredRoles.includes(userRole)) {
      router.push(redirectTo)
    }
  }, [session, status, requiredRoles, router, redirectTo])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return fallback
  }

  const userRole = session.user.role as UserRole
  if (!requiredRoles.includes(userRole)) {
    return fallback
  }

  return <>{children}</>
}

// Specific role guards for convenience
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <RBACGuard requiredRoles={[UserRole.ADMIN]}>
      {children}
    </RBACGuard>
  )
}

export function HRGuard({ children }: { children: React.ReactNode }) {
  return (
    <RBACGuard requiredRoles={[UserRole.ADMIN, UserRole.HR]}>
      {children}
    </RBACGuard>
  )
}

export function ManagerGuard({ children }: { children: React.ReactNode }) {
  return (
    <RBACGuard requiredRoles={[UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]}>
      {children}
    </RBACGuard>
  )
}

export function EmployeeGuard({ children }: { children: React.ReactNode }) {
  return (
    <RBACGuard requiredRoles={[UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE]}>
      {children}
    </RBACGuard>
  )
}