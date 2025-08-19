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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Calendar,
  Search,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Building,
  Eye,
  AlertCircle
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

interface LeaveRequest {
  id: string
  employee: Employee
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason?: string
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELED"
  approver?: Employee
  createdAt: string
  updatedAt: string
}

export default function LeaveRequestsPage() {
  const [userRole] = useState("EMPLOYEE") // In real app, this would come from auth context
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null)
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaveRequests()
    fetchEmployees()
    fetchLeaveTypes()
  }, [])

  const fetchLeaveRequests = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockLeaveRequests: LeaveRequest[] = [
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
          startDate: "2024-12-20",
          endDate: "2024-12-22",
          days: 3,
          reason: "Family vacation for Christmas",
          status: "APPROVED",
          approver: {
            id: "3",
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "HR" }
          },
          createdAt: "2024-12-01T00:00:00Z",
          updatedAt: "2024-12-02T00:00:00Z"
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
          leaveType: { id: "2", name: "Sick Leave", accrual: false },
          startDate: "2024-12-12",
          endDate: "2024-12-13",
          days: 2,
          reason: "Medical appointment and recovery",
          status: "PENDING",
          createdAt: "2024-12-10T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: "3",
          employee: {
            id: "4",
            firstName: "Sarah",
            lastName: "Wilson",
            email: "sarah.wilson@techsolutions.com",
            company: { name: "Tech Solutions Inc" },
            department: { name: "Sales" }
          },
          leaveType: { id: "4", name: "Annual Leave", accrual: true },
          startDate: "2024-12-25",
          endDate: "2025-01-05",
          days: 10,
          reason: "Year-end holiday with family",
          status: "PENDING",
          createdAt: "2024-12-05T00:00:00Z",
          updatedAt: "2024-12-05T00:00:00Z"
        },
        {
          id: "4",
          employee: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "Engineering" }
          },
          leaveType: { id: "1", name: "Annual Leave", accrual: true },
          startDate: "2024-11-15",
          endDate: "2024-11-16",
          days: 2,
          reason: "Personal matters",
          status: "APPROVED",
          approver: {
            id: "3",
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@acme.com",
            company: { name: "Acme Corporation" },
            department: { name: "HR" }
          },
          createdAt: "2024-11-10T00:00:00Z",
          updatedAt: "2024-11-11T00:00:00Z"
        }
      ]
      setLeaveRequests(mockLeaveRequests)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
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

  const fetchLeaveTypes = async () => {
    try {
      // Mock data
      const mockLeaveTypes: LeaveType[] = [
        { id: "1", name: "Annual Leave", accrual: true },
        { id: "2", name: "Sick Leave", accrual: false },
        { id: "3", name: "Maternity Leave", accrual: false },
        { id: "4", name: "Personal Leave", accrual: false }
      ]
      setLeaveTypes(mockLeaveTypes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave types",
        variant: "destructive"
      })
    }
  }

  const filteredLeaveRequests = leaveRequests.filter(request => {
    const matchesSearch = 
      `${request.employee.firstName} ${request.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.leaveTypeId || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const selectedLeaveType = leaveTypes.find(lt => lt.id === formData.leaveTypeId)
      
      // Calculate days (simplified - in real app, would exclude weekends and holidays)
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

      if (editingRequest) {
        // Update existing request
        setLeaveRequests(prev => prev.map(request => 
          request.id === editingRequest.id 
            ? { 
                ...request, 
                leaveType: selectedLeaveType || request.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                days,
                reason: formData.reason,
                updatedAt: new Date().toISOString() 
              }
            : request
        ))
        toast({
          title: "Success",
          description: "Leave request updated successfully"
        })
      } else {
        // Create new request
        const newRequest: LeaveRequest = {
          id: Date.now().toString(),
          employee: employees[0], // In real app, would be current user
          leaveType: selectedLeaveType!,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days,
          reason: formData.reason,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setLeaveRequests(prev => [...prev, newRequest])
        toast({
          title: "Success",
          description: "Leave request submitted successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: ""
      })
      setEditingRequest(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save leave request",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (request: LeaveRequest) => {
    setEditingRequest(request)
    setFormData({ 
      leaveTypeId: request.leaveType.id,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason || ""
    })
    setIsDialogOpen(true)
  }

  const handleApprove = async (requestId: string) => {
    try {
      setLeaveRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: "APPROVED" as const,
              approver: employees[2], // In real app, would be current user
              updatedAt: new Date().toISOString() 
            }
          : request
      ))
      toast({
        title: "Success",
        description: "Leave request approved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive"
      })
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      setLeaveRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: "REJECTED" as const,
              approver: employees[2], // In real app, would be current user
              updatedAt: new Date().toISOString() 
            }
          : request
      ))
      toast({
        title: "Success",
        description: "Leave request rejected",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive"
      })
    }
  }

  const handleCancel = async (requestId: string) => {
    try {
      setLeaveRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: "CANCELED" as const,
              updatedAt: new Date().toISOString() 
            }
          : request
      ))
      toast({
        title: "Success",
        description: "Leave request canceled",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel leave request",
        variant: "destructive"
      })
    }
  }

  const openNewDialog = () => {
    setEditingRequest(null)
    setFormData({
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: ""
    })
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      case "APPROVED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "CANCELED":
        return <Badge variant="outline">Canceled</Badge>
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

  const pendingCount = filteredLeaveRequests.filter(r => r.status === "PENDING").length
  const approvedCount = filteredLeaveRequests.filter(r => r.status === "APPROVED").length
  const rejectedCount = filteredLeaveRequests.filter(r => r.status === "REJECTED").length

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading leave requests...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
            <p className="text-muted-foreground">
              Manage and track employee leave requests
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingRequest ? "Edit Leave Request" : "New Leave Request"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingRequest 
                      ? "Update your leave request details."
                      : "Submit a new leave request for approval."
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="leaveType" className="text-right">
                      Leave Type
                    </Label>
                    <Select
                      value={formData.leaveTypeId}
                      onValueChange={(value) => setFormData({ ...formData, leaveTypeId: value })}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((leaveType) => (
                          <SelectItem key={leaveType.id} value={leaveType.id}>
                            {leaveType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">
                      Reason
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide a reason for your leave request..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingRequest ? "Update Request" : "Submit Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredLeaveRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              All leave requests in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{request.employee.firstName} {request.employee.lastName}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.employee.company.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{request.leaveType.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(request.startDate)}</div>
                        <div className="text-muted-foreground">to {formatDate(request.endDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{request.days} days</span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={request.reason}>
                        {request.reason || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {request.status === "PENDING" && (userRole === "HR" || userRole === "MANAGER") && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {request.status === "PENDING" && userRole === "EMPLOYEE" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(request.id)}
                          >
                            Cancel
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
            
            {filteredLeaveRequests.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No leave requests found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals Alert */}
        {pendingCount > 0 && (userRole === "HR" || userRole === "MANAGER") && (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                <span>Pending Approvals</span>
              </CardTitle>
              <CardDescription>
                You have {pendingCount} leave request{pendingCount > 1 ? 's' : ''} waiting for your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredLeaveRequests
                  .filter(request => request.status === "PENDING")
                  .slice(0, 3)
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <span className="font-medium">
                          {request.employee.firstName} {request.employee.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({request.leaveType.name})
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                {pendingCount > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{pendingCount - 3} more pending requests
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}