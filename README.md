# Hostel Leave Management System

A complete hostel leave management platform built with Next.js, Prisma, PostgreSQL, Tailwind CSS, and JWT authentication. This project supports end-to-end leave request flow from student submission through parent approval, warden confirmation, and leave pass download.

## What Works Today

This repository now fully supports:

- Student registration and login with secure JWT tokens
- Student dashboard with profile, leave history, notification feed, and leave statistics
- Leave application submission with destination, dates, transport, emergency contact, and reason
- Parent verification via email notification with approval link, OTP verification, selfie capture, and signature capture
- Warden/admin approval workflow with stored digital signature
- Downloadable leave pass PDF containing student details, leave details, parent selfie/signature, and warden approval signature
- Prisma-backed relational data model with student, parent, admin, leave request, approval, and signature entities
- Responsive UI for student, admin, parent approval, and leave pass screens

## End-to-End Workflow

1. **Student registers** on `/register` and completes a student profile.
2. **Student logs in** on `/login` and lands on `/dashboard/student`.
3. From the dashboard, the student can open `/dashboard/student/apply-leave` to submit a leave request.
4. The request is stored in the database and a **parent notification email** is sent.
5. The parent receives the approval email with:
   - direct approval link
   - OTP code
   - fallback parent portal instructions
6. The parent opens the link or goes to `/parent`, enters the request ID and token, then:
   - verifies the OTP
   - captures a selfie
   - signs digitally
7. After parent approval, the warden/admin can approve the request in the admin panel.
8. Once fully approved, the student can download a **leave pass PDF** with:
   - student details
   - leave details
   - parent selfie
   - parent signature
   - warden/admin signature

## Key Pages

- `/register` – student signup
- `/login` – student login
- `/parent` – parent portal fallback entry
- `/approve/leave/[id]` – parent approval UI for OTP, selfie, and signature
- `/dashboard/student` – student home dashboard
- `/dashboard/student/apply-leave` – leave request form
- `/leave-pass/[id]` – leave pass download page
- `/admin/login` – admin login
- `/admin/register` – admin account creation
- `/dashboard/admin` – admin summary dashboard
- `/dashboard/admin/requests` – admin leave request list
- `/dashboard/admin/users` – student records
- `/dashboard/admin/analytics` – approval and user analytics

## API Flow

### Authentication

- `POST /api/auth/register` – create student account + parent profile
- `POST /api/auth/login` – student login, returns JWT tokens
- `POST /api/admin/register` – create admin user and admin profile
- `POST /api/admin/login` – admin login with JWT tokens

### Student APIs

- `GET /api/student/dashboard` – return student profile, statistics, history, and notifications
- `GET /api/student/leave-requests/[id]` – fetch a student-owned leave request

### Leave and Parent Verification

- `POST /api/leave/apply` – create leave request and send parent verification email
- `GET /api/parent/verification` – validate approval token and load request details
- `POST /api/parent/verification` – send OTP, verify OTP, complete selfie/signature
- `GET /api/leave-pass/[id]` – return approved leave request data for pass generation

### Admin APIs

- `GET /api/admin/summary` – totals and approval counts
- `GET /api/admin/students` – student records
- `GET /api/admin/leave-requests` – list requests with filtering
- `GET /api/admin/leave-requests/[id]` – request details for admin review
- `POST /api/admin/leave-requests/[id]` – approve or reject leave request
- `GET /api/admin/profile` – admin profile data

## Tech Stack

- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL / SQLite-compatible database
- JWT auth
- React Hook Form + Zod validation
- @react-pdf/renderer for PDF generation
- Brevo email for parent notifications

## Setup and Running

### Prerequisites

- Node.js 18 or later
- npm
- PostgreSQL or Neon database

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` with:

```dotenv
DATABASE_URL="postgresql://..."
DIRECT_DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
BREVO_API_KEY="..."
BREVO_SENDER_EMAIL="verified@example.com"
BREVO_SENDER_NAME="Hostel Leave Management"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`NEXT_PUBLIC_APP_URL` is useful for parent email links during local development and public tunneling.

### Database

Run migrations:

```bash
npx prisma migrate deploy
```

For development schema updates:

```bash
npx prisma migrate dev
```

### Start Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Parent Link Behavior

- The parent receives an emailed approval link plus OTP.
- If the direct link does not work, parents can manually use `/parent` and enter the request ID and token.
- This ensures the approval flow still works even when email links are blocked by local host restrictions.

## PDF Leave Pass

The PDF pass includes:

- student name, roll number, course, room number
- leave reason, destination, departure and return dates, transport mode
- parent selfie and signature
- warden/admin digital signature and approval stamp

This pass is intended for gate security verification.

## Notes

- Authenticated requests require `Authorization: Bearer <token>`.
- Leave dates are passed as `YYYY-MM-DD` and stored as Prisma `DateTime`.
- The app supports both student and admin roles with separate dashboards.
- Parent verification is a secure multi-step flow: token validation → OTP → selfie → signature.

## Helpful Commands

```bash
npm install
npm run dev
npm run build
npx prisma migrate deploy
npx prisma migrate dev
```
