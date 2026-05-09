-- Add status columns required by the leave approval flow.
ALTER TABLE "LeaveRequest"
ADD COLUMN IF NOT EXISTS "parentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS "wardenStatus" TEXT NOT NULL DEFAULT 'PENDING';