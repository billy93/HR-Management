'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Settings,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  // Mock data for admin dashboard
  const stats = [
    {
      title: 'Total Users',
      value: 45,
      change: '+12%',
      icon: <Users className="h-4 w-4" />,
      description: 'Active system users'
    },
    {
      title: 'Pending Approvals',
      value: 8,
      change: '+3',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Awaiting approval'
    },
    {
      title: 'System Alerts',
      value: 3,
      change: '-2',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Requires attention'
    },
    {
      title: 'Active Sessions',
      value: 23,
      change: '+5',
      icon: <Activity className="h-4 w-4" />,
      description: 'Currently logged in'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'New user registered',
      user: 'John Doe',
      time: '2 minutes ago',
      type: 'user'
    },
    {
      id: 2,
      action: 'Leave request approved',
      user: 'Jane Smith',
      time: '15 minutes ago',
      type: 'approval'
    },
    {
      id: 3,
      action: 'Role updated',
      user: 'Admin',
      time: '1 hour ago',
      type: 'role'
    },
    {
      id: 4,
      action: 'Payroll processed',
      user: 'System',
      time: '2 hours ago',
      type: 'system'
    }
  ]

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove system users',
      icon: <Users className="h-6 w-6" />,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Role Management',
      description: 'Configure user roles and permissions',
      icon: <Shield className="h-6 w-6" />,
      href: '/admin/roles',
      color: 'bg-green-500'
    },
    {
      title: 'Approvals',
      description: 'Review and approve pending requests',
      icon: <CheckCircle className="h-6 w-6" />,
      href: '/admin/approvals',
      color: 'bg-purple-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: <Settings className="h-6 w-6" />,
      href: '/admin/settings',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            System administration and management
          </p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Shield className="h-4 w-4" />
          Administrator
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white mb-2`}>
                  {action.icon}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest system activities and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'approval' ? 'bg-green-500' :
                      activity.type === 'role' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Current system health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge variant="default" className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Server</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Authentication</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">File Storage</span>
                <Badge variant="default" className="bg-yellow-500">Warning</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Service</span>
                <Badge variant="default" className="bg-green-500">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}