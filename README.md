# LegalHub AI - Legal Marketplace Platform

![Status](https://img.shields.io/badge/status-MVP-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📌 Overview

**LegalHub AI** — O'zbekistonda mijozlarni va advokatlarni bog'lovchi AI-powered Legal Marketplace platformasi.

### 🎯 Maqsad
- Mijozlar va advokatlar o'rtasida foydalanuvchi-do'st platforma
- AI-powered legal assistant RAG bilan
- To'lov integratsiyasi (Payme, Click)
- Enterprise-level security

### 👥 Foydalanuvchi Rollari
- **Mijoz**: Huquqiy maslahat izlash va buyurtma berish
- **Advokat**: Xizmat ko'rsatish va daromad olish
- **Administrator**: Platform boshqarish

---

## 🏗️ Loyiha Strukturasi

```
legalhubai/
├── backend/              # NestJS API
├── frontend/             # Next.js 15 Frontend
├── ai/                   # AI Service (Future)
├── docs/                 # Documentation
├── docker-compose.yml    # Local Development
└── README.md
```

---

## 🛠️ Texnologiyalar

### Backend
- **NestJS** - Enterprise Node.js framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **Redis** - Caching & sessions
- **BullMQ** - Job queue

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **TanStack Query** - Data fetching
- **Zustand** - State management

### AI
- **OpenAI GPT-4o** - LLM (Provider pattern)
- **pgvector** - Vector embeddings
- **RAG** - Retrieval-Augmented Generation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local development
- **GitHub Actions** - CI/CD
- **AWS S3** - File storage

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### Development Setup

```bash
# Clone repository
git clone https://github.com/batisyuri680-stack/legalhubai.git
cd legalhubai

# Backend setup
cd backend
npm install
cp .env.example .env

# Database setup
npx prisma migrate dev
npx prisma generate

# Start backend
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### Using Docker Compose

```bash
docker-compose up -d
```

---

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE.md)
- [API Documentation](./backend/docs/API.md)
- [Security Guidelines](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🔐 Security Features

- ✅ JWT Authentication with Refresh Token Rotation
- ✅ Role-Based Access Control (RBAC)
- ✅ Bcrypt Password Hashing
- ✅ Helmet.js for secure headers
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Input Validation (DTO + Zod)
- ✅ XSS & CSRF Protection
- ✅ Comprehensive Audit Logging
- ✅ OWASP Top 10 Compliance

---

## 📈 MVP Features

### Client
- ✅ Registration & Login
- ✅ Profile Management
- ✅ Lawyer Search & Filtering
- ✅ Consultation Creation
- ✅ Chat System
- ✅ Payment Integration
- ✅ AI Legal Assistant
- ✅ Order History

### Lawyer
- ✅ Registration & Login
- ✅ KYC Verification
- ✅ Order Management
- ✅ Revenue Statistics
- ✅ Calendar Management
- ✅ Ratings & Reviews

### Admin
- ✅ Dashboard & Analytics
- ✅ User Management
- ✅ Lawyer Verification
- ✅ Complaint Management
- ✅ Audit Logs

---

## 🤖 AI Legal Assistant

- RAG (Retrieval-Augmented Generation) architecture
- pgvector for semantic search
- Trusted legal sources only
- Hallucination prevention
- Source attribution
- Legal disclaimer on all responses
- Legal topics only

---

## 📋 Development Status

- [x] Repository Setup
- [x] Project Planning
- [ ] Backend Infrastructure
- [ ] Database Schema
- [ ] Authentication
- [ ] Core Modules
- [ ] API Implementation
- [ ] Frontend Setup
- [ ] AI Module
- [ ] DevOps Pipeline
- [ ] Testing & QA
- [ ] Deployment

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/feature-name`
4. Submit pull request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 📞 Contact

For questions or support, please open an issue or contact the development team.

---

**Last Updated**: 2026-07-20
**Status**: MVP Development Phase 1
