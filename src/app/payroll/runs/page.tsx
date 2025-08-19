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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Calendar,
  Plus,
  Search,
  Eye,
  Play,
  Lock,
  CheckCircle,
  CreditCard,
  Building,
  Users,
  Download,
  AlertTriangle
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Company {
  id: string
  name: string
}

interface PayrollRun {
  id: string
  company: Company
  period: string
  status: "DRAFT" | "LOCKED" | "PAID"
  items: PayrollItem[]
  payslips: Payslip[]
  createdAt: string
  updatedAt: string
}

interface PayrollItem {
  id: string
  employee: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  name: string
  type: "EARNING" | "DEDUCTION"
  amount: number
}

interface Payslip {
  id: string
  employee: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  grossPay: number
  deductions: number
  netPay: number
  publishedAt?: string
  paidAt?: string
}

export default function PayrollRunsPage() {
  const [userRole] = useState("HR") // In real app, this would come from auth context
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    companyId: "",
    period: ""
  })
  const [processingRun, setProcessingRun] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPayrollRuns()
    fetchCompanies()
  }, [])

  const fetchPayrollRuns = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockPayrollRuns: PayrollRun[] = [
        {
          id: "1",
          company: { id: "1", name: "Acme Corporation" },
          period: "2024-11",
          status: "PAID",
          items: [],
          payslips: [],
          createdAt: "2024-11-01T00:00:00Z",
          updatedAt: "2024-11-30T00:00:00Z"
        },
        {
          id: "2",
          company: { id: "1", name: "Acme Corporation" },
          period: "2024-12",
          status: "DRAFT",
          items: [],
          payslips: [],
          createdAt: "2024-12-01T00:00:00Z",
          updatedAt: "2024-12-01T00:00:00Z"
        },
        {
          id: "3",
          company: { id: "2", name: "Tech Solutions Inc" },
          period: "2024-11",
          status: "LOCKED",
          items: [],
          payslips: [],
          createdAt: "2024-11-01T00:00:00Z",
          updatedAt: "2024-11-25T00:00:00Z"
        }
      ]
      setPayrollRuns(mockPayrollRuns)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payroll runs",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      // Mock data
      const mockCompanies: Company[] = [
        { id: "1", name: "Acme Corporation" },
        { id: "2", name: "Tech Solutions Inc" }
      ]
      setCompanies(mockCompanies)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive"
      })
    }
  }

  const filteredPayrollRuns = payrollRuns.filter(run => {
    const matchesSearch = 
      run.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.period.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || run.status === statusFilter
    const matchesCompany = companyFilter === "all" || run.company.id === companyFilter

    return matchesSearch && matchesStatus && matchesCompany
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyId || !formData.period) {
      toast({
        title: "Error",
        description: "Please select company and period",
        variant: "destructive"
      })
      return
    }

    // Check if payroll run already exists for this company and period
    const existingRun = payrollRuns.find(run => 
      run.company.id === formData.companyId && run.period === formData.period
    )

    if (existingRun) {
      toast({
        title: "Error",
        description: "Payroll run already exists for this company and period",
        variant: "destructive"
      })
      return
    }

    try {
      const selectedCompany = companies.find(c => c.id === formData.companyId)
      
      const newRun: PayrollRun = {
        id: Date.now().toString(),
        company: selectedCompany!,
        period: formData.period,
        status: "DRAFT",
        items: [],
        payslips: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setPayrollRuns(prev => [...prev, newRun])
      toast({
        title: "Success",
        description: "Payroll run created successfully"
      })
      
      setIsDialogOpen(false)
      setFormData({ companyId: "", period: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payroll run",
        variant: "destructive"
      })
    }
  }

  const handleGenerate = async (runId: string) => {
    setProcessingRun(runId)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPayrollRuns(prev => prev.map(run => 
        run.id === runId 
          ? { 
              ...run, 
              updatedAt: new Date().toISOString() 
            }
          : run
      ))
      toast({
        title: "Success",
        description: "Payroll items generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate payroll items",
        variant: "destructive"
      })
    } finally {
      setProcessingRun(null)
    }
  }

  const handleLock = async (runId: string) => {
    try {
      setPayrollRuns(prev => prev.map(run => 
        run.id === runId 
          ? { ...run, status: "LOCKED" as const, updatedAt: new Date().toISOString() }
          : run
      ))
      toast({
        title: "Success",
        description: "Payroll run locked successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to lock payroll run",
        variant: "destructive"
      })
    }
  }

  const handlePublish = async (runId: string) => {
    try {
      setPayrollRuns(prev => prev.map(run => 
        run.id === runId 
          ? { 
              ...run, 
              payslips: run.payslips.map(payslip => ({
                ...payslip,
                publishedAt: new Date().toISOString()
              })),
              updatedAt: new Date().toISOString() 
            }
          : run
      ))
      toast({
        title: "Success",
        description: "Payslips published successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish payslips",
        variant: "destructive"
      })
    }
  }

  const handleMarkPaid = async (runId: string) => {
    try {
      setPayrollRuns(prev => prev.map(run => 
        run.id === runId 
          ? { 
              ...run, 
              status: "PAID" as const,
              payslips: run.payslips.map(payslip => ({
                ...payslip,
                paidAt: new Date().toISOString()
              })),
              updatedAt: new Date().toISOString() 
            }
          : run
      ))
      toast({
        title: "Success",
        description: "Payroll run marked as paid",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark payroll as paid",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>
      case "LOCKED":
        return <Badge variant="secondary">Locked</Badge>
      case "PAID":
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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

  const totalGrossPay = filteredPayrollRuns.reduce((sum, run) => {
    return sum + run.payslips.reduce((payslipSum, payslip) => payslipSum + payslip.grossPay, 0)
  }, 0)

  const totalNetPay = filteredPayrollRuns.reduce((sum, run) => {
    return sum + run.payslips.reduce((payslipSum, payslip) => payslipSum + payslip.netPay, 0)
  }, 0)

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading payroll runs...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Payroll Runs</h1>
            <p className="text-muted-foreground">
              Manage and process payroll runs for your organization
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Payroll Run
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Payroll Run</DialogTitle>
                  <DialogDescription>
                    Create a new payroll run for a specific company and period
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company
                    </Label>
                    <Select
                      value={formData.companyId}
                      onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="period" className="text-right">
                      Period
                    </Label>
                    <Input
                      id="period"
                      type="month"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create</Button>
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
              placeholder="Search payroll runs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="LOCKED">Locked</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPayrollRuns.length}</div>
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
              <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalNetPay)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Runs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredPayrollRuns.filter(r => r.status === "PAID").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Runs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Runs</CardTitle>
            <CardDescription>
              All payroll runs in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrollRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{run.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatPeriod(run.period)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(run.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{run.payslips.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(run.payslips.reduce((sum, p) => sum + p.grossPay, 0))}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(run.payslips.reduce((sum, p) => sum + p.netPay, 0))}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(run.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/payroll/runs/${run.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        {run.status === "DRAFT" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerate(run.id)}
                              disabled={processingRun === run.id}
                            >
                              {processingRun === run.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLock(run.id)}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {run.status === "LOCKED" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublish(run.id)}
                            >
                              Publish
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkPaid(run.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPayrollRuns.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No payroll runs found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Required Alert */}
        {filteredPayrollRuns.some(run => run.status === "DRAFT") && (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Action Required</span>
              </CardTitle>
              <CardDescription>
                You have payroll runs that need to be processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredPayrollRuns
                  .filter(run => run.status === "DRAFT")
                  .map((run) => (
                    <div key={run.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <span className="font-medium">
                          {run.company.name} - {formatPeriod(run.period)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerate(run.id)}
                          disabled={processingRun === run.id}
                        >
                          {processingRun === run.id ? "Processing..." : "Generate"}
                        </Button>
                      </div>
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