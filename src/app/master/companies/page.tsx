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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building,
  MapPin,
  Users,
  Calendar
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: string
  name: string
  locations: Location[]
  employees: Employee[]
  createdAt: string
  updatedAt: string
}

interface Location {
  id: string
  name: string
  departments: Department[]
}

interface Department {
  id: string
  name: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

export default function CompaniesPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
    name: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockCompanies: Company[] = [
        {
          id: "1",
          name: "Acme Corporation",
          locations: [
            { id: "1", name: "Jakarta HQ", departments: [] },
            { id: "2", name: "Surabaya Branch", departments: [] }
          ],
          employees: [],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2", 
          name: "Tech Solutions Inc",
          locations: [
            { id: "3", name: "Bandung Office", departments: [] }
          ],
          employees: [],
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z"
        }
      ]
      setCompanies(mockCompanies)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingCompany) {
        // Update existing company
        setCompanies(prev => prev.map(company => 
          company.id === editingCompany.id 
            ? { ...company, name: formData.name, updatedAt: new Date().toISOString() }
            : company
        ))
        toast({
          title: "Success",
          description: "Company updated successfully"
        })
      } else {
        // Create new company
        const newCompany: Company = {
          id: Date.now().toString(),
          name: formData.name,
          locations: [],
          employees: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setCompanies(prev => [...prev, newCompany])
        toast({
          title: "Success",
          description: "Company created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({ name: "" })
      setEditingCompany(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save company",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormData({ name: company.name })
    setIsDialogOpen(true)
  }

  const handleDelete = async (companyId: string) => {
    if (confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      try {
        setCompanies(prev => prev.filter(company => company.id !== companyId))
        toast({
          title: "Success",
          description: "Company deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete company",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingCompany(null)
    setFormData({ name: "" })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading companies...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground">
              Manage your organization's companies
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingCompany ? "Edit Company" : "Add New Company"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCompany 
                      ? "Update the company information below."
                      : "Create a new company to get started."
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
                      onChange={(e) => setFormData({ name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingCompany ? "Update" : "Create"}
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
              placeholder="Search companies..."
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
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {companies.reduce((acc, company) => acc + company.locations.length, 0)}
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
                {companies.reduce((acc, company) => acc + company.employees.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
            <CardDescription>
              A list of all companies in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {company.locations.map((location) => (
                          <Badge key={location.id} variant="secondary" className="text-xs">
                            {location.name}
                          </Badge>
                        ))}
                        {company.locations.length === 0 && (
                          <span className="text-muted-foreground text-sm">No locations</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{company.employees.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(company.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCompanies.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No companies found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}