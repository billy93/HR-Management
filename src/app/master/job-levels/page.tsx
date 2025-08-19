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
  TrendingUp,
  Users,
  Calendar,
  Star
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: string
  firstName: string
  lastName: string
}

interface JobLevel {
  id: string
  name: string
  rank: number
  employees: Employee[]
  createdAt: string
  updatedAt: string
}

export default function JobLevelsPage() {
  const [userRole] = useState("ADMIN") // In real app, this would come from auth context
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJobLevel, setEditingJobLevel] = useState<JobLevel | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    rank: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchJobLevels()
  }, [])

  const fetchJobLevels = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      const mockJobLevels: JobLevel[] = [
        {
          id: "1",
          name: "Intern",
          rank: 0,
          employees: [
            { id: "1", firstName: "Alex", lastName: "Chen" }
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          name: "Junior",
          rank: 1,
          employees: [
            { id: "2", firstName: "Sarah", lastName: "Wilson" },
            { id: "3", firstName: "Tom", lastName: "Brown" }
          ],
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z"
        },
        {
          id: "3",
          name: "Mid",
          rank: 2,
          employees: [
            { id: "4", firstName: "Jane", lastName: "Smith" },
            { id: "5", firstName: "Bob", lastName: "Johnson" }
          ],
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-03T00:00:00Z"
        },
        {
          id: "4",
          name: "Senior",
          rank: 3,
          employees: [
            { id: "6", firstName: "John", lastName: "Doe" }
          ],
          createdAt: "2024-01-04T00:00:00Z",
          updatedAt: "2024-01-04T00:00:00Z"
        },
        {
          id: "5",
          name: "Manager",
          rank: 4,
          employees: [
            { id: "7", firstName: "Mike", lastName: "Johnson" }
          ],
          createdAt: "2024-01-05T00:00:00Z",
          updatedAt: "2024-01-05T00:00:00Z"
        }
      ]
      setJobLevels(mockJobLevels)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job levels",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredJobLevels = jobLevels.filter(jobLevel =>
    jobLevel.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const rankValue = parseInt(formData.rank)
    if (isNaN(rankValue) || rankValue < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid rank (number >= 0)",
        variant: "destructive"
      })
      return
    }

    try {
      if (editingJobLevel) {
        // Update existing job level
        setJobLevels(prev => prev.map(jobLevel => 
          jobLevel.id === editingJobLevel.id 
            ? { ...jobLevel, name: formData.name, rank: rankValue, updatedAt: new Date().toISOString() }
            : jobLevel
        ))
        toast({
          title: "Success",
          description: "Job level updated successfully"
        })
      } else {
        // Create new job level
        const newJobLevel: JobLevel = {
          id: Date.now().toString(),
          name: formData.name,
          rank: rankValue,
          employees: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setJobLevels(prev => [...prev, newJobLevel])
        toast({
          title: "Success",
          description: "Job level created successfully"
        })
      }
      
      setIsDialogOpen(false)
      setFormData({ name: "", rank: "" })
      setEditingJobLevel(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job level",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (jobLevel: JobLevel) => {
    setEditingJobLevel(jobLevel)
    setFormData({ 
      name: jobLevel.name, 
      rank: jobLevel.rank.toString() 
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (jobLevelId: string) => {
    if (confirm("Are you sure you want to delete this job level? This action cannot be undone.")) {
      try {
        setJobLevels(prev => prev.filter(jobLevel => jobLevel.id !== jobLevelId))
        toast({
          title: "Success",
          description: "Job level deleted successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job level",
          variant: "destructive"
        })
      }
    }
  }

  const openNewDialog = () => {
    setEditingJobLevel(null)
    setFormData({ name: "", rank: "" })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <MainLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading job levels...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const sortedJobLevels = [...filteredJobLevels].sort((a, b) => a.rank - b.rank)

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Levels</h1>
            <p className="text-muted-foreground">
              Manage your organization's job levels and career progression
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Job Level
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingJobLevel ? "Edit Job Level" : "Add New Job Level"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingJobLevel 
                      ? "Update the job level information below."
                      : "Create a new job level to get started."
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
                    <Label htmlFor="rank" className="text-right">
                      Rank
                    </Label>
                    <Input
                      id="rank"
                      type="number"
                      min="0"
                      value={formData.rank}
                      onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingJobLevel ? "Update" : "Create"}
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
              placeholder="Search job levels..."
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
              <CardTitle className="text-sm font-medium">Total Job Levels</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobLevels.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobLevels.reduce((acc, jobLevel) => acc + jobLevel.employees.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Level</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobLevels.length > 0 ? Math.max(...jobLevels.map(jl => jl.rank)) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Levels Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Job Levels</CardTitle>
            <CardDescription>
              A list of all job levels in your organization (sorted by rank)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedJobLevels.map((jobLevel) => (
                  <TableRow key={jobLevel.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">#{jobLevel.rank}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{jobLevel.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{jobLevel.employees.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(jobLevel.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(jobLevel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(jobLevel.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {sortedJobLevels.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No job levels found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Career Progression Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Career Progression Overview</CardTitle>
            <CardDescription>
              Visual representation of job levels and employee distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedJobLevels.map((jobLevel, index) => (
                <div key={jobLevel.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                      {jobLevel.rank}
                    </div>
                    <div>
                      <h3 className="font-medium">{jobLevel.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {jobLevel.employees.length} employee{jobLevel.employees.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(jobLevel.employees.length / Math.max(...jobLevels.map(jl => jl.employees.length), 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <Badge variant="secondary">
                      Level {jobLevel.rank}
                    </Badge>
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