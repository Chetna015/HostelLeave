# Hostel Leave Management System

This is a complete hostel leave management platform built with Next.js, Prisma, PostgreSQL on Neon, Tailwind CSS, and JWT authentication. The system covers the full workflow from student registration to parent verification, warden approval, and final leave pass generation.

If you are new to the project, the most important idea is this: a leave request is not approved in one step. It moves through a chain of roles and checks.

1. A student creates an account and profile.
2. The student submits a leave request.
3. The parent verifies the request using a token, OTP, selfie, and signature.
4. The admin or warden reviews and approves the request.
5. The student downloads the final leave pass.

## What This Project Does

The application supports:

- Student registration and login with JWT sessions.
- Student dashboard with leave history, profile data, notifications, and request statistics.
- Leave request submission with destination, dates, transport mode, emergency contact, and reason.
- Parent verification using a secure approval link, OTP verification, selfie upload, and digital signature.
- Admin or warden approval and rejection workflow.
- Leave pass generation as a PDF-like downloadable output for gate verification.
- Relational data storage through Prisma and Neon PostgreSQL.
- Separate portals for student, parent, and admin roles.

## Beginner Overview

If you are learning how the system works, here are the key concepts.

### 1. Next.js App Router

This project uses the Next.js App Router, which means pages live in the `app/` folder. Each folder can contain a page, route handler, or shared layout.

Example pages:

- [app/register/page.tsx](app/register/page.tsx)
- [app/login/page.tsx](app/login/page.tsx)
- [app/dashboard/student/page.tsx](app/dashboard/student/page.tsx)
- [app/dashboard/admin/page.tsx](app/dashboard/admin/page.tsx)

### 2. API Routes

Backend logic is implemented inside route handlers in `app/api/...`. These routes create users, save requests, verify parents, and approve leave.

### 3. Prisma ORM

Prisma is the database layer. It maps TypeScript models to PostgreSQL tables and helps the app read and write data safely.

### 4. Neon PostgreSQL

Neon is the production database. This project uses:

- `DATABASE_URL` for the runtime app connection.
- `DIRECT_DATABASE_URL` for migrations and direct schema changes.

### 5. JWT Authentication

When a user logs in, the server returns a signed token. The token is used to protect routes and identify the user.

### 6. Multi-step Parent Verification

The parent approval flow is intentionally strict. It uses a token and OTP to prevent unauthorized approval, then records selfie and signature evidence.

### 7. Role-based Access

Students, parents, and admins see different screens and have different permissions.

## Complete End-to-End Flow

### Student Registration

The journey starts on [app/register/page.tsx](app/register/page.tsx).

The registration form creates:

- a `User` record
- a `StudentProfile` record
- a `ParentProfile` record

The backend route is [app/api/auth/register/route.ts](app/api/auth/register/route.ts).

What the student typically provides:

- email and password
- full name
- father name
- course and branch
- roll number
- hostel room number
- student mobile number
- parent mobile number
- parent email
- ID card upload and selfie upload if enabled in the form

### Student Login

The student signs in at [app/login/page.tsx](app/login/page.tsx).

The backend route is [app/api/auth/login/route.ts](app/api/auth/login/route.ts).

After successful login, the student lands on [app/dashboard/student/page.tsx](app/dashboard/student/page.tsx).

### Leave Request Submission

The student opens [app/dashboard/student/apply-leave/page.tsx](app/dashboard/student/apply-leave/page.tsx) and submits a request.

This creates a `LeaveRequest` record through [app/api/leave/apply/route.ts](app/api/leave/apply/route.ts).

The request stores:

- leave type
- reason
- destination address
- departure date and time
- return date
- emergency contact
- transport mode
- parent verification state
- warden approval state

### Parent Verification

The system sends a verification message after the request is created.

The parent can use either:

- the approval link sent by email, or
- the fallback portal at [app/parent/page.tsx](app/parent/page.tsx)

The verification page is [app/approve/leave/[id]/page.tsx](app/approve/leave/[id]/page.tsx).

The parent verification API is [app/api/parent/verification/route.ts](app/api/parent/verification/route.ts).

This step usually includes:

- token validation
- OTP send and verify
- selfie capture or upload
- signature capture
- storing parent verification timestamps and metadata

### Admin or Warden Approval

After the parent approves the request, the admin can review it in the admin portal.

Main admin pages:

- [app/admin/login/page.tsx](app/admin/login/page.tsx)
- [app/admin/register/page.tsx](app/admin/register/page.tsx)
- [app/dashboard/admin/page.tsx](app/dashboard/admin/page.tsx)
- [app/dashboard/admin/requests/page.tsx](app/dashboard/admin/requests/page.tsx)

