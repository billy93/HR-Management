"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Menu,
  Building,
  MapPin,
  Briefcase,
  User,
  FileText,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
  { name: "Master Data", href: "/master", icon: Settings, roles: ["ADMIN", "HR"], 
    children: [
      { name: "Companies", href: "/master/companies", roles: ["ADMIN", "HR"] },
      { name: "Locations", href: "/master/locations", roles: ["ADMIN", "HR"] },
      { name: "Departments", href: "/master/departments", roles: ["ADMIN", "HR"] },
      { name: "Job Titles", href: "/master/job-titles", roles: ["ADMIN", "HR"] },
      { name: "Job Levels", href: "/master/job-levels", roles: ["ADMIN", "HR"] },
      { name: "Work Schedules", href: "/master/work-rules/schedules", roles: ["ADMIN", "HR"] },
      { name: "Holidays", href: "/master/work-rules/holidays", roles: ["ADMIN", "HR"] },
    ]
  },
  { name: "People", href: "/people/employees", icon: Users, roles: ["ADMIN", "HR", "MANAGER"] },
  { name: "Attendance", href: "/attendance", icon: Clock, roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
    children: [
      { name: "Clock In/Out", href: "/attendance/clock", roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
      { name: "Timesheets", href: "/attendance/timesheets", roles: ["ADMIN", "HR", "MANAGER"] },
    ]
  },
  { name: "Leave", href: "/leave", icon: Calendar, roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
    children: [
      { name: "Types", href: "/leave/types", roles: ["ADMIN", "HR"] },
      { name: "Balances", href: "/leave/balances", roles: ["ADMIN", "HR", "MANAGER"] },
      { name: "Requests", href: "/leave/requests", roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
    ]
  },
  { name: "Payroll", href: "/payroll", icon: CreditCard, roles: ["ADMIN", "HR"],
    children: [
      { name: "Runs", href: "/payroll/runs", roles: ["ADMIN", "HR"] },
      { name: "Payslips", href: "/payroll/payslips", roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
    ]
  },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["ADMIN", "HR", "MANAGER"] },
  { name: "Self Service", href: "/self", icon: User, roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
    children: [
      { name: "Profile", href: "/self/profile", roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
      { name: "Attendance", href: "/self/attendance", roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
      { name: "Leave", href: "/self/leave", roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
      { name: "Payslips", href: "/self/payslips", roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"] },
    ]
  },
  { name: "Admin", href: "/admin", icon: Settings, roles: ["ADMIN"],
    children: [
      { name: "Users", href: "/admin/users", roles: ["ADMIN"] },
      { name: "Roles", href: "/admin/roles", roles: ["ADMIN"] },
      { name: "Approvals", href: "/admin/approvals", roles: ["ADMIN"] },
      { name: "Notifications", href: "/admin/notifications", roles: ["ADMIN"] },
    ]
  },
]

interface SidebarProps {
  className?: string
  userRole: string
  collapsedMenus: Record<string, boolean>
  toggleMenu: (menuName: string) => void
}

function Sidebar({ className, userRole, collapsedMenus, toggleMenu }: SidebarProps) {
  const pathname = usePathname()

  const filterNavByRole = (items: any[]) => {
    return items.filter(item => item.roles.includes(userRole))
  }

  const NavItems = ({ items, level = 0 }: { items: any[], level?: number }) => {
    return items.map((item) => {
      const isActive = pathname === item.href
      const hasChildren = item.children && item.children.length > 0
      const filteredChildren = hasChildren ? filterNavByRole(item.children) : []
      const isCollapsed = collapsedMenus[item.name] || false

      if (hasChildren && filteredChildren.length > 0) {
        const IconComponent = item.icon
        return (
          <div key={item.name} className="space-y-1">
            <button
              onClick={() => toggleMenu(item.name)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                level === 0 ? "text-muted-foreground" : "text-muted-foreground/70",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{item.name}</span>
              </div>
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {!isCollapsed && (
              <div className={cn("ml-4 space-y-1", level > 0 && "ml-8")}>
                <NavItems items={filteredChildren} level={level + 1} />
              </div>
            )}
          </div>
        )
      }

      if (!hasChildren) {
        const IconComponent = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-primary text-primary-foreground",
              level === 0 ? "" : "ml-4"
            )}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span>{item.name}</span>
          </Link>
        )
      }

      return null
    })
  }

  const filteredNavigation = filterNavByRole(navigation)

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            SBHR System
          </h2>
          <div className="space-y-1">
            <NavItems items={filteredNavigation} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface MainLayoutProps {
  children: React.ReactNode
  userRole: string
}

export function MainLayout({ children, userRole }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsedMenus, setCollapsedMenus] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const toggleMenu = (menuName: string) => {
    setCollapsedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  const handleLogout = async () => {
    try {
      // Call logout API to clear session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      // Clear client-side session
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('hr-session')
        localStorage.removeItem('hr-session')
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r pt-5 overflow-y-auto">
          <Sidebar userRole={userRole} collapsedMenus={collapsedMenus} toggleMenu={toggleMenu} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar userRole={userRole} collapsedMenus={collapsedMenus} toggleMenu={toggleMenu} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="text-sm text-muted-foreground">
                Role: {userRole}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}