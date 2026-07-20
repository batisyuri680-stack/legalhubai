# LegalHub AI - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTS LAYER                          │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │         │   Mobile     │                 │
│  │  (Next.js)   │         │   (Future)   │                 │
│  └──────────────┘         └──────────────┘                 │
└────────────────┬──────────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │    HTTP/REST   │
         └───────┬────────┘
                 │
┌────────────────▼──────────────────────────────────────────┐
│                  API GATEWAY LAYER                        │
│         ┌──────────────────────────────────┐              │
│         │      CORS | Rate Limiting        │              │
│         │      Authentication | Logging    │              │
│         └──────────────────────────────────┘              │
└────────────────┬───────────────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────────────┐
│              BACKEND SERVICES LAYER                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ NestJS Microservices                                │  │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │ │  Auth    │ │  Users   │ │  Orders  │ │ Payments│ │  │
│  │ └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │ │Messaging │ │ AI Legal │ │ Admin    │ │ Storage│ │  │
│  │ └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────┬───────────────────────────────────────────┘
                 │
         ┌───────┴────────────┬──────────────┐
         │                    │              │
┌────────▼──────┐  ┌──────────▼───┐  ┌──────▼───────┐
│  PostgreSQL   │  │    Redis     │  │   AWS S3     │
│   (Primary)   │  │   (Cache)    │  │  (Storage)   │
│  + pgvector   │  │              │  │              │
└───────────────┘  └──────────────┘  └──────────────┘
```

---

## 📦 Modular Structure

### Backend Modules

```
src/
├── common/
│   ├── decorators/          # Custom decorators (@IsPublic, @Roles, etc)
│   ├── filters/             # Exception filters
│   ├── guards/              # Auth guards, Role guards
│   ├── interceptors/        # Logging, transformation
│   ├── pipes/               # Validation pipes
│   └── exceptions/          # Custom exceptions
│
├── config/
│   ├── database.config.ts   # Prisma, PostgreSQL
│   ├── redis.config.ts      # Redis connection
│   ├── jwt.config.ts        # JWT strategy
│   ├── aws.config.ts        # AWS S3
│   └── mail.config.ts       # Email service
│
├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   │
│   ├── users/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   │
│   ├── clients/
│   │   ├── clients.service.ts
│   │   └── clients.controller.ts
│   │
│   ├── lawyers/
│   │   ├── lawyers.service.ts
│   │   ├── lawyers.controller.ts
│   │   └── kyc/             # KYC verification logic
│   │
│   ├── consultations/
│   │   ├── consultations.service.ts
│   │   └── consultations.controller.ts
│   │
│   ├── orders/
│   │   ├── orders.service.ts
│   │   └── orders.controller.ts
│   │
│   ├── payments/
│   │   ├── providers/       # Payme, Click integration
│   │   ├── payments.service.ts
│   │   └── payments.controller.ts
│   │
│   ├── messages/
│   │   ├── messages.service.ts
│   │   └── messages.controller.ts
│   │
│   ├── notifications/
│   │   ├── notifications.service.ts
│   │   └── notifications.controller.ts
│   │
│   ├── reviews/
│   │   ├── reviews.service.ts
│   │   └── reviews.controller.ts
│   │
│   ├── ai/
│   │   ├── services/
│   │   │   ├── rag.service.ts        # RAG implementation
│   │   │   ├── embedding.service.ts  # Vector embeddings
│   │   │   └── llm.service.ts        # LLM provider pattern
│   │   ├── ai.controller.ts
│   │   └── ai.module.ts
│   │
│   ├── admin/
│   │   ├── admin.service.ts
│   │   └── admin.controller.ts
│   │
│   ├── audit/
│   │   ├── audit.service.ts
│   │   └── audit.module.ts
│   │
│   └── storage/
│       ├── storage.service.ts        # AWS S3 integration
│       └── storage.module.ts
│
└── main.ts
```

---

## 🔐 Security Layers

### 1. **Authentication Layer**
- JWT tokens with short expiration (24h)
- Refresh tokens with rotation (7d)
- Bcrypt password hashing (10 rounds)
- 2FA support (future)

### 2. **Authorization Layer**
- Role-Based Access Control (RBAC)
- Custom decorators (@Roles, @IsPublic)
- Guards for permission checking

### 3. **API Security Layer**
- Helmet.js for secure headers
- CORS configuration
- Rate limiting (100 requests/15 min per IP)
- Input validation (DTO + Zod)

### 4. **Data Protection Layer**
- HTTPS enforced (production)
- Sensitive fields encrypted
- Audit logging for all actions

### 5. **Infrastructure Security**
- Docker container isolation
- Environment variable management
- Secret management (GitHub Secrets)
- Database access control

---

## 🤖 AI Architecture

### RAG Pipeline

```
User Query
    │
    ▼
