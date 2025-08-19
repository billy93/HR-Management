"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Calendar,
  Search,
  Users,
  Building,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  company: { name: string }
  department?: { name: string }
}

interface LeaveType {
  id: string
  name: string
  accrual: boolean
}

interface LeaveBalance {
  id: string
  employee: Employee
  leaveType: LeaveType
  balanceDays: number
  periodStart: string
  periodEnd: string
  createdAt: string
  updatedAt: string
}

export default function LeaveBalancesPage() {
  const [userRole] = useState("HR") // In real app, this would come from auth context
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaveBalances()
    fetchEmployees()
  }, [])

  const fetchLeaveBalances = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockLeaveBalances: LeaveBalance[] = [
        {
          id: "1",
          employee: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "Engineering" }
          },
          leaveType: { id: "1", name: "Annual Leave", accrual: true },
          balanceDays: 15.5,
          periodStart: "2024-01-01",
          periodEnd: "2024-12-31",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "2",
          employee: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "Engineering" }
          },
          leaveType: { id: "2", name: "Sick Leave", accrual: false },
          balanceDays: 12.0,
          periodStart: "2024-01-01",
          periodEnd: "2024-12-31",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "3",
          employee: {
            id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "Engineering" }
          },
          leaveType: { id: "1", name: "Annual Leave", accrual: true },
          balanceDays: 8.0,
          periodStart: "2024-01-01",
          periodEnd: "2024-12-31",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "4",
          employee: {
            id: "3",
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "HR" }
          },
          leaveType: { id: "1", name: "Annual Leave", accrual: true },
          balanceDays: 18.0,
          periodStart: "2024-01-01",
          periodEnd: "2024-12-31",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "5",
          employee: {
            id: "4",
            firstName: "Sarah",
            lastName: "Wilson",
            email: "sarah.wilson@techsolutions.com",
            company: { name: "Tech Solutions Inc" },
            department: { name: "Sales" }
          },
          leaveType: { id: "4", name: "Annual Leave", accrual: true },
          balanceDays: 22.0,
          periodStart: "2024-01-01",
          periodEnd: "2024-12-31",
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        }
      ]
      setLeaveBalances(mockLeaveBalances)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave balances",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      // Mock data
      const mockEmployees: Employee[] = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@acme.com",
          company: { name: "Acme Corporation" },
          department: { name: "Engineering" }
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@acme.com",
          company: { name: "Acme Corporation" },
          department: { name: "Engineering" }
        },
        {
          id: "3",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@acme.com",
          company: { name: "Acme Corporation" },
          department: { name: "HR" }
        },
        {
          id: "4",
          firstName: "Sarah",
          lastName: "Wilson",
          email: "sarah.wilson@techsolutions.com",
          company: { name: "Tech Solutions Inc" },
          department: { name: "Sales" }
        }
      ]
      setEmployees(mockEmployees)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive"
      })
    }
  }

  const filteredLeaveBalances = leaveBalances.filter(balance => {
    const matchesSearch = 
      `${balance.employee.firstName} ${balance.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCompany = companyFilter === "all" || balance.employee.company.name === companyFilter
    const matchesDepartment = departmentFilter === "all" || balance.employee.department?.name === departmentFilter
    const matchesLeaveType = leaveTypeFilter === "all" || balance.leaveType.name === leaveTypeFilter

    return matchesSearch && matchesCompany && matchesDepartment && matchesLeaveType
  })

  const getBalanceStatus = (balanceDays: number) => {
    if (balanceDays <= 2) {
      return { 
        badge: <Badge variant="destructive" className="bg-red-100 text-red-800">Low</Badge>,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      }
    } else if (balanceDays <= 5) {
      return { 
        badge: <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>,
        icon: <TrendingDown className="h-4 w-4 text-yellow-500" />
      }
    } else {
      return { 
        badge: <Badge variant="default" className="bg-green-100 text-green-800">Good</Badge>,
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const companies = Array.from(new Set(leaveBalances.map(b => b.employee.company.name)))
  const departments = Array.from(new Set(leaveBalances.map(b => b.employee.department?.name).filter(Boolean)))
  const leaveTypes = Array.from(new Set(leaveBalances.map(b => b.leaveType.name)))

  const totalBalances = filteredLeaveBalances.reduce((sum, balance) => sum + balance.balanceDays, 0)
  const lowBalances = filteredLeaveBalances.filter(b => b.balanceDays <= 2).length
  const goodBalances = filteredLeaveBalances.filter(b => b.balanceDays > 5).length

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading leave balances...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Leave Balances</h1>
          <p className="text-muted-foreground">
            Monitor and manage employee leave balances
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department!}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Leave Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leave Types</SelectItem>
                  {leaveTypes.map((leaveType) => (
                    <SelectItem key={leaveType} value={leaveType}>
                      {leaveType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setCompanyFilter("all")
                setDepartmentFilter("all")
                setLeaveTypeFilter("all")
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balances</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredLeaveBalances.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBalances.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Balances</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowBalances}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Good Balances</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{goodBalances}</div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Balances Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Balances</CardTitle>
            <CardDescription>
              Employee leave balances matching your filter criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Balance Days</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaveBalances.map((balance) => {
                  const status = getBalanceStatus(balance.balanceDays)
                  return (
                    <TableRow key={balance.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{balance.employee.firstName} {balance.employee.lastName}</div>
                            <div className="text-sm text-muted-foreground">
                              {balance.employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{balance.employee.company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {balance.employee.department?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{balance.leaveType.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={`font-medium ${
                            balance.balanceDays <= 2 ? 'text-red-600' : 
                            balance.balanceDays <= 5 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {balance.balanceDays.toFixed(1)} days
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(balance.periodStart)} - {formatDate(balance.periodEnd)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {status.icon}
                          {status.badge}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            
            {filteredLeaveBalances.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No leave balances found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Balance Alerts */}
        {lowBalances > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Low Balance Alerts</span>
              </CardTitle>
              <CardDescription>
                Employees with critically low leave balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredLeaveBalances
                  .filter(balance => balance.balanceDays <= 2)
                  .map((balance) => (
                    <div key={balance.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <span className="font-medium">
                          {balance.employee.firstName} {balance.employee.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({balance.leaveType.name})
                        </span>
                      </div>
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        {balance.balanceDays.toFixed(1)} days
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}