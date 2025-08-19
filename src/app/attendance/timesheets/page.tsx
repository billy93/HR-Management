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
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Timer,
  User,
  Building
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

interface Timesheet {
  id: string
  employee: Employee
  date: string
  workHours: number
  overtime: number
  status: "DRAFT" | "POSTED" | "APPROVED"
  createdAt: string
  updatedAt: string
}

export default function TimesheetsPage() {
  const [userRole] = useState("HR") // In real app, this would come from auth context
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [employeeFilter, setEmployeeFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchTimesheets()
    fetchEmployees()
  }, [])

  const fetchTimesheets = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockTimesheets: Timesheet[] = [
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
          date: "2024-12-10",
          workHours: 8.5,
          overtime: 0.5,
          status: "POSTED",
          createdAt: "2024-12-10T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "2",
          employee: {
            id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "Engineering" }
          },
          date: "2024-12-10",
          workHours: 8.0,
          overtime: 0.0,
          status: "POSTED",
          createdAt: "2024-12-10T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "3",
          employee: {
            id: "3",
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "HR" }
          },
          date: "2024-12-10",
          workHours: 7.5,
          overtime: 0.0,
          status: "APPROVED",
          createdAt: "2024-12-10T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "4",
          employee: {
            id: "4",
            firstName: "Sarah",
            lastName: "Wilson",
            email: "sarah.wilson@techsolutions.com",
            company: { name: "Tech Solutions Inc" },
            department: { name: "Sales" }
          },
          date: "2024-12-09",
          workHours: 9.0,
          overtime: 1.0,
          status: "DRAFT",
          createdAt: "2024-12-09T00:00:00Z",
          updatedAt: "2024-12-09T00:00:00Z"
        },
        {
          id: "5",
          employee: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "Engineering" }
          },
          date: "2024-12-09",
          workHours: 8.0,
          overtime: 0.0,
          status: "APPROVED",
          createdAt: "2024-12-09T00:00:00Z",
          updatedAt: "2024-12-09T00:00:00Z"
        }
      ]
      setTimesheets(mockTimesheets)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch timesheets",
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

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = 
      `${timesheet.employee.firstName} ${timesheet.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.employee.company.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || timesheet.status === statusFilter
    const matchesEmployee = employeeFilter === "all" || timesheet.employee.id === employeeFilter

    let matchesDateRange = true
    if (dateFrom && timesheet.date < dateFrom) matchesDateRange = false
    if (dateTo && timesheet.date > dateTo) matchesDateRange = false

    return matchesSearch && matchesStatus && matchesEmployee && matchesDateRange
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>
      case "POSTED":
        return <Badge variant="secondary">Posted</Badge>
      case "APPROVED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const handleExportCSV = () => {
    toast({
      title: "Export Started",
      description: "Timesheet data is being exported to CSV.",
    })
    // In real app, this would trigger a CSV download
  }

  const handleApprove = async (timesheetId: string) => {
    try {
      setTimesheets(prev => prev.map(timesheet => 
        timesheet.id === timesheetId 
          ? { ...timesheet, status: "APPROVED" as const, updatedAt: new Date().toISOString() }
          : timesheet
      ))
      toast({
        title: "Success",
        description: "Timesheet approved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve timesheet",
        variant: "destructive"
      })
    }
  }

  const totalHours = filteredTimesheets.reduce((sum, timesheet) => sum + timesheet.workHours, 0)
  const totalOvertime = filteredTimesheets.reduce((sum, timesheet) => sum + timesheet.overtime, 0)

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading timesheets...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timesheets</h1>
            <p className="text-muted-foreground">
              Manage and review employee timesheets
            </p>
          </div>
          <Button onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
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
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="POSTED">Posted</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="From date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />

              <Input
                type="date"
                placeholder="To date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Timesheets</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTimesheets.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overtime</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOvertime.toFixed(1)}h</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredTimesheets.filter(t => t.status === "APPROVED").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timesheets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Timesheet Records</CardTitle>
            <CardDescription>
              Employee timesheets matching your filter criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimesheets.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{timesheet.employee.firstName} {timesheet.employee.lastName}</div>
                          <div className="text-sm text-muted-foreground">
                            {timesheet.employee.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{timesheet.employee.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {timesheet.employee.department?.name || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(timesheet.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{timesheet.workHours}h</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {timesheet.overtime > 0 ? (
                        <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                          {timesheet.overtime}h
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(timesheet.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {timesheet.status === "POSTED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(timesheet.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredTimesheets.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No timesheets found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Summary of filtered timesheet data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {filteredTimesheets.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {totalHours.toFixed(1)}h
                </div>
                <div className="text-sm text-muted-foreground">Total Work Hours</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {totalOvertime.toFixed(1)}h
                </div>
                <div className="text-sm text-muted-foreground">Total Overtime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}