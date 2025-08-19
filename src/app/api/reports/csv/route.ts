import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reportType, departmentId, dateFrom, dateTo } = await request.json()

    if (!reportType) {
      return NextResponse.json({ error: 'Report type is required' }, { status: 400 })
    }

    let csvContent = ''
    let filename = ''

    switch (reportType) {
      case 'attendance':
        csvContent = await generateAttendanceReport(departmentId, dateFrom, dateTo)
        filename = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'payroll':
        csvContent = await generatePayrollReport(departmentId, dateFrom, dateTo)
        filename = `payroll_report_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'leave':
        csvContent = await generateLeaveReport(departmentId, dateFrom, dateTo)
        filename = `leave_report_${new Date().toISOString().split('T')[0]}.csv`
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateAttendanceReport(departmentId?: string, dateFrom?: string, dateTo?: string) {
  const whereClause: any = {}
  
  if (departmentId && departmentId !== 'all') {
    whereClause.employee = {
      departmentId: departmentId
    }
  }
  
  if (dateFrom && dateTo) {
    whereClause.date = {
      gte: new Date(dateFrom),
      lte: new Date(dateTo)
    }
  }

  const attendanceLogs = await db.attendanceLog.findMany({
    where: whereClause,
    include: {
      employee: {
        include: {
          department: true,
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  })

  // Group by employee and calculate statistics
  const employeeStats = new Map()
  
  attendanceLogs.forEach(log => {
    const employeeId = log.employeeId
    if (!employeeStats.has(employeeId)) {
      employeeStats.set(employeeId, {
        employeeName: log.employee.user.name,
        department: log.employee.department.name,
        totalDays: 0,
        presentDays: 0,
        lateDays: 0,
        absentDays: 0
      })
    }
    
    const stats = employeeStats.get(employeeId)
    stats.totalDays++
    
    if (log.clockIn && log.clockOut) {
      stats.presentDays++
      
      // Check if late (after 9:00 AM)
      const clockInTime = new Date(log.clockIn).getHours()
      if (clockInTime >= 9) {
        stats.lateDays++
      }
    } else {
      stats.absentDays++
    }
  })

  // Generate CSV content
  let csv = 'Employee Name,Department,Total Days,Present Days,Late Days,Absent Days,Attendance Rate (%)\n'
  
  employeeStats.forEach(stats => {
    const attendanceRate = stats.totalDays > 0 
      ? ((stats.presentDays / stats.totalDays) * 100).toFixed(1)
      : '0'
    
    csv += `${stats.employeeName},${stats.department},${stats.totalDays},${stats.presentDays},${stats.lateDays},${stats.absentDays},${attendanceRate}\n`
  })

  return csv
}

async function generatePayrollReport(departmentId?: string, dateFrom?: string, dateTo?: string) {
  const whereClause: any = {}
  
  if (departmentId && departmentId !== 'all') {
    whereClause.employee = {
      departmentId: departmentId
    }
  }
  
  if (dateFrom && dateTo) {
    whereClause.payrollRun = {
      periodStart: {
        gte: new Date(dateFrom)
      },
      periodEnd: {
        lte: new Date(dateTo)
      }
    }
  }

  const payslips = await db.payslip.findMany({
    where: whereClause,
    include: {
      employee: {
        include: {
          department: true,
          user: {
            select: {
              name: true
            }
          }
        }
      },
      payrollRun: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Generate CSV content
  let csv = 'Employee Name,Department,Period,Base Salary,Overtime,Deductions,Net Salary,Status\n'
  
  payslips.forEach(payslip => {
    csv += `${payslip.employee.user.name},${payslip.employee.department.name},${payslip.payrollRun.periodStart} to ${payslip.payrollRun.periodEnd},${payslip.baseSalary},${payslip.overtimePay},${payslip.deductions},${payslip.netSalary},${payslip.status}\n`
  })

  return csv
}

async function generateLeaveReport(departmentId?: string, dateFrom?: string, dateTo?: string) {
  const whereClause: any = {}
  
  if (departmentId && departmentId !== 'all') {
    whereClause.employee = {
      departmentId: departmentId
    }
  }
  
  if (dateFrom && dateTo) {
    whereClause.startDate = {
      gte: new Date(dateFrom)
    }
    whereClause.endDate = {
      lte: new Date(dateTo)
    }
  }

  const leaveRequests = await db.leaveRequest.findMany({
    where: whereClause,
    include: {
      employee: {
        include: {
          department: true,
          user: {
            select: {
              name: true
            }
          }
        }
      },
      leaveType: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Get leave balances
  const leaveBalances = await db.leaveBalance.findMany({
    where: departmentId && departmentId !== 'all' ? {
      employee: {
        departmentId: departmentId
      }
    } : {},
    include: {
      employee: {
        include: {
          department: true,
          user: {
            select: {
              name: true
            }
          }
        }
      },
      leaveType: true
    }
  })

  // Generate CSV content
  let csv = 'Employee Name,Department,Leave Type,Total Days,Used Days,Remaining Days,Pending Requests\n'
  
  leaveBalances.forEach(balance => {
    const pendingRequests = leaveRequests.filter(lr => 
      lr.employeeId === balance.employeeId && 
      lr.leaveTypeId === balance.leaveTypeId &&
      lr.status === 'PENDING'
    ).length
    
    csv += `${balance.employee.user.name},${balance.employee.department.name},${balance.leaveType.name},${balance.totalDays},${balance.usedDays},${balance.remainingDays},${pendingRequests}\n`
  })

  return csv
}