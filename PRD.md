Great—here’s a comprehensive, **LLM-friendly PRD** for the Small Business HR app you outlined (Next.js + Tailwind + PostgreSQL + Prisma). It’s written to be **directly consumable by code-gen tools**: explicit entities, routes, rules, and acceptance criteria.
---
# Product Requirements Document (PRD)
**Product:** Small Business HR (SBHR)
**Tech:** Next.js (App Router), Tailwind CSS, PostgreSQL, Prisma
**Timezone:** Asia/Jakarta (default)
**RBAC Roles:** `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`
## 1. Product Overview
A lightweight HR system for SMEs (≤200 employees) covering:
* **People management** (org + employee profiles)
* **Attendance** (clock in/out, daily timesheets)
* **Leave** (policies, balances, requests & approvals)
* **Payroll (simple)** (monthly runs, items, payslips, exports)
* **Reports** (headcount, leave, attendance, payroll)
* **Self-service** for employees
* **Admin** (users, roles, approvals, notifications)
### 1.1 Goals
* Be usable in <1 day with sensible defaults.
* Minimize manual work (auto-recalc timesheets, accruals, payroll drafts).
* Clean separation between master data, transactions, and reporting.
### 1.2 Non-Goals (Phase-2 or later)
* Complex tax engines, multi-currency payroll, performance reviews, recruiting pipelines.
* Native mobile apps (PWA only in MVP).
* Biometric hardware integration.
---
## 2. Personas & Roles
* **ADMIN:** Full control (settings, users, companies, billing if any).
* **HR:** Manages org, employees, schedules, leave, payroll, reports.
* **MANAGER:** Approves leave/timesheets for direct reports, views team metrics.
* **EMPLOYEE:** Self-service (profile, clock, leave requests, payslips).
---
## 3. Information Architecture (Navigation)
```
/dashboard
/master
/companies
/locations
/departments
/job-titles
/job-levels
/work-rules/schedules
/work-rules/shifts
/work-rules/holidays
/compensation/pay-grades
/compensation/earning-types
/compensation/deduction-types
/people/employees
/people/employees/[id] (tabs: overview | employment | documents | attendance | leave | payroll)
/attendance/clock
/attendance/timesheets
/attendance/overtime (optional v2)
/leave/types
/leave/balances
/leave/requests
/payroll/runs
/payroll/runs/[id]
/payroll/payslips
/self/profile
/self/attendance
/self/leave
/self/payslips
/reports (summary pages with export CSV)
/admin/users
/admin/roles
/admin/approvals
/admin/notifications
```
---
## 4. Functional Requirements
### 4.1 Dashboard
* **Shows (role-aware):** today’s attendance, pending approvals, leave calendar, payroll status, announcements.
* **Filters:** company, location, department (where applicable).
### 4.2 Master Data
* **Organization:** Company, Location, Department, Job Title, Job Level.
* **Work Rules:** Work Schedule (e.g., 5-2), Shifts (start/end), Holidays (per company).
* **Compensation:** Pay Grade, Earning Types, Deduction Types (flat or percentage).
* **Constraints:** Names unique per company scope; cannot delete if referenced.
### 4.3 People
* Create/Read/Update employees; link to `User` (auth).
* Employment details: type, base salary, pay schedule, bank account.
* Upload/view documents (optional stubs).
* Termination sets `endDate` and stops accruals.
### 4.4 Attendance
* **Clock In/Out:** web button; one open session at a time.
* **Logs → Timesheet:** nightly job aggregates logs per day.
* **Corrections:** employee submits; manager approves.
* **Holidays:** auto-exclude from work hours.
### 4.5 Leave
* **Types:** paid/unpaid, default annual days, accrual toggle.
* **Balances:** tracked per employee/type & period.
* **Requests:** start/end date, days auto-calc (exclude holidays), single-level approval (MVP).
* **Status flow:** `DRAFT → PENDING → APPROVED/REJECTED → CANCELED`.
### 4.6 Payroll (Simple)
* **Run:** monthly per company (`period="YYYY-MM"`).
* **Items:** earnings (e.g., base, allowances), deductions (e.g., absence penalty).
* **Payslips:** gross, deductions, net; publish to employee portal.
* **Status flow:** `DRAFT → LOCKED → PAID`.
* **Exports:** CSV bank instructions and summary.
### 4.7 Reports
* Headcount & turnover, attendance summary, leave utilization, payroll summary.
* CSV export everywhere.
### 4.8 Admin
* Users & RBAC mapping to employees.
* Approval settings (single approver in MVP).
* Notification channels (email stub/web).
---
## 5. Data Model (Authoritative)
### 5.1 Enums
```
UserRole: ADMIN | HR | MANAGER | EMPLOYEE
EmploymentType: FULLTIME | PARTTIME | CONTRACT | INTERN
AttendanceType: CLOCK_IN | CLOCK_OUT
LeaveStatus: DRAFT | PENDING | APPROVED | REJECTED | CANCELED
PayrollRunStatus: DRAFT | LOCKED | PAID
PayrollItemType: EARNING | DEDUCTION
TimesheetStatus: DRAFT | POSTED | APPROVED
```
### 5.2 Entities (Prisma-style fields)
**User**
* `id (cuid, pk)`
* `email (unique)`, `hashedPwd`
* `role (UserRole, default EMPLOYEE)`
* `employeeId (nullable, unique)`
**Company**
* `id (cuid)`, `name`
* relationships: locations, employees, work rules, payroll runs
**Location**
* `id`, `companyId`, `name`
**Department**
* `id`, `locationId`, `name`
**JobTitle**
* `id`, `name (unique)`
**JobLevel**
* `id`, `name (unique)`, `rank (int)`
**Employee**
* `id`, `userId?`, `companyId`, `departmentId?`, `jobTitleId?`, `jobLevelId?`
* `firstName`, `lastName`, `email (unique)`, `phone?`
* `startDate`, `endDate?`
* `employment (1:1)`
**Employment**
* `id`, `employeeId (unique)`
* `type (EmploymentType)`
* `baseSalary (decimal(12,2))`
* `payGrade?`, `paySchedule?` (e.g., monthly)
* `bankAccount?`
**WorkSchedule**
* `id`, `companyId`, `name`, `timezone`
**Shift**
* `id`, `scheduleId`, `name`, `startTime (time)`, `endTime (time)`
**Holiday**
* `id`, `companyId`, `date`, `name`
**AttendanceLog**
* `id`, `employeeId`, `eventTime (timestamp tz)`, `type (AttendanceType)`, `notes?`, `source?`
**Timesheet**
* `id`, `employeeId`, `date (date)`, `workHours (dec 5,2)`, `overtime (dec 5,2)`, `status (TimesheetStatus)`
* unique (`employeeId`, `date`)
**LeaveType**
* `id`, `companyId`, `name`, `accrual (bool)`, `defaultDays (int)`
**LeaveBalance**
* `id`, `employeeId`, `leaveTypeId`, `balanceDays (dec 5,2)`, `periodStart (date)`, `periodEnd (date)`
* unique (`employeeId`,`leaveTypeId`,`periodStart`,`periodEnd`)
**LeaveRequest**
* `id`, `employeeId`, `leaveTypeId`, `startDate`, `endDate`, `days (dec 5,2)`, `reason?`, `status (LeaveStatus)`, `approverId?`
**PayrollRun**
* `id`, `companyId`, `period (YYYY-MM string)`, `status (PayrollRunStatus)`
* unique (`companyId`,`period`)
**PayrollItem**
* `id`, `payrollRunId`, `employeeId`, `name`, `type (PayrollItemType)`, `amount (dec 12,2)`
**Payslip**
* `id`, `payrollRunId`, `employeeId`, `grossPay`, `deductions`, `netPay`, `publishedAt?`, `paidAt?`
**AuditLog (recommended)**
* `id`, `actorUserId`, `action`, `entity`, `entityId`, `before?`, `after?`, `createdAt`
> **Note:** Use `timestamp with time zone` everywhere for instants; store dates without time where appropriate (timesheet.date).
---
## 6. Core Business Rules
### 6.1 Attendance
* One **open** clock session at a time: must `CLOCK_OUT` before next `CLOCK_IN`.
* Timesheet aggregation job runs nightly 01:00 local:
`workHours = sum(clock pairs duration) - unpaid breaks (future)`; holidays excluded.
* Late/Early optional: computed from assigned shift.
### 6.2 Leave
* Days auto-calculated as **business days** excluding holidays; half-day not in MVP.
* Approval: **manager of employee** (derived from org or explicit approverId).
* Approved leave locks the date range for attendance (no clock expected those days).
* Cancel only if `APPROVED` and start date ≥ today; adjust balances back.
### 6.3 Payroll (Simple)
* Run is per company & month.
* Items include: **base salary prorated** if employee start/end within period (MVP: linear by working days).
* Net = sum(EARNING) − sum(DEDUCTION).
* `LOCKED` prevents item edits; `PAID` requires `paidAt` and freezes payslips.
### 6.4 RBAC & Data Access
* Employee sees **only their** data & payslips.
* Manager sees direct reports.
* HR/ADMIN see company data scoped to their company (multi-tenant support optional).
---
## 7. Validation Rules (Non-exhaustive)
* Names: 2–80 chars; emails valid + unique.
* Dates: `startDate ≤ endDate`. Leave `startDate ≥ today` unless HR override.
* Payroll period string regex: `^\d{4}-(0[1-9]|1[0-2])$`.
* Monetary decimals: max 2 fraction digits.
* Attendance: reject CLOCK\_IN if last event is open `CLOCK_IN`.
---
## 8. API Surface (for server actions or REST—LLM can choose)
> Path prefixes mirror App Router segments. All endpoints are **role-protected**.
### 8.1 People
* `POST /api/people/employees` → create
* `GET /api/people/employees?companyId&query&page`
* `GET /api/people/employees/:id`
* `PATCH /api/people/employees/:id`
* `POST /api/people/employees/:id/terminate` → sets `endDate`
### 8.2 Attendance
* `POST /api/attendance/clock` body: `{ type: "CLOCK_IN"|"CLOCK_OUT", notes? }`
* `GET /api/attendance/timesheets?employeeId&from&to`
* `POST /api/attendance/corrections` (MVP optional)
### 8.3 Leave
* `GET /api/leave/types?companyId`
* `POST /api/leave/requests`
* `PATCH /api/leave/requests/:id` (submit/cancel)
* `POST /api/leave/requests/:id/approve`
* `POST /api/leave/requests/:id/reject`
### 8.4 Payroll
* `POST /api/payroll/runs` body: `{ companyId, period }`
* `POST /api/payroll/runs/:id/generate` (create items, draft payslips)
* `POST /api/payroll/runs/:id/lock`
* `POST /api/payroll/runs/:id/publish-payslips`
* `POST /api/payroll/runs/:id/mark-paid`
* `GET /api/payroll/payslips?employeeId&period`
### 8.5 Reports
* `GET /api/reports/attendance-summary?from&to&deptId`
* `GET /api/reports/leave-usage?period`
* `GET /api/reports/payroll-summary?period`
---
## 9. UI/UX Requirements
* Tailwind components; forms with inline validation messages.
* Tables with: search, pagination, CSV export.
* Date pickers default to **Asia/Jakarta**.
* Role-aware navigation (hide unauthorized menus).
* **Self-service** pages are simplified and mobile-friendly.
---
## 10. Background Jobs (Cron)
* **Timesheet Aggregation:** daily 01:00 local.
* **Leave Accrual (if accrual=true):** monthly 00:30 on period start—add `defaultDays/12`.
* **Payroll Draft Generation:** manual action (not auto) for transparency.
---
## 11. Notifications (MVP)
* **Email/Web**:
* Leave submitted → notify approver.
* Leave approved/rejected → notify employee.
* Payslip published → notify employee.
* Provide stub sender; real SMTP integration optional.
---
## 12. Security & Privacy
* Server-side RBAC guard on every action.
* Protect PII (mask bank account in UI except last 4).
* AuditLog for all **write** actions (who, what, when).
* Rate-limit clock endpoint to avoid spam.
---
## 13. Seed Data (for demo/dev)
* 1 company (e.g., “Acme”)
* Locations (Jakarta HQ), Departments (Engineering, HR)
* Job Titles/Levels (Engineer, HR Generalist)
* WorkSchedule (“Standard 5-2”), default Shift (09:00–18:00)
* Holidays (New Year’s Day)
* 6 demo employees: 1 Admin, 1 HR, 2 Managers, 2 Employees
* LeaveTypes: Annual (12), Sick (12, non-accrual)
* One PayrollRun for current month (DRAFT)
---
## 14. Acceptance Criteria (Key Modules)
### 14.1 People
* [ ] HR can create an employee with required fields; duplicate email rejected.
* [ ] Terminating sets `endDate` and blocks future attendance & payroll inclusion after end.
* [ ] Employee profile page shows tabs and data loads under 500ms on local dev.
### 14.2 Attendance
* [ ] When employee **CLOCK\_IN**, if last event is open, request is rejected with clear error.
* [ ] Nightly job aggregates logs into a Timesheet with `workHours` in hours (2 decimals).
* [ ] Holidays on the date result in `workHours = 0` by default.
* [ ] Employee can view their last 30 days of timesheets.
### 14.3 Leave
* [ ] Creating a leave request auto-calculates `days` excluding weekends/holidays.
* [ ] Manager can approve; status transitions valid only as defined.
* [ ] Cancel allowed only if `startDate ≥ today` and status `APPROVED`.
* [ ] Approved leave surfaces on employee profile and dashboard calendar.
### 14.4 Payroll
* [ ] Creating `PayrollRun(period="YYYY-MM")` enforces uniqueness per company.
* [ ] Generating items includes base salary prorated by **working days present in period**.
* [ ] Locking a run disables editing items; publishing creates payslips with **netPay**.
* [ ] Marking paid sets `paidAt` and status `PAID`; payslips visible in Self-service.
### 14.5 Reports
* [ ] Attendance summary export produces a valid CSV with `employeeId, date, hours`.
* [ ] Payroll summary export includes `gross, deductions, net` totals.
### 14.6 Admin/RBAC
* [ ] Employees cannot access another employee’s payslip via URL (server check).
* [ ] Managers see only their direct reports (seed a simple manager mapping).
* [ ] HR sees all employees within their company.
---
## 15. Error Handling (Standardized)
* 4xx errors include `code`, `message`, `field?`.
* Examples:
* `ATTENDANCE_OPEN_SESSION`: “You must clock out before clocking in again.”
* `LEAVE_INVALID_RANGE`: “Start date must be before end date.”
* `PAYROLL_LOCKED`: “Run is locked and cannot be modified.”
---
## 16. Internationalization & Time
* Store instants in UTC; render in **Asia/Jakarta**.
* Dates (leave/timesheets) use `date` columns; conversions must be precise across midnight.
---
## 17. LLM Implementation Notes (Code-Gen Hints)
* **Stack:** Next.js App Router + Server Actions; Prisma Client; Zod schemas; Tailwind UI.
* **Folder Structure:**
```
src/
app/(protected)/...pages
app/api/...routes
lib/db.ts (Prisma client)
lib/auth.ts (RBAC helpers)
lib/cron.ts (job triggers)
components/ui/* (table, form, modal)
domain/* (attendance.ts, leave.ts, payroll.ts) // business rules
prisma/schema.prisma
```
* **Naming Conventions:** camelCase in TS, snake\_case in SQL (Prisma handles mapping).
* **Transactions:** use `prisma.$transaction` for payroll generation & leave approval.
* **Guards:** `requireRole(…)`, `requireSelfOrManager(…)`.
* **Testing:** add unit tests for calc functions (timesheet hours, leave days, payroll net).
---
## 18. Example Calculations
### 18.1 Timesheet
* Pairs: `(in1,out1), (in2,out2)…` → sum durations in hours (2 decimals).
* If `Holiday(date)=true` ⇒ `workHours=0` (MVP).
### 18.2 Leave Days
* `days = businessDays(startDate,endDate) – holidaysWithinRange`.
### 18.3 Payroll Proration (MVP)
* **WorkingDaysInMonth** = business days excluding holidays.
* **EmployeeActiveDays** = working days between `max(startDate, periodStart)` and `min(endDate||∞, periodEnd)`.
* **ProratedBase** = `baseSalary * (EmployeeActiveDays / WorkingDaysInMonth)`.
---
## 19. Out-of-Scope (MVP)
* Multi-currency; tax compliance; progressive accrual rules; half-day leave.
* Multi-level approvals; geofencing/face-ID; biometric devices.
* Advanced performance & recruiting.
---
## 20. Milestones
* **MVP (2–3 sprints):** Org + People, Attendance + Timesheet, Leave (single approver), Payroll simple, Reports CSV, RBAC, Audit log.
* **Phase 2:** Overtime, corrections workflow, multi-approval, PWA clock, richer payroll rules, assets/expenses.
---
## 21. Minimal Prisma Schema (Starter)
> This is a compact starter; the LLM can expand with indices & relations exactly as in §5.
```prisma
enum UserRole { ADMIN HR MANAGER EMPLOYEE }
enum EmploymentType { FULLTIME PARTTIME CONTRACT INTERN }
enum AttendanceType { CLOCK_IN CLOCK_OUT }
enum LeaveStatus { DRAFT PENDING APPROVED REJECTED CANCELED }
enum PayrollRunStatus { DRAFT LOCKED PAID }
enum TimesheetStatus { DRAFT POSTED APPROVED }
enum PayrollItemType { EARNING DEDUCTION }
model User {
id String @id @default(cuid())
email String @unique
hashedPwd String?
role UserRole @default(EMPLOYEE)
employee Employee?
createdAt DateTime @default(now())
}
model Company {
id String @id @default(cuid())
name String
locations Location[]
employees Employee[]
payroll PayrollRun[]
holidays Holiday[]
}
model Location {
id String @id @default(cuid())
company Company @relation(fields: [companyId], references: [id])
companyId String
name String
departments Department[]
}
model Department {
id String @id @default(cuid())
location Location @relation(fields: [locationId], references: [id])
locationId String
name String
employees Employee[]
}
model JobTitle { id String @id @default(cuid()) name String @unique employees Employee[] }
model JobLevel { id String @id @default(cuid()) name String @unique rank Int employees Employee[] }
model Employee {
id String @id @default(cuid())
user User? @relation(fields: [userId], references: [id])
userId String? @unique
company Company @relation(fields: [companyId], references: [id])
companyId String
department Department? @relation(fields: [departmentId], references: [id])
departmentId String?
jobTitle JobTitle? @relation(fields: [jobTitleId], references: [id])
jobTitleId String?
jobLevel JobLevel? @relation(fields: [jobLevelId], references: [id])
jobLevelId String?
firstName String
lastName String
email String @unique
phone String?
startDate DateTime
endDate DateTime?
employment Employment?
attendance AttendanceLog[]
leaves LeaveRequest[]
payslips Payslip[]
}
model Employment {
id String @id @default(cuid())
employee Employee @relation(fields: [employeeId], references: [id])
employeeId String @unique
type EmploymentType
baseSalary Decimal @db.Decimal(12,2)
payGrade String?
paySchedule String?
bankAccount String?
}
model WorkSchedule {
id String @id @default(cuid())
company Company @relation(fields: [companyId], references: [id])
companyId String
name String
timezone String
shifts Shift[]
}
model Shift {
id String @id @default(cuid())
schedule WorkSchedule @relation(fields: [scheduleId], references: [id])
scheduleId String
name String
startTime DateTime
endTime DateTime
}
model Holiday {
id String @id @default(cuid())
company Company @relation(fields: [companyId], references: [id])
companyId String
date DateTime
name String
}
model AttendanceLog {
id String @id @default(cuid())
employee Employee @relation(fields: [employeeId], references: [id])
employeeId String
eventTime DateTime
type AttendanceType
notes String?
source String?
}
model Timesheet {
id String @id @default(cuid())
employee Employee @relation(fields: [employeeId], references: [id])
employeeId String
date DateTime
workHours Decimal @db.Decimal(5,2)
overtime Decimal @db.Decimal(5,2)
status TimesheetStatus @default(POSTED)
@@unique([employeeId, date])
}
model LeaveType {
id String @id @default(cuid())
company Company @relation(fields: [companyId], references: [id])
companyId String
name String
accrual Boolean @default(true)
defaultDays Int @default(12)
}
model LeaveBalance {
id String @id @default(cuid())
employee Employee @relation(fields: [employeeId], references: [id])
employeeId String
leaveType LeaveType @relation(fields: [leaveTypeId], references: [id])
leaveTypeId String
balanceDays Decimal @db.Decimal(5,2)
periodStart DateTime
periodEnd DateTime
@@unique([employeeId, leaveTypeId, periodStart, periodEnd])
}
model LeaveRequest {
id String @id @default(cuid())
employee Employee @relation(fields: [employeeId], references: [id])
employeeId String
leaveType LeaveType @relation(fields: [leaveTypeId], references: [id])
leaveTypeId String
startDate DateTime
endDate DateTime
days Decimal @db.Decimal(5,2)
reason String?
status LeaveStatus @default(PENDING)
approverId String?
}
model PayrollRun {
id String @id @default(cuid())
company Company @relation(fields: [companyId], references: [id])
companyId String
period String
status PayrollRunStatus @default(DRAFT)
items PayrollItem[]
payslips Payslip[]
@@unique([companyId, period])
}
model PayrollItem {
id String @id @default(cuid())
payrollRun PayrollRun @relation(fields: [payrollRunId], references: [id])
payrollRunId String
employee Employee @relation(fields: [employeeId], references: [id])
employeeId String
name String
type PayrollItemType
amount Decimal @db.Decimal(12,2)
}
model Payslip {
id String @id @default(cuid())
payrollRun PayrollRun @relation(fields: [payrollRunId], references: [id])
payrollRunId String
employee Employee @relation(fields: [employeeId], references: [id])
employeeId String
grossPay Decimal @db.Decimal(12,2)
deductions Decimal @db.Decimal(12,2)
netPay Decimal @db.Decimal(12,2)
publishedAt DateTime?
paidAt DateTime?
}
model AuditLog {
id String @id @default(cuid())
actorUserId String
action String
entity String
entityId String
before Json?
after Json?
createdAt DateTime @default(now())
}
```
---
## 22. Test Scenarios (Gherkin-style samples)
**Attendance single open session**
```
Given employee E has CLOCK_IN at 09:00 and no CLOCK_OUT
When E attempts to CLOCK_IN at 13:00
Then the request is rejected with code ATTENDANCE_OPEN_SESSION
```
**Leave auto days**
```
Given company C has a holiday on 2025-08-17
When employee requests leave from 2025-08-15 to 2025-08-19
Then calculated days exclude weekend and holiday
And result days = businessDays(15..19) - 1 holiday
```
**Payroll lock**
```
Given payroll run R is LOCKED
When HR tries to add a PayrollItem
Then the request is rejected with code PAYROLL_LOCKED
```
---
## 23. Deliverables for MVP (Definition of Done)
* All routes/pages listed in §3 exist and are role-gated.
* Prisma migrations run clean; seed script provisions demo data.
* Clock, Leave, Payroll flows pass acceptance criteria in §14.
* Exports (CSV) available for each report page.
* AuditLog records all write operations with before/after snapshots.