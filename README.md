# Digital Dealer Acceptance Form (DAF) System

A comprehensive system for managing RV/vehicle manufacturer inspections and dealer acceptance workflows.

## Overview

The DAF system streamlines the process of:
1. **Manufacturer QA Inspection** - Quality assurance checks before shipping units to dealers
2. **Dealer Acceptance** - Pre-delivery inspection (PDI) when dealers receive units

## Tech Stack

- **Backend**: NestJS, Prisma ORM, SQLite (dev) / PostgreSQL (prod)
- **Frontend**: React, TypeScript, TanStack Query, Tailwind CSS
- **Authentication**: JWT with role-based access control

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run start:dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| System Admin | admin@example.com | password123 |
| Manufacturer QA | qa@manufacturer.com | password123 |
| Dealer Admin | admin@abcrv.com | password123 |
| Dealer Tech | dealer@example.com | password123 |

## Features

### Manufacturer QA Workflow

1. **Pending Inspection** - Units awaiting QA inspection
2. **In Progress** - Inspections that have been started but not completed
   - Resume incomplete inspections from the dashboard
   - Track progress with item completion percentage
3. **Pending Approval** - Completed inspections awaiting manager approval
4. **Ready to Ship** - Approved units ready for dealer shipment

### Dealer Acceptance Workflow

1. **Pending Units** - Shipped units awaiting dealer acceptance
2. **In Progress** - Acceptance inspections underway
3. **Completed** - Units that have been accepted or conditionally accepted

## API Endpoints

### Manufacturer Inspection

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/manufacturer-inspection` | List all inspections |
| GET | `/api/v1/manufacturer-inspection/pending-inspection` | Get units pending inspection |
| GET | `/api/v1/manufacturer-inspection/in-progress` | Get inspections in progress |
| GET | `/api/v1/manufacturer-inspection/pending-approval` | Get units pending approval |
| GET | `/api/v1/manufacturer-inspection/ready-to-ship` | Get approved units |
| GET | `/api/v1/manufacturer-inspection/:id` | Get inspection by ID |
| GET | `/api/v1/manufacturer-inspection/unit/:unitId` | Get inspection by unit ID |
| POST | `/api/v1/manufacturer-inspection/start` | Start new inspection |
| PATCH | `/api/v1/manufacturer-inspection/:id/items/:itemId` | Update inspection item |
| POST | `/api/v1/manufacturer-inspection/:id/complete` | Complete inspection |
| POST | `/api/v1/manufacturer-inspection/:id/approve` | Approve inspection |
| POST | `/api/v1/manufacturer-inspection/:id/reject` | Reject inspection |
| POST | `/api/v1/manufacturer-inspection/ship/:unitId` | Ship unit to dealer |

### Units

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/units` | List units with filters |
| GET | `/api/v1/units/:identifier` | Get unit by VIN or UUID |
| GET | `/api/v1/units/pending` | Get pending units for dealer |
| GET | `/api/v1/units/in-progress` | Get in-progress units for dealer |
| POST | `/api/v1/units` | Create new unit |
| PUT | `/api/v1/units/:id` | Update unit |
| PATCH | `/api/v1/units/:id/status` | Update unit status |

## Recent Changes

### Resume Inspection Feature
- Added ability to resume incomplete manufacturer inspections
- Dashboard shows "In Progress" inspections with progress percentage
- StartInspectionPage detects existing inspections and offers resume option
- Units controller now handles both VIN and UUID lookups

## Development

### Database

The development environment uses SQLite for simplicity. The database file is stored at `backend/prisma/dev.db`.

To reset the database:
```bash
cd backend
npx prisma db push --force-reset
npx prisma db seed
```

### Environment Variables

Create a `.env` file in the backend directory:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

## License

Proprietary - All rights reserved
