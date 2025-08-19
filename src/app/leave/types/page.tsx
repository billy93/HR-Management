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
  Switch,
} from "@/components/ui/switch"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  Building,
  Users,
  Clock,
  TrendingUp
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: string
  name: string
}

interface LeaveType {
  id: string
  name: string
  accrual: boolean
  defaultDays: number
  company: Company
  requests: any[]
  balances: any[]
  createdAt: string
  updatedAt: string
}

export default function LeaveTypesPage() {
  const [userRole] = useState("HR") // In real app, this would come from auth context
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    accrual: true,
    defaultDays: 12,
    companyId: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaveTypes()
    fetchCompanies()
  }, [])

  const fetchLeaveTypes = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockLeaveTypes: LeaveType[] = [
        {
          id: "1",
          name: "Annual Leave",
          accrual: true,
          defaultDays: 12,
          company: { id: "1", name: "Acme Corporation" },
          requests: [],
          balances: [],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          name: "Sick Leave",
          accrual: false,
          defaultDays: 12,
          company: { id: "1", name: "Acme Corporation" },
          requests: [],
          balances: [],
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z"
        },
        {
          id: "3",
          name: "Maternity Leave",
          accrual: false,
          defaultDays: 90,
          company: { id: "1", name: "Acme Corporation" },
          requests: [],
          balances: [],
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-03T00:00:00Z"
        },
        {
          id: "4",
          name: "Annual Leave",
          accrual: true,
          defaultDays: 15,
          company: { id: "2", name: "Tech Solutions Inc" },
          requests: [],
          balances: [],
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z"
        },
        {
          id: "5",
          name: "Personal Leave",
          accrual: false,
          defaultDays: 5,
          company: { id: "2", name: "Tech Solutions Inc" },
          requests: [],
          balances: [],
          createdAt: "2024-01-16T00:00:00Z",
          updatedAt: "2024-01-16T00:00:00Z"
        }
      ]
      setLeaveTypes(mockLeaveTypes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave types",
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

  const filteredLeaveTypes = leaveTypes.filter(leaveType =>
    leaveType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leaveType.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyId) {
      toast({
        title: "Error",
        description: "Please select a company",
        variant: "destructive"
      })
      return
    }

    try {
      const selectedCompany = companies.find(c => c.id === formData.companyId)
      
      if (editingLeaveType) {
        // Update existing leave type
        setLeaveTypes(prev => prev.map(leaveType => 
          leaveType.id === editingLeaveType.id 
            ? { 
                ...leaveType, 
                name: formData.name,
                accrual: formData.accrual,
                defaultDays: formData.defaultDays,
                company: selectedCompany || leaveType.company,
                updatedAt: new Date().toISOString() 
              }
            : leaveType
        ))
        toast({
          title: "Success",
          description: "Leave type updated successfully"
        })
      } else {
        // Create new leave type
        const newLeaveType: LeaveType = {
          id: Date.now().toString(),
          name: formData.name,
          accrual: formData.accrual,
          defaultDays: formData.defaultDays,
          company: selectedCompany!,
          requests: [],
          balances: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setLeaveTypes(prev => [...prev, newLeaveType])
        toast({
          title: "Success",
          description: "Leave type created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({
        name: "",
        accrual: true,
        defaultDays: 12,
        companyId: ""
      })
      setEditingLeaveType(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save leave type",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType)
    setFormData({ 
      name: leaveType.name, 
      accrual: leaveType.accrual,
      defaultDays: leaveType.defaultDays,
      companyId: leaveType.company.id
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (leaveTypeId: string) => {
    if (confirm("Are you sure you want to delete this leave type? This action cannot be undone.")) {
      try {
        setLeaveTypes(prev => prev.filter(leaveType => leaveType.id !== leaveTypeId))
        toast({
          title: "Success",
          description: "Leave type deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete leave type",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingLeaveType(null)
    setFormData({
      name: "",
      accrual: true,
      defaultDays: 12,
      companyId: ""
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading leave types...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Leave Types</h1>
            <p className="text-muted-foreground">
              Manage your organization's leave types and policies
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Leave Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingLeaveType ? "Edit Leave Type" : "Add New Leave Type"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingLeaveType 
                      ? "Update the leave type information below."
                      : "Create a new leave type to get started."
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  
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
                    <Label htmlFor="defaultDays" className="text-right">
                      Default Days
                    </Label>
                    <Input
                      id="defaultDays"
                      type="number"
                      min="0"
                      value={formData.defaultDays}
                      onChange={(e) => setFormData({ ...formData, defaultDays: parseInt(e.target.value) || 0 })}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="accrual" className="text-right">
                      Accrual
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="accrual"
                        checked={formData.accrual}
                        onCheckedChange={(checked) => setFormData({ ...formData, accrual: checked })}
                      />
                      <Label htmlFor="accrual" className="text-sm">
                        {formData.accrual ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingLeaveType ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search leave types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Types</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveTypes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accrual Types</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveTypes.filter(lt => lt.accrual).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(leaveTypes.map(lt => lt.company.id)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Days</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveTypes.length > 0 
                  ? Math.round(leaveTypes.reduce((sum, lt) => sum + lt.defaultDays, 0) / leaveTypes.length)
                  : 0
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Types Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leave Types</CardTitle>
            <CardDescription>
              A list of all leave types in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Default Days</TableHead>
                  <TableHead>Accrual</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaveTypes.map((leaveType) => (
                  <TableRow key={leaveType.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{leaveType.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{leaveType.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{leaveType.defaultDays} days</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {leaveType.accrual ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(leaveType.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(leaveType)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(leaveType.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLeaveTypes.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No leave types found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leave Types Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Types Overview</CardTitle>
            <CardDescription>
              Summary of leave types by company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(leaveTypes.map(lt => lt.company.id))).map(companyId => {
                const company = companies.find(c => c.id === companyId)
                const companyLeaveTypes = leaveTypes.filter(lt => lt.company.id === companyId)
                
                return (
                  <div key={companyId} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3">{company?.name}</h3>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {companyLeaveTypes.map((leaveType) => (
                        <div key={leaveType.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <div className="font-medium text-sm">{leaveType.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {leaveType.defaultDays} days
                            </div>
                          </div>
                          {leaveType.accrual ? (
                            <Badge variant="outline" className="text-xs">Accrual</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Fixed</Badge>
                          )}
                        </div>
                      ))}
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