export interface User {
  id: string
  email: string
  name: string
  role: string
  dealerId?: string
  dealer?: Dealer
}

export interface Dealer {
  id: string
  name: string
  code: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  phone?: string
  email?: string
  active: boolean
}

export interface Model {
  id: string
  name: string
  code: string
  category?: string
}

export interface Unit {
  id: string
  vin: string
  stockNumber?: string
  dealerId?: string
  modelId?: string
  modelYear: number
  exteriorColor?: string
  interiorColor?: string
  chassisType?: string
  engineType?: string
  gvwr?: number
  shipDate?: string
  receiveDate?: string
  status: UnitStatus
  model?: Model
  dealer?: Dealer
  pdiRecords?: PdiRecord[]
  acceptanceRecords?: AcceptanceRecord[]
}

export type UnitStatus =
  | 'PENDING_PDI'
  | 'PDI_COMPLETE'
  | 'PDI_ISSUES'
  | 'SHIPPED'
  | 'RECEIVED'
  | 'IN_ACCEPTANCE'
  | 'ACCEPTED'
  | 'CONDITIONALLY_ACCEPTED'
  | 'REJECTED'

export interface PdiRecord {
  id: string
  unitId: string
  inspectorName?: string
  completedAt: string
  status: 'IN_PROGRESS' | 'COMPLETE' | 'ISSUES_PENDING'
  totalItems?: number
  passedItems?: number
  failedItems?: number
  notes?: string
  pdiItems?: PdiItem[]
  pdiPhotos?: PdiPhoto[]
}

export interface PdiItem {
  id: string
  itemCode?: string
  itemDescription?: string
  status: ItemStatus
  notes?: string
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: string
  resolutionNotes?: string
  pdiPhotos?: PdiPhoto[]
}

export interface PdiPhoto {
  id: string
  filePath: string
  thumbnailPath?: string
  photoType: string
}

export interface AcceptanceRecord {
  id: string
  unitId: string
  userId: string
  startedAt: string
  completedAt?: string
  decision?: AcceptanceDecision
  conditions?: AcceptanceCondition[]
  generalNotes?: string
  signatureData?: string
  status: AcceptanceStatus
  unit?: Unit
  user?: User
  acceptanceItems?: AcceptanceItem[]
  acceptancePhotos?: AcceptancePhoto[]
}

export type AcceptanceDecision = 'FULL_ACCEPT' | 'CONDITIONAL' | 'REJECT'
export type AcceptanceStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface AcceptanceCondition {
  description: string
  type?: string
  relatedItemId?: string
}

export interface AcceptanceItem {
  id: string
  checklistItemId: string
  status: ItemStatus
  notes?: string
  isIssue: boolean
  issueSeverity?: IssueSeverity
  checklistItem?: ChecklistItem
  acceptancePhotos?: AcceptancePhoto[]
}

export type ItemStatus = 'PENDING' | 'PASS' | 'ISSUE' | 'FAIL' | 'NA'
export type IssueSeverity = 'MINOR' | 'MODERATE' | 'SEVERE'

export interface AcceptancePhoto {
  id: string
  filePath: string
  thumbnailPath?: string
  capturedAt: string
}

export interface ChecklistTemplate {
  id: string
  name: string
  version: number
  description?: string
  active: boolean
  categories?: ChecklistCategory[]
}

export interface ChecklistCategory {
  id: string
  name: string
  code?: string
  description?: string
  orderNum: number
  required: boolean
  items?: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  code: string
  description: string
  instructions?: string
  orderNum: number
  required: boolean
  photoRequired: boolean
  photoRequiredOnIssue: boolean
  category?: ChecklistCategory
}

export interface AcceptanceProgress {
  acceptanceId: string
  total: number
  completed: number
  passed: number
  issues: number
  failed: number
  skipped: number
  percentComplete: number
  byCategory: Record<string, {
    total: number
    completed: number
    passed: number
    issues: number
    failed: number
  }>
  photoCount: number
}
