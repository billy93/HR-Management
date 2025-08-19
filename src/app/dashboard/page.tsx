"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Clock, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface DashboardStats {
  totalEmployees: number
  presentToday: number
  pendingApprovals: number
  activeLeaveRequests: number
  payrollStatus: string
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  status: string
}

export default function Dashboard() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    pendingApprovals: 0,
    activeLeaveRequests: 0,
    payrollStatus: "DRAFT"
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Mock data - in real app, this would be API calls
        setStats({
          totalEmployees: 45,
          presentToday: 38,
          pendingApprovals: 5,
          activeLeaveRequests: 3,
          payrollStatus: "DRAFT"
        })

        setRecentActivities([
          {
            id: "1",
            type: "LEAVE_REQUEST",
            description: "John Doe requested Annual Leave",
            timestamp: "2 hours ago",
            status: "PENDING"
          },
          {
            id: "2",
            type: "ATTENDANCE",
            description: "Jane Smith clocked in",
            timestamp: "3 hours ago",
            status: "COMPLETED"
          },
          {
            id: "3",
            type: "PAYROLL",
            description: "Payroll run for December 2024 created",
            timestamp: "1 day ago",
            status: "DRAFT"
          },
          {
            id: "4",
            type: "EMPLOYEE",
            description: "New employee Mike Johnson onboarded",
            timestamp: "2 days ago",
            status: "COMPLETED"
          }
        ])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      case "APPROVED":
        return <Badge variant="default">Approved</Badge>
      case "COMPLETED":
        return <Badge variant="default">Completed</Badge>
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "LEAVE_REQUEST":
        return <Calendar className="h-4 w-4" />
      case "ATTENDANCE":
        return <Clock className="h-4 w-4" />
      case "PAYROLL":
        return <CreditCard className="h-4 w-4" />
      case "EMPLOYEE":
        return <Users className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ClockIcon className="h-8 w-8 mx-auto mb-4 animate-spin" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your HR system - {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.presentToday}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.presentToday / stats.totalEmployees) * 100)}% attendance rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payroll Status</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getStatusBadge(stats.payrollStatus)}
              </div>
              <p className="text-xs text-muted-foreground">
                Current month payroll
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {(userRole === "ADMIN" || userRole === "HR") && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you might want to perform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-4">
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Approve Leave
                </Button>
                <Button variant="outline" className="justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Run Payroll
                </Button>
                <Button variant="outline" className="justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activities in the HR system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Status Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>
                Employee attendance summary for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Present</span>
                  <span className="font-medium">{stats.presentToday}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Absent</span>
                  <span className="font-medium">{stats.totalEmployees - stats.presentToday}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>On Leave</span>
                  <span className="font-medium">{stats.activeLeaveRequests}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave Overview</CardTitle>
              <CardDescription>
                Current leave requests and balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pending Requests</span>
                  <span className="font-medium">{stats.pendingApprovals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Approved This Month</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rejected This Month</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}