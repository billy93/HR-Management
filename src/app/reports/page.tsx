'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  FileSpreadsheet, 
  Download, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  DollarSign,
  TrendingUp,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { MainLayout } from '@/components/layout/main-layout'

export default function ReportsPage() {
  const [userRole] = useState("ADMIN")
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedReportType, setSelectedReportType] = useState<string>('attendance')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data for demonstration
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: '1', name: 'Engineering' },
    { id: '2', name: 'HR' },
    { id: '3', name: 'Finance' },
    { id: '4', name: 'Marketing' }
  ]

  const attendanceData = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      totalDays: 22,
      presentDays: 20,
      lateDays: 2,
      absentDays: 0,
      attendanceRate: 90.9
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'HR',
      totalDays: 22,
      presentDays: 22,
      lateDays: 0,
      absentDays: 0,
      attendanceRate: 100
    },
    {
      id: 3,
      employeeName: 'Bob Johnson',
      department: 'Finance',
      totalDays: 22,
      presentDays: 19,
      lateDays: 1,
      absentDays: 2,
      attendanceRate: 86.4
    }
  ]

  const payrollData = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      baseSalary: 5000000,
      overtime: 500000,
      deductions: 300000,
      netSalary: 5200000
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'HR',
      baseSalary: 4500000,
      overtime: 0,
      deductions: 200000,
      netSalary: 4300000
    },
    {
      id: 3,
      employeeName: 'Bob Johnson',
      department: 'Finance',
      baseSalary: 6000000,
      overtime: 750000,
      deductions: 400000,
      netSalary: 6350000
    }
  ]

  const leaveData = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      totalLeave: 12,
      usedLeave: 5,
      remainingLeave: 7,
      pendingRequests: 1
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'HR',
      totalLeave: 12,
      usedLeave: 8,
      remainingLeave: 4,
      pendingRequests: 0
    },
    {
      id: 3,
      employeeName: 'Bob Johnson',
      department: 'Finance',
      totalLeave: 12,
      usedLeave: 3,
      remainingLeave: 9,
      pendingRequests: 2
    }
  ]

  const handleExportCSV = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/reports/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: selectedReportType,
          departmentId: selectedDepartment,
          dateFrom: dateRange.from?.toISOString(),
          dateTo: dateRange.to?.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || 'report.csv'
        : 'report.csv'

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Report Generated",
        description: "CSV file has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getReportSummary = () => {
    switch (selectedReportType) {
      case 'attendance':
        return {
          title: 'Attendance Report',
          icon: <Clock className="h-5 w-5" />,
          description: 'Employee attendance summary and statistics',
          total: attendanceData.length,
          averageRate: attendanceData.reduce((acc, curr) => acc + curr.attendanceRate, 0) / attendanceData.length
        }
      case 'payroll':
        return {
          title: 'Payroll Report',
          icon: <DollarSign className="h-5 w-5" />,
          description: 'Employee payroll and compensation summary',
          total: payrollData.reduce((acc, curr) => acc + curr.netSalary, 0),
          average: payrollData.reduce((acc, curr) => acc + curr.netSalary, 0) / payrollData.length
        }
      case 'leave':
        return {
          title: 'Leave Report',
          icon: <TrendingUp className="h-5 w-5" />,
          description: 'Employee leave balances and usage',
          total: leaveData.reduce((acc, curr) => acc + curr.usedLeave, 0),
          average: leaveData.reduce((acc, curr) => acc + curr.remainingLeave, 0) / leaveData.length
        }
      default:
        return {
          title: 'Report',
          icon: <FileSpreadsheet className="h-5 w-5" />,
          description: 'Select a report type to view',
          total: 0,
          average: 0
        }
    }
  }

  const summary = getReportSummary()

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and export various HR reports
          </p>
        </div>
        <Button 
          onClick={handleExportCSV}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export CSV
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
          <CardDescription>
            Configure your report parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="payroll">Payroll Report</SelectItem>
                  <SelectItem value="leave">Leave Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {summary.icon}
            {summary.title}
          </CardTitle>
          <CardDescription>{summary.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {summary.averageRate ? `${summary.averageRate.toFixed(1)}%` : 
                 summary.average ? `Rp ${summary.average.toLocaleString('id-ID')}` : '0'}
              </div>
              <div className="text-sm text-muted-foreground">
                {summary.averageRate ? 'Average Rate' : 'Average Amount'}
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {selectedDepartment === 'all' ? departments.length - 1 : 1}
              </div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Data */}
      <Tabs value={selectedReportType} onValueChange={setSelectedReportType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance" className="gap-2">
            <Clock className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="payroll" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="leave" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Leave
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Details</CardTitle>
              <CardDescription>
                Detailed attendance records for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{record.totalDays}</TableCell>
                      <TableCell>{record.presentDays}</TableCell>
                      <TableCell>
                        <Badge variant={record.lateDays > 0 ? "destructive" : "secondary"}>
                          {record.lateDays}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.absentDays > 0 ? "destructive" : "secondary"}>
                          {record.absentDays}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.attendanceRate >= 95 ? "default" : "secondary"}>
                          {record.attendanceRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Details</CardTitle>
              <CardDescription>
                Employee payroll and compensation breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>Rp {record.baseSalary.toLocaleString('id-ID')}</TableCell>
                      <TableCell>Rp {record.overtime.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-red-600">
                        -Rp {record.deductions.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        Rp {record.netSalary.toLocaleString('id-ID')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Details</CardTitle>
              <CardDescription>
                Employee leave balances and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Leave</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Pending Requests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{record.totalLeave} days</TableCell>
                      <TableCell>{record.usedLeave} days</TableCell>
                      <TableCell>
                        <Badge variant={record.remainingLeave > 5 ? "default" : "secondary"}>
                          {record.remainingLeave} days
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.pendingRequests > 0 ? "destructive" : "secondary"}>
                          {record.pendingRequests}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </MainLayout>
  )
}