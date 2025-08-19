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
  Users,
  MapPin,
  Building,
  Calendar
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: string
  name: string
}

interface Location {
  id: string
  name: string
  company: Company
}

interface Department {
  id: string
  name: string
  location: Location
  employees: Employee[]
  createdAt: string
  updatedAt: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

export default function DepartmentsPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [departments, setDepartments] = useState<Department[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    locationId: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchDepartments()
    fetchLocations()
  }, [])

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockDepartments: Department[] = [
        {
          id: "1",
          name: "Engineering",
          location: { 
            id: "1", 
            name: "Jakarta HQ", 
            company: { id: "1", name: "Acme Corporation" } 
          },
          employees: [
            { id: "1", firstName: "John", lastName: "Doe" },
            { id: "2", firstName: "Jane", lastName: "Smith" }
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          name: "HR",
          location: { 
            id: "1", 
            name: "Jakarta HQ", 
            company: { id: "1", name: "Acme Corporation" } 
          },
          employees: [
            { id: "3", firstName: "Mike", lastName: "Johnson" }
          ],
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z"
        },
        {
          id: "3",
          name: "Sales",
          location: { 
            id: "2", 
            name: "Surabaya Branch", 
            company: { id: "1", name: "Acme Corporation" } 
          },
          employees: [],
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-03T00:00:00Z"
        }
      ]
      setDepartments(mockDepartments)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      // Mock data
      const mockLocations: Location[] = [
        { 
          id: "1", 
          name: "Jakarta HQ", 
          company: { id: "1", name: "Acme Corporation" } 
        },
        { 
          id: "2", 
          name: "Surabaya Branch", 
          company: { id: "1", name: "Acme Corporation" } 
        },
        { 
          id: "3", 
          name: "Bandung Office", 
          company: { id: "2", name: "Tech Solutions Inc" } 
        }
      ]
      setLocations(mockLocations)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive"
      })
    }
  }

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.location.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.locationId) {
      toast({
        title: "Error",
        description: "Please select a location",
        variant: "destructive"
      })
      return
    }

    try {
      const selectedLocation = locations.find(l => l.id === formData.locationId)
      
      if (editingDepartment) {
        // Update existing department
        setDepartments(prev => prev.map(department => 
          department.id === editingDepartment.id 
            ? { 
                ...department, 
                name: formData.name,
                location: selectedLocation || department.location,
                updatedAt: new Date().toISOString() 
              }
            : department
        ))
        toast({
          title: "Success",
          description: "Department updated successfully"
        })
      } else {
        // Create new department
        const newDepartment: Department = {
          id: Date.now().toString(),
          name: formData.name,
          location: selectedLocation!,
          employees: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setDepartments(prev => [...prev, newDepartment])
        toast({
          title: "Success",
          description: "Department created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({ name: "", locationId: "" })
      setEditingDepartment(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save department",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({ 
      name: department.name, 
      locationId: department.location.id 
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (departmentId: string) => {
    if (confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      try {
        setDepartments(prev => prev.filter(department => department.id !== departmentId))
        toast({
          title: "Success",
          description: "Department deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete department",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingDepartment(null)
    setFormData({ name: "", locationId: "" })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading departments...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground">
              Manage your organization's departments
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingDepartment ? "Edit Department" : "Add New Department"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingDepartment 
                      ? "Update the department information below."
                      : "Create a new department to get started."
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
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Select
                      value={formData.locationId}
                      onValueChange={(value) => setFormData({ ...formData, locationId: value })}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name} ({location.company.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingDepartment ? "Update" : "Create"}
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
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(departments.map(dept => dept.location.id)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.reduce((acc, department) => acc + department.employees.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Departments</CardTitle>
            <CardDescription>
              A list of all departments in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{department.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{department.location.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{department.location.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{department.employees.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(department.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(department)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(department.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredDepartments.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No departments found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}