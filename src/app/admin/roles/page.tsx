'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Users,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function RolesPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)

  // Mock data for demonstration
  const roles = [
    {
      id: 1,
      name: 'ADMIN',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: [
        'users.read',
        'users.write',
        'users.delete',
        'roles.read',
        'roles.write',
        'attendance.read',
        'attendance.write',
        'leave.read',
        'leave.write',
        'leave.approve',
        'payroll.read',
        'payroll.write',
        'reports.read',
        'reports.export',
        'admin.read',
        'admin.write'
      ],
      isActive: true
    },
    {
      id: 2,
      name: 'HR',
      description: 'Human Resources management access',
      userCount: 3,
      permissions: [
        'users.read',
        'users.write',
        'attendance.read',
        'attendance.write',
        'leave.read',
        'leave.write',
        'leave.approve',
        'payroll.read',
        'reports.read',
        'reports.export'
      ],
      isActive: true
    },
    {
      id: 3,
      name: 'MANAGER',
      description: 'Department management access',
      userCount: 5,
      permissions: [
        'users.read',
        'attendance.read',
        'attendance.write',
        'leave.read',
        'leave.write',
        'leave.approve',
        'payroll.read',
        'reports.read'
      ],
      isActive: true
    },
    {
      id: 4,
      name: 'EMPLOYEE',
      description: 'Basic employee access',
      userCount: 35,
      permissions: [
        'attendance.read',
        'attendance.write',
        'leave.read',
        'leave.write',
        'payroll.read'
      ],
      isActive: true
    }
  ]

  const allPermissions = [
    { category: 'User Management', permissions: ['users.read', 'users.write', 'users.delete'] },
    { category: 'Role Management', permissions: ['roles.read', 'roles.write'] },
    { category: 'Attendance', permissions: ['attendance.read', 'attendance.write'] },
    { category: 'Leave Management', permissions: ['leave.read', 'leave.write', 'leave.approve'] },
    { category: 'Payroll', permissions: ['payroll.read', 'payroll.write'] },
    { category: 'Reports', permissions: ['reports.read', 'reports.export'] },
    { category: 'Admin', permissions: ['admin.read', 'admin.write'] }
  ]

  const handleSaveRole = async (formData: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Role Saved",
        description: `Role has been ${editingRole ? 'updated' : 'created'} successfully.`,
      })
      
      setIsDialogOpen(false)
      setEditingRole(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm('Are you sure you want to delete this role? This will affect all users with this role.')) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Role Deleted",
        description: "Role has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN': return <Shield className="h-5 w-5" />
      case 'HR': return <Users className="h-5 w-5" />
      case 'MANAGER': return <Settings className="h-5 w-5" />
      case 'EMPLOYEE': return <FileText className="h-5 w-5" />
      default: return <Shield className="h-5 w-5" />
    }
  }

  const getPermissionIcon = (permission: string) => {
    if (permission.includes('read')) return <FileText className="h-4 w-4" />
    if (permission.includes('write')) return <Edit className="h-4 w-4" />
    if (permission.includes('delete')) return <Trash2 className="h-4 w-4" />
    if (permission.includes('approve')) return <CheckCircle className="h-4 w-4" />
    if (permission.includes('export')) return <Calendar className="h-4 w-4" />
    return <Settings className="h-4 w-4" />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </DialogTitle>
              <DialogDescription>
                {editingRole ? 'Update role and permissions' : 'Create a new role with specific permissions'}
              </DialogDescription>
            </DialogHeader>
            <form action={handleSaveRole}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingRole?.name || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingRole?.description || ''}
                    required
                  />
                </div>
                
                <div>
                  <Label>Permissions</Label>
                  <div className="space-y-4 mt-2">
                    {allPermissions.map((category) => (
                      <div key={category.category} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">{category.category}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {category.permissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Switch
                                id={permission}
                                name="permissions"
                                value={permission}
                                defaultChecked={editingRole?.permissions?.includes(permission) || false}
                              />
                              <Label htmlFor={permission} className="text-sm">
                                {permission.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked={editingRole?.isActive ?? true}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRole ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRoleIcon(role.name)}
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {role.isActive ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Users</span>
                  <Badge variant="secondary">{role.userCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Permissions</span>
                  <Badge variant="secondary">{role.permissions.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles and Permissions</CardTitle>
          <CardDescription>
            Detailed view of all roles and their assigned permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role.name)}
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      {role.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{role.userCount} users</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.split('.').pop()}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingRole(role)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={role.userCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}