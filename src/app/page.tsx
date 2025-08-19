"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, Calendar, CreditCard, Building } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 bg-gradient-to-br from-background to-muted">
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <img
          src="/logo.svg"
          alt="SBHR Logo"
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Small Business HR
        </h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive HR management system for small and medium businesses
        </p>
        <Button 
          size="lg" 
          onClick={handleGetStarted}
          className="mt-6"
        >
          Get Started
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              People Management
            </CardTitle>
            <CardDescription>
              Manage employee profiles, departments, and organizational structure
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Tracking
            </CardTitle>
            <CardDescription>
              Clock in/out functionality and automated timesheet generation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Management
            </CardTitle>
            <CardDescription>
              Leave requests, approvals, and balance tracking
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payroll System
            </CardTitle>
            <CardDescription>
              Simple payroll processing with payslip generation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Master Data
            </CardTitle>
            <CardDescription>
              Configure companies, locations, work schedules, and holidays
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role-Based Access
            </CardTitle>
            <CardDescription>
              Secure access control with ADMIN, HR, MANAGER, and EMPLOYEE roles
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}