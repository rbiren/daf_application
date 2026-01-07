# Digital Dealer Acceptance Form (DAF) System

A comprehensive digital platform for managing RV dealer acceptance workflows, replacing paper-based checklists with a streamlined, mobile-first digital solution.

## Features

- **VIN Management**: Lookup, scanning, and unit tracking
- **PDI Integration**: View Pre-Delivery Inspection results from manufacturer
- **Digital Checklists**: Dynamic, configurable acceptance checklists
- **Photo Documentation**: Capture and annotate photos with GPS/timestamp metadata
- **Digital Signatures**: Secure acceptance submission with signature capture
- **Offline Support**: Work without connectivity, sync when back online
- **Role-Based Access**: Dealer techs, admins, manufacturer QA, and system admins

## Tech Stack

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + TanStack Query
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/dealer_acceptance"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with test data
npm run prisma:seed

# Start development server
npm run start:dev
```

The API will be available at http://localhost:3000

API Documentation: http://localhost:3000/docs

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The web app will be available at http://localhost:5173

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| System Admin | admin@example.com | password123 |
| Manufacturer QA | qa@manufacturer.com | password123 |
| Dealer Admin | admin@abcrv.com | password123 |
| Dealer Tech | dealer@example.com | password123 |

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   └── src/
│       ├── auth/              # Authentication module
│       ├── users/             # User management
│       ├── dealers/           # Dealer management
│       ├── units/             # Unit/VIN management
│       ├── pdi/               # Pre-Delivery Inspection
│       ├── acceptance/        # Acceptance workflow
│       ├── checklist/         # Checklist templates
│       ├── common/            # Shared utilities
│       └── prisma/            # Database service
│
├── frontend/
│   └── src/
│       ├── components/        # React components
│       ├── pages/             # Page components
│       ├── services/          # API services
│       ├── stores/            # State management
│       └── types/             # TypeScript types
│
└── DEALER_ACCEPTANCE_SYSTEM_PLAN.md  # Full planning document
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Units
- `GET /api/v1/units` - List units
- `GET /api/v1/units/pending` - Get pending units
- `GET /api/v1/units/:vin` - Get unit by VIN
- `GET /api/v1/units/:vin/history` - Get unit history
- `POST /api/v1/units/:id/receive` - Mark unit received

### PDI
- `GET /api/v1/pdi/unit/:vin` - Get PDI results for unit
- `GET /api/v1/pdi/:id` - Get PDI record
- `POST /api/v1/pdi/webhook` - PDI webhook (for integrations)

### Acceptance
- `GET /api/v1/acceptances` - List acceptance records
- `GET /api/v1/acceptances/:id` - Get acceptance details
- `POST /api/v1/acceptances` - Start new acceptance
- `PATCH /api/v1/acceptances/:id/items/:itemId` - Update item status
- `POST /api/v1/acceptances/:id/submit` - Submit completed acceptance

### Checklists
- `GET /api/v1/checklists` - List checklist templates
- `GET /api/v1/checklists/:id` - Get template details
- `GET /api/v1/checklists/for-model/:modelId` - Get template for model

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e
```

### Database Management

```bash
# Create new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database and reseed
npm run db:reset
```

## License

MIT
