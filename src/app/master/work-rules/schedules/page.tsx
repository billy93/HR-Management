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
  Clock,
  Building,
  Calendar,
  Globe,
  Users
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: string
  name: string
}

interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
}

interface WorkSchedule {
  id: string
  name: string
  timezone: string
  company: Company
  shifts: Shift[]
  createdAt: string
  updatedAt: string
}

export default function WorkSchedulesPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkSchedule, setEditingWorkSchedule] = useState<WorkSchedule | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    companyId: "",
    timezone: "Asia/Jakarta"
  })
  const { toast } = useToast()

  const timezones = [
    "Asia/Jakarta",
    "Asia/Singapore",
    "Asia/Kuala_Lumpur",
    "Asia/Bangkok",
    "Asia/Manila",
    "UTC"
  ]

  useEffect(() => {
    fetchWorkSchedules()
    fetchCompanies()
  }, [])

  const fetchWorkSchedules = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockWorkSchedules: WorkSchedule[] = [
        {
          id: "1",
          name: "Standard 5-2",
          timezone: "Asia/Jakarta",
          company: { id: "1", name: "Acme Corporation" },
          shifts: [
            { id: "1", name: "Morning Shift", startTime: "09:00", endTime: "17:00" },
            { id: "2", name: "Afternoon Shift", startTime: "14:00", endTime: "22:00" }
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          name: "Flexible Hours",
          timezone: "Asia/Jakarta",
          company: { id: "1", name: "Acme Corporation" },
          shifts: [
            { id: "3", name: "Core Hours", startTime: "10:00", endTime: "16:00" }
          ],
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z"
        },
        {
          id: "3",
          name: "Tech Startup Schedule",
          timezone: "Asia/Singapore",
          company: { id: "2", name: "Tech Solutions Inc" },
          shifts: [
            { id: "4", name: "Dev Shift", startTime: "08:00", endTime: "17:00" }
          ],
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z"
        }
      ]
      setWorkSchedules(mockWorkSchedules)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch work schedules",
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

  const filteredWorkSchedules = workSchedules.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.company.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      if (editingWorkSchedule) {
        // Update existing work schedule
        setWorkSchedules(prev => prev.map(schedule => 
          schedule.id === editingWorkSchedule.id 
            ? { 
                ...schedule, 
                name: formData.name,
                company: selectedCompany || schedule.company,
                timezone: formData.timezone,
                updatedAt: new Date().toISOString() 
              }
            : schedule
        ))
        toast({
          title: "Success",
          description: "Work schedule updated successfully"
        })
      } else {
        // Create new work schedule
        const newWorkSchedule: WorkSchedule = {
          id: Date.now().toString(),
          name: formData.name,
          timezone: formData.timezone,
          company: selectedCompany!,
          shifts: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setWorkSchedules(prev => [...prev, newWorkSchedule])
        toast({
          title: "Success",
          description: "Work schedule created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({ name: "", companyId: "", timezone: "Asia/Jakarta" })
      setEditingWorkSchedule(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save work schedule",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (schedule: WorkSchedule) => {
    setEditingWorkSchedule(schedule)
    setFormData({ 
      name: schedule.name, 
      companyId: schedule.company.id,
      timezone: schedule.timezone
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (scheduleId: string) => {
    if (confirm("Are you sure you want to delete this work schedule? This action cannot be undone.")) {
      try {
        setWorkSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId))
        toast({
          title: "Success",
          description: "Work schedule deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete work schedule",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingWorkSchedule(null)
    setFormData({ name: "", companyId: "", timezone: "Asia/Jakarta" })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading work schedules...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Work Schedules</h1>
            <p className="text-muted-foreground">
              Manage your organization's work schedules and shifts
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Work Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingWorkSchedule ? "Edit Work Schedule" : "Add New Work Schedule"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingWorkSchedule 
                      ? "Update the work schedule information below."
                      : "Create a new work schedule to get started."
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
                    <Label htmlFor="timezone" className="text-right">
                      Timezone
                    </Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone} value={timezone}>
                            {timezone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingWorkSchedule ? "Update" : "Create"}
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
              placeholder="Search work schedules..."
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
              <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workSchedules.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(workSchedules.map(schedule => schedule.company.id)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workSchedules.reduce((acc, schedule) => acc + schedule.shifts.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Schedules Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Work Schedules</CardTitle>
            <CardDescription>
              A list of all work schedules in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Shifts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{schedule.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{schedule.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{schedule.timezone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {schedule.shifts.map((shift) => (
                          <Badge key={shift.id} variant="secondary" className="text-xs">
                            {shift.name} ({shift.startTime}-{shift.endTime})
                          </Badge>
                        ))}
                        {schedule.shifts.length === 0 && (
                          <span className="text-muted-foreground text-sm">No shifts</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(schedule.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(schedule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredWorkSchedules.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No work schedules found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Work Schedule Overview</CardTitle>
            <CardDescription>
              Summary of work schedules and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredWorkSchedules.slice(0, 4).map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{schedule.name}</h3>
                    <Badge variant="outline">{schedule.timezone}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {schedule.company.name}
                  </p>
                  <div className="space-y-1">
                    {schedule.shifts.slice(0, 2).map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between text-sm">
                        <span>{shift.name}</span>
                        <span className="text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>
                    ))}
                    {schedule.shifts.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{schedule.shifts.length - 2} more shifts
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}