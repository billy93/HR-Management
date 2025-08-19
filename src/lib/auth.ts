import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  employeeId?: string
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { employee: true }
    })

    if (!user || !user.hashedPwd) {
      return null
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPwd)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee?.id
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function createUser(email: string, password: string, role: UserRole = UserRole.EMPLOYEE): Promise<AuthUser | null> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return null
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPwd: hashedPassword,
        role
      }
    })

    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  } catch (error) {
    console.error('User creation error:', error)
    return null
  }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPwd: hashedPassword }
    })

    return true
  } catch (error) {
    console.error('Password update error:', error)
    return false
  }
}

// Role-based authorization helpers
export function requireRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

export function requireAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN
}

export function requireHR(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.HR
}

export function requireManager(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.HR || userRole === UserRole.MANAGER
}

export function canAccessEmployeeData(currentUser: AuthUser, targetEmployeeId?: string): boolean {
  // Admin and HR can access all employee data
  if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.HR) {
    return true
  }

  // Managers can access their direct reports
  if (currentUser.role === UserRole.MANAGER) {
    // This would need to be implemented with a database query to check if the target employee is a direct report
    // For now, we'll return true and implement the actual check in the API routes
    return true
  }

  // Employees can only access their own data
  return currentUser.employeeId === targetEmployeeId
}

// Session management (simplified for demo)
export function createSession(user: AuthUser): { user: AuthUser } {
  return { user }
}

export function getSession(): AuthUser | null {
  // This is a simplified version - in a real app, you'd use NextAuth.js or similar
  // For demo purposes, we'll use a simple session storage
  if (typeof window !== 'undefined') {
    const sessionData = sessionStorage.getItem('hr-session')
    if (sessionData) {
      try {
        return JSON.parse(sessionData)
      } catch {
        return null
      }
    }
  }
  return null
}

export function setSession(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hr-session', JSON.stringify(user))
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('hr-session')
  }
}