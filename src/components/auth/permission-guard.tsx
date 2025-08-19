'use client'

import { useSession } from 'next-auth/react'
import { UserRole } from '@prisma/client'

interface PermissionGuardProps {
  children: React.ReactNode
  permission: string
  fallback?: React.ReactNode
}

// Permission mapping based on roles
const rolePermissions: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    'users.read',
    'users.write',
    'users.delete',
    'roles.read',
    'roles.write',
    'attendance.read',
    'attendance.write',
    'leave.read',
    'leave.write',
    'leave.approve',
    'payroll.read',
    'payroll.write',
    'reports.read',
    'reports.export',
    'admin.read',
    'admin.write'
  ],
  [UserRole.HR]: [
    'users.read',
    'users.write',
    'attendance.read',
    'attendance.write',
    'leave.read',
    'leave.write',
    'leave.approve',
    'payroll.read',
    'reports.read',
    'reports.export'
  ],
  [UserRole.MANAGER]: [
    'users.read',
    'attendance.read',
    'attendance.write',
    'leave.read',
    'leave.write',
    'leave.approve',
    'payroll.read',
    'reports.read'
  ],
  [UserRole.EMPLOYEE]: [
    'attendance.read',
    'attendance.write',
    'leave.read',
    'leave.write',
    'payroll.read'
  ]
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { data: session, status } = useSession()

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
  const userPermissions = rolePermissions[userRole] || []

  if (!userPermissions.includes(permission)) {
    return fallback
  }

  return <>{children}</>
}

// Hook to check if user has permission
export function usePermission(permission: string): boolean {
  const { data: session } = useSession()

  if (!session) {
    return false
  }

  const userRole = session.user.role as UserRole
  const userPermissions = rolePermissions[userRole] || []

  return userPermissions.includes(permission)
}

// Hook to get all user permissions
export function usePermissions(): string[] {
  const { data: session } = useSession()

  if (!session) {
    return []
  }

  const userRole = session.user.role as UserRole
  return rolePermissions[userRole] || []
}

// Hook to check if user has any of the specified permissions
export function useHasAnyPermission(permissions: string[]): boolean {
  const userPermissions = usePermissions()
  return permissions.some(permission => userPermissions.includes(permission))
}

// Hook to check if user has all of the specified permissions
export function useHasAllPermissions(permissions: string[]): boolean {
  const userPermissions = usePermissions()
  return permissions.every(permission => userPermissions.includes(permission))
}