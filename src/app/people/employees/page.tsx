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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  MoreHorizontal
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Company {
  id: string
  name: string
}

interface Department {
  id: string
  name: string
  location: { name: string; company: { name: string } }
}

interface JobTitle {
  id: string
  name: string
}

interface JobLevel {
  id: string
  name: string
  rank: number
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  startDate: string
  endDate?: string
  company: Company
  department?: Department
  jobTitle?: JobTitle
  jobLevel?: JobLevel
  manager?: Employee
  createdAt: string
  updatedAt: string
}

export default function EmployeesPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [employees, setEmployees] = useState<Employee[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([])
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    companyId: "",
    departmentId: "",
    jobTitleId: "",
    jobLevelId: "",
    managerId: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchEmployees()
    fetchCompanies()
    fetchDepartments()
    fetchJobTitles()
    fetchJobLevels()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockEmployees: Employee[] = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@acme.com",
          phone: "+62-812-3456-7890",
          startDate: "2024-01-15",
          company: { id: "1", name: "Acme Corporation" },
          department: { 
            id: "1", 
            name: "Engineering", 
            location: { name: "Jakarta HQ", company: { name: "Acme Corporation" } } 
          },
          jobTitle: { id: "1", name: "Software Engineer" },
          jobLevel: { id: "3", name: "Senior", rank: 3 },
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z"
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@acme.com",
          phone: "+62-813-4567-8901",
          startDate: "2024-02-01",
          company: { id: "1", name: "Acme Corporation" },
          department: { 
            id: "1", 
            name: "Engineering", 
            location: { name: "Jakarta HQ", company: { name: "Acme Corporation" } } 
          },
          jobTitle: { id: "1", name: "Software Engineer" },
          jobLevel: { id: "2", name: "Mid", rank: 2 },
          manager: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@acme.com",
            startDate: "2024-01-15",
            company: { id: "1", name: "Acme Corporation" },
            createdAt: "2024-01-15T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z"
          },
          createdAt: "2024-02-01T00:00:00Z",
          updatedAt: "2024-02-01T00:00:00Z"
        },
        {
          id: "3",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@acme.com",
          phone: "+62-814-5678-9012",
          startDate: "2024-01-10",
          company: { id: "1", name: "Acme Corporation" },
          department: { 
            id: "2", 
            name: "HR", 
            location: { name: "Jakarta HQ", company: { name: "Acme Corporation" } } 
          },
          jobTitle: { id: "2", name: "HR Manager" },
          jobLevel: { id: "4", name: "Manager", rank: 4 },
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z"
        },
        {
          id: "4",
          firstName: "Sarah",
          lastName: "Wilson",
          email: "sarah.wilson@techsolutions.com",
          startDate: "2024-03-01",
          company: { id: "2", name: "Tech Solutions Inc" },
          department: { 
            id: "3", 
            name: "Sales", 
            location: { name: "Bandung Office", company: { name: "Tech Solutions Inc" } } 
          },
          jobTitle: { id: "3", name: "Sales Representative" },
          jobLevel: { id: "1", name: "Junior", rank: 1 },
          createdAt: "2024-03-01T00:00:00Z",
          updatedAt: "2024-03-01T00:00:00Z"
        }
      ]
      setEmployees(mockEmployees)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
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

  const fetchDepartments = async () => {
    try {
      const mockDepartments: Department[] = [
        { 
          id: "1", 
          name: "Engineering", 
          location: { name: "Jakarta HQ", company: { name: "Acme Corporation" } } 
        },
        { 
          id: "2", 
          name: "HR", 
          location: { name: "Jakarta HQ", company: { name: "Acme Corporation" } } 
        },
        { 
          id: "3", 
          name: "Sales", 
          location: { name: "Bandung Office", company: { name: "Tech Solutions Inc" } } 
        }
      ]
      setDepartments(mockDepartments)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive"
      })
    }
  }

  const fetchJobTitles = async () => {
    try {
      const mockJobTitles: JobTitle[] = [
        { id: "1", name: "Software Engineer" },
        { id: "2", name: "HR Manager" },
        { id: "3", name: "Sales Representative" },
        { id: "4", name: "Product Manager" }
      ]
      setJobTitles(mockJobTitles)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job titles",
        variant: "destructive"
      })
    }
  }

  const fetchJobLevels = async () => {
    try {
      const mockJobLevels: JobLevel[] = [
        { id: "1", name: "Junior", rank: 1 },
        { id: "2", name: "Mid", rank: 2 },
        { id: "3", name: "Senior", rank: 3 },
        { id: "4", name: "Manager", rank: 4 }
      ]
      setJobLevels(mockJobLevels)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job levels",
        variant: "destructive"
      })
    }
  }

  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      const selectedDepartment = departments.find(d => d.id === formData.departmentId)
      const selectedJobTitle = jobTitles.find(jt => jt.id === formData.jobTitleId)
      const selectedJobLevel = jobLevels.find(jl => jl.id === formData.jobLevelId)
      const selectedManager = employees.find(emp => emp.id === formData.managerId)
      
      if (editingEmployee) {
        // Update existing employee
        setEmployees(prev => prev.map(employee => 
          employee.id === editingEmployee.id 
            ? { 
                ...employee, 
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone || undefined,
                startDate: formData.startDate,
                company: selectedCompany || employee.company,
                department: selectedDepartment,
                jobTitle: selectedJobTitle,
                jobLevel: selectedJobLevel,
                manager: selectedManager,
                updatedAt: new Date().toISOString() 
              }
            : employee
        ))
        toast({
          title: "Success",
          description: "Employee updated successfully"
        })
      } else {
        // Create new employee
        const newEmployee: Employee = {
          id: Date.now().toString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          startDate: formData.startDate,
          company: selectedCompany!,
          department: selectedDepartment,
          jobTitle: selectedJobTitle,
          jobLevel: selectedJobLevel,
          manager: selectedManager,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setEmployees(prev => [...prev, newEmployee])
        toast({
          title: "Success",
          description: "Employee created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        startDate: "",
        companyId: "",
        departmentId: "",
        jobTitleId: "",
        jobLevelId: "",
        managerId: ""
      })
      setEditingEmployee(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({ 
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || "",
      startDate: employee.startDate,
      companyId: employee.company.id,
      departmentId: employee.department?.id || "",
      jobTitleId: employee.jobTitle?.id || "",
      jobLevelId: employee.jobLevel?.id || "",
      managerId: employee.manager?.id || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      try {
        setEmployees(prev => prev.filter(employee => employee.id !== employeeId))
        toast({
          title: "Success",
          description: "Employee deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete employee",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingEmployee(null)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      startDate: "",
      companyId: "",
      departmentId: "",
      jobTitleId: "",
      jobLevelId: "",
      managerId: ""
    })
    setIsDialogOpen(true)
  }

  const getEmployeeStatus = (employee: Employee) => {
    if (employee.endDate) {
      return <Badge variant="secondary">Terminated</Badge>
    }
    return <Badge variant="default">Active</Badge>
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading employees...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage your organization's employees and their information
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingEmployee ? "Edit Employee" : "Add New Employee"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEmployee 
                      ? "Update the employee information below."
                      : "Create a new employee to get started."
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Select
                      value={formData.companyId}
                      onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                      required
                    >
                      <SelectTrigger>
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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.departmentId}
                        onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments
                            .filter(dept => !formData.companyId || dept.location.company.name === companies.find(c => c.id === formData.companyId)?.name)
                            .map((department) => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Select
                        value={formData.jobTitleId}
                        onValueChange={(value) => setFormData({ ...formData, jobTitleId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job title" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTitles.map((jobTitle) => (
                            <SelectItem key={jobTitle.id} value={jobTitle.id}>
                              {jobTitle.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="jobLevel">Job Level</Label>
                      <Select
                        value={formData.jobLevelId}
                        onValueChange={(value) => setFormData({ ...formData, jobLevelId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job level" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobLevels.map((jobLevel) => (
                            <SelectItem key={jobLevel.id} value={jobLevel.id}>
                              {jobLevel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="manager">Manager</Label>
                    <Select
                      value={formData.managerId}
                      onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees
                          .filter(emp => emp.id !== editingEmployee?.id)
                          .map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.firstName} {employee.lastName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingEmployee ? "Update" : "Create"}
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
              placeholder="Search employees..."
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
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employees.filter(emp => !emp.endDate).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(employees.filter(emp => emp.department).map(emp => emp.department!.id)).size}
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
                {new Set(employees.map(emp => emp.company.id)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Employees</CardTitle>
            <CardDescription>
              A list of all employees in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.firstName} {employee.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {employee.department ? (
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.department.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.jobTitle ? (
                        <span>{employee.jobTitle.name}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getEmployeeStatus(employee)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/people/employees/${employee.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No employees found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}