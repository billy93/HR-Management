"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  Users,
  Clock,
  Edit,
  ArrowLeft,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: string
  name: string
}

interface Department {
  id: string
  name: string
  location: { name: string }
}

interface JobTitle {
  id: string
  name: string
}

interface JobLevel {
  id: string
  name: string
  rank: number
}

interface Employment {
  id: string
  type: string
  baseSalary: number
  payGrade?: string
  paySchedule?: string
  bankAccount?: string
}

interface AttendanceLog {
  id: string
  eventTime: string
  type: string
  notes?: string
}

interface Timesheet {
  id: string
  date: string
  workHours: number
  overtime: number
  status: string
}

interface LeaveRequest {
  id: string
  leaveType: { name: string }
  startDate: string
  endDate: string
  days: number
  reason?: string
  status: string
}

interface Payslip {
  id: string
  payrollRun: { period: string }
  grossPay: number
  deductions: number
  netPay: number
  publishedAt?: string
  paidAt?: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  startDate: string
  endDate?: string
  company: Company
  department?: Department
  jobTitle?: JobTitle
  jobLevel?: JobLevel
  manager?: {
    id: string
    firstName: string
    lastName: string
  }
  employment?: Employment
  attendance: AttendanceLog[]
  timesheets: Timesheet[]
  leaves: LeaveRequest[]
  payslips: Payslip[]
  createdAt: string
  updatedAt: string
}

export default function EmployeeDetailPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id as string
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (employeeId) {
      fetchEmployee()
    }
  }, [employeeId])

  const fetchEmployee = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockEmployee: Employee = {
        id: employeeId,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@acme.com",
        phone: "+62-812-3456-7890",
        startDate: "2024-01-15",
        company: { id: "1", name: "Acme Corporation" },
        department: { 
          id: "1", 
          name: "Engineering", 
          location: { name: "Jakarta HQ" } 
        },
        jobTitle: { id: "1", name: "Software Engineer" },
        jobLevel: { id: "3", name: "Senior", rank: 3 },
        manager: {
          id: "2",
          firstName: "Mike",
          lastName: "Johnson"
        },
        employment: {
          id: "1",
          type: "FULLTIME",
          baseSalary: 15000000,
          payGrade: "P3",
          paySchedule: "Monthly",
          bankAccount: "123-456-7890"
        },
        attendance: [
          {
            id: "1",
            eventTime: "2024-12-10T09:00:00Z",
            type: "CLOCK_IN",
            notes: "Regular check-in"
          },
          {
            id: "2",
            eventTime: "2024-12-10T17:30:00Z",
            type: "CLOCK_OUT",
            notes: "Regular check-out"
          }
        ],
        timesheets: [
          {
            id: "1",
            date: "2024-12-10",
            workHours: 8.5,
            overtime: 0.5,
            status: "POSTED"
          }
        ],
        leaves: [
          {
            id: "1",
            leaveType: { name: "Annual Leave" },
            startDate: "2024-12-20",
            endDate: "2024-12-22",
            days: 3,
            reason: "Family vacation",
            status: "APPROVED"
          }
        ],
        payslips: [
          {
            id: "1",
            payrollRun: { period: "2024-11" },
            grossPay: 15000000,
            deductions: 1500000,
            netPay: 13500000,
            publishedAt: "2024-11-30T00:00:00Z",
            paidAt: "2024-11-30T00:00:00Z"
          }
        ],
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      }
      setEmployee(mockEmployee)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch employee details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
      case "POSTED":
      case "PAID":
        return <Badge variant="default" className="bg-green-100 text-green-800">{status}</Badge>
      case "PENDING":
        return <Badge variant="secondary">{status}</Badge>
      case "REJECTED":
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading employee details...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!employee) {
    return (
      <MainLayout userRole={userRole}>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <p className="text-muted-foreground mb-4">The employee you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/people/employees")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/people/employees")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-muted-foreground">
                {employee.jobTitle?.name} at {employee.company.name}
              </p>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Employee
          </Button>
        </div>

        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.firstName} {employee.lastName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(employee.startDate)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.company.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.department?.name || "Not assigned"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Job Title</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.jobTitle?.name || "Not assigned"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Manager</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.manager 
                        ? `${employee.manager.firstName} ${employee.manager.lastName}`
                        : "No manager assigned"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Attendance Rate</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Leave Balance</span>
                      <span className="font-medium">12 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Overtime Hours</span>
                      <span className="font-medium">24.5 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Clocked in today at 09:00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Leave request approved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <span className="text-sm">November payslip paid</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4">
            {employee.employment && (
              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Employment Type</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.employment.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Base Salary</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(employee.employment.baseSalary)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pay Grade</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.employment.payGrade || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Pay Schedule</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.employment.paySchedule || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Bank Account</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.employment.bankAccount || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employee.attendance.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(log.eventTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{log.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.eventTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timesheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employee.timesheets.slice(0, 5).map((timesheet) => (
                      <div key={timesheet.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(timesheet.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {timesheet.workHours}h work, {timesheet.overtime}h overtime
                          </p>
                        </div>
                        {getStatusBadge(timesheet.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employee.leaves.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{leave.leaveType.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {leave.days} days • {leave.reason}
                        </p>
                      </div>
                      {getStatusBadge(leave.status)}
                    </div>
                  ))}
                  {employee.leaves.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No leave requests found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payslips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employee.payslips.map((payslip) => (
                    <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {new Date(payslip.payrollRun.period + "-01").toLocaleDateString("en-US", { 
                            year: "numeric", 
                            month: "long" 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Gross: {formatCurrency(payslip.grossPay)} • 
                          Deductions: {formatCurrency(payslip.deductions)} • 
                          Net: {formatCurrency(payslip.netPay)}
                        </p>
                      </div>
                      <div className="text-right">
                        {payslip.paidAt ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Paid
                          </Badge>
                        ) : payslip.publishedAt ? (
                          <Badge variant="secondary">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {employee.payslips.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No payslips found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}