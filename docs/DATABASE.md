# Database Schema Documentation

## 📋 Overview

LegalHub AI database schema is built with **Prisma ORM** and **PostgreSQL**, designed for production-grade legal marketplace platform with AI capabilities.

---

## 🏗️ Core Entities

### 1. **User** (Base Model)
Central user model for all three roles: Client, Lawyer, Admin.

```prisma
model User {
  id                  String    @id @default(cuid())
  email               String    @unique
  passwordHash        String    @db.Text
  firstName           String
  lastName            String
  phone               String?
  avatar              String?   // S3 URL
  role                Role      // CLIENT, LAWYER, ADMIN
  status              UserStatus  // ACTIVE, INACTIVE, SUSPENDED, BLOCKED
  twoFactorEnabled    Boolean   @default(false)
  lastLoginAt         DateTime?
  loginAttempts       Int       @default(0)  // Security
  lockedUntil         DateTime? // Account lockout
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  deletedAt           DateTime? // Soft delete
}
```

**Indexes**:
- `email` (UNIQUE) - Fast authentication
- `role` - Filter by user type
- `status` - Active users queries

---

### 2. **Client**
Client profile with verification and preferences.

```prisma
model Client {
  id                  String
  userId              String    @unique
  companyName         String?
  legalIssueAreas     String[]  // Array: ["Family Law", "Civil Law"]
  budget              Decimal(10,2)?
  preferredLanguage   String    @default("uz")
  verificationStatus  VerificationStatus
  verifiedAt          DateTime?
  createdAt           DateTime
  updatedAt           DateTime
  deletedAt           DateTime?
}
```

**Features**:
- Multiple legal areas of interest
- Budget tracking
- Verification status
- Soft delete support

---

### 3. **Lawyer**
Lawyer profile with specializations, ratings, and KYC.

```prisma
model Lawyer {
  id                  String
  userId              String    @unique
  specializations     String[]  // Expertise areas
  experience          Int       // Years of practice
  bio                 String?   // Professional bio
  hourlyRate          Decimal(10,2)
  verificationStatus  VerificationStatus  // Platform verification
  kycStatus           KYCStatus  // Government KYC
  rating              Decimal(3,2)  // 1.00 to 5.00
  reviewCount         Int
  totalEarnings       Decimal(15,2)
  isAvailable         Boolean   @default(true)
  createdAt           DateTime
  updatedAt           DateTime
  deletedAt           DateTime?
}
```

**Key Features**:
- Dual verification (platform + KYC)
- Rating system (aggregated from reviews)
- Availability status
- Income tracking

---

### 4. **KYCDocument**
Government KYC verification documents.

```prisma
model KYCDocument {
  id                  String
  lawyerId            String    @unique
  documentType        String    // passport, id_card, license
  documentNumber      String
  documentUrl         String    // S3 URL
  issueDate           DateTime?
  expiryDate          DateTime?
  verificationStatus  VerificationStatus
  verifiedAt          DateTime?
  rejectionReason     String?   // If rejected
}
```

---

### 5. **Consultation**
Legal consultation request/session.

```prisma
model Consultation {
  id                  String
  clientId            String
  lawyerId            String
  title               String    @db.VarChar(255)
  description         String
  status              ConsultationStatus  // PENDING, ACCEPTED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED
  rejectionReason     String?
  scheduledAt         DateTime?  // Appointment time
  duration            Int?       // Minutes
  videoCallUrl        String?   // Zoom/Meet link
  meetingNotes        String?   // Notes after consultation
  createdAt           DateTime
  updatedAt           DateTime
  deletedAt           DateTime?
}
```

**Statuses**:
- `PENDING` - Awaiting lawyer response
- `ACCEPTED` - Lawyer accepted
- `IN_PROGRESS` - Consultation happening
- `COMPLETED` - Finished

---

### 6. **Order**
Consultation order (after lawyer accepts consultation).

```prisma
model Order {
  id                  String
  consultationId      String    @unique  // 1:1 relationship
  clientId            String
  lawyerId            String
  status              OrderStatus  // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, DISPUTED
  amount              Decimal(10,2)
  currency            String    @default("UZS")
  disputeReason       String?
  completedAt         DateTime?
  createdAt           DateTime
  updatedAt           DateTime
  deletedAt           DateTime?
}
```

---

### 7. **Payment**
Payment transaction (Payme, Click).

```prisma
model Payment {
  id                  String
  orderId             String    @unique  // 1:1 relationship
  clientId            String
  lawyerId            String
  amount              Decimal(10,2)
  provider            PaymentProvider  // PAYME, CLICK
  transactionId       String?   @unique  // Provider's transaction ID
  status              PaymentStatus  // PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
  metadata            Json?     // Provider-specific data
  failureReason       String?
  paidAt              DateTime?
  createdAt           DateTime
  updatedAt           DateTime
}
```

---

### 8. **Message**
Chat messages between client and lawyer.

```prisma
model Message {
  id                  String
  consultationId      String
  senderId            String    // User ID
  senderRole          Role      // For quick role access
  content             String
  attachments         String[]  // S3 URLs
  isRead              Boolean   @default(false)
  readAt              DateTime?
  createdAt           DateTime
  updatedAt           DateTime
}
```

---

### 9. **Review**
Client's review and rating of lawyer.

```prisma
model Review {
  id                  String
  lawyerId            String
  clientId            String
  rating              Int       // 1-5
  comment             String?   // Optional review text
  createdAt           DateTime
  updatedAt           DateTime
  deletedAt           DateTime?
}
```

