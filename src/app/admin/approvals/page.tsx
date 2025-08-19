'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  DollarSign,
  FileText,
  User,
  Mail,
  Phone,
  Building,
  Eye,
  MessageSquare
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState('leave')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [comment, setComment] = useState('')

  // Mock data for demonstration
  const leaveRequests = [
    {
      id: 1,
      employeeName: 'John Doe',
      employeeEmail: 'john.doe@company.com',
      department: 'Engineering',
      leaveType: 'Annual Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-24',
      totalDays: 5,
      reason: 'Family vacation',
      status: 'PENDING',
      submittedAt: '2024-01-15T10:30:00Z',
      attachments: ['vacation_plan.pdf']
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeEmail: 'jane.smith@company.com',
      department: 'HR',
      leaveType: 'Sick Leave',
      startDate: '2024-01-18',
      endDate: '2024-01-19',
      totalDays: 2,
      reason: 'Medical checkup',
      status: 'PENDING',
      submittedAt: '2024-01-16T14:20:00Z',
      attachments: ['medical_certificate.pdf']
    },
    {
      id: 3,
      employeeName: 'Bob Johnson',
      employeeEmail: 'bob.johnson@company.com',
      department: 'Finance',
      leaveType: 'Personal Leave',
      startDate: '2024-01-22',
      endDate: '2024-01-22',
      totalDays: 1,
      reason: 'Personal matters',
      status: 'PENDING',
      submittedAt: '2024-01-17T09:15:00Z',
      attachments: []
    }
  ]

  const overtimeRequests = [
    {
      id: 1,
      employeeName: 'Alice Brown',
      employeeEmail: 'alice.brown@company.com',
      department: 'Marketing',
      date: '2024-01-18',
      startTime: '18:00',
      endTime: '22:00',
      totalHours: 4,
      reason: 'Project deadline',
      status: 'PENDING',
      submittedAt: '2024-01-17T16:30:00Z'
    },
    {
      id: 2,
      employeeName: 'Charlie Wilson',
      employeeEmail: 'charlie.wilson@company.com',
      department: 'Engineering',
      date: '2024-01-19',
      startTime: '19:00',
      endTime: '23:00',
      totalHours: 4,
      reason: 'System maintenance',
      status: 'PENDING',
      submittedAt: '2024-01-18T11:20:00Z'
    }
  ]

  const expenseRequests = [
    {
      id: 1,
      employeeName: 'David Lee',
      employeeEmail: 'david.lee@company.com',
      department: 'Sales',
      amount: 2500000,
      description: 'Client meeting expenses',
      date: '2024-01-17',
      category: 'Travel',
      status: 'PENDING',
      submittedAt: '2024-01-17T15:45:00Z',
      receipts: ['receipt_1.pdf', 'receipt_2.pdf']
    },
    {
      id: 2,
      employeeName: 'Eva Martinez',
      employeeEmail: 'eva.martinez@company.com',
      department: 'HR',
      amount: 1500000,
      description: 'Training materials',
      date: '2024-01-18',
      category: 'Training',
      status: 'PENDING',
      submittedAt: '2024-01-18T10:15:00Z',
      receipts: ['invoice.pdf']
    }
  ]

  const handleApproval = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: `Request ${actionType === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The request has been ${actionType === 'approve' ? 'approved' : 'rejected'} successfully.`,
      })
      
      setIsDialogOpen(false)
      setSelectedRequest(null)
      setComment('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openApprovalDialog = (request: any, action: 'approve' | 'reject') => {
    setSelectedRequest(request)
    setActionType(action)
    setIsDialogOpen(true)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'APPROVED': return 'bg-green-500'
      case 'REJECTED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPendingCount = (requests: any[]) => {
    return requests.filter(r => r.status === 'PENDING').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve pending requests
          </p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Clock className="h-4 w-4" />
          {getPendingCount(leaveRequests) + getPendingCount(overtimeRequests) + getPendingCount(expenseRequests)} Pending
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingCount(leaveRequests)}</div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingCount(overtimeRequests)}</div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expense Requests</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingCount(expenseRequests)}</div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different request types */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leave" className="gap-2">
            <Calendar className="h-4 w-4" />
            Leave Requests
            {getPendingCount(leaveRequests) > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                {getPendingCount(leaveRequests)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overtime" className="gap-2">
            <Clock className="h-4 w-4" />
            Overtime Requests
            {getPendingCount(overtimeRequests) > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                {getPendingCount(overtimeRequests)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="expense" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Expense Requests
            {getPendingCount(expenseRequests) > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                {getPendingCount(expenseRequests)}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>
                Review and approve employee leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{request.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{request.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.leaveType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{request.startDate} to {request.endDate}</p>
                          <p className="text-muted-foreground">{request.totalDays} days</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">{request.reason}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openApprovalDialog(request, 'approve')}
                            disabled={request.status !== 'PENDING'}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openApprovalDialog(request, 'reject')}
                            disabled={request.status !== 'PENDING'}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overtime Requests</CardTitle>
              <CardDescription>
                Review and approve overtime work requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overtimeRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{request.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{request.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{request.startTime} - {request.endTime}</p>
                          <p className="text-muted-foreground">{request.totalHours} hours</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">{request.reason}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openApprovalDialog(request, 'approve')}
                            disabled={request.status !== 'PENDING'}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openApprovalDialog(request, 'reject')}
                            disabled={request.status !== 'PENDING'}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Requests</CardTitle>
              <CardDescription>
                Review and approve expense reimbursement requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{request.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{request.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">Rp {request.amount.toLocaleString('id-ID')}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">{request.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openApprovalDialog(request, 'approve')}
                            disabled={request.status !== 'PENDING'}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openApprovalDialog(request, 'reject')}
                            disabled={request.status !== 'PENDING'}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Are you sure you want to approve this request?' 
                : 'Are you sure you want to reject this request?'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Employee:</span>
                    <span>{selectedRequest.employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span>{selectedRequest.department}</span>
                  </div>
                  {selectedRequest.leaveType && (
                    <div className="flex justify-between">
                      <span>Leave Type:</span>
                      <span>{selectedRequest.leaveType}</span>
                    </div>
                  )}
                  {selectedRequest.amount && (
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>Rp {selectedRequest.amount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Reason:</span>
                    <span>{selectedRequest.reason || selectedRequest.description}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Add a comment for your decision..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApproval}
                  variant={actionType === 'approve' ? 'default' : 'destructive'}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}