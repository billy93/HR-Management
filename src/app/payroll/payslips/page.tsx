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
  Download,
  Eye,
  CreditCard,
  Building,
  Users,
  FileText,
  CheckCircle,
  Clock
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

interface Payslip {
  id: string
  employee: Employee
  payrollRun: {
    id: string
    period: string
    company: { name: string }
  }
  grossPay: number
  deductions: number
  netPay: number
  publishedAt?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export default function PayslipsPage() {
  const [userRole] = useState("EMPLOYEE") // In real app, this would come from auth context
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [periodFilter, setPeriodFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchPayslips()
  }, [])

  const fetchPayslips = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockPayslips: Payslip[] = [
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
          payrollRun: {
            id: "1",
            period: "2024-11",
            company: { name: "Acme Corporation" }
          },
          grossPay: 15000000,
          deductions: 1500000,
          netPay: 13500000,
          publishedAt: "2024-11-30T00:00:00Z",
          paidAt: "2024-11-30T00:00:00Z",
          createdAt: "2024-11-30T00:00:00Z",
          updatedAt: "2024-11-30T00:00:00Z"
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
          payrollRun: {
            id: "1",
            period: "2024-11",
            company: { name: "Acme Corporation" }
          },
          grossPay: 12000000,
          deductions: 1200000,
          netPay: 10800000,
          publishedAt: "2024-11-30T00:00:00Z",
          paidAt: "2024-11-30T00:00:00Z",
          createdAt: "2024-11-30T00:00:00Z",
          updatedAt: "2024-11-30T00:00:00Z"
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
          payrollRun: {
            id: "1",
            period: "2024-11",
            company: { name: "Acme Corporation" }
          },
          grossPay: 18000000,
          deductions: 1800000,
          netPay: 16200000,
          publishedAt: "2024-11-30T00:00:00Z",
          paidAt: "2024-11-30T00:00:00Z",
          createdAt: "2024-11-30T00:00:00Z",
          updatedAt: "2024-11-30T00:00:00Z"
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
          payrollRun: {
            id: "3",
            period: "2024-11",
            company: { name: "Tech Solutions Inc" }
          },
          grossPay: 10000000,
          deductions: 1000000,
          netPay: 9000000,
          publishedAt: "2024-11-25T00:00:00Z",
          paidAt: null,
          createdAt: "2024-11-25T00:00:00Z",
          updatedAt: "2024-11-25T00:00:00Z"
        }
      ]
      setPayslips(mockPayslips)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payslips",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = 
      `${payslip.employee.firstName} ${payslip.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.payrollRun.company.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPeriod = periodFilter === "all" || payslip.payrollRun.period === periodFilter
    const matchesCompany = companyFilter === "all" || payslip.payrollRun.company.name === companyFilter
    
    let matchesStatus = true
    if (statusFilter === "published") {
      matchesStatus = !!payslip.publishedAt
    } else if (statusFilter === "paid") {
      matchesStatus = !!payslip.paidAt
    } else if (statusFilter === "draft") {
      matchesStatus = !payslip.publishedAt
    }

    return matchesSearch && matchesPeriod && matchesCompany && matchesStatus
  })

  const getStatusBadge = (payslip: Payslip) => {
    if (payslip.paidAt) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
    } else if (payslip.publishedAt) {
      return <Badge variant="secondary">Published</Badge>
    } else {
      return <Badge variant="outline">Draft</Badge>
    }
  }

  const formatPeriod = (period: string) => {
    const [year, month] = period.split("-")
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const handleDownload = (payslipId: string) => {
    toast({
      title: "Download Started",
      description: "Payslip is being downloaded.",
    })
    // In real app, this would trigger a PDF download
  }

  const periods = Array.from(new Set(payslips.map(p => p.payrollRun.period))).sort()
  const companies = Array.from(new Set(payslips.map(p => p.payrollRun.company.name)))

  const totalGrossPay = filteredPayslips.reduce((sum, payslip) => sum + payslip.grossPay, 0)
  const totalNetPay = filteredPayslips.reduce((sum, payslip) => sum + payslip.netPay, 0)
  const totalDeductions = filteredPayslips.reduce((sum, payslip) => sum + payslip.deductions, 0)

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
            <h1 className="text-3xl font-bold tracking-tight">Payslips</h1>
            <p className="text-muted-foreground">
              View and download employee payslips
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search payslips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {formatPeriod(period)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-48">
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payslips</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPayslips.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gross Pay</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalGrossPay)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalDeductions)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalNetPay)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payslips Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payslips</CardTitle>
            <CardDescription>
              Employee payslips matching your filter criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{payslip.employee.firstName} {payslip.employee.lastName}</div>
                          <div className="text-sm text-muted-foreground">
                            {payslip.employee.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{payslip.payrollRun.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatPeriod(payslip.payrollRun.period)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(payslip.grossPay)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(payslip.deductions)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(payslip.netPay)}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payslip)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payslip.paidAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
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
            
            {filteredPayslips.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No payslips found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary by Period */}
        <Card>
          <CardHeader>
            <CardTitle>Summary by Period</CardTitle>
            <CardDescription>
              Payroll summary grouped by period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(filteredPayslips.map(p => p.payrollRun.period))).map(period => {
                const periodPayslips = filteredPayslips.filter(p => p.payrollRun.period === period)
                const grossTotal = periodPayslips.reduce((sum, p) => sum + p.grossPay, 0)
                const netTotal = periodPayslips.reduce((sum, p) => sum + p.netPay, 0)
                const employeeCount = new Set(periodPayslips.map(p => p.employee.id)).size

                return (
                  <div key={period} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{formatPeriod(period)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {employeeCount} employee{employeeCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Gross: </span>
                        <span className="font-medium">{formatCurrency(grossTotal)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Net: </span>
                        <span className="font-medium">{formatCurrency(netTotal)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}