┌─────────────────────────────┐
│ 1. Query Vectorization      │
│ (OpenAI Embedding)          │
└────────────┬────────────────┘
             │
    ┌────────▼────────┐
    │ pgvector Search │
    │ (Semantic)      │
    └────────┬────────┘
             │
    ┌────────▼──────────────────┐
    │ 2. Document Retrieval     │
    │ (Top K similar docs)      │
    └────────┬──────────────────┘
             │
    ┌────────▼──────────────────┐
    │ 3. Context Building       │
    │ (Prompt engineering)      │
    └────────┬──────────────────┘
             │
    ┌────────▼──────────────────┐
    │ 4. LLM Call (GPT-4o)      │
    │ (With context)            │
    └────────┬──────────────────┘
             │
    ┌────────▼──────────────────┐
    │ 5. Response Processing    │
    │ - Source attribution      │
    │ - Disclaimer injection    │
    │ - Hallucination check     │
    └────────┬──────────────────┘
             │
        Response
```

### Provider Pattern for LLM

```typescript
interface LLMProvider {
  name: string;
  call(prompt: string, context: string): Promise<string>;
}

// Implementations:
// - OpenAIProvider (GPT-4o)
// - ClaudeProvider (Future)
// - GeminiProvider (Future)
// - QwenProvider (Future)
```

---

## 📊 Data Flow

### Consultation Flow

```
1. Client searches lawyers
   ├─ Filter by specialization
   ├─ Filter by rating
   └─ Filter by price
   
2. Client creates consultation
   ├─ Validation
   ├─ Notification to lawyer
   └─ Email sent
   
3. Lawyer accepts/rejects
   ├─ Order created (if accepted)
   ├─ Notification to client
   └─ Payment initiated
   
4. Payment processing
   ├─ Payme/Click webhook
   ├─ Order status update
   ├─ Notifications sent
   └─ Consultation starts
   
5. Chat & Consultation
   ├─ Messages stored
   ├─ Notifications on new message
   └─ Consultation completion
   
6. Review & Rating
   ├─ Client reviews lawyer
   ├─ Rating calculated
   └─ Lawyer stats updated
```

---

## 🗄️ Database Design Principles

- **UUID Primary Keys**: Better distribution, security
- **Soft Deletes**: Data recovery capability
- **Timestamps**: audit trail (createdAt, updatedAt)
- **Foreign Keys**: Referential integrity
- **Indexes**: Performance optimization
- **Enums**: Type safety

---

## 🔄 API Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { },
  "timestamp": "2026-07-20T12:00:00Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2026-07-20T12:00:00Z"
}
```

---

## 🚀 Deployment Architecture

```
GitHub Repository
       │
       ▼
GitHub Actions (CI/CD)
├─ Lint & Format
├─ Type Check
├─ Unit Tests
└─ Build Docker Images
       │
       ▼
Docker Registry (Docker Hub/ECR)
       │
       ▼
Docker Compose / Kubernetes
├─ Backend Container
├─ Frontend Container
├─ PostgreSQL Container
└─ Redis Container
```

---

## 📈 Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design
   - Load balancing (Nginx)
   - Database replication

2. **Caching Strategy**
   - Redis for sessions
   - Redis for API responses
   - Cache invalidation strategy

3. **Database Optimization**
   - Proper indexing
   - Query optimization
   - Connection pooling

4. **Background Jobs**
   - BullMQ for async tasks
   - Email notifications
   - Report generation

---

## 🔍 Monitoring & Logging

- **Logging**: Winston (structured logging)
- **Monitoring**: Application-level + Infrastructure
- **Audit Trails**: All user actions logged
- **Error Tracking**: Sentry (future)
- **Performance Monitoring**: New Relic (future)

---

**Last Updated**: 2026-07-20
