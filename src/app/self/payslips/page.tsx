"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  CreditCard, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Search
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Payslip {
  id: string
  payPeriod: string
  payDate: string
  grossPay: number
  deductions: number
  netPay: number
  status: "PAID" | "PENDING" | "PROCESSING"
  payrollRunId: string
}

interface PayslipDetail {
  id: string
  payPeriod: string
  payDate: string
  employee: {
    name: string
    employeeId: string
    department: string
    position: string
  }
  earnings: {
    basicSalary: number
    overtime: number
    allowances: number
    bonus: number
  }
  deductions: {
    tax: number
    socialSecurity: number
    insurance: number
    other: number
  }
  grossPay: number
  totalDeductions: number
  netPay: number
}

export default function SelfPayslipsPage() {
  const [userRole] = useState("EMPLOYEE")
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString())
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPayslips()
  }, [yearFilter])

  const fetchPayslips = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, fetch from API
      const mockPayslips: Payslip[] = [
        {
          id: "1",
          payPeriod: "January 2024",
          payDate: "2024-01-31",
          grossPay: 5000,
          deductions: 1200,
          netPay: 3800,
          status: "PAID",
          payrollRunId: "PR-2024-01"
        },
        {
          id: "2",
          payPeriod: "December 2023",
          payDate: "2023-12-31",
          grossPay: 5200,
          deductions: 1250,
          netPay: 3950,
          status: "PAID",
          payrollRunId: "PR-2023-12"
        },
        {
          id: "3",
          payPeriod: "November 2023",
          payDate: "2023-11-30",
          grossPay: 4800,
          deductions: 1150,
          netPay: 3650,
          status: "PAID",
          payrollRunId: "PR-2023-11"
        },
        {
          id: "4",
          payPeriod: "October 2023",
          payDate: "2023-10-31",
          grossPay: 5100,
          deductions: 1220,
          netPay: 3880,
          status: "PAID",
          payrollRunId: "PR-2023-10"
        }
      ]
      
      setPayslips(mockPayslips)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payslips.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPayslipDetail = async (payslipId: string) => {
    try {
      // Mock detailed payslip data
      const mockDetail: PayslipDetail = {
        id: payslipId,
        payPeriod: "January 2024",
        payDate: "2024-01-31",
        employee: {
          name: "John Doe",
          employeeId: "EMP001",
          department: "Engineering",
          position: "Software Developer"
        },
        earnings: {
          basicSalary: 4000,
          overtime: 600,
          allowances: 300,
          bonus: 100
        },
        deductions: {
          tax: 800,
          socialSecurity: 200,
          insurance: 150,
          other: 50
        },
        grossPay: 5000,
        totalDeductions: 1200,
        netPay: 3800
      }
      
      setSelectedPayslip(mockDetail)
      setIsDetailOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payslip details.",
        variant: "destructive"
      })
    }
  }

  const handleDownload = (payslipId: string) => {
    // In a real app, this would download the PDF
    toast({
      title: "Download Started",
      description: "Your payslip PDF is being downloaded.",
    })
  }

  const getStatusBadge = (status: Payslip['status']) => {
    const variants = {
      PAID: { variant: "default" as const, color: "text-green-600" },
      PENDING: { variant: "secondary" as const, color: "text-yellow-600" },
      PROCESSING: { variant: "outline" as const, color: "text-blue-600" }
    }
    
    const config = variants[status]
    
    return (
      <Badge variant={config.variant}>
        {status}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const filteredPayslips = payslips.filter(payslip => 
    payslip.payPeriod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payslip.payrollRunId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  
  // Calculate summary stats
  const totalEarnings = payslips.reduce((sum, p) => sum + p.netPay, 0)
  const averageEarnings = payslips.length > 0 ? totalEarnings / payslips.length : 0
  const lastPayslip = payslips[0]

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading payslips...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">My Payslips</h1>
            <p className="text-muted-foreground">
              View and download your salary statements
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payslips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lastPayslip ? formatCurrency(lastPayslip.netPay) : '$0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastPayslip ? lastPayslip.payPeriod : 'No payments yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(averageEarnings)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {payslips.length} payslips
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total YTD</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalEarnings)}
              </div>
              <p className="text-xs text-muted-foreground">
                Year to date earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payslips Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payslip History</CardTitle>
            <CardDescription>
              Your salary statements for {yearFilter}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Pay Date</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">
                      {payslip.payPeriod}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(payslip.payDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {formatCurrency(payslip.grossPay)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(payslip.deductions)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">
                        {formatCurrency(payslip.netPay)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payslip.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchPayslipDetail(payslip.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(payslip.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payslip Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Payslip Details</DialogTitle>
              <DialogDescription>
                {selectedPayslip?.payPeriod} - {selectedPayslip?.employee.name}
              </DialogDescription>
            </DialogHeader>
            {selectedPayslip && (
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Employee ID</p>
                    <p className="text-sm text-muted-foreground">{selectedPayslip.employee.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">{selectedPayslip.employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Position</p>
                    <p className="text-sm text-muted-foreground">{selectedPayslip.employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pay Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedPayslip.payDate)}</p>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <h4 className="font-medium mb-3">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <span>{formatCurrency(selectedPayslip.earnings.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime</span>
                      <span>{formatCurrency(selectedPayslip.earnings.overtime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowances</span>
                      <span>{formatCurrency(selectedPayslip.earnings.allowances)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus</span>
                      <span>{formatCurrency(selectedPayslip.earnings.bonus)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Gross Pay</span>
                      <span>{formatCurrency(selectedPayslip.grossPay)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-medium mb-3">Deductions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Income Tax</span>
                      <span className="text-red-600">-{formatCurrency(selectedPayslip.deductions.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Security</span>
                      <span className="text-red-600">-{formatCurrency(selectedPayslip.deductions.socialSecurity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span className="text-red-600">-{formatCurrency(selectedPayslip.deductions.insurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other</span>
                      <span className="text-red-600">-{formatCurrency(selectedPayslip.deductions.other)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Deductions</span>
                      <span className="text-red-600">-{formatCurrency(selectedPayslip.totalDeductions)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Net Pay</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedPayslip.netPay)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleDownload(selectedPayslip.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}