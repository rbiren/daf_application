// Shared enums for the DAF application
// These match the string values used in the Prisma schema

export enum UserRole {
  DEALER_TECH = 'DEALER_TECH',
  DEALER_ADMIN = 'DEALER_ADMIN',
  MFG_QA = 'MFG_QA',
  MFG_ADMIN = 'MFG_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

export enum UnitStatus {
  // Manufacturer inspection workflow (NEW)
  PENDING_INSPECTION = 'PENDING_INSPECTION',       // Unit created, waiting for inspection
  INSPECTION_IN_PROGRESS = 'INSPECTION_IN_PROGRESS', // Manufacturer inspection started
  INSPECTION_COMPLETE = 'INSPECTION_COMPLETE',     // Manufacturer inspection done
  PENDING_APPROVAL = 'PENDING_APPROVAL',           // Waiting for manufacturer approval
  APPROVED = 'APPROVED',                           // Approved, ready to ship
  SHIPPED = 'SHIPPED',                             // Shipped to dealer - NOW VISIBLE TO DEALER

  // Legacy PDI statuses (kept for backwards compatibility)
  PENDING_PDI = 'PENDING_PDI',
  PDI_IN_PROGRESS = 'PDI_IN_PROGRESS',
  PDI_COMPLETE = 'PDI_COMPLETE',
  PDI_ISSUES = 'PDI_ISSUES',

  // Dealer workflow
  RECEIVED = 'RECEIVED',                           // Dealer received the unit
  PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE',
  IN_ACCEPTANCE = 'IN_ACCEPTANCE',                 // Dealer acceptance in progress
  ACCEPTANCE_IN_PROGRESS = 'ACCEPTANCE_IN_PROGRESS',
  ACCEPTED = 'ACCEPTED',                           // Dealer fully accepted
  ACCEPTED_WITH_CONDITIONS = 'ACCEPTED_WITH_CONDITIONS',
  CONDITIONALLY_ACCEPTED = 'CONDITIONALLY_ACCEPTED',
  REJECTED = 'REJECTED',                           // Dealer rejected
}

export enum EventType {
  // Unit lifecycle
  UNIT_CREATED = 'UNIT_CREATED',
  MANUFACTURED = 'MANUFACTURED',
  SHIPPED = 'SHIPPED',
  RECEIVED = 'RECEIVED',

  // Manufacturer inspection events (NEW)
  INSPECTION_STARTED = 'INSPECTION_STARTED',
  INSPECTION_COMPLETED = 'INSPECTION_COMPLETED',
  INSPECTION_APPROVED = 'INSPECTION_APPROVED',
  INSPECTION_REJECTED = 'INSPECTION_REJECTED',

  // Legacy PDI events
  PDI_STARTED = 'PDI_STARTED',
  PDI_COMPLETED = 'PDI_COMPLETED',

  // Dealer acceptance events
  ACCEPTANCE_STARTED = 'ACCEPTANCE_STARTED',
  ACCEPTANCE_COMPLETED = 'ACCEPTANCE_COMPLETED',

  // General
  STATUS_CHANGED = 'STATUS_CHANGED',
  NOTE_ADDED = 'NOTE_ADDED',
  NOTE_SHARED = 'NOTE_SHARED',
}

export enum PdiStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  INCOMPLETE = 'INCOMPLETE',
  ISSUES_PENDING = 'ISSUES_PENDING',
}

export enum ItemStatus {
  PENDING = 'PENDING',
  PASS = 'PASS',
  FAIL = 'FAIL',
  ISSUE = 'ISSUE',
  NA = 'NA',
}

export enum AcceptanceStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum AcceptanceDecision {
  ACCEPTED = 'ACCEPTED',
  ACCEPTED_WITH_CONDITIONS = 'ACCEPTED_WITH_CONDITIONS',
  REJECTED = 'REJECTED',
  FULL_ACCEPT = 'FULL_ACCEPT',
  CONDITIONAL = 'CONDITIONAL',
  REJECT = 'REJECT',
}

export enum IssueSeverity {
  MINOR = 'MINOR',
  MAJOR = 'MAJOR',
  CRITICAL = 'CRITICAL',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}

export enum PhotoType {
  GENERAL = 'GENERAL',
  ISSUE = 'ISSUE',
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
  RESOLUTION = 'RESOLUTION',
  DOCUMENTATION = 'DOCUMENTATION',
}

// NEW: Manufacturer Inspection Status
export enum ManufacturerInspectionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// NEW: Checklist Template Type
export enum ChecklistTemplateType {
  MANUFACTURER = 'MANUFACTURER',
  DEALER = 'DEALER',
}

// NEW: Note Author Role
export enum NoteAuthorRole {
  MANUFACTURER = 'MANUFACTURER',
  DEALER = 'DEALER',
}

// Updated: Issue Severity with MODERATE
export enum IssueSeverityLevel {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  CRITICAL = 'CRITICAL',
}
