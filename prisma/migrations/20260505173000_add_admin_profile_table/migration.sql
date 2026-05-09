-- Create the admin profile table required by admin registration/login.
CREATE TABLE IF NOT EXISTS "AdminProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "hostelName" TEXT NOT NULL,
    "signatureImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AdminProfile_userId_key" ON "AdminProfile"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminProfile_email_key" ON "AdminProfile"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminProfile_employeeId_key" ON "AdminProfile"("employeeId");

ALTER TABLE "AdminProfile"
ADD CONSTRAINT "AdminProfile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;