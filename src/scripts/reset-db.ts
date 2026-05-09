import prisma from '../../lib/prisma';

async function main() {
  console.log('Resetting database...');

  await prisma.$transaction([
    prisma.approval.deleteMany({}),
    prisma.signature.deleteMany({}),
    prisma.notification.deleteMany({}),
    prisma.auditLog.deleteMany({}),
    prisma.leaveRequest.deleteMany({}),
    prisma.adminProfile.deleteMany({}),
    prisma.parentProfile.deleteMany({}),
    prisma.studentProfile.deleteMany({}),
    prisma.uploadedDocument.deleteMany({}),
    prisma.oTPVerification.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  console.log('Database reset complete.');
}

main()
  .catch((error) => {
    console.error('Database reset failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
