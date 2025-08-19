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
  Calendar,
  Building,
  Star,
  Clock,
  MapPin
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: string
  name: string
}

interface Holiday {
  id: string
  date: string
  name: string
  company: Company
  createdAt: string
  updatedAt: string
}

export default function HolidaysPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    companyId: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchHolidays()
    fetchCompanies()
  }, [])

  const fetchHolidays = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockHolidays: Holiday[] = [
        {
          id: "1",
          date: "2024-01-01",
          name: "New Year's Day",
          company: { id: "1", name: "Acme Corporation" },
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          date: "2024-08-17",
          name: "Independence Day",
          company: { id: "1", name: "Acme Corporation" },
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z"
        },
        {
          id: "3",
          date: "2024-12-25",
          name: "Christmas Day",
          company: { id: "1", name: "Acme Corporation" },
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-03T00:00:00Z"
        },
        {
          id: "4",
          date: "2024-01-01",
          name: "New Year's Day",
          company: { id: "2", name: "Tech Solutions Inc" },
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z"
        },
        {
          id: "5",
          date: "2024-02-10",
          name: "Chinese New Year",
          company: { id: "2", name: "Tech Solutions Inc" },
          createdAt: "2024-01-16T00:00:00Z",
          updatedAt: "2024-01-16T00:00:00Z"
        }
      ]
      setHolidays(mockHolidays)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch holidays",
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

  const filteredHolidays = holidays.filter(holiday =>
    holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    holiday.date.includes(searchTerm) ||
    holiday.company.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (!formData.date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive"
      })
      return
    }

    try {
      const selectedCompany = companies.find(c => c.id === formData.companyId)
      
      if (editingHoliday) {
        // Update existing holiday
        setHolidays(prev => prev.map(holiday => 
          holiday.id === editingHoliday.id 
            ? { 
                ...holiday, 
                name: formData.name,
                date: formData.date,
                company: selectedCompany || holiday.company,
                updatedAt: new Date().toISOString() 
              }
            : holiday
        ))
        toast({
          title: "Success",
          description: "Holiday updated successfully"
        })
      } else {
        // Create new holiday
        const newHoliday: Holiday = {
          id: Date.now().toString(),
          name: formData.name,
          date: formData.date,
          company: selectedCompany!,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setHolidays(prev => [...prev, newHoliday])
        toast({
          title: "Success",
          description: "Holiday created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({ name: "", date: "", companyId: "" })
      setEditingHoliday(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save holiday",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setFormData({ 
      name: holiday.name, 
      date: holiday.date,
      companyId: holiday.company.id
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (holidayId: string) => {
    if (confirm("Are you sure you want to delete this holiday? This action cannot be undone.")) {
      try {
        setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId))
        toast({
          title: "Success",
          description: "Holiday deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete holiday",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingHoliday(null)
    setFormData({ name: "", date: "", companyId: "" })
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const isUpcoming = (dateString: string) => {
    const holidayDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return holidayDate >= today
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading holidays...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const sortedHolidays = [...filteredHolidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Holidays</h1>
            <p className="text-muted-foreground">
              Manage your organization's holidays and non-working days
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingHoliday 
                      ? "Update the holiday information below."
                      : "Create a new holiday to get started."
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
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    {editingHoliday ? "Update" : "Create"}
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
              placeholder="Search holidays..."
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
              <CardTitle className="text-sm font-medium">Total Holidays</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{holidays.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Holidays</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {holidays.filter(holiday => isUpcoming(holiday.date)).length}
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
                {new Set(holidays.map(holiday => holiday.company.id)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holidays Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Holidays</CardTitle>
            <CardDescription>
              A list of all holidays in your organization (sorted by date)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHolidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(holiday.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>{holiday.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{holiday.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isUpcoming(holiday.date) ? (
                        <Badge variant="default">Upcoming</Badge>
                      ) : (
                        <Badge variant="secondary">Past</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(holiday.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(holiday)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(holiday.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {sortedHolidays.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No holidays found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
            <CardDescription>
              Holidays that are coming up in the future
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {holidays
                .filter(holiday => isUpcoming(holiday.date))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 6)
                .map((holiday) => (
                  <div key={holiday.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{holiday.name}</h3>
                      <Badge variant="default">
                        {new Date(holiday.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {holiday.company.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(holiday.date)}</span>
                    </div>
                  </div>
                ))}
            </div>
            
            {holidays.filter(holiday => isUpcoming(holiday.date)).length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No upcoming holidays found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}