import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.auditLog.deleteMany({})
  await prisma.notification.deleteMany({})
  await prisma.leaveApproval.deleteMany({})
  await prisma.payrollItem.deleteMany({})
  await prisma.payslip.deleteMany({})
  await prisma.payrollRun.deleteMany({})
  await prisma.leaveRequest.deleteMany({})
  await prisma.leaveBalance.deleteMany({})
  await prisma.leaveType.deleteMany({})
  await prisma.timesheet.deleteMany({})
  await prisma.attendanceLog.deleteMany({})
  await prisma.employment.deleteMany({})
  await prisma.employee.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.holiday.deleteMany({})
  await prisma.shift.deleteMany({})
  await prisma.workSchedule.deleteMany({})
  await prisma.jobLevel.deleteMany({})
  await prisma.jobTitle.deleteMany({})
  await prisma.department.deleteMany({})
  await prisma.location.deleteMany({})
  await prisma.company.deleteMany({})

  console.log('Creating new data...')

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
    },
  })

  // Create location
  const location = await prisma.location.create({
    data: {
      name: 'Jakarta HQ',
      companyId: company.id,
    },
  })

  // Create departments
  const engineeringDept = await prisma.department.create({
    data: {
      name: 'Engineering',
      locationId: location.id,
    },
  })

  const hrDept = await prisma.department.create({
    data: {
      name: 'Human Resources',
      locationId: location.id,
    },
  })

  // Create job titles
  const engineerTitle = await prisma.jobTitle.create({
    data: {
      name: 'Software Engineer',
    },
  })

  const hrTitle = await prisma.jobTitle.create({
    data: {
      name: 'HR Generalist',
    },
  })

  const managerTitle = await prisma.jobTitle.create({
    data: {
      name: 'Engineering Manager',
    },
  })

  // Create job levels
  const juniorLevel = await prisma.jobLevel.create({
    data: {
      name: 'Junior',
      rank: 1,
    },
  })

  const seniorLevel = await prisma.jobLevel.create({
    data: {
      name: 'Senior',
      rank: 2,
    },
  })

  const managerLevel = await prisma.jobLevel.create({
    data: {
      name: 'Manager',
      rank: 3,
    },
  })

  // Create work schedule
  const workSchedule = await prisma.workSchedule.create({
    data: {
      name: 'Standard 5-2',
      companyId: company.id,
      timezone: 'Asia/Jakarta',
    },
  })

  // Create shift
  await prisma.shift.create({
    data: {
      name: 'Regular Shift',
      scheduleId: workSchedule.id,
      startTime: '09:00',
      endTime: '18:00',
    },
  })

  // Create holidays
  await prisma.holiday.create({
    data: {
      companyId: company.id,
      date: '2025-01-01',
      name: "New Year's Day",
    },
  })

  await prisma.holiday.create({
    data: {
      companyId: company.id,
      date: '2025-08-17',
      name: 'Independence Day',
    },
  })

  // Create leave types
  const annualLeave = await prisma.leaveType.create({
    data: {
      companyId: company.id,
      name: 'Annual Leave',
      accrual: true,
      defaultDays: 12,
    },
  })

  const sickLeave = await prisma.leaveType.create({
    data: {
      companyId: company.id,
      name: 'Sick Leave',
      accrual: false,
      defaultDays: 12,
    },
  })

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      role: 'ADMIN',
    },
  })

  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@acme.com',
      role: 'HR',
    },
  })

  const manager1User = await prisma.user.create({
    data: {
      email: 'manager1@acme.com',
      role: 'MANAGER',
    },
  })

  const manager2User = await prisma.user.create({
    data: {
      email: 'manager2@acme.com',
      role: 'MANAGER',
    },
  })

  const employee1User = await prisma.user.create({
    data: {
      email: 'employee1@acme.com',
      role: 'EMPLOYEE',
    },
  })

  const employee2User = await prisma.user.create({
    data: {
      email: 'employee2@acme.com',
      role: 'EMPLOYEE',
    },
  })

  // Create employees
  const adminEmployee = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      companyId: company.id,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@acme.com',
      startDate: '2024-01-01T00:00:00Z',
      departmentId: hrDept.id,
      jobTitleId: managerTitle.id,
      jobLevelId: managerLevel.id,
    },
  })

  const hrEmployee = await prisma.employee.create({
    data: {
      userId: hrUser.id,
      companyId: company.id,
      firstName: 'HR',
      lastName: 'Manager',
      email: 'hr@acme.com',
      startDate: '2024-01-01T00:00:00Z',
      departmentId: hrDept.id,
      jobTitleId: hrTitle.id,
      jobLevelId: seniorLevel.id,
    },
  })

  const manager1Employee = await prisma.employee.create({
    data: {
      userId: manager1User.id,
      companyId: company.id,
      firstName: 'Engineering',
      lastName: 'Manager',
      email: 'manager1@acme.com',
      startDate: '2024-01-01T00:00:00Z',
      departmentId: engineeringDept.id,
      jobTitleId: managerTitle.id,
      jobLevelId: managerLevel.id,
    },
  })

  const manager2Employee = await prisma.employee.create({
    data: {
      userId: manager2User.id,
      companyId: company.id,
      firstName: 'Senior',
      lastName: 'Manager',
      email: 'manager2@acme.com',
      startDate: '2024-01-01T00:00:00Z',
      departmentId: engineeringDept.id,
      jobTitleId: managerTitle.id,
      jobLevelId: managerLevel.id,
    },
  })

  const employee1 = await prisma.employee.create({
    data: {
      userId: employee1User.id,
      companyId: company.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'employee1@acme.com',
      startDate: '2024-01-01T00:00:00Z',
      departmentId: engineeringDept.id,
      jobTitleId: engineerTitle.id,
      jobLevelId: juniorLevel.id,
      managerId: manager1Employee.id,
    },
  })

  const employee2 = await prisma.employee.create({
    data: {
      userId: employee2User.id,
      companyId: company.id,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'employee2@acme.com',
      startDate: '2024-01-01T00:00:00Z',
      departmentId: engineeringDept.id,
      jobTitleId: engineerTitle.id,
      jobLevelId: seniorLevel.id,
      managerId: manager2Employee.id,
    },
  })

  // Create employment records
  const employees = [adminEmployee, hrEmployee, manager1Employee, manager2Employee, employee1, employee2]
  
  for (const employee of employees) {
    await prisma.employment.create({
      data: {
        employeeId: employee.id,
        type: 'FULLTIME',
        baseSalary: employee.jobLevelId === juniorLevel.id ? 5000000 : 
                   employee.jobLevelId === seniorLevel.id ? 8000000 : 15000000,
        paySchedule: 'MONTHLY',
        bankAccount: '****1234',
      },
    })
  }

  // Create leave balances for current year
  const currentYear = new Date().getFullYear()
  const periodStart = `${currentYear}-01-01`
  const periodEnd = `${currentYear}-12-31`

  for (const employee of employees) {
    await prisma.leaveBalance.create({
      data: {
        employeeId: employee.id,
        leaveTypeId: annualLeave.id,
        balanceDays: 12,
        periodStart,
        periodEnd,
      },
    })

    await prisma.leaveBalance.create({
      data: {
        employeeId: employee.id,
        leaveTypeId: sickLeave.id,
        balanceDays: 12,
        periodStart,
        periodEnd,
      },
    })
  }

  // Create a sample payroll run for current month
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  const payrollRun = await prisma.payrollRun.create({
    data: {
      companyId: company.id,
      period: currentMonth,
      status: 'DRAFT',
    },
  })

  // Create sample attendance logs for the last 30 days
  const today = new Date()
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    for (const employee of employees) {
      // Random attendance data
      const isPresent = Math.random() > 0.1 // 90% attendance rate
      
      if (isPresent) {
        // Create clock in event
        const clockIn = new Date(date)
        clockIn.setHours(8 + Math.floor(Math.random() * 2))
        clockIn.setMinutes(Math.floor(Math.random() * 60))
        
        await prisma.attendanceLog.create({
          data: {
            employeeId: employee.id,
            eventTime: clockIn,
            type: 'CLOCK_IN',
            notes: 'Morning clock in',
          },
        })
        
        // Create clock out event
        const clockOut = new Date(date)
        clockOut.setHours(17 + Math.floor(Math.random() * 2))
        clockOut.setMinutes(Math.floor(Math.random() * 60))
        
        await prisma.attendanceLog.create({
          data: {
            employeeId: employee.id,
            eventTime: clockOut,
            type: 'CLOCK_OUT',
            notes: 'Evening clock out',
          },
        })
      }
    }
  }

  // Create sample leave requests
  const leaveRequests = [
    {
      employee: employee1,
      leaveType: annualLeave,
      startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
      reason: 'Family vacation',
      status: 'PENDING'
    },
    {
      employee: employee2,
      leaveType: sickLeave,
      startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      reason: 'Medical checkup',
      status: 'APPROVED'
    },
    {
      employee: manager1Employee,
      leaveType: annualLeave,
      startDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      endDate: new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
      reason: 'Personal time off',
      status: 'PENDING'
    }
  ]

  for (const request of leaveRequests) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: request.employee.id,
        leaveTypeId: request.leaveType.id,
        startDate: request.startDate.toISOString().split('T')[0],
        endDate: request.endDate.toISOString().split('T')[0],
        days: 3, // Calculate business days between start and end
        reason: request.reason,
        status: request.status as any, // Cast to satisfy TypeScript
      },
    })
  }

  // Create sample payslips
  for (const employee of employees) {
    const employment = await prisma.employment.findFirst({
      where: { employeeId: employee.id }
    })
    
    if (employment) {
      // Calculate some sample values
      const baseSalaryNum = Number(employment.baseSalary)
      const overtimePay = Math.random() > 0.5 ? Math.floor(Math.random() * 2000000) : 0
      const grossPay = baseSalaryNum + overtimePay
      const deductions = Math.floor(grossPay * 0.05) // 5% deductions
      const netPay = grossPay - deductions
      
      await prisma.payslip.create({
        data: {
          employeeId: employee.id,
          payrollRunId: payrollRun.id,
          grossPay,
          deductions,
          netPay,
        },
      })
    }
  }

  // Create sample timesheets for current month
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i)
    
    // Skip weekends and future dates
    if (date.getDay() === 0 || date.getDay() === 6 || date > today) continue
    
    for (const employee of employees) {
      const workHours = 8 + (Math.random() - 0.5) * 2 // 7-9 hours
      const overtime = Math.random() > 0.7 ? Math.random() * 3 : 0 // Random overtime
      
      await prisma.timesheet.create({
        data: {
          employeeId: employee.id,
          date: date.toISOString().split('T')[0],
          workHours,
          overtime,
          status: 'POSTED',
        },
      })
    }
  }

  console.log('Database seeded successfully!')
  console.log('Demo users:')
  console.log('Admin: admin@acme.com (ADMIN)')
  console.log('HR: hr@acme.com (HR)')
  console.log('Manager1: manager1@acme.com (MANAGER)')
  console.log('Manager2: manager2@acme.com (MANAGER)')
  console.log('Employee1: employee1@acme.com (EMPLOYEE)')
  console.log('Employee2: employee2@acme.com (EMPLOYEE)')
  console.log('')
  console.log('Sample data created:')
  console.log('- Attendance logs for the last 30 days')
  console.log('- Leave requests (pending and approved)')
  console.log('- Payslips for current month')
  console.log('- Timesheets for current month')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })