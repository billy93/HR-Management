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
  MapPin,
  Building,
  Users,
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
  departments: Department[]
  createdAt: string
  updatedAt: string
}

interface Department {
  id: string
  name: string
}

export default function LocationsPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [locations, setLocations] = useState<Location[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    companyId: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLocations()
    fetchCompanies()
  }, [])

  const fetchLocations = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockLocations: Location[] = [
        {
          id: "1",
          name: "Jakarta HQ",
          company: { id: "1", name: "Acme Corporation" },
          departments: [
            { id: "1", name: "Engineering" },
            { id: "2", name: "HR" }
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          name: "Surabaya Branch", 
          company: { id: "1", name: "Acme Corporation" },
          departments: [
            { id: "3", name: "Sales" }
          ],
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z"
        },
        {
          id: "3",
          name: "Bandung Office",
          company: { id: "2", name: "Tech Solutions Inc" },
          departments: [],
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z"
        }
      ]
      setLocations(mockLocations)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch locations",
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

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.company.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      if (editingLocation) {
        // Update existing location
        setLocations(prev => prev.map(location => 
          location.id === editingLocation.id 
            ? { 
                ...location, 
                name: formData.name,
                company: selectedCompany || location.company,
                updatedAt: new Date().toISOString() 
              }
            : location
        ))
        toast({
          title: "Success",
          description: "Location updated successfully"
        })
      } else {
        // Create new location
        const newLocation: Location = {
          id: Date.now().toString(),
          name: formData.name,
          company: selectedCompany!,
          departments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setLocations(prev => [...prev, newLocation])
        toast({
          title: "Success",
          description: "Location created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({ name: "", companyId: "" })
      setEditingLocation(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setFormData({ 
      name: location.name, 
      companyId: location.company.id 
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (locationId: string) => {
    if (confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
      try {
        setLocations(prev => prev.filter(location => location.id !== locationId))
        toast({
          title: "Success",
          description: "Location deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete location",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingLocation(null)
    setFormData({ name: "", companyId: "" })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading locations...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
            <p className="text-muted-foreground">
              Manage your organization's locations
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingLocation ? "Edit Location" : "Add New Location"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingLocation 
                      ? "Update the location information below."
                      : "Create a new location to get started."
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
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingLocation ? "Update" : "Create"}
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
              placeholder="Search locations..."
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
              <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{locations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(locations.map(loc => loc.company.id)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {locations.reduce((acc, location) => acc + location.departments.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Locations</CardTitle>
            <CardDescription>
              A list of all locations in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{location.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{location.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {location.departments.map((department) => (
                          <Badge key={department.id} variant="secondary" className="text-xs">
                            {department.name}
                          </Badge>
                        ))}
                        {location.departments.length === 0 && (
                          <span className="text-muted-foreground text-sm">No departments</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(location.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(location.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLocations.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No locations found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}