"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Clock, 
  MapPin, 
  Calendar,
  Play,
  Pause,
  LogOut,
  LogIn,
  Coffee,
  Home,
  AlertCircle,
  CheckCircle,
  Timer
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface AttendanceLog {
  id: string
  eventTime: string
  type: "CLOCK_IN" | "CLOCK_OUT"
  notes?: string
  source?: string
}

interface TodayStatus {
  clockedIn: boolean
  clockInTime?: string
  clockOutTime?: string
  workHours: number
  expectedHours: number
}

export default function AttendanceClockPage() {
  const [userRole] = useState("EMPLOYEE") // In real app, this would come from auth context
  const [todayStatus, setTodayStatus] = useState<TodayStatus>({
    clockedIn: false,
    workHours: 0,
    expectedHours: 8
  })
  const [recentLogs, setRecentLogs] = useState<AttendanceLog[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clockType, setClockType] = useState<"CLOCK_IN" | "CLOCK_OUT">("CLOCK_IN")
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchTodayStatus()
    fetchRecentLogs()
  }, [])

  const fetchTodayStatus = async () => {
    try {
      // Mock data - in real app, this would be API call
      const mockStatus: TodayStatus = {
        clockedIn: true,
        clockInTime: "2024-12-10T09:00:00Z",
        workHours: 4.5,
        expectedHours: 8
      }
      setTodayStatus(mockStatus)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch today's status",
        variant: "destructive"
      })
    }
  }

  const fetchRecentLogs = async () => {
    try {
      // Mock data - in real app, this would be API call
      const mockLogs: AttendanceLog[] = [
        {
          id: "1",
          eventTime: "2024-12-10T09:00:00Z",
          type: "CLOCK_IN",
          notes: "Regular check-in",
          source: "Web"
        },
        {
          id: "2",
          eventTime: "2024-12-09T17:30:00Z",
          type: "CLOCK_OUT",
          notes: "Regular check-out",
          source: "Web"
        },
        {
          id: "3",
          eventTime: "2024-12-09T09:15:00Z",
          type: "CLOCK_IN",
          notes: "Slight delay due to traffic",
          source: "Web"
        }
      ]
      setRecentLogs(mockLogs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recent logs",
        variant: "destructive"
      })
    }
  }

  const handleClockAction = async () => {
    if (todayStatus.clockedIn && clockType === "CLOCK_IN") {
      toast({
        title: "Error",
        description: "You are already clocked in. Please clock out first.",
        variant: "destructive"
      })
      return
    }

    if (!todayStatus.clockedIn && clockType === "CLOCK_OUT") {
      toast({
        title: "Error",
        description: "You are not clocked in. Please clock in first.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Mock API call
      const newLog: AttendanceLog = {
        id: Date.now().toString(),
        eventTime: new Date().toISOString(),
        type: clockType,
        notes: notes || undefined,
        source: "Web"
      }

      setRecentLogs(prev => [newLog, ...prev])
      
      if (clockType === "CLOCK_IN") {
        setTodayStatus(prev => ({
          ...prev,
          clockedIn: true,
          clockInTime: newLog.eventTime
        }))
        toast({
          title: "Clocked In",
          description: "You have successfully clocked in.",
        })
      } else {
        setTodayStatus(prev => ({
          ...prev,
          clockedIn: false,
          clockOutTime: newLog.eventTime
        }))
        toast({
          title: "Clocked Out",
          description: "You have successfully clocked out.",
        })
      }

      setIsDialogOpen(false)
      setNotes("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process clock action",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const openClockDialog = (type: "CLOCK_IN" | "CLOCK_OUT") => {
    setClockType(type)
    setNotes("")
    setIsDialogOpen(true)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    })
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Clock</h1>
          <p className="text-muted-foreground">
            Clock in and out to track your working hours
          </p>
        </div>

        {/* Current Time Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="h-5 w-5" />
              <span>Current Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">{currentTime}</div>
              <p className="text-muted-foreground mt-2">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Clock Status */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Status */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Status</CardTitle>
              <CardDescription>
                Your current attendance status for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {todayStatus.clockedIn ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Clocked In
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Home className="w-3 h-3 mr-1" />
                      Clocked Out
                    </Badge>
                  )}
                </div>

                {todayStatus.clockInTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Clock In</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(todayStatus.clockInTime)}
                    </span>
                  </div>
                )}

                {todayStatus.clockOutTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Clock Out</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(todayStatus.clockOutTime)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Work Hours</span>
                  <span className="text-sm text-muted-foreground">
                    {todayStatus.workHours.toFixed(1)}h / {todayStatus.expectedHours}h
                  </span>
                </div>

                <div className="pt-4">
                  {todayStatus.clockedIn ? (
                    <Button 
                      onClick={() => openClockDialog("CLOCK_OUT")}
                      className="w-full"
                      size="lg"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Clock Out
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => openClockDialog("CLOCK_IN")}
                      className="w-full"
                      size="lg"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Clock In
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common attendance-related actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Coffee className="mr-2 h-4 w-4" />
                  Start Break
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Timer className="mr-2 h-4 w-4" />
                  End Break
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Work from Home
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent clock in/out history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      log.type === "CLOCK_IN" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {log.type === "CLOCK_IN" ? (
                        <LogIn className="h-4 w-4" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {log.type === "CLOCK_IN" ? "Clocked In" : "Clocked Out"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(log.eventTime)} at {formatTime(log.eventTime)}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {log.source}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clock Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {clockType === "CLOCK_IN" ? "Clock In" : "Clock Out"}
              </DialogTitle>
              <DialogDescription>
                {clockType === "CLOCK_IN" 
                  ? "Record your clock in time for today."
                  : "Record your clock out time for today."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about your clock in/out..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleClockAction} 
                disabled={loading}
                className={clockType === "CLOCK_IN" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto" />
                ) : clockType === "CLOCK_IN" ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Clock In
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Clock Out
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}