// prisma/seed.ts - Database seeding script
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.kycDocument.deleteMany();
  await prisma.client.deleteMany();
  await prisma.lawyer.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleared existing data');

  // Hash password function
  const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
  };

  // Create admin user
  const adminPasswordHash = await hashPassword('Admin@123456');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@legalhubai.uz',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'System',
      phone: '+998901234567',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✓ Created admin user:', adminUser.email);

  // Create sample clients
  const clientPasswordHash = await hashPassword('Client@123456');
  const clientUsers = await Promise.all(
    [
      {
        email: 'client1@legalhubai.uz',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+998901111111',
      },
      {
        email: 'client2@legalhubai.uz',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+998902222222',
      },
    ].map((data) =>
      prisma.user.create({
        data: {
          ...data,
          passwordHash: clientPasswordHash,
          role: 'CLIENT',
          status: 'ACTIVE',
        },
      }),
    ),
  );
  console.log('✓ Created', clientUsers.length, 'client users');

  // Create client profiles
  const clients = await Promise.all(
    clientUsers.map((user) =>
      prisma.client.create({
        data: {
          userId: user.id,
          legalIssueAreas: ['Family Law', 'Civil Law'],
          budget: 1000000,
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      }),
    ),
  );
  console.log('✓ Created', clients.length, 'client profiles');

  // Create sample lawyers
  const lawyerPasswordHash = await hashPassword('Lawyer@123456');
  const lawyerUsers = await Promise.all(
    [
      {
        email: 'lawyer1@legalhubai.uz',
        firstName: 'Muhammad',
        lastName: 'Qoraboyev',
        phone: '+998903333333',
      },
      {
        email: 'lawyer2@legalhubai.uz',
        firstName: 'Gulnora',
        lastName: 'Karimova',
        phone: '+998904444444',
      },
    ].map((data) =>
      prisma.user.create({
        data: {
          ...data,
          passwordHash: lawyerPasswordHash,
          role: 'LAWYER',
          status: 'ACTIVE',
        },
      }),
    ),
  );
  console.log('✓ Created', lawyerUsers.length, 'lawyer users');

  // Create lawyer profiles
  const lawyers = await Promise.all(
    lawyerUsers.map((user, index) =>
      prisma.lawyer.create({
        data: {
          userId: user.id,
          specializations: [
            'Family Law',
            'Civil Law',
            'Criminal Law',
          ],
          experience: 10 + index * 5,
          bio: `Experienced lawyer with ${10 + index * 5} years of practice in various legal fields.`,
          hourlyRate: 100000 + index * 50000,
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
          kycStatus: 'VERIFIED',
          kycVerifiedAt: new Date(),
          rating: 4.5 + index * 0.3,
          reviewCount: 15 + index * 5,
          isAvailable: true,
        },
      }),
    ),
  );
  console.log('✓ Created', lawyers.length, 'lawyer profiles');

  // Create KYC documents
  const kycDocuments = await Promise.all(
    lawyers.map((lawyer) =>
      prisma.kycDocument.create({
        data: {
          lawyerId: lawyer.id,
          documentType: 'passport',
          documentNumber: `P${Math.floor(Math.random() * 1000000)}`,
          documentUrl: 'https://example.com/kyc/document.pdf',
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      }),
    ),
  );
  console.log('✓ Created', kycDocuments.length, 'KYC documents');

  // Create sample consultations
  const consultations = await Promise.all([
    prisma.consultation.create({
      data: {
        clientId: clients[0].id,
        lawyerId: lawyers[0].id,
        title: 'Family Law Consultation',
        description: 'I need help with divorce procedures and child custody matters.',
        status: 'ACCEPTED',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 60,
      },
    }),
    prisma.consultation.create({
      data: {
        clientId: clients[1].id,
        lawyerId: lawyers[1].id,
        title: 'Business Contract Review',
        description: 'Need review of our business partnership agreement.',
        status: 'PENDING',
      },
    }),
  ]);
  console.log('✓ Created', consultations.length, 'consultations');

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        consultationId: consultations[0].id,
        clientId: clients[0].id,
        lawyerId: lawyers[0].id,
        amount: 500000,
        status: 'CONFIRMED',
      },
    }),
  ]);
  console.log('✓ Created', orders.length, 'orders');

  // Create payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        orderId: orders[0].id,
        clientId: clients[0].id,
        lawyerId: lawyers[0].id,
        amount: 500000,
        provider: 'PAYME',
        transactionId: `TXN${Date.now()}`,
        status: 'COMPLETED',
        paidAt: new Date(),
      },
    }),
  ]);
  console.log('✓ Created', payments.length, 'payments');

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: clientUsers[0].id,
        title: 'Consultation Accepted',
        message: 'Your consultation request has been accepted by the lawyer.',
        type: 'CONSULTATION_SCHEDULED',
        relatedId: consultations[0].id,
      },
    }),
  ]);
  console.log('✓ Created', notifications.length, 'notifications');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@legalhubai.uz / Admin@123456');
  console.log('Client: client1@legalhubai.uz / Client@123456');
  console.log('Lawyer: lawyer1@legalhubai.uz / Lawyer@123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