The core approval endpoint is [app/api/admin/leave-requests/[id]/route.ts](app/api/admin/leave-requests/[id]/route.ts).

### Leave Pass Generation

Once the request is fully approved, the student can open [app/leave-pass/[id]/page.tsx](app/leave-pass/[id]/page.tsx).

The data source behind this view is [app/api/leave-pass/[id]/route.ts](app/api/leave-pass/[id]/route.ts).

This pass includes the student and approval details needed for gate verification.

## Main Pages

- [app/register/page.tsx](app/register/page.tsx) – student signup
- [app/login/page.tsx](app/login/page.tsx) – student login
- [app/parent/page.tsx](app/parent/page.tsx) – parent fallback portal
- [app/approve/leave/[id]/page.tsx](app/approve/leave/[id]/page.tsx) – parent approval screen
- [app/dashboard/student/page.tsx](app/dashboard/student/page.tsx) – student dashboard
- [app/dashboard/student/apply-leave/page.tsx](app/dashboard/student/apply-leave/page.tsx) – leave form
- [app/leave-pass/[id]/page.tsx](app/leave-pass/[id]/page.tsx) – final leave pass page
- [app/admin/login/page.tsx](app/admin/login/page.tsx) – admin login
- [app/admin/register/page.tsx](app/admin/register/page.tsx) – admin registration
- [app/dashboard/admin/page.tsx](app/dashboard/admin/page.tsx) – admin dashboard
- [app/dashboard/admin/requests/page.tsx](app/dashboard/admin/requests/page.tsx) – leave request review list
- [app/dashboard/admin/users/page.tsx](app/dashboard/admin/users/page.tsx) – student records
- [app/dashboard/admin/analytics/page.tsx](app/dashboard/admin/analytics/page.tsx) – analytics view

## API Routes

### Authentication APIs

- [app/api/auth/register/route.ts](app/api/auth/register/route.ts) – create student, parent, and profile records.
- [app/api/auth/login/route.ts](app/api/auth/login/route.ts) – authenticate student users.
- [app/api/admin/register/route.ts](app/api/admin/register/route.ts) – create admin users.
- [app/api/admin/login/route.ts](app/api/admin/login/route.ts) – authenticate admin users.

### Student APIs

- [app/api/student/dashboard/route.ts](app/api/student/dashboard/route.ts) – dashboard summary, history, and notifications.
- [app/api/student/leave-requests/[id]/route.ts](app/api/student/leave-requests/[id]/route.ts) – fetch a student-owned request.

### Leave and Verification APIs

- [app/api/leave/apply/route.ts](app/api/leave/apply/route.ts) – create leave requests.
- [app/api/parent/verification/route.ts](app/api/parent/verification/route.ts) – validate parent approval and OTP flow.
- [app/api/leave-pass/[id]/route.ts](app/api/leave-pass/[id]/route.ts) – return data for the final pass.

### Admin APIs

- [app/api/admin/summary/route.ts](app/api/admin/summary/route.ts) – totals and status counts.
- [app/api/admin/students/route.ts](app/api/admin/students/route.ts) – student list.
- [app/api/admin/profile/route.ts](app/api/admin/profile/route.ts) – admin profile data.
- [app/api/admin/leave-requests/[id]/route.ts](app/api/admin/leave-requests/[id]/route.ts) – approve or reject a request.
- [app/api/admin/leave-requests/route.ts](app/api/admin/leave-requests/route.ts) – request listing and filtering.

### Public API

- [app/api/public/summary/route.ts](app/api/public/summary/route.ts) – public summary stats.

## Database Models

The schema lives in [prisma/schema.prisma](prisma/schema.prisma).

Important models:

- `User` – shared login identity and role.
- `StudentProfile` – student details and leave history.
- `ParentProfile` – parent contact details.
- `AdminProfile` – admin/warden profile.
- `LeaveRequest` – the leave application and its state machine.
- `Approval` – approval records for parent or admin actions.
- `Signature` – stored signatures.
- `Notification` – app notifications.
- `AuditLog` – activity history.
- `OTPVerification` – OTP records.
- `UploadedDocument` – uploaded files and document URLs.

### Important state fields in leave requests

The `LeaveRequest` table uses status fields to track progress:

- `status` – overall request state such as `DRAFT`, `PENDING_PARENT`, `PENDING_ADMIN`, `APPROVED`, or `REJECTED`.
- `parentStatus` – parent-side verification state.
- `wardenStatus` – admin-side approval state.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- Neon PostgreSQL
- JWT authentication
- React Hook Form + Zod validation
- `@react-pdf/renderer` for PDF generation
- Brevo email notifications for parent approvals
- Socket.IO for realtime features

## Production Architecture Notes

This project is now configured for Neon production use.

