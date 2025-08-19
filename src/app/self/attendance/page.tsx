"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Clock, 
  Calendar as CalendarIcon, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  LogIn,
  LogOut,
  Timer
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface AttendanceRecord {
  id: string
  date: string
  clockIn?: string
  clockOut?: string
  workHours: number
  status: "PRESENT" | "ABSENT" | "LATE" | "PARTIAL"
  notes?: string
}

interface AttendanceSummary {
  totalWorkDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  totalWorkHours: number
  averageWorkHours: number
}

export default function SelfAttendancePage() {
  const [userRole] = useState("EMPLOYEE")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<AttendanceSummary>({
    totalWorkDays: 22,
    presentDays: 20,
    absentDays: 1,
    lateDays: 3,
    totalWorkHours: 168,
    averageWorkHours: 8.4
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAttendanceData()
  }, [selectedMonth, selectedYear])

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, fetch from API
      const mockData: AttendanceRecord[] = [
        {
          id: "1",
          date: "2024-01-15",
          clockIn: "09:00",
          clockOut: "17:30",
          workHours: 8.5,
          status: "PRESENT"
        },
        {
          id: "2",
          date: "2024-01-16",
          clockIn: "09:15",
          clockOut: "17:45",
          workHours: 8.5,
          status: "LATE",
          notes: "Traffic delay"
        },
        {
          id: "3",
          date: "2024-01-17",
          clockIn: "09:00",
          clockOut: "16:00",
          workHours: 7,
          status: "PARTIAL",
          notes: "Left early for appointment"
        },
        {
          id: "4",
          date: "2024-01-18",
          workHours: 0,
          status: "ABSENT",
          notes: "Sick leave"
        },
        {
          id: "5",
          date: "2024-01-19",
          clockIn: "08:45",
          clockOut: "17:15",
          workHours: 8.5,
          status: "PRESENT"
        }
      ]
      
      setAttendanceRecords(mockData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance data.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const variants = {
      PRESENT: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      LATE: { variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-600" },
      PARTIAL: { variant: "outline" as const, icon: Timer, color: "text-blue-600" },
      ABSENT: { variant: "destructive" as const, icon: AlertCircle, color: "text-red-600" }
    }
    
    const config = variants[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading attendance data...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
            <p className="text-muted-foreground">
              View your attendance history and work hours
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.presentDays}</div>
              <p className="text-xs text-muted-foreground">
                out of {summary.totalWorkDays} work days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Days</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.lateDays}</div>
              <p className="text-xs text-muted-foreground">
                {((summary.lateDays / summary.totalWorkDays) * 100).toFixed(1)}% of work days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalWorkHours}h</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.averageWorkHours}h</div>
              <p className="text-xs text-muted-foreground">
                Per work day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              Your daily attendance for {months[selectedMonth]} {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {formatDate(record.date)}
                    </TableCell>
                    <TableCell>
                      {record.clockIn ? (
                        <div className="flex items-center gap-2">
                          <LogIn className="h-4 w-4 text-green-600" />
                          {formatTime(record.clockIn)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.clockOut ? (
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4 text-red-600" />
                          {formatTime(record.clockOut)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        {record.workHours}h
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {record.notes || '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}