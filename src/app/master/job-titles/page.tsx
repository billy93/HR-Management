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
  Briefcase,
  Users,
  Calendar,
  TrendingUp
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: string
  firstName: string
  lastName: string
  jobLevel?: { name: string; rank: number }
}

interface JobTitle {
  id: string
  name: string
  employees: Employee[]
  createdAt: string
  updatedAt: string
}

export default function JobTitlesPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJobTitle, setEditingJobTitle] = useState<JobTitle | null>(null)
  const [formData, setFormData] = useState({
    name: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchJobTitles()
  }, [])

  const fetchJobTitles = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockJobTitles: JobTitle[] = [
        {
          id: "1",
          name: "Software Engineer",
          employees: [
            { id: "1", firstName: "John", lastName: "Doe", jobLevel: { name: "Senior", rank: 3 } },
            { id: "2", firstName: "Jane", lastName: "Smith", jobLevel: { name: "Mid", rank: 2 } }
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          name: "HR Manager",
          employees: [
            { id: "3", firstName: "Mike", lastName: "Johnson", jobLevel: { name: "Manager", rank: 4 } }
          ],
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z"
        },
        {
          id: "3",
          name: "Sales Representative",
          employees: [
            { id: "4", firstName: "Sarah", lastName: "Wilson", jobLevel: { name: "Junior", rank: 1 } }
          ],
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-03T00:00:00Z"
        },
        {
          id: "4",
          name: "Product Manager",
          employees: [],
          createdAt: "2024-01-04T00:00:00Z",
          updatedAt: "2024-01-04T00:00:00Z"
        }
      ]
      setJobTitles(mockJobTitles)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job titles",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredJobTitles = jobTitles.filter(jobTitle =>
    jobTitle.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingJobTitle) {
        // Update existing job title
        setJobTitles(prev => prev.map(jobTitle => 
          jobTitle.id === editingJobTitle.id 
            ? { ...jobTitle, name: formData.name, updatedAt: new Date().toISOString() }
            : jobTitle
        ))
        toast({
          title: "Success",
          description: "Job title updated successfully"
        })
      } else {
        // Create new job title
        const newJobTitle: JobTitle = {
          id: Date.now().toString(),
          name: formData.name,
          employees: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setJobTitles(prev => [...prev, newJobTitle])
        toast({
          title: "Success",
          description: "Job title created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({ name: "" })
      setEditingJobTitle(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job title",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (jobTitle: JobTitle) => {
    setEditingJobTitle(jobTitle)
    setFormData({ name: jobTitle.name })
    setIsDialogOpen(true)
  }

  const handleDelete = async (jobTitleId: string) => {
    if (confirm("Are you sure you want to delete this job title? This action cannot be undone.")) {
      try {
        setJobTitles(prev => prev.filter(jobTitle => jobTitle.id !== jobTitleId))
        toast({
          title: "Success",
          description: "Job title deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job title",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingJobTitle(null)
    setFormData({ name: "" })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading job titles...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Job Titles</h1>
            <p className="text-muted-foreground">
              Manage your organization's job titles and positions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Job Title
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingJobTitle ? "Edit Job Title" : "Add New Job Title"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingJobTitle 
                      ? "Update the job title information below."
                      : "Create a new job title to get started."
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
                    {editingJobTitle ? "Update" : "Create"}
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
              placeholder="Search job titles..."
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
              <CardTitle className="text-sm font-medium">Total Job Titles</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobTitles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobTitles.reduce((acc, jobTitle) => acc + jobTitle.employees.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacant Positions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobTitles.filter(jobTitle => jobTitle.employees.length === 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Titles Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Job Titles</CardTitle>
            <CardDescription>
              A list of all job titles in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Employee Levels</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobTitles.map((jobTitle) => (
                  <TableRow key={jobTitle.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{jobTitle.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{jobTitle.employees.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {jobTitle.employees.length > 0 ? (
                          [...new Set(jobTitle.employees.map(emp => emp.jobLevel?.name).filter(Boolean))].map((level, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {level}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No employees</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(jobTitle.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(jobTitle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(jobTitle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredJobTitles.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No job titles found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Job Titles */}
        <Card>
          <CardHeader>
            <CardTitle>Job Titles Distribution</CardTitle>
            <CardDescription>
              Overview of job titles and their employee distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobTitles
                .sort((a, b) => b.employees.length - a.employees.length)
                .slice(0, 5)
                .map((jobTitle) => (
                  <div key={jobTitle.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{jobTitle.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(jobTitle.employees.length / Math.max(...jobTitles.map(jt => jt.employees.length))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">
                        {jobTitle.employees.length}
                      </span>
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