import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validatedData.error.errors 
        },
        { status: 400 }
      )
    }

    const { email, password } = validatedData.data

    // Authenticate user
    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session (in a real app, you'd use proper session management)
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId
      },
      message: 'Login successful'
    })

    // Set session cookie (simplified for demo)
    response.cookies.set('hr-session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}