**Constraint**: `UNIQUE(lawyerId, clientId)` - One review per client-lawyer pair

---

### 10. **AuditLog**
Complete audit trail of all user actions.

```prisma
model AuditLog {
  id                  String
  userId              String    // Who performed action
  action              String    // CREATE, READ, UPDATE, DELETE
  entity              String    // Model name (User, Order, Payment, etc)
  entityId            String    // ID of affected entity
  changes             Json?     // { before: {...}, after: {...} }
  ipAddress           String?
  userAgent           String?
  statusCode          Int?      // HTTP status
  createdAt           DateTime
}
```

---

### 11. **Notification**
User notifications (orders, messages, payments, etc).

```prisma
model Notification {
  id                  String
  userId              String
  title               String
  message             String
  type                NotificationType  // ORDER_CREATED, ORDER_ACCEPTED, MESSAGE_RECEIVED, PAYMENT_SUCCESS, etc
  relatedId           String?   // ID of related entity
  isRead              Boolean   @default(false)
  readAt              DateTime?
  createdAt           DateTime
}
```

---

### 12. **CalendarEvent**
Lawyer's availability calendar.

```prisma
model CalendarEvent {
  id                  String
  lawyerId            String
  title               String
  description         String?
  startTime           DateTime
  endTime             DateTime
  isAvailable         Boolean   @default(true)  // Available slot?
  createdAt           DateTime
}
```

---

### 13. **LegalDocument**
Knowledge base for AI RAG (Retrieval-Augmented Generation).

```prisma
model LegalDocument {
  id                  String
  title               String
  content             String    @db.Text
  category            String    // Constitution, CivilCode, CriminalCode, etc
  source              String    // Official source URL
  embedding           Unsupported("vector(1536)")?  // OpenAI embedding
  metadata            Json?     // Custom data
  createdAt           DateTime
}
```

**Note**: Requires `pgvector` extension for vector search.

---

## 📊 Relationships

```
User (1)
  ├─ Client (1)
  │   ├─ Consultations (many)
  │   ├─ Orders (many)
  │   ├─ Payments (many)
  │   └─ Reviews (many)
  │
  ├─ Lawyer (1)
  │   ├─ KYCDocument (1)
  │   ├─ Consultations (many)
  │   ├─ Orders (many)
  │   ├─ Payments (many)
  │   ├─ Reviews (many)
  │   └─ CalendarEvents (many)
  │
  ├─ AuditLogs (many)
  ├─ Notifications (many)
  └─ Messages (many) [as sender]

Consultation (1)
  ├─ Order (1)
  └─ Messages (many)
```

---

## 🗂️ Enums

### Role
```
CLIENT  - Regular user seeking legal help
LAWYER  - Legal professional
ADMIN   - Platform administrator
```

### UserStatus
```
ACTIVE      - Normal account
INACTIVE    - User disabled
SUSPENDED   - Temporary suspension
BLOCKED     - Banned from platform
```

### VerificationStatus
```
PENDING    - Awaiting verification
VERIFIED   - Approved
REJECTED   - Denied
```

### KYCStatus
```
PENDING      - Not started
IN_PROGRESS  - Under review
VERIFIED     - Government verified
REJECTED     - Failed verification
```

### ConsultationStatus
```
PENDING     - Awaiting lawyer response
ACCEPTED    - Lawyer accepted
REJECTED    - Lawyer rejected
IN_PROGRESS - Active consultation
COMPLETED   - Finished
CANCELLED   - Cancelled
```

### OrderStatus
```
PENDING     - New order
CONFIRMED   - Lawyer confirmed
IN_PROGRESS - Service delivery
COMPLETED   - Finished
CANCELLED   - Cancelled
DISPUTED    - Dispute raised
```

### PaymentStatus
```
PENDING    - Awaiting payment
PROCESSING - Being processed
COMPLETED  - Successful
FAILED     - Transaction failed
REFUNDED   - Refund issued
```

### PaymentProvider
```
PAYME  - Payme payment system
CLICK  - Click payment system
```

---

## 🔍 Key Indexes

| Table | Columns | Purpose |
|-------|---------|----------|
| User | email | Authentication lookup |
| User | role, status | User filtering |
| Lawyer | specializations | Search by expertise (GIN index) |
| Lawyer | rating | Sorting by rating |
| Consultation | status, scheduledAt | Query upcoming consultations |
| Order | status, createdAt | Order management |
| Payment | transactionId | Webhook validation |
| Message | consultationId, createdAt | Chat retrieval |
| AuditLog | userId, action, createdAt | Audit queries |

---

## 🔐 Security Features

1. **Soft Deletes**: All main entities have `deletedAt` field
2. **Foreign Keys**: Cascading deletes for data consistency
3. **Audit Logging**: All actions tracked
4. **UUID Primary Keys**: Better security than sequential IDs
5. **Password Hashing**: Bcrypt (handled in application layer)
6. **Unique Constraints**: Email, transaction IDs, etc.

---

## 📈 Scalability Considerations

1. **Partitioning**: AuditLog and Message tables can be partitioned by date
2. **Archiving**: Move old data to archive tables
3. **Connection Pooling**: Use PgBouncer
4. **Read Replicas**: For reporting queries
5. **Caching**: Redis for frequently accessed data

---

## 🚀 Setup Instructions

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# View database
npx prisma studio
```

---

**Last Updated**: 2026-07-20