- Runtime app queries use `DATABASE_URL`.
- Prisma migrations use `DIRECT_DATABASE_URL` through `directUrl` in the Prisma schema.
- This is important because Neon pooler and direct URLs behave differently.

The Prisma connection code is in [lib/prisma.ts](lib/prisma.ts).

## Environment Variables

Create a `.env` or `.env.local` file with values like this:

```dotenv
DATABASE_URL="postgresql://<pooler-user>:<password>@<pooler-host>/<database>?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_DATABASE_URL="postgresql://<direct-user>:<password>@<direct-host>/<database>?sslmode=require&connect_timeout=15"
JWT_SECRET="a-long-random-secret"
REFRESH_TOKEN_SECRET="another-long-random-secret"
BREVO_API_KEY="your-brevo-api-key"
BREVO_SENDER_EMAIL="verified-sender@example.com"
BREVO_SENDER_NAME="Hostel Leave Management"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### What each variable does

- `DATABASE_URL` – used by the app at runtime.
- `DIRECT_DATABASE_URL` – used for Prisma migrations and direct schema work.
- `JWT_SECRET` – signs login tokens.
- `REFRESH_TOKEN_SECRET` – signs refresh tokens if used in your auth flow.
- `BREVO_API_KEY` – enables real parent emails.
- `BREVO_SENDER_EMAIL` – verified sender address for notifications.
- `BREVO_SENDER_NAME` – display name for emails.
- `NEXT_PUBLIC_APP_URL` – useful when building local or public links.

## Setup From Scratch

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Neon

Use Neon to create a PostgreSQL database and copy both connection strings:

- pooler string into `DATABASE_URL`
- direct string into `DIRECT_DATABASE_URL`

### 3. Set secrets and email configuration

Make sure JWT secrets and Brevo settings are present before testing the full flow.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Apply migrations

```bash
npx prisma migrate deploy
```

For local schema changes during development:

```bash
npx prisma migrate dev
```

### 6. Start the app

```bash
npm run dev
```

### 7. Build for production

```bash
npm run build
```

## End-to-End Smoke Test Checklist

Use this checklist to verify the system before deployment.

1. Open [app/register/page.tsx](app/register/page.tsx) and create a new student account.
2. Log in through [app/login/page.tsx](app/login/page.tsx).
3. Confirm the student dashboard loads at [app/dashboard/student/page.tsx](app/dashboard/student/page.tsx).
4. Submit a leave request from [app/dashboard/student/apply-leave/page.tsx](app/dashboard/student/apply-leave/page.tsx).
5. Confirm the leave request is created in the database and the parent verification flow is triggered.
6. Open the parent approval route [app/approve/leave/[id]/page.tsx](app/approve/leave/[id]/page.tsx) or fallback portal [app/parent/page.tsx](app/parent/page.tsx).
7. Complete the token and OTP verification.
8. Complete selfie and signature capture.
9. Log in as admin at [app/admin/login/page.tsx](app/admin/login/page.tsx).
10. Open the admin request list at [app/dashboard/admin/requests/page.tsx](app/dashboard/admin/requests/page.tsx).
11. Approve the request.
12. Open the final pass page [app/leave-pass/[id]/page.tsx](app/leave-pass/[id]/page.tsx) and confirm the approved request is visible.

## Production Readiness Checklist

Before deploying, confirm all of these are true:

- Neon `DATABASE_URL` and `DIRECT_DATABASE_URL` are correct.
- Prisma client has been regenerated.
- Migrations deploy successfully.
- `npm run build` passes.
- Brevo API and verified sender email are configured if email delivery is required.
- JWT secrets are set in production.
- The public app URL is correct for email links and redirects.

## Parent Approval Behavior

The parent flow is designed to be resilient.

- The parent receives a tokenized approval link.
- OTP verification blocks unauthorized approvals.
- The fallback parent portal exists so verification can still continue if the email link is not used directly.
- The parent approval step must finish before admin approval is allowed.

## Leave Pass Output

The final pass contains:

- student name
- roll number
- course and branch
- room number
- leave reason
- destination
- dates and time
- transport mode
- parent verification proof
- admin or warden approval proof

This pass is intended for gate security and administrative record keeping.

## Useful Files To Read Next

- [prisma/schema.prisma](prisma/schema.prisma)
- [lib/prisma.ts](lib/prisma.ts)
- [lib/parent-notification.ts](lib/parent-notification.ts)
- [lib/media-upload.ts](lib/media-upload.ts)
- [app/api/leave/apply/route.ts](app/api/leave/apply/route.ts)
- [app/api/parent/verification/route.ts](app/api/parent/verification/route.ts)
- [app/api/admin/leave-requests/[id]/route.ts](app/api/admin/leave-requests/[id]/route.ts)

## Helpful Commands

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
npm run build
```
