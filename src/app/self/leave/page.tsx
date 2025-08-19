"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Calendar, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  TrendingUp
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface LeaveBalance {
  leaveType: string
  totalDays: number
  usedDays: number
  remainingDays: number
}

interface LeaveRequest {
  id: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  submittedAt: string
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
}

interface LeaveType {
  id: string
  name: string
  description: string
}

export default function SelfLeavePage() {
  const [userRole] = useState("EMPLOYEE")
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaveData()
  }, [])

  const fetchLeaveData = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, fetch from API
      const mockBalances: LeaveBalance[] = [
        {
          leaveType: "Annual Leave",
          totalDays: 25,
          usedDays: 8,
          remainingDays: 17
        },
        {
          leaveType: "Sick Leave",
          totalDays: 12,
          usedDays: 3,
          remainingDays: 9
        },
        {
          leaveType: "Personal Leave",
          totalDays: 5,
          usedDays: 1,
          remainingDays: 4
        },
        {
          leaveType: "Maternity/Paternity Leave",
          totalDays: 90,
          usedDays: 0,
          remainingDays: 90
        }
      ]

      const mockRequests: LeaveRequest[] = [
        {
          id: "1",
          leaveType: "Annual Leave",
          startDate: "2024-02-15",
          endDate: "2024-02-19",
          days: 5,
          reason: "Family vacation",
          status: "APPROVED",
          submittedAt: "2024-01-20T10:30:00Z",
          approvedBy: "Jane Smith",
          approvedAt: "2024-01-21T14:20:00Z"
        },
        {
          id: "2",
          leaveType: "Sick Leave",
          startDate: "2024-01-25",
          endDate: "2024-01-26",
          days: 2,
          reason: "Medical appointment",
          status: "PENDING",
          submittedAt: "2024-01-22T09:15:00Z"
        },
        {
          id: "3",
          leaveType: "Personal Leave",
          startDate: "2024-01-10",
          endDate: "2024-01-10",
          days: 1,
          reason: "Personal matters",
          status: "REJECTED",
          submittedAt: "2024-01-05T16:45:00Z",
          rejectionReason: "Insufficient notice period"
        }
      ]

      const mockTypes: LeaveType[] = [
        { id: "1", name: "Annual Leave", description: "Yearly vacation days" },
        { id: "2", name: "Sick Leave", description: "Medical leave" },
        { id: "3", name: "Personal Leave", description: "Personal time off" },
        { id: "4", name: "Emergency Leave", description: "Urgent personal matters" }
      ]

      setLeaveBalances(mockBalances)
      setLeaveRequests(mockRequests)
      setLeaveTypes(mockTypes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave data.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    try {
      // Calculate days
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

      const selectedType = leaveTypes.find(t => t.id === formData.leaveTypeId)
      
      const newRequest: LeaveRequest = {
        id: Date.now().toString(),
        leaveType: selectedType?.name || "",
        startDate: formData.startDate,
        endDate: formData.endDate,
        days,
        reason: formData.reason,
        status: "PENDING",
        submittedAt: new Date().toISOString()
      }

      setLeaveRequests(prev => [newRequest, ...prev])
      setIsDialogOpen(false)
      setFormData({ leaveTypeId: "", startDate: "", endDate: "", reason: "" })
      
      toast({
        title: "Request Submitted",
        description: "Your leave request has been submitted for approval.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: LeaveRequest['status']) => {
    const variants = {
      PENDING: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      APPROVED: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      REJECTED: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" }
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
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading leave data...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">My Leave</h1>
            <p className="text-muted-foreground">
              Manage your leave requests and view balances
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Submit Leave Request</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your leave request
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="leaveType" className="text-right">
                      Leave Type *
                    </Label>
                    <Select value={formData.leaveTypeId} onValueChange={(value) => setFormData(prev => ({ ...prev, leaveTypeId: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">
                      Reason *
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter reason for leave"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    Submit Request
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balances */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {leaveBalances.map((balance, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{balance.leaveType}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balance.remainingDays}</div>
                <p className="text-xs text-muted-foreground">
                  {balance.usedDays} used of {balance.totalDays} total
                </p>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(balance.usedDays / balance.totalDays) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>My Leave Requests</CardTitle>
            <CardDescription>
              Track the status of your leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.leaveType}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(request.startDate)}</div>
                        {request.startDate !== request.endDate && (
                          <div className="text-muted-foreground">to {formatDate(request.endDate)}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        {request.days} day{request.days > 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(request.submittedAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {request.status === "APPROVED" && request.approvedBy && (
                          <div className="text-green-600">Approved by {request.approvedBy}</div>
                        )}
                        {request.status === "REJECTED" && request.rejectionReason && (
                          <div className="text-red-600">{request.rejectionReason}</div>
                        )}
                        {request.status === "PENDING" && (
                          <div className="text-yellow-600">Awaiting approval</div>
                        )}
                      </div>
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