# Digital Dealer Acceptance Form System
## Comprehensive Architecture & Development Plan

**Version:** 1.0
**Date:** January 2026
**Author:** Development Team
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Context & Problem Statement](#2-business-context--problem-statement)
3. [Stakeholder Analysis](#3-stakeholder-analysis)
4. [Functional Requirements Deep Dive](#4-functional-requirements-deep-dive)
5. [Data Architecture](#5-data-architecture)
6. [System Architecture](#6-system-architecture)
7. [User Experience Design](#7-user-experience-design)
8. [Security & Compliance](#8-security--compliance)
9. [Integration Architecture](#9-integration-architecture)
10. [Technical Implementation Plan](#10-technical-implementation-plan)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment & Operations](#12-deployment--operations)
13. [Risk Analysis & Mitigation](#13-risk-analysis--mitigation)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

### 1.1 Vision Statement

Create a comprehensive digital platform that transforms the dealer unit acceptance process from paper-based checklists to a streamlined, mobile-first digital workflow. This system will provide complete traceability from manufacturer Pre-Delivery Inspection (PDI) through dealer acceptance, creating an auditable chain of custody that protects both manufacturer and dealer interests.

### 1.2 Key Objectives

| Objective | Success Metric | Target |
|-----------|----------------|--------|
| Digitize acceptance process | Paper reduction | 100% digital |
| Reduce acceptance time | Minutes per unit | < 30 minutes |
| Improve issue documentation | Photo evidence rate | 95%+ |
| Enable PDI visibility | Dealer access rate | 100% of units |
| Reduce disputes | Dispute resolution time | 50% reduction |
| Enhance traceability | Audit trail completeness | 100% |

### 1.3 Scope Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DEALER ACCEPTANCE SYSTEM SCOPE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   VIN       │───▶│  PDI        │───▶│  DEALER     │───▶│  WARRANTY   │  │
│  │   LOOKUP    │    │  REVIEW     │    │  CHECKLIST  │    │  CLAIMS     │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                 │                   │                  │          │
│         ▼                 ▼                   ▼                  ▼          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CENTRAL DATA REPOSITORY                          │   │
│  │  • Unit History  • Photo Archive  • Signatures  • Audit Logs       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Business Context & Problem Statement

### 2.1 Current State Analysis

#### 2.1.1 Paper-Based Process Pain Points

```
Current Workflow (Paper-Based):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANUFACTURER                              DEALER
┌────────────────────────┐                ┌────────────────────────┐
│ 1. Complete PDI        │                │ 4. Receive unit        │
│ 2. Print PDI report    │───Transport───▶│ 5. Find paper checklist│
│ 3. Attach to unit      │                │ 6. Manual inspection   │
└────────────────────────┘                │ 7. Handwritten notes   │
                                          │ 8. Polaroid photos?    │
                                          │ 9. File in cabinet     │
                                          └────────────────────────┘
                                                      │
                                                      ▼
                                          ┌────────────────────────┐
                                          │ PROBLEMS:              │
                                          │ • Lost paperwork       │
                                          │ • Illegible notes      │
                                          │ • Missing photos       │
                                          │ • No searchability     │
                                          │ • Dispute hell         │
                                          │ • No standardization   │
                                          │ • PDI not visible      │
                                          └────────────────────────┘
```

#### 2.1.2 Business Impact of Current State

| Problem Area | Annual Impact Estimate |
|--------------|------------------------|
| Disputed warranty claims | $500K - $2M |
| Administrative overhead | 2,000+ man-hours |
| Lost/misfiled documentation | 15% of records |
| Delayed acceptance processing | 2-5 days average |
| Customer delivery delays | 8% of deliveries |

### 2.2 Future State Vision

```
Digital Workflow:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANUFACTURER                              DEALER
┌────────────────────────┐                ┌────────────────────────┐
│ Complete PDI digitally │                │ Scan VIN/Select Unit   │
│         │              │                │         │              │
│         ▼              │                │         ▼              │
│ ┌──────────────────┐   │                │ ┌──────────────────┐   │
│ │ PDI syncs to     │   │                │ │ View PDI results │   │
│ │ cloud instantly  │───┼───Real-time───┼─▶│ on tablet        │   │
│ └──────────────────┘   │                │ └──────────────────┘   │
└────────────────────────┘                │         │              │
                                          │         ▼              │
         ┌────────────────────────────────┼──────────────────┐     │
         │              CLOUD PLATFORM    │                  │     │
         │  ┌─────────────────────────────┴───────────────┐  │     │
         │  │ • Real-time sync                            │  │     │
         │  │ • Photo storage with GPS/timestamp         │  │     │
         │  │ • Digital signatures                       │  │     │
         │  │ • Instant notifications                    │  │     │
         │  │ • Complete audit trail                     │  │     │
         │  └─────────────────────────────────────────────┘  │     │
         └───────────────────────────────────────────────────┘     │
                                          │                        │
                                          │ ┌──────────────────┐   │
                                          │ │ Complete digital │   │
                                          │ │ acceptance form  │   │
                                          │ └──────────────────┘   │
                                          └────────────────────────┘
```

### 2.3 Key Business Drivers

1. **Warranty Cost Reduction** - Clear documentation of unit condition at acceptance
2. **Dealer Relationship Enhancement** - Transparency into PDI process
3. **Regulatory Compliance** - Auditable records for recalls and safety issues
4. **Operational Efficiency** - Eliminate paper handling and filing
5. **Data Analytics** - Identify systemic quality issues across production

---

## 3. Stakeholder Analysis

### 3.1 Stakeholder Matrix

```
                    INTEREST IN PROJECT
                    Low                     High
              ┌──────────────────┬──────────────────┐
         High │                  │                  │
              │   KEEP           │   MANAGE         │
      P       │   SATISFIED      │   CLOSELY        │
      O       │                  │                  │
      W       │ • IT Security    │ • Dealer Owners  │
      E       │ • Legal/Comply   │ • Quality Mgmt   │
      R       │ • Finance        │ • Warranty Dept  │
              │                  │ • Field Service  │
              ├──────────────────┼──────────────────┤
         Low  │                  │                  │
              │   MONITOR        │   KEEP           │
              │                  │   INFORMED       │
              │                  │                  │
              │ • External       │ • Dealer Techs   │
              │   Vendors        │ • PDI Inspectors │
              │ • Competitors    │ • Customers      │
              │                  │                  │
              └──────────────────┴──────────────────┘
```

### 3.2 Detailed Stakeholder Profiles

#### 3.2.1 Primary Users: Dealer Acceptance Personnel

```yaml
Profile: Dealer Technician
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Demographics:
  - Age Range: 25-55
  - Tech Savvy: Medium (smartphone proficient)
  - Environment: Outdoor lot, service bay, office
  - Device Preference: Tablet (iPad/Android)

Pain Points:
  - Time pressure to process units
  - Poor connectivity on outdoor lots
  - Glare on screens in sunlight
  - Dirty/greasy hands while working
  - Multiple interruptions during process

Goals:
  - Complete acceptance quickly
  - Document issues thoroughly
  - Avoid warranty disputes
  - Access historical information easily

Success Metrics:
  - Time to complete acceptance < 30 min
  - Issue documentation rate > 95%
  - Return visits for missed items < 5%
```

#### 3.2.2 Secondary Users: Manufacturer Quality Team

```yaml
Profile: Quality Assurance Manager
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Demographics:
  - Role: QA oversight, PDI management
  - Tech Savvy: High
  - Environment: Office, manufacturing floor
  - Device: Desktop/Laptop

Pain Points:
  - Lack of visibility into dealer acceptance
  - Delayed feedback on production issues
  - Difficulty tracking systemic problems
  - Manual report generation

Goals:
  - Real-time quality metrics
  - Early warning on defect trends
  - Reduce warranty claim rates
  - Improve PDI effectiveness

Success Metrics:
  - Defect trend identification < 24 hours
  - Warranty claim reduction 20%
  - Report generation time < 5 minutes
```

#### 3.2.3 Tertiary Users: Warranty Claims Department

```yaml
Profile: Warranty Claims Processor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Demographics:
  - Role: Claims adjudication
  - Tech Savvy: Medium-High
  - Environment: Office
  - Device: Desktop

Pain Points:
  - Insufficient documentation on claims
  - He-said/she-said disputes
  - Time spent gathering evidence
  - Inconsistent acceptance standards

Goals:
  - Clear acceptance documentation
  - Photo evidence at time of acceptance
  - Comparison to PDI results
  - Quick dispute resolution

Success Metrics:
  - Dispute resolution time < 48 hours
  - Claims with full documentation > 95%
  - Denied claim appeal rate < 10%
```

---

## 4. Functional Requirements Deep Dive

### 4.1 Feature Hierarchy

```
DEALER ACCEPTANCE SYSTEM
│
├── 4.1 VIN MANAGEMENT
│   ├── 4.1.1 VIN Lookup & Selection
│   ├── 4.1.2 VIN Scanning (Barcode/OCR)
│   ├── 4.1.3 Unit Information Display
│   ├── 4.1.4 Expected Units Queue
│   └── 4.1.5 VIN History Timeline
│
├── 4.2 PDI REVIEW
│   ├── 4.2.1 PDI Results Display
│   ├── 4.2.2 PDI Photo Gallery
│   ├── 4.2.3 PDI Notes & Flags
│   ├── 4.2.4 PDI Inspector Information
│   └── 4.2.5 PDI Comparison Mode
│
├── 4.3 ACCEPTANCE CHECKLIST
│   ├── 4.3.1 Dynamic Checklist Loading
│   ├── 4.3.2 Category Navigation
│   ├── 4.3.3 Item Status Marking
│   ├── 4.3.4 Issue Flagging
│   ├── 4.3.5 Conditional Logic
│   └── 4.3.6 Progress Tracking
│
├── 4.4 PHOTO DOCUMENTATION
│   ├── 4.4.1 Camera Integration
│   ├── 4.4.2 Photo Annotation
│   ├── 4.4.3 Photo Organization
│   ├── 4.4.4 Metadata Capture
│   └── 4.4.5 Offline Photo Queue
│
├── 4.5 NOTES & COMMENTS
│   ├── 4.5.1 Item-Level Notes
│   ├── 4.5.2 General Notes
│   ├── 4.5.3 Voice-to-Text
│   ├── 4.5.4 Template Responses
│   └── 4.5.5 Note History
│
├── 4.6 SIGNATURE & SUBMISSION
│   ├── 4.6.1 Digital Signature Capture
│   ├── 4.6.2 Acceptance Declaration
│   ├── 4.6.3 Conditional Acceptance
│   ├── 4.6.4 Rejection Workflow
│   └── 4.6.5 Submission Confirmation
│
├── 4.7 HISTORY & REPORTING
│   ├── 4.7.1 Acceptance History
│   ├── 4.7.2 Unit Timeline View
│   ├── 4.7.3 Export Functions
│   ├── 4.7.4 Analytics Dashboard
│   └── 4.7.5 Trend Analysis
│
└── 4.8 ADMINISTRATION
    ├── 4.8.1 Checklist Builder
    ├── 4.8.2 User Management
    ├── 4.8.3 Dealer Configuration
    ├── 4.8.4 System Settings
    └── 4.8.5 Audit Logs
```

### 4.2 Detailed Feature Specifications

#### 4.2.1 VIN Management Module

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ VIN LOOKUP & SELECTION                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ SEARCH / SCAN                                                       │   │
│  │ ┌─────────────────────────────┐  ┌──────────────────────────────┐  │   │
│  │ │ [____________________] 🔍   │  │  📷 SCAN VIN BARCODE         │  │   │
│  │ │ Enter VIN or last 6 digits │  │  ──────────────────────────   │  │   │
│  │ └─────────────────────────────┘  │  Point camera at VIN plate   │  │   │
│  │                                   └──────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ EXPECTED UNITS (Pending Acceptance)                         Filter ▼│   │
│  │ ───────────────────────────────────────────────────────────────────  │   │
│  │ │ VIN              │ Model        │ Received │ Status    │ Action │  │   │
│  │ ├──────────────────┼──────────────┼──────────┼───────────┼────────┤  │   │
│  │ │ ...ABC123456     │ Aria 3200    │ Jan 5    │ Pending   │ START  │  │   │
│  │ │ ...DEF789012     │ Vegas 2400   │ Jan 5    │ In Prog   │ RESUME │  │   │
│  │ │ ...GHI345678     │ Venetian XL  │ Jan 4    │ Pending   │ START  │  │   │
│  │ │ ...JKL901234     │ Aria 3200    │ Jan 3    │ PDI Issue │ REVIEW │  │   │
│  │ └──────────────────┴──────────────┴──────────┴───────────┴────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RECENT COMPLETIONS                                                  │   │
│  │ ───────────────────────────────────────────────────────────────────  │   │
│  │ │ VIN              │ Completed    │ By         │ Status   │ View  │  │   │
│  │ ├──────────────────┼──────────────┼────────────┼──────────┼───────┤  │   │
│  │ │ ...MNO567890     │ Jan 5 2:30pm │ J. Smith   │ Accepted │  👁️   │  │   │
│  │ │ ...PQR123456     │ Jan 5 11:00am│ M. Jones   │ Cond.    │  👁️   │  │   │
│  │ └──────────────────┴──────────────┴────────────┴──────────┴───────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**VIN Lookup Requirements:**

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| VIN-001 | Support full 17-character VIN entry | Must |
| VIN-002 | Support partial VIN search (last 6-8) | Must |
| VIN-003 | Barcode scanning via device camera | Must |
| VIN-004 | OCR scanning of VIN plates | Should |
| VIN-005 | Auto-complete from expected units list | Must |
| VIN-006 | VIN validation (check digit) | Must |
| VIN-007 | Display unit details on selection | Must |
| VIN-008 | Show PDI completion status | Must |
| VIN-009 | Highlight units with PDI issues | Must |
| VIN-010 | Sort/filter expected units | Should |

**Unit Information Display:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ UNIT DETAILS                                                    VIN: ...123 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ IDENTIFICATION ─────────────────┐  ┌─ STATUS ─────────────────────────┐│
│  │ Full VIN: 1THO123456ABC78901     │  │ PDI Status: ✅ Complete          ││
│  │ Stock #:  THO-2024-0892          │  │ PDI Date:   Jan 3, 2024 2:30pm   ││
│  │ Serial:   892                    │  │ Shipped:    Jan 4, 2024          ││
│  └──────────────────────────────────┘  │ Received:   Jan 5, 2024 9:00am   ││
│                                        │ Days on Lot: 0                   ││
│  ┌─ UNIT SPECIFICATION ─────────────┐  └──────────────────────────────────┘│
│  │ Model Year: 2024                 │                                      │
│  │ Model:      Aria 3200            │  ┌─ PDI SUMMARY ───────────────────┐│
│  │ Trim:       Elite Package        │  │ Inspector: M. Rodriguez         ││
│  │ Exterior:   Champagne Metallic   │  │ Items Checked: 142/142          ││
│  │ Interior:   Saddle Leather       │  │ Issues Found: 3                 ││
│  │ Chassis:    Ford F-53            │  │ Issues Resolved: 3              ││
│  │ Engine:     7.3L V8              │  │ Notes: "Slide seal replaced..." ││
│  │ GVWR:       22,000 lbs           │  │                                 ││
│  └──────────────────────────────────┘  │ [View Full PDI Report]          ││
│                                        └──────────────────────────────────┘│
│  ┌─ OPTIONS & FEATURES ─────────────────────────────────────────────────┐  │
│  │ ☑ Hydraulic Leveling  ☑ Residential Fridge  ☑ Washer/Dryer         │  │
│  │ ☑ Solar Package       ☑ Outdoor Kitchen     ☑ King Bed             │  │
│  │ ☑ Fireplace           ☑ Theater Seating     ☐ Safe                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────────────────┐ │
│  │ VIEW HISTORY │  │  VIEW PDI    │  │     START ACCEPTANCE CHECKLIST   │ │
│  └──────────────┘  └──────────────┘  └───────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 4.2.2 PDI Review Module

```
PDI REVIEW SCREEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│ MANUFACTURER PDI RESULTS                           VIN: 1THO123456ABC78901  │
│ Completed: January 3, 2024 2:30 PM                 Inspector: M. Rodriguez  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─ OVERALL SUMMARY ──────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │   CATEGORIES        ITEMS      PASSED    ISSUES    RESOLVED            │ │
│ │   ───────────────────────────────────────────────────────────────      │ │
│ │   Exterior           24         24         0          -                │ │
│ │   Interior           31         29         2          2 ✓              │ │
│ │   Electrical         28         28         0          -                │ │
│ │   Plumbing           18         17         1          1 ✓              │ │
│ │   Appliances         22         22         0          -                │ │
│ │   Safety             12         12         0          -                │ │
│ │   Documentation       7          7         0          -                │ │
│ │   ───────────────────────────────────────────────────────────────      │ │
│ │   TOTAL             142        139         3          3 ✓              │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ ISSUES FOUND & RESOLUTIONS ───────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │ ⚠️ ISSUE #1 - Interior / Living Area                                   │ │
│ │ ├─ Finding: Dinette table wobble, mounting loose                       │ │
│ │ ├─ Severity: Minor                                                     │ │
│ │ ├─ Resolution: Re-torqued mounting bolts to spec                       │ │
│ │ ├─ Resolved By: T. Martinez                                            │ │
│ │ ├─ Resolved Date: Jan 3, 2024 3:15 PM                                  │ │
│ │ └─ Photos: [Before] [After]                                            │ │
│ │                                                                         │ │
│ │ ⚠️ ISSUE #2 - Interior / Bedroom                                       │ │
│ │ ├─ Finding: Wardrobe door misaligned                                   │ │
│ │ ├─ Severity: Minor                                                     │ │
│ │ ├─ Resolution: Adjusted hinges, door now closes properly               │ │
│ │ ├─ Resolved By: T. Martinez                                            │ │
│ │ ├─ Resolved Date: Jan 3, 2024 3:45 PM                                  │ │
│ │ └─ Photos: [Before] [After]                                            │ │
│ │                                                                         │ │
│ │ ⚠️ ISSUE #3 - Plumbing / Water System                                  │ │
│ │ ├─ Finding: Minor drip at kitchen faucet connection                    │ │
│ │ ├─ Severity: Minor                                                     │ │
│ │ ├─ Resolution: Replaced supply line, tested no leak                    │ │
│ │ ├─ Resolved By: J. Wilson                                              │ │
│ │ ├─ Resolved Date: Jan 3, 2024 4:00 PM                                  │ │
│ │ └─ Photos: [Before] [After]                                            │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ PDI PHOTO GALLERY ────────────────────────────────────────────────────┐ │
│ │  [Img1] [Img2] [Img3] [Img4] [Img5] [Img6] [+24 more...]              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ INSPECTOR NOTES ──────────────────────────────────────────────────────┐ │
│ │ "Unit inspected thoroughly. All systems functional. Three minor        │ │
│ │ issues found and corrected during PDI. Slide seal inspected -         │ │
│ │ recommend dealer verify operation. Unit ready for delivery."          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌───────────────────┐  ┌──────────────────────────────────────────────────┐│
│ │ DOWNLOAD PDF      │  │       PROCEED TO DEALER ACCEPTANCE              ││
│ └───────────────────┘  └──────────────────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**PDI Review Requirements:**

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| PDI-001 | Display complete PDI results summary | Must |
| PDI-002 | Show all issues found during PDI | Must |
| PDI-003 | Display resolution details for each issue | Must |
| PDI-004 | Access PDI photos with zoom capability | Must |
| PDI-005 | View inspector notes and comments | Must |
| PDI-006 | Compare PDI photos to current condition | Should |
| PDI-007 | Flag items for special attention during acceptance | Should |
| PDI-008 | Download PDI report as PDF | Should |
| PDI-009 | Show PDI timeline with timestamps | Should |
| PDI-010 | Display inspector credentials/certification | Could |

#### 4.2.3 Acceptance Checklist Module

```
ACCEPTANCE CHECKLIST STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checklist Hierarchy:
────────────────────

📋 ACCEPTANCE CHECKLIST
│
├── 📁 1. EXTERIOR INSPECTION
│   ├── 📁 1.1 Front Cap
│   │   ├── ☐ 1.1.1 Front cap condition (no cracks/damage)
│   │   ├── ☐ 1.1.2 Headlights operational
│   │   ├── ☐ 1.1.3 Turn signals operational
│   │   ├── ☐ 1.1.4 Clearance lights operational
│   │   ├── ☐ 1.1.5 Graphics/decals intact
│   │   └── ☐ 1.1.6 Windshield condition
│   │
│   ├── 📁 1.2 Driver Side
│   │   ├── ☐ 1.2.1 Entry door operation
│   │   ├── ☐ 1.2.2 Entry door seal
│   │   ├── ☐ 1.2.3 Entry steps extend/retract
│   │   ├── ☐ 1.2.4 Sidewall condition
│   │   ├── ☐ 1.2.5 Windows condition & seals
│   │   ├── ☐ 1.2.6 Compartment doors (if equipped)
│   │   └── ☐ 1.2.7 Awning condition (if equipped)
│   │
│   ├── 📁 1.3 Rear Cap
│   │   ├── ☐ 1.3.1 Rear cap condition
│   │   ├── ☐ 1.3.2 Taillights operational
│   │   ├── ☐ 1.3.3 Backup lights operational
│   │   ├── ☐ 1.3.4 Backup camera (if equipped)
│   │   ├── ☐ 1.3.5 Ladder condition (if equipped)
│   │   └── ☐ 1.3.6 Spare tire/carrier (if equipped)
│   │
│   ├── 📁 1.4 Passenger Side
│   │   └── ... [similar items]
│   │
│   ├── 📁 1.5 Roof
│   │   ├── ☐ 1.5.1 Roof membrane condition
│   │   ├── ☐ 1.5.2 A/C shroud condition
│   │   ├── ☐ 1.5.3 Vent covers condition
│   │   ├── ☐ 1.5.4 Skylight condition (if equipped)
│   │   ├── ☐ 1.5.5 Sealant condition at penetrations
│   │   └── ☐ 1.5.6 Solar panels (if equipped)
│   │
│   └── 📁 1.6 Undercarriage
│       ├── ☐ 1.6.1 Frame condition
│       ├── ☐ 1.6.2 Holding tanks secured
│       ├── ☐ 1.6.3 Dump valve operation
│       ├── ☐ 1.6.4 Suspension components
│       └── ☐ 1.6.5 Tires condition & pressure
│
├── 📁 2. INTERIOR INSPECTION
│   ├── 📁 2.1 Cockpit/Cab
│   ├── 📁 2.2 Living Area
│   ├── 📁 2.3 Kitchen
│   ├── 📁 2.4 Bathroom
│   ├── 📁 2.5 Bedroom
│   └── 📁 2.6 General Interior
│
├── 📁 3. ELECTRICAL SYSTEMS
│   ├── 📁 3.1 12V DC System
│   ├── 📁 3.2 120V AC System
│   ├── 📁 3.3 Generator (if equipped)
│   ├── 📁 3.4 Solar System (if equipped)
│   └── 📁 3.5 Inverter (if equipped)
│
├── 📁 4. PLUMBING SYSTEMS
│   ├── 📁 4.1 Fresh Water System
│   ├── 📁 4.2 Waste Water System
│   ├── 📁 4.3 Water Heater
│   └── 📁 4.4 Water Pump
│
├── 📁 5. HVAC SYSTEMS
│   ├── 📁 5.1 Air Conditioning
│   ├── 📁 5.2 Heating (Furnace)
│   └── 📁 5.3 Ventilation
│
├── 📁 6. APPLIANCES
│   ├── 📁 6.1 Refrigerator
│   ├── 📁 6.2 Cooktop/Oven
│   ├── 📁 6.3 Microwave
│   ├── 📁 6.4 Washer/Dryer (if equipped)
│   └── 📁 6.5 Entertainment System
│
├── 📁 7. LP GAS SYSTEM
│   ├── ☐ 7.1 Tank condition & mounting
│   ├── ☐ 7.2 Regulator condition
│   ├── ☐ 7.3 Leak test performed
│   └── ☐ 7.4 Appliance operation on LP
│
├── 📁 8. SLIDEOUTS (if equipped)
│   ├── ☐ 8.1 Slideout operation - extend
│   ├── ☐ 8.2 Slideout operation - retract
│   ├── ☐ 8.3 Slideout seal condition
│   └── ☐ 8.4 Slideout room fit/alignment
│
├── 📁 9. LEVELING SYSTEM (if equipped)
│   ├── ☐ 9.1 Auto-level function
│   ├── ☐ 9.2 Manual override
│   └── ☐ 9.3 All jacks operational
│
└── 📁 10. DOCUMENTATION
    ├── ☐ 10.1 Owner's manual present
    ├── ☐ 10.2 Warranty documents present
    ├── ☐ 10.3 Appliance manuals present
    ├── ☐ 10.4 MSO/Title documents
    └── ☐ 10.5 Window sticker matches unit
```

**Checklist Item UI:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHECKLIST ITEM                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Section: 1.2 Driver Side                                    Item 3 of 7   │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  1.2.3 Entry Steps Extend/Retract                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                          │
│                                                                             │
│  Instructions:                                                              │
│  • Open entry door to trigger step extension                                │
│  • Verify steps extend fully and lock in position                          │
│  • Close door to retract steps                                             │
│  • Verify steps retract fully and don't drag                               │
│  • Test manual override switch                                             │
│                                                                             │
│  PDI Result: ✅ PASSED                                                      │
│  PDI Notes: "Steps operated smoothly, no issues"                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         YOUR ASSESSMENT                             │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │   │
│  │  │   ✅ PASS       │  │   ⚠️ ISSUE      │  │   ❌ FAIL           │ │   │
│  │  │                 │  │                 │  │                     │ │   │
│  │  │  Item OK        │  │  Minor Issue    │  │  Major Issue        │ │   │
│  │  │  No concerns    │  │  Needs note     │  │  Stop acceptance    │ │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 📷 ADD PHOTO    📝 ADD NOTE    🎤 VOICE NOTE    ⏭️ SKIP (N/A)      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◀ PREVIOUS                                              NEXT ▶            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Checklist Requirements:**

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| CHK-001 | Dynamic checklist based on model/options | Must |
| CHK-002 | Three-state marking (Pass/Issue/Fail) | Must |
| CHK-003 | N/A option for non-applicable items | Must |
| CHK-004 | Photo attachment per item | Must |
| CHK-005 | Notes/comments per item | Must |
| CHK-006 | Show PDI result for comparison | Must |
| CHK-007 | Progress indicator | Must |
| CHK-008 | Save progress (auto-save) | Must |
| CHK-009 | Resume interrupted checklist | Must |
| CHK-010 | Conditional items (show/hide based on options) | Should |
| CHK-011 | Required photo for issues | Should |
| CHK-012 | Voice-to-text for notes | Should |
| CHK-013 | Bulk pass by category | Could |
| CHK-014 | Template responses for common issues | Could |

#### 4.2.4 Photo Documentation Module

```
PHOTO CAPTURE REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Photo Metadata Capture:
───────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│ PHOTO PROPERTIES (Auto-captured)                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📷 Image Properties                                                        │
│  ├── Filename: IMG_20240105_143022_VIN78901_CHK_1_2_3.jpg                   │
│  ├── Resolution: 3024 x 4032 pixels                                        │
│  ├── File Size: 2.4 MB                                                     │
│  └── Format: JPEG (quality 85%)                                            │
│                                                                             │
│  📍 Location Data                                                           │
│  ├── GPS Coordinates: 41.8781° N, 87.6298° W                               │
│  ├── Accuracy: ± 5 meters                                                  │
│  └── Location Name: ABC RV Dealership - Lot Area                           │
│                                                                             │
│  🕐 Timestamp Data                                                          │
│  ├── Capture Time: 2024-01-05 14:30:22 CST                                 │
│  ├── Timezone: America/Chicago                                             │
│  └── Server Verified: ✅ Yes                                               │
│                                                                             │
│  🔗 Association Data                                                        │
│  ├── VIN: 1THO123456ABC78901                                               │
│  ├── Checklist Item: 1.2.3 Entry Steps                                     │
│  ├── Captured By: John Smith (jsmith@abcrv.com)                            │
│  └── Device: iPad Pro (iOS 17.2)                                           │
│                                                                             │
│  🔒 Integrity                                                               │
│  ├── Hash (SHA-256): a3f2b8c9d4e5...                                       │
│  └── Tamper Detection: Original, unmodified                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Photo Annotation Interface:
───────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│ ANNOTATE PHOTO                                           [Save] [Cancel]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                      [PHOTO WITH DAMAGE]                           │   │
│  │                                                                     │   │
│  │                    ┌──────────────┐                                │   │
│  │                    │   ⭕ 1       │◄── Circle annotation           │   │
│  │                    └──────────────┘                                │   │
│  │                                                                     │   │
│  │         ←───────── Arrow pointing to issue                         │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ANNOTATION TOOLS:                                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐    │
│  │  ⭕    │ │  ➡️    │ │  ▭    │ │  ✏️    │ │  Aa    │ │  🎨 Color │    │
│  │ Circle │ │ Arrow  │ │  Box   │ │ Draw   │ │  Text  │ │            │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────────┘    │
│                                                                             │
│  Annotation Notes:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Scratch approximately 4 inches long on entry door panel.            │   │
│  │ Located 18 inches from bottom of door. Not noted in PDI.           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Photo Requirements:**

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| PHT-001 | Capture photos via device camera | Must |
| PHT-002 | Auto-capture GPS coordinates | Must |
| PHT-003 | Auto-capture timestamp | Must |
| PHT-004 | Associate photos with checklist items | Must |
| PHT-005 | Support multiple photos per item | Must |
| PHT-006 | Offline photo storage with queue sync | Must |
| PHT-007 | Photo annotation (circles, arrows, text) | Should |
| PHT-008 | Photo zoom/pan viewing | Must |
| PHT-009 | Photo gallery per unit | Must |
| PHT-010 | Photo hash for integrity verification | Should |
| PHT-011 | Compress photos for upload efficiency | Should |
| PHT-012 | Import from device gallery | Could |
| PHT-013 | Compare photos side-by-side (PDI vs Dealer) | Should |

#### 4.2.5 Signature & Submission Module

```
ACCEPTANCE SUBMISSION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Submission Flow:
────────────────

    ┌──────────────────┐
    │ Checklist        │
    │ Complete?        │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐     No      ┌──────────────────┐
    │ All required     │────────────▶│ Return to        │
    │ items marked?    │             │ incomplete items │
    └────────┬─────────┘             └──────────────────┘
             │ Yes
             ▼
    ┌──────────────────┐     No      ┌──────────────────┐
    │ Issues with      │────────────▶│ Full Acceptance  │
    │ photos?          │             │ Summary          │
    └────────┬─────────┘             └──────────────────┘
             │ Yes                            │
             ▼                                │
    ┌──────────────────┐                      │
    │ Review Issues    │                      │
    │ Summary          │                      │
    └────────┬─────────┘                      │
             │                                │
             ▼                                ▼
    ┌──────────────────────────────────────────────────────┐
    │                 ACCEPTANCE DECISION                  │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
    │  │   ACCEPT    │  │ CONDITIONAL │  │   REJECT    │  │
    │  │   AS-IS     │  │  ACCEPT     │  │             │  │
    │  └─────────────┘  └─────────────┘  └─────────────┘  │
    └──────────────────────────────────────────────────────┘
             │                 │                │
             ▼                 ▼                ▼
    ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
    │ Sign & Submit  │ │ Document       │ │ Document       │
    │                │ │ Conditions     │ │ Rejection      │
    └────────────────┘ │ Sign & Submit  │ │ Reasons        │
                       └────────────────┘ │ Sign & Submit  │
                                          └────────────────┘


Acceptance Summary Screen:
──────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│ ACCEPTANCE SUMMARY                                  VIN: 1THO123456ABC78901 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ CHECKLIST SUMMARY ───────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │   CATEGORY              ITEMS    PASSED    ISSUES    FAILED    N/A    │ │
│  │   ──────────────────────────────────────────────────────────────────  │ │
│  │   Exterior               42       40         2         0        0     │ │
│  │   Interior               38       38         0         0        0     │ │
│  │   Electrical             28       28         0         0        0     │ │
│  │   Plumbing               18       18         0         0        0     │ │
│  │   HVAC                   12       12         0         0        0     │ │
│  │   Appliances             22       22         0         0        0     │ │
│  │   LP Gas                  4        4         0         0        0     │ │
│  │   Slideouts               4        4         0         0        0     │ │
│  │   Leveling                3        3         0         0        0     │ │
│  │   Documentation           5        5         0         0        0     │ │
│  │   ──────────────────────────────────────────────────────────────────  │ │
│  │   TOTAL                 176      174         2         0        0     │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ ISSUES REQUIRING ATTENTION (2) ──────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  ⚠️ 1.4.3 Passenger Side - Compartment Door                           │ │
│  │  └─ Issue: Small dent on compartment door #2                          │ │
│  │  └─ Photos: [2 attached]                                              │ │
│  │  └─ Severity: Minor - Cosmetic                                        │ │
│  │                                                                        │ │
│  │  ⚠️ 1.1.5 Front Cap - Graphics                                        │ │
│  │  └─ Issue: Decal peeling at corner (approx 2")                        │ │
│  │  └─ Photos: [1 attached]                                              │ │
│  │  └─ Severity: Minor - Cosmetic                                        │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ PHOTOS CAPTURED ─────────────────────────────────────────────────────┐ │
│  │  Total Photos: 47  |  Issue Photos: 3  |  General: 44                 │ │
│  │  [View All Photos]                                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ GENERAL NOTES ───────────────────────────────────────────────────────┐ │
│  │  Unit overall in excellent condition. Two minor cosmetic issues       │ │
│  │  documented. Recommend acceptance with conditions.                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ACCEPTANCE DECISION                              │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  ○ FULL ACCEPTANCE                                          │   │   │
│  │  │    Unit accepted without conditions                         │   │   │
│  │  ├─────────────────────────────────────────────────────────────┤   │   │
│  │  │  ● CONDITIONAL ACCEPTANCE                                   │   │   │
│  │  │    Unit accepted with documented conditions                 │   │   │
│  │  │    ┌─────────────────────────────────────────────────────┐ │   │   │
│  │  │    │ Conditions:                                         │ │   │   │
│  │  │    │ □ Manufacturer to provide replacement decal         │ │   │   │
│  │  │    │ □ Credit requested for compartment door dent        │ │   │   │
│  │  │    │ □ Other: _________________________________          │ │   │   │
│  │  │    └─────────────────────────────────────────────────────┘ │   │   │
│  │  ├─────────────────────────────────────────────────────────────┤   │   │
│  │  │  ○ REJECT UNIT                                              │   │   │
│  │  │    Unit not accepted - return to manufacturer               │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                        [PROCEED TO SIGNATURE]                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


Digital Signature Screen:
─────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│ DIGITAL SIGNATURE                                   VIN: 1THO123456ABC78901 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ACCEPTANCE DECLARATION                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━                                                     │
│                                                                             │
│  I, the undersigned, certify that I have personally inspected the          │
│  recreational vehicle identified by VIN 1THO123456ABC78901 and have        │
│  completed the dealer acceptance checklist. I acknowledge:                  │
│                                                                             │
│  • I have reviewed the manufacturer's Pre-Delivery Inspection results      │
│  • I have inspected all accessible areas of the unit                       │
│  • I have documented all issues found during inspection                    │
│  • The photos attached accurately represent the condition of the unit      │
│  • I am authorized to accept units on behalf of ABC RV Dealership          │
│                                                                             │
│  ☑ I agree to the above declaration                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                         SIGN HERE                                   │   │
│  │                                                                     │   │
│  │           ┌─────────────────────────────────────────┐              │   │
│  │           │                                         │              │   │
│  │           │      [Signature capture area]           │              │   │
│  │           │         ~~~~~~~~~~~~~~~~~~~~            │              │   │
│  │           │                                         │              │   │
│  │           └─────────────────────────────────────────┘              │   │
│  │                                                                     │   │
│  │           [Clear]                                                   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Inspector: John Smith                                                      │
│  Date/Time: January 5, 2024 3:45 PM CST                                    │
│  Location:  ABC RV Dealership, Chicago, IL                                 │
│  Device:    iPad Pro (jsmith-ipad-01)                                      │
│                                                                             │
│                     [SUBMIT ACCEPTANCE]                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Architecture

### 5.1 Entity Relationship Diagram

```
ENTITY RELATIONSHIP DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   DEALERSHIP    │       │      USER       │       │   USER_ROLE     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ PK dealer_id    │──┐    │ PK user_id      │───────│ PK role_id      │
│    name         │  │    │ FK dealer_id    │──┐    │    role_name    │
│    code         │  │    │ FK role_id      │  │    │    permissions  │
│    address      │  │    │    email        │  │    └─────────────────┘
│    phone        │  │    │    name         │  │
│    active       │  │    │    active       │  │
└─────────────────┘  │    └─────────────────┘  │
                     │                         │
                     │    ┌─────────────────┐  │
                     └────│   UNIT          │──┘
                          ├─────────────────┤
                          │ PK unit_id      │
          ┌───────────────│ FK dealer_id    │───────────────┐
          │               │    vin          │               │
          │               │    stock_number │               │
          │               │ FK model_id     │               │
          │               │    model_year   │               │
          │               │    exterior     │               │
          │               │    interior     │               │
          │               │    ship_date    │               │
          │               │    receive_date │               │
          │               │    status       │               │
          │               └────────┬────────┘               │
          │                        │                        │
          │                        │                        │
          ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│   PDI_RECORD    │    │ ACCEPTANCE_RECORD   │    │ UNIT_OPTIONS    │
├─────────────────┤    ├─────────────────────┤    ├─────────────────┤
│ PK pdi_id       │    │ PK acceptance_id    │    │ PK unit_opt_id  │
│ FK unit_id      │    │ FK unit_id          │    │ FK unit_id      │
│    completed_at │    │ FK user_id          │    │ FK option_id    │
│    inspector_id │    │    started_at       │    └─────────────────┘
│    status       │    │    completed_at     │            │
│    total_items  │    │    decision         │            │
│    passed_items │    │    conditions       │            ▼
│    failed_items │    │    signature_data   │    ┌─────────────────┐
│    notes        │    │    signature_ip     │    │     OPTION      │
└────────┬────────┘    │    device_info      │    ├─────────────────┤
         │             │    location_data    │    │ PK option_id    │
         │             │    status           │    │    name         │
         ▼             └──────────┬──────────┘    │    category     │
┌─────────────────┐               │               │    code         │
│   PDI_ITEM      │               │               └─────────────────┘
├─────────────────┤               │
│ PK pdi_item_id  │               ▼
│ FK pdi_id       │    ┌─────────────────────┐
│ FK checklist_   │    │ ACCEPTANCE_ITEM     │
│    item_id      │    ├─────────────────────┤
│    status       │    │ PK acc_item_id      │
│    notes        │    │ FK acceptance_id    │
│    resolved     │    │ FK checklist_item_id│
│    resolved_by  │    │    status           │
│    resolved_at  │    │    notes            │
└────────┬────────┘    │    is_issue         │
         │             │    issue_severity   │
         │             └──────────┬──────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌─────────────────────┐
│   PDI_PHOTO     │    │ ACCEPTANCE_PHOTO    │
├─────────────────┤    ├─────────────────────┤
│ PK photo_id     │    │ PK photo_id         │
│ FK pdi_item_id  │    │ FK acc_item_id      │
│    file_path    │    │    file_path        │
│    thumbnail    │    │    thumbnail        │
│    captured_at  │    │    captured_at      │
│    gps_lat      │    │    gps_lat          │
│    gps_long     │    │    gps_long         │
│    annotations  │    │    annotations      │
│    hash         │    │    hash             │
└─────────────────┘    │    metadata         │
                       └─────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│ CHECKLIST TEMPLATE STRUCTURE                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐     │
│  │ CHECKLIST_      │──────│ CHECKLIST_      │──────│ CHECKLIST_      │     │
│  │ TEMPLATE        │      │ CATEGORY        │      │ ITEM            │     │
│  ├─────────────────┤      ├─────────────────┤      ├─────────────────┤     │
│  │ PK template_id  │      │ PK category_id  │      │ PK item_id      │     │
│  │    name         │      │ FK template_id  │      │ FK category_id  │     │
│  │    version      │      │    name         │      │    code         │     │
│  │    model_ids[]  │      │    order_num    │      │    description  │     │
│  │    active       │      │    required     │      │    instructions │     │
│  │    created_at   │      └─────────────────┘      │    order_num    │     │
│  │    created_by   │                               │    required     │     │
│  └─────────────────┘                               │    photo_req    │     │
│                                                    │    condition    │     │
│         ┌─────────────────┐                        │    options[]    │     │
│         │ ITEM_CONDITION  │◄───────────────────────│                 │     │
│         ├─────────────────┤                        └─────────────────┘     │
│         │ PK condition_id │                                                │
│         │ FK item_id      │                                                │
│         │    option_id    │ (Show item if unit has this option)            │
│         │    logic        │ (AND, OR, NOT)                                 │
│         └─────────────────┘                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│ UNIT HISTORY & AUDIT                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐     │
│  │ UNIT_EVENT      │      │ WARRANTY_CLAIM  │      │ AUDIT_LOG       │     │
│  ├─────────────────┤      ├─────────────────┤      ├─────────────────┤     │
│  │ PK event_id     │      │ PK claim_id     │      │ PK log_id       │     │
│  │ FK unit_id      │      │ FK unit_id      │      │    timestamp    │     │
│  │    event_type   │      │ FK acceptance_id│      │    user_id      │     │
│  │    event_date   │      │    claim_number │      │    action       │     │
│  │    description  │      │    claim_date   │      │    entity_type  │     │
│  │    source       │      │    status       │      │    entity_id    │     │
│  │    metadata     │      │    resolution   │      │    old_values   │     │
│  └─────────────────┘      └─────────────────┘      │    new_values   │     │
│                                                    │    ip_address   │     │
│  Event Types:                                      │    device_info  │     │
│  • MANUFACTURED                                    └─────────────────┘     │
│  • PDI_COMPLETED                                                           │
│  • SHIPPED                                                                 │
│  • RECEIVED                                                                │
│  • ACCEPTANCE_STARTED                                                      │
│  • ACCEPTANCE_COMPLETED                                                    │
│  • WARRANTY_CLAIM                                                          │
│  • SERVICE_PERFORMED                                                       │
│  • SOLD                                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Data Dictionary

#### 5.2.1 Core Entities

| Entity | Field | Type | Constraints | Description |
|--------|-------|------|-------------|-------------|
| **UNIT** | unit_id | UUID | PK, NOT NULL | Unique unit identifier |
| | vin | VARCHAR(17) | UNIQUE, NOT NULL | Vehicle Identification Number |
| | stock_number | VARCHAR(20) | | Dealer stock number |
| | model_id | UUID | FK | Reference to model |
| | model_year | INT | NOT NULL | Manufacturing year |
| | status | ENUM | NOT NULL | PENDING_PDI, PDI_COMPLETE, SHIPPED, RECEIVED, ACCEPTED, REJECTED |
| | ship_date | TIMESTAMP | | When shipped from manufacturer |
| | receive_date | TIMESTAMP | | When received at dealer |
| **ACCEPTANCE_RECORD** | acceptance_id | UUID | PK, NOT NULL | Unique acceptance identifier |
| | unit_id | UUID | FK, NOT NULL | Reference to unit |
| | user_id | UUID | FK, NOT NULL | Inspector user |
| | decision | ENUM | NOT NULL | FULL_ACCEPT, CONDITIONAL, REJECT |
| | conditions | JSONB | | Array of condition objects |
| | signature_data | TEXT | | Base64 encoded signature image |
| | status | ENUM | NOT NULL | IN_PROGRESS, COMPLETED, CANCELLED |
| **ACCEPTANCE_ITEM** | acc_item_id | UUID | PK, NOT NULL | Unique item result identifier |
| | acceptance_id | UUID | FK, NOT NULL | Reference to acceptance |
| | checklist_item_id | UUID | FK, NOT NULL | Reference to checklist item |
| | status | ENUM | NOT NULL | PASS, ISSUE, FAIL, NA, PENDING |
| | is_issue | BOOLEAN | DEFAULT FALSE | Whether flagged as issue |
| | issue_severity | ENUM | | MINOR, MODERATE, SEVERE |

### 5.3 Data Flow Diagram

```
DATA FLOW DIAGRAM - LEVEL 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                          External Systems
    ┌─────────────────────────────────────────────────────────────────────┐
    │                                                                     │
    │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
    │   │ Manufacturer│    │    DMS      │    │  Warranty   │            │
    │   │   ERP       │    │  System     │    │   System    │            │
    │   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
    │          │                  │                  │                   │
    └──────────┼──────────────────┼──────────────────┼───────────────────┘
               │                  │                  │
               ▼                  ▼                  ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │                    INTEGRATION LAYER                             │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
    │  │ Unit Import │  │ Dealer Sync │  │ Claim Export│               │
    │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘               │
    └─────────┼────────────────┼────────────────┼──────────────────────┘
              │                │                │
              ▼                ▼                ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │                      APPLICATION LAYER                           │
    │                                                                  │
    │  ┌────────────────────────────────────────────────────────────┐  │
    │  │                                                            │  │
    │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
    │  │  │   VIN    │  │   PDI    │  │ Checklist│  │  Photo   │   │  │
    │  │  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │  │
    │  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │  │
    │  │       │             │             │             │         │  │
    │  │       └─────────────┴──────┬──────┴─────────────┘         │  │
    │  │                            │                               │  │
    │  │                            ▼                               │  │
    │  │                  ┌──────────────────┐                      │  │
    │  │                  │  Acceptance      │                      │  │
    │  │                  │  Orchestrator    │                      │  │
    │  │                  └────────┬─────────┘                      │  │
    │  │                           │                                │  │
    │  └───────────────────────────┼────────────────────────────────┘  │
    │                              │                                   │
    │  ┌───────────────────────────┼────────────────────────────────┐  │
    │  │                           ▼                                │  │
    │  │                  ┌──────────────────┐                      │  │
    │  │                  │   Data Access    │                      │  │
    │  │                  │     Layer        │                      │  │
    │  │                  └────────┬─────────┘                      │  │
    │  │                           │                                │  │
    │  └───────────────────────────┼────────────────────────────────┘  │
    └──────────────────────────────┼───────────────────────────────────┘
                                   │
                                   ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │                        DATA LAYER                                │
    │                                                                  │
    │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
    │   │  PostgreSQL │    │    Redis    │    │    S3/      │         │
    │   │  Database   │    │   Cache     │    │   Blob      │         │
    │   └─────────────┘    └─────────────┘    └─────────────┘         │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘
```

---

## 6. System Architecture

### 6.1 High-Level Architecture

```
SYSTEM ARCHITECTURE OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                    ┌─────────────────────────────────────────────────────┐
                    │                   CLIENT TIER                       │
                    │                                                     │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
                    │  │   Mobile    │  │    Web      │  │   Admin     │ │
                    │  │   App       │  │   Portal    │  │   Console   │ │
                    │  │  (Tablet)   │  │             │  │             │ │
                    │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
                    │         │                │                │        │
                    └─────────┼────────────────┼────────────────┼────────┘
                              │                │                │
                              └────────────────┼────────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────────────┐
                    │              API GATEWAY / LOAD BALANCER            │
                    │                                                     │
                    │  • SSL Termination    • Rate Limiting              │
                    │  • Authentication     • Request Routing            │
                    │  • API Versioning     • CORS Handling              │
                    └─────────────────────────────────────────────────────┘
                                               │
                              ┌────────────────┼────────────────┐
                              │                │                │
                              ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION TIER                                 │
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │   Auth Service    │  │   Unit Service    │  │ Checklist Service │       │
│  │                   │  │                   │  │                   │       │
│  │ • JWT Auth        │  │ • VIN Lookup      │  │ • Template Mgmt   │       │
│  │ • SSO/SAML        │  │ • Unit CRUD       │  │ • Item Evaluation │       │
│  │ • Role Management │  │ • History         │  │ • Progress Track  │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │   PDI Service     │  │ Acceptance Service│  │   Photo Service   │       │
│  │                   │  │                   │  │                   │       │
│  │ • PDI Data Sync   │  │ • Orchestration   │  │ • Upload/Process  │       │
│  │ • Result Display  │  │ • Submission      │  │ • Storage Mgmt    │       │
│  │ • Issue Tracking  │  │ • Signature       │  │ • Thumbnail Gen   │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │ Notification Svc  │  │ Reporting Service │  │  Sync Service     │       │
│  │                   │  │                   │  │                   │       │
│  │ • Email           │  │ • Analytics       │  │ • Offline Sync    │       │
│  │ • Push            │  │ • Export          │  │ • Conflict Res    │       │
│  │ • SMS             │  │ • Dashboards      │  │ • Queue Mgmt      │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                              │                │
              ┌───────────────┴────────────────┴───────────────┐
              │                                                │
              ▼                                                ▼
┌────────────────────────────────┐    ┌────────────────────────────────────────┐
│         DATA TIER              │    │          STORAGE TIER                  │
│                                │    │                                        │
│  ┌──────────────────────────┐  │    │  ┌──────────────────────────────────┐  │
│  │       PostgreSQL         │  │    │  │         Object Storage           │  │
│  │                          │  │    │  │         (S3/Azure Blob)          │  │
│  │  • Primary Database      │  │    │  │                                  │  │
│  │  • Read Replicas         │  │    │  │  • Photo Storage                 │  │
│  │  • Automatic Failover    │  │    │  │  • Document Storage              │  │
│  └──────────────────────────┘  │    │  │  • Backup Storage                │  │
│                                │    │  └──────────────────────────────────┘  │
│  ┌──────────────────────────┐  │    │                                        │
│  │         Redis            │  │    │  ┌──────────────────────────────────┐  │
│  │                          │  │    │  │         CDN                      │  │
│  │  • Session Cache         │  │    │  │                                  │  │
│  │  • Query Cache           │  │    │  │  • Photo Delivery                │  │
│  │  • Sync Queue            │  │    │  │  • Static Assets                 │  │
│  └──────────────────────────┘  │    │  │  • Geographic Distribution       │  │
│                                │    │  └──────────────────────────────────┘  │
└────────────────────────────────┘    └────────────────────────────────────────┘
```

### 6.2 Mobile Architecture (Offline-First)

```
MOBILE APP ARCHITECTURE - OFFLINE-FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│                          MOBILE APPLICATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        PRESENTATION LAYER                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│   │
│  │  │  VIN Lookup │  │ PDI Review  │  │  Checklist  │  │   Summary   ││   │
│  │  │   Screen    │  │   Screen    │  │   Screen    │  │   Screen    ││   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                         │                                   │
│                                         ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         STATE MANAGEMENT                            │   │
│  │                                                                     │   │
│  │   ┌────────────────────────────────────────────────────────────┐   │   │
│  │   │                    Redux / Zustand Store                   │   │   │
│  │   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│   │   │
│  │   │  │  Units      │  │ Acceptance  │  │  Sync Queue         ││   │   │
│  │   │  │  State      │  │  State      │  │  State              ││   │   │
│  │   │  └─────────────┘  └─────────────┘  └─────────────────────┘│   │   │
│  │   └────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                         │                                   │
│                                         ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        SERVICE LAYER                                │   │
│  │                                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ Unit Service │  │ Photo Service│  │ Sync Service │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ • CRUD ops   │  │ • Capture    │  │ • Queue mgmt │              │   │
│  │  │ • Validation │  │ • Compress   │  │ • Conflict   │              │   │
│  │  │ • Transform  │  │ • Annotate   │  │   resolution │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                         │                                   │
│                    ┌────────────────────┴────────────────────┐              │
│                    │                                         │              │
│                    ▼                                         ▼              │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │           LOCAL STORAGE             │  │       NETWORK LAYER         │  │
│  │                                     │  │                             │  │
│  │  ┌─────────────────────────────┐   │  │  ┌───────────────────────┐  │  │
│  │  │        SQLite               │   │  │  │   API Client          │  │  │
│  │  │  • Units                    │   │  │  │                       │  │  │
│  │  │  • Checklists               │   │  │  │ • Retry logic         │  │  │
│  │  │  • Acceptance records       │   │  │  │ • Queue processing    │  │  │
│  │  │  • Photo metadata           │   │  │  │ • Connectivity check  │  │  │
│  │  └─────────────────────────────┘   │  │  └───────────────────────┘  │  │
│  │                                     │  │                             │  │
│  │  ┌─────────────────────────────┐   │  │  ┌───────────────────────┐  │  │
│  │  │     File System             │   │  │  │   Background Sync     │  │  │
│  │  │  • Photo files              │   │  │  │                       │  │  │
│  │  │  • Pending uploads          │   │  │  │ • Periodic sync       │  │  │
│  │  └─────────────────────────────┘   │  │  │ • On-connect sync     │  │  │
│  │                                     │  │  │ • Prioritization      │  │  │
│  └─────────────────────────────────────┘  │  └───────────────────────┘  │  │
│                                           └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘


OFFLINE SYNC STRATEGY
─────────────────────

┌──────────────────────────────────────────────────────────────────────────────┐
│                           SYNC QUEUE MANAGEMENT                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Action (Offline)                                                       │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 1. WRITE TO LOCAL STORAGE                                           │   │
│  │    • Store in SQLite immediately                                    │   │
│  │    • User sees success instantly                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 2. ADD TO SYNC QUEUE                                                │   │
│  │    • Create sync operation record                                   │   │
│  │    • Assign priority (photos = low, submission = high)              │   │
│  │    • Store timestamp and retry count                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 3. BACKGROUND SYNC PROCESSOR                                        │   │
│  │                                                                      │   │
│  │    When Online:                                                     │   │
│  │    ┌────────────────────────────────────────────────────────────┐   │   │
│  │    │ while (queue.hasItems()) {                                 │   │   │
│  │    │   item = queue.getHighestPriority()                        │   │   │
│  │    │   try {                                                    │   │   │
│  │    │     result = await api.sync(item)                          │   │   │
│  │    │     if (result.conflict) {                                 │   │   │
│  │    │       resolvedData = resolveConflict(item, result.server)  │   │   │
│  │    │       await api.sync(resolvedData)                         │   │   │
│  │    │     }                                                      │   │   │
│  │    │     queue.markComplete(item)                               │   │   │
│  │    │     localStorage.updateFromServer(result)                  │   │   │
│  │    │   } catch (error) {                                        │   │   │
│  │    │     if (item.retries < MAX_RETRIES) {                      │   │   │
│  │    │       queue.requeueWithBackoff(item)                       │   │   │
│  │    │     } else {                                               │   │   │
│  │    │       queue.markFailed(item)                               │   │   │
│  │    │       notifyUser(item)                                     │   │   │
│  │    │     }                                                      │   │   │
│  │    │   }                                                        │   │   │
│  │    │ }                                                          │   │   │
│  │    └────────────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


CONFLICT RESOLUTION STRATEGY
────────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│                      CONFLICT RESOLUTION MATRIX                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Scenario                      Resolution Strategy                          │
│  ──────────────────────────────────────────────────────────────────────    │
│  Same record, different       Last-write-wins with timestamp               │
│  fields modified              (Server time authoritative)                   │
│                                                                             │
│  Same field modified          Prompt user to resolve OR                    │
│  on both sides                Server-wins for non-critical fields          │
│                                                                             │
│  Record deleted on            Re-create on server if local has             │
│  server, modified locally     unsynced changes, else accept deletion       │
│                                                                             │
│  Photo uploaded but           Mark as requiring re-upload                  │
│  server rejects               Store failure reason                         │
│                                                                             │
│  Acceptance submitted         Create new acceptance record                 │
│  while offline, unit          Flag for manual review                       │
│  already accepted                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Technology Stack Recommendation

```
TECHNOLOGY STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Mobile Application (Primary - Tablet-optimized)                           │
│  ├── Framework:      React Native                                          │
│  ├── State:          Zustand + React Query                                 │
│  ├── Local Storage:  WatermelonDB (SQLite wrapper)                         │
│  ├── Camera:         react-native-camera-kit                               │
│  ├── Signature:      react-native-signature-capture                        │
│  ├── Offline Sync:   Custom sync engine with queue                         │
│  └── Barcode:        react-native-vision-camera + ML Kit                   │
│                                                                             │
│  Web Portal (Admin/Reporting)                                              │
│  ├── Framework:      React + TypeScript                                    │
│  ├── UI Library:     Tailwind CSS + shadcn/ui                              │
│  ├── State:          Zustand + TanStack Query                              │
│  ├── Charts:         Recharts                                              │
│  └── Tables:         TanStack Table                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ BACKEND                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  API Services                                                              │
│  ├── Runtime:        Node.js 20 LTS                                        │
│  ├── Framework:      NestJS                                                │
│  ├── API:            REST + GraphQL (for complex queries)                  │
│  ├── Validation:     class-validator + class-transformer                   │
│  ├── Documentation:  OpenAPI/Swagger                                       │
│  └── Auth:           Passport.js + JWT                                     │
│                                                                             │
│  Background Jobs                                                           │
│  ├── Queue:          BullMQ                                                │
│  ├── Scheduler:      node-cron                                             │
│  └── Workers:        Separate worker processes                             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ DATA                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Primary Database                                                          │
│  ├── Engine:         PostgreSQL 16                                         │
│  ├── ORM:            Prisma                                                │
│  ├── Migrations:     Prisma Migrate                                        │
│  └── Hosting:        AWS RDS / Azure SQL                                   │
│                                                                             │
│  Caching                                                                   │
│  ├── Engine:         Redis 7                                               │
│  ├── Use Cases:      Session, API cache, sync queue                        │
│  └── Hosting:        AWS ElastiCache / Azure Cache                         │
│                                                                             │
│  Object Storage                                                            │
│  ├── Service:        AWS S3 / Azure Blob Storage                           │
│  ├── CDN:            CloudFront / Azure CDN                                │
│  └── Processing:     Lambda / Azure Functions (thumbnail gen)             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Container Platform                                                        │
│  ├── Orchestration:  Kubernetes (EKS/AKS)                                  │
│  ├── Registry:       ECR / ACR                                             │
│  └── Service Mesh:   (Optional) Istio                                      │
│                                                                             │
│  CI/CD                                                                     │
│  ├── Pipeline:       GitHub Actions                                        │
│  ├── IaC:            Terraform                                             │
│  └── Secrets:        AWS Secrets Manager / Azure Key Vault                 │
│                                                                             │
│  Monitoring                                                                │
│  ├── APM:            Datadog / New Relic                                   │
│  ├── Logging:        CloudWatch / Azure Monitor                            │
│  ├── Alerts:         PagerDuty                                             │
│  └── Analytics:      Amplitude / Mixpanel                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. User Experience Design

### 7.1 Design Principles

```
UX DESIGN PRINCIPLES FOR FIELD USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LARGE TOUCH TARGETS
   ─────────────────────
   • Minimum 48dp touch targets (better: 56dp)
   • Consider users with gloves or dirty hands
   • Spacing between targets to prevent mis-taps

   ┌──────────────────────────────────────────────────────────────────────┐
   │                                                                      │
   │   ┌────────────────────────────────────────────────────────────┐    │
   │   │                                                            │    │
   │   │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │    │
   │   │    │             │    │             │    │             │   │    │
   │   │    │  ✅ PASS    │    │  ⚠️ ISSUE   │    │  ❌ FAIL    │   │    │
   │   │    │             │    │             │    │             │   │    │
   │   │    │   56dp x    │    │   56dp x    │    │   56dp x    │   │    │
   │   │    │   56dp      │    │   56dp      │    │   56dp      │   │    │
   │   │    └─────────────┘    └─────────────┘    └─────────────┘   │    │
   │   │         ◄──────── 16dp spacing ────────▶                   │    │
   │   └────────────────────────────────────────────────────────────┘    │
   │                                                                      │
   └──────────────────────────────────────────────────────────────────────┘

2. HIGH CONTRAST FOR OUTDOOR USE
   ──────────────────────────────
   • Support light/dark modes with auto-detect
   • High contrast text (4.5:1 minimum ratio)
   • Avoid pure white backgrounds (causes glare)
   • Use color + icons (never color alone)

   ┌─────────────────────────────────────────────────────────────────────┐
   │                    STATUS INDICATORS                                │
   │                                                                     │
   │   INDOOR MODE                      OUTDOOR/HIGH-CONTRAST MODE      │
   │   ┌─────────────┐                  ┌─────────────┐                 │
   │   │ ✅ Passed   │                  │ ▓▓▓▓▓▓▓▓▓▓▓ │ ✓ PASSED       │
   │   │ (green)     │                  │ (dark green │                 │
   │   └─────────────┘                  │  + bold)    │                 │
   │   ┌─────────────┐                  └─────────────┘                 │
   │   │ ⚠️ Issue    │                  ┌─────────────┐                 │
   │   │ (yellow)    │                  │ ░░░░░░░░░░░ │ ! ISSUE        │
   │   └─────────────┘                  │ (orange +   │                 │
   │   ┌─────────────┐                  │  bold)      │                 │
   │   │ ❌ Failed   │                  └─────────────┘                 │
   │   │ (red)       │                  ┌─────────────┐                 │
   │   └─────────────┘                  │ ▒▒▒▒▒▒▒▒▒▒▒ │ ✕ FAILED       │
   │                                    │ (dark red   │                 │
   │                                    │  + bold)    │                 │
   │                                    └─────────────┘                 │
   └─────────────────────────────────────────────────────────────────────┘

3. MINIMAL DATA ENTRY
   ───────────────────
   • Pre-populated fields where possible
   • Smart defaults based on context
   • Voice input for notes
   • Quick-select common responses
   • Avoid keyboards when possible

4. CLEAR PROGRESS INDICATION
   ──────────────────────────
   ┌─────────────────────────────────────────────────────────────────────┐
   │                                                                     │
   │  EXTERIOR ████████████████████░░░░░░░░░░░  42/56  75%              │
   │                                                                     │
   │  ┌────────────────────────────────────────────────────────────┐    │
   │  │  Section: Front Cap                           5 of 7 items  │    │
   │  │  ─────────────────────────────────────────────────────────  │    │
   │  │  ● ● ● ● ● ○ ○                                              │    │
   │  └────────────────────────────────────────────────────────────┘    │
   │                                                                     │
   └─────────────────────────────────────────────────────────────────────┘

5. OFFLINE-AWARE UI
   ─────────────────
   ┌─────────────────────────────────────────────────────────────────────┐
   │                                                                     │
   │  ┌──── Header Bar ────────────────────────────────────────────┐    │
   │  │                                                            │    │
   │  │  📡 Offline Mode                      ⏳ 12 items pending   │    │
   │  │  ─────────────────────────────────────────────────────────  │    │
   │  │  Data will sync when connection is restored                │    │
   │  │                                                            │    │
   │  └────────────────────────────────────────────────────────────┘    │
   │                                                                     │
   │  Visual indicators:                                                │
   │  • Persistent banner when offline                                  │
   │  • Sync status icon in header                                      │
   │  • Item-level sync status (✓ synced, ⏳ pending, ⚠️ failed)        │
   │  • Auto-dismiss notifications on successful sync                  │
   │                                                                     │
   └─────────────────────────────────────────────────────────────────────┘

6. INTERRUPTIBLE WORKFLOW
   ───────────────────────
   • Auto-save every action
   • Clear resume points
   • No data loss on app close/crash
   • "Continue where you left off" on restart
```

### 7.2 Screen Flow

```
USER FLOW DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                              ┌──────────────┐
                              │    LOGIN     │
                              │    SCREEN    │
                              └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │    HOME      │
                              │   SCREEN     │
                              └──────┬───────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
       │   PENDING    │       │   HISTORY    │       │   SETTINGS   │
       │    UNITS     │       │    VIEW      │       │              │
       └──────┬───────┘       └──────────────┘       └──────────────┘
              │
              ▼
       ┌──────────────┐         ┌──────────────┐
       │  VIN LOOKUP  │────────▶│  VIN DETAILS │
       │   / SCAN     │         │    SCREEN    │
       └──────────────┘         └──────┬───────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
             │  UNIT        │   │    PDI       │   │   START      │
             │  HISTORY     │   │   REVIEW     │   │  CHECKLIST   │
             └──────────────┘   └──────────────┘   └──────┬───────┘
                                                          │
                              ┌────────────────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  CHECKLIST   │◄────────────────┐
                       │   SCREEN     │                 │
                       └──────┬───────┘                 │
                              │                         │
                              │                         │
              ┌───────────────┴───────────────┐        │
              │                               │        │
              ▼                               ▼        │
       ┌──────────────┐               ┌──────────────┐ │
       │   ITEM       │               │    PHOTO     │ │
       │   DETAIL     │               │   CAPTURE    │─┘
       └──────────────┘               └──────────────┘
              │
              │ (Last item completed)
              ▼
       ┌──────────────┐
       │   SUMMARY    │
       │    SCREEN    │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │  SIGNATURE   │
       │    SCREEN    │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ CONFIRMATION │
       │    SCREEN    │
       └──────────────┘
```

### 7.3 Wireframe Concepts

```
HOME SCREEN WIREFRAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│ ≡                    DEALER ACCEPTANCE                              👤 JS  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        Good afternoon, John                                 │
│                        ABC RV Dealership                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │     📷  SCAN VIN                    🔍  SEARCH VIN                 │   │
│  │                                                                     │   │
│  │   Scan barcode                    Enter VIN or                     │   │
│  │   on window                       stock number                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                             │
│  PENDING ACCEPTANCE                                              See All ▶ │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🚐  ARIA 3200 ELITE                                      RECEIVED │   │
│  │     VIN: ...ABC78901                                      Jan 5   │   │
│  │     ✅ PDI Complete  │  3 issues resolved                         │   │
│  │                                                   [START] ────────▶│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🚐  VEGAS 2400                                          IN PROGRESS│   │
│  │     VIN: ...DEF12345                                      Jan 4   │   │
│  │     Progress: ████████░░░░░░░░ 52%                                │   │
│  │                                                  [RESUME] ────────▶│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🚐  VENETIAN XL                                          RECEIVED │   │
│  │     VIN: ...GHI67890                                      Jan 4   │   │
│  │     ⚠️  PDI has 2 unresolved issues                               │   │
│  │                                                  [REVIEW] ────────▶│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                             │
│  RECENT COMPLETIONS                                              See All ▶ │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ✅  PALAZZO 35.5                              ACCEPTED  │  Jan 3  │   │
│  │     VIN: ...JKL23456                          by J.Smith│  2:30pm │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    🏠 Home        📋 Pending        📊 History        ⚙️ Settings          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


CHECKLIST ITEM WIREFRAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│ ◀ Back           ARIA 3200 - ...78901                          Save & Exit │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EXTERIOR INSPECTION                                    42/56 items  75%   │
│  ████████████████████████████████████████░░░░░░░░░░░░░░░░░                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Section: 1.2 DRIVER SIDE                                    Item 3 of 7   │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  1.2.3 ENTRY STEPS OPERATION                                       │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │ Check that entry steps:                                       │ │   │
│  │  │ • Extend when door opens                                      │ │   │
│  │  │ • Retract when door closes                                    │ │   │
│  │  │ • Lock firmly in extended position                            │ │   │
│  │  │ • Manual override switch works                                │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │  PDI RESULT: ✅ PASSED                                             │   │
│  │  Notes: "Steps operated smoothly"                                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  YOUR ASSESSMENT:                                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌───────────────────┐  ┌───────────────────┐  ┌─────────────────┐ │   │
│  │  │                   │  │                   │  │                 │ │   │
│  │  │       ✅          │  │       ⚠️          │  │       ❌        │ │   │
│  │  │                   │  │                   │  │                 │ │   │
│  │  │      PASS         │  │      ISSUE        │  │      FAIL       │ │   │
│  │  │                   │  │                   │  │                 │ │   │
│  │  │   Item is OK      │  │   Minor issue     │  │   Major issue   │ │   │
│  │  │                   │  │   needs doc       │  │   stop here     │ │   │
│  │  │                   │  │                   │  │                 │ │   │
│  │  └───────────────────┘  └───────────────────┘  └─────────────────┘ │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                                                                    │    │
│  │   📷 Add Photo     📝 Add Note     🎤 Voice Note     ⏭️ Skip (N/A) │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────┐                      ┌─────────────────────────┐  │
│  │                     │                      │                         │  │
│  │    ◀ PREVIOUS       │                      │      NEXT ▶             │  │
│  │                     │                      │                         │  │
│  └─────────────────────┘                      └─────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Security & Compliance

### 8.1 Security Architecture

```
SECURITY ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LAYER 1: NETWORK SECURITY                                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • TLS 1.3 for all communications                                   │   │
│  │ • Certificate pinning in mobile apps                               │   │
│  │ • WAF (Web Application Firewall)                                   │   │
│  │ • DDoS protection                                                  │   │
│  │ • IP allowlisting for admin access                                 │   │
│  │ • VPN for internal services                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  LAYER 2: APPLICATION SECURITY                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • JWT with short expiry + refresh tokens                           │   │
│  │ • Role-based access control (RBAC)                                 │   │
│  │ • Input validation and sanitization                                │   │
│  │ • SQL injection prevention (parameterized queries)                 │   │
│  │ • XSS prevention (output encoding)                                 │   │
│  │ • CSRF protection                                                  │   │
│  │ • Rate limiting per user/endpoint                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  LAYER 3: DATA SECURITY                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • Encryption at rest (AES-256)                                     │   │
│  │ • Encryption in transit (TLS 1.3)                                  │   │
│  │ • Field-level encryption for sensitive data                        │   │
│  │ • Secure key management (AWS KMS / Azure Key Vault)                │   │
│  │ • Database access via service accounts only                        │   │
│  │ • No PII in logs                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  LAYER 4: DEVICE SECURITY (Mobile)                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • Encrypted local database                                         │   │
│  │ • Secure keychain for credentials                                  │   │
│  │ • Biometric authentication option                                  │   │
│  │ • Remote wipe capability                                           │   │
│  │ • Jailbreak/root detection                                         │   │
│  │ • Screenshot prevention on sensitive screens                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


AUTHENTICATION FLOW
───────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  User                    App                    Auth Server    API Server  │
│    │                      │                          │             │        │
│    │──── Login ──────────▶│                          │             │        │
│    │                      │──── Credentials ────────▶│             │        │
│    │                      │                          │             │        │
│    │                      │◀─── JWT + Refresh ───────│             │        │
│    │                      │                          │             │        │
│    │                      │ Store securely           │             │        │
│    │                      │ (Keychain/Keystore)      │             │        │
│    │                      │                          │             │        │
│    │──── API Request ────▶│                          │             │        │
│    │                      │──── Request + JWT ──────────────────────▶│      │
│    │                      │                          │             │        │
│    │                      │                          │◀── Validate │        │
│    │                      │                          │    JWT ─────│        │
│    │                      │                          │             │        │
│    │                      │◀─── Response ─────────────────────────────│     │
│    │◀── Display ──────────│                          │             │        │
│    │                      │                          │             │        │
│    │         [Token Expiry]                          │             │        │
│    │                      │                          │             │        │
│    │                      │──── Refresh Token ──────▶│             │        │
│    │                      │◀─── New JWT ────────────│             │        │
│    │                      │                          │             │        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Role-Based Access Control

```
RBAC MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│                        ROLE PERMISSIONS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Permission                    │ Dealer │ Dealer │ Mfg QA │ Mfg    │ System│
│                                │  Tech  │  Admin │        │ Admin  │ Admin │
│  ──────────────────────────────┼────────┼────────┼────────┼────────┼───────│
│                                │        │        │        │        │       │
│  VIEW UNITS (Own Dealer)       │   ✅   │   ✅   │   ❌   │   ❌   │  ✅   │
│  VIEW UNITS (All Dealers)      │   ❌   │   ❌   │   ✅   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
│  VIEW PDI RESULTS              │   ✅   │   ✅   │   ✅   │   ✅   │  ✅   │
│  MODIFY PDI RESULTS            │   ❌   │   ❌   │   ✅   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
│  PERFORM ACCEPTANCE            │   ✅   │   ✅   │   ❌   │   ❌   │  ❌   │
│  VIEW ACCEPTANCE (Own)         │   ✅   │   ✅   │   ❌   │   ❌   │  ✅   │
│  VIEW ACCEPTANCE (All)         │   ❌   │   ✅   │   ✅   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
│  CAPTURE PHOTOS                │   ✅   │   ✅   │   ❌   │   ❌   │  ❌   │
│  VIEW PHOTOS (Own Dealer)      │   ✅   │   ✅   │   ❌   │   ❌   │  ✅   │
│  VIEW PHOTOS (All)             │   ❌   │   ❌   │   ✅   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
│  SIGN ACCEPTANCE               │   ✅   │   ✅   │   ❌   │   ❌   │  ❌   │
│  OVERRIDE ACCEPTANCE           │   ❌   │   ❌   │   ❌   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
│  VIEW REPORTS (Own Dealer)     │   ❌   │   ✅   │   ❌   │   ❌   │  ✅   │
│  VIEW REPORTS (All)            │   ❌   │   ❌   │   ✅   │   ✅   │  ✅   │
│  EXPORT DATA                   │   ❌   │   ✅   │   ✅   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
│  MANAGE USERS (Own Dealer)     │   ❌   │   ✅   │   ❌   │   ❌   │  ✅   │
│  MANAGE USERS (All)            │   ❌   │   ❌   │   ❌   │   ✅   │  ✅   │
│  MANAGE DEALERS                │   ❌   │   ❌   │   ❌   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
│  MANAGE CHECKLISTS             │   ❌   │   ❌   │   ✅   │   ✅   │  ✅   │
│  SYSTEM CONFIGURATION          │   ❌   │   ❌   │   ❌   │   ❌   │  ✅   │
│  VIEW AUDIT LOGS               │   ❌   │   ❌   │   ❌   │   ✅   │  ✅   │
│                                │        │        │        │        │       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Compliance Considerations

| Regulation | Applicability | Key Requirements |
|------------|---------------|------------------|
| **GDPR** | If EU dealers/data | Data minimization, right to deletion, consent |
| **CCPA** | California dealers | Privacy policy, opt-out, data access rights |
| **SOC 2** | Enterprise customers | Security controls, audit trails, access management |
| **PCI DSS** | If payments processed | Encryption, access controls, network security |
| **Industry Standards** | RV Industry | Documentation retention, warranty record keeping |

---

## 9. Integration Architecture

### 9.1 Integration Patterns

```
INTEGRATION ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│                          MANUFACTURER SYSTEMS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  ERP System     │    │  PDI System     │    │  Warranty       │         │
│  │  (SAP/Oracle)   │    │  (Internal)     │    │  System         │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                   │
│           │                      │                      │                   │
│           ▼                      ▼                      ▼                   │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    INTEGRATION MIDDLEWARE                          │    │
│  │                                                                    │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │    │
│  │  │   Message    │  │    API       │  │       ETL/CDC            │ │    │
│  │  │   Queue      │  │   Gateway    │  │    (Data Sync)           │ │    │
│  │  │  (RabbitMQ)  │  │              │  │                          │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                              │                                              │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DEALER ACCEPTANCE SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                      INTEGRATION SERVICES                          │    │
│  │                                                                    │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐   │    │
│  │  │ Unit Import    │  │ PDI Sync       │  │ Claim Export       │   │    │
│  │  │ Service        │  │ Service        │  │ Service            │   │    │
│  │  │                │  │                │  │                    │   │    │
│  │  │ • New units    │  │ • PDI results  │  │ • Acceptance data  │   │    │
│  │  │ • Updates      │  │ • Photos       │  │ • Issue history    │   │    │
│  │  │ • Options      │  │ • Resolutions  │  │ • Photo evidence   │   │    │
│  │  └────────────────┘  └────────────────┘  └────────────────────┘   │    │
│  │                                                                    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEALER SYSTEMS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  DMS System     │    │  CRM System     │    │  Service        │         │
│  │  (CDK/Reynolds) │    │  (Salesforce)   │    │  Scheduling     │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


DATA FLOW: UNIT IMPORT
──────────────────────

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ERP System                                      Dealer Acceptance System   │
│                                                                              │
│  ┌───────────────┐                              ┌───────────────────────┐   │
│  │ Unit Record   │                              │ Unit Import Service   │   │
│  │               │                              │                       │   │
│  │ {             │                              │ 1. Validate VIN       │   │
│  │   vin: "...", │     Message Queue           │ 2. Check for dupe     │   │
│  │   model: ..., │────▶ ────────────── ────────▶│ 3. Enrich data       │   │
│  │   ship_date,  │     unit.created            │ 4. Create record      │   │
│  │   dealer_id,  │                              │ 5. Notify dealer      │   │
│  │   options: [] │                              │                       │   │
│  │ }             │                              └───────────┬───────────┘   │
│  └───────────────┘                                          │               │
│                                                             ▼               │
│                                                ┌───────────────────────┐    │
│                                                │ Database              │    │
│                                                │                       │    │
│                                                │ units table           │    │
│                                                │ unit_options table    │    │
│                                                │ unit_events table     │    │
│                                                └───────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


DATA FLOW: PDI SYNC
───────────────────

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  PDI System                                      Dealer Acceptance System   │
│                                                                              │
│  ┌───────────────┐                              ┌───────────────────────┐   │
│  │ PDI Completed │                              │ PDI Sync Service      │   │
│  │               │                              │                       │   │
│  │ {             │     Webhook                  │ 1. Validate payload   │   │
│  │   vin: "...", │────▶ POST /api/pdi ─────────▶│ 2. Match to unit     │   │
│  │   inspector,  │                              │ 3. Store results      │   │
│  │   items: [],  │                              │ 4. Download photos    │   │
│  │   photos: [], │                              │ 5. Update unit status │   │
│  │   notes: "..."|                              │ 6. Queue notification │   │
│  │ }             │                              │                       │   │
│  └───────────────┘                              └───────────┬───────────┘   │
│                                                             │               │
│                      ┌──────────────────────────────────────┘               │
│                      │                                                      │
│                      ▼                                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │   Database                          Object Storage                   │  │
│  │   ┌─────────────────┐               ┌─────────────────────────────┐  │  │
│  │   │ pdi_records     │               │ /pdi-photos/{vin}/{id}.jpg  │  │  │
│  │   │ pdi_items       │               │                             │  │  │
│  │   │ pdi_photos      │──────────────▶│ Thumbnail generation        │  │  │
│  │   └─────────────────┘               │ CDN distribution            │  │  │
│  │                                     └─────────────────────────────┘  │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 API Specifications

```yaml
# API SPECIFICATION OVERVIEW
# ─────────────────────────────────────────────────────────────────────────────

openapi: 3.0.3
info:
  title: Dealer Acceptance System API
  version: 1.0.0
  description: API for managing RV dealer acceptance workflows

# Key Endpoints:

paths:
  # ─────────────────────────────────────────────────────────────────────────
  # UNIT MANAGEMENT
  # ─────────────────────────────────────────────────────────────────────────

  /api/v1/units:
    get:
      summary: List units for dealer
      parameters:
        - name: status
          in: query
          schema:
            enum: [pending, accepted, rejected]
        - name: page
          in: query
          schema:
            type: integer
    post:
      summary: Create new unit (internal/integration)

  /api/v1/units/{vin}:
    get:
      summary: Get unit details by VIN

  /api/v1/units/{vin}/history:
    get:
      summary: Get unit event history

  # ─────────────────────────────────────────────────────────────────────────
  # PDI MANAGEMENT
  # ─────────────────────────────────────────────────────────────────────────

  /api/v1/units/{vin}/pdi:
    get:
      summary: Get PDI results for unit

  /api/v1/pdi:
    post:
      summary: Receive PDI data (webhook)

  # ─────────────────────────────────────────────────────────────────────────
  # ACCEPTANCE MANAGEMENT
  # ─────────────────────────────────────────────────────────────────────────

  /api/v1/acceptances:
    post:
      summary: Start new acceptance
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                vin:
                  type: string

  /api/v1/acceptances/{id}:
    get:
      summary: Get acceptance details
    patch:
      summary: Update acceptance (items, notes)

  /api/v1/acceptances/{id}/items:
    get:
      summary: List checklist items with status
    patch:
      summary: Bulk update item statuses

  /api/v1/acceptances/{id}/items/{itemId}:
    patch:
      summary: Update single item

  /api/v1/acceptances/{id}/submit:
    post:
      summary: Submit completed acceptance
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                decision:
                  enum: [full_accept, conditional, reject]
                conditions:
                  type: array
                signature:
                  type: string
                  format: base64

  # ─────────────────────────────────────────────────────────────────────────
  # PHOTO MANAGEMENT
  # ─────────────────────────────────────────────────────────────────────────

  /api/v1/acceptances/{id}/photos:
    post:
      summary: Upload photo
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                item_id:
                  type: string
                metadata:
                  type: object

  /api/v1/photos/{id}:
    get:
      summary: Get photo (redirects to CDN)
    delete:
      summary: Delete photo

  # ─────────────────────────────────────────────────────────────────────────
  # OFFLINE SYNC
  # ─────────────────────────────────────────────────────────────────────────

  /api/v1/sync:
    post:
      summary: Sync offline changes
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                operations:
                  type: array
                  items:
                    type: object
                    properties:
                      type:
                        enum: [create, update, delete]
                      entity:
                        type: string
                      data:
                        type: object
                      timestamp:
                        type: string
                        format: date-time
      responses:
        200:
          description: Sync results
          content:
            application/json:
              schema:
                type: object
                properties:
                  processed:
                    type: integer
                  conflicts:
                    type: array
                  serverChanges:
                    type: array
```

---

## 10. Technical Implementation Plan

### 10.1 Development Phases

```
DEVELOPMENT PHASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1: FOUNDATION
───────────────────────────────────────────────────────────────────────────────

  BACKEND INFRASTRUCTURE
  ├── Set up cloud infrastructure (AWS/Azure)
  ├── Database schema design & implementation
  ├── API framework setup (NestJS)
  ├── Authentication system (JWT)
  ├── Basic CRUD operations for units
  └── CI/CD pipeline setup

  MOBILE APP FOUNDATION
  ├── React Native project setup
  ├── Navigation structure
  ├── State management setup
  ├── Local database (WatermelonDB)
  ├── Basic UI component library
  └── Authentication flow

  DELIVERABLES:
  • Working API with auth
  • Mobile app shell with login
  • Basic unit listing
  • Database with seed data


PHASE 2: CORE FEATURES
───────────────────────────────────────────────────────────────────────────────

  VIN MANAGEMENT
  ├── VIN search functionality
  ├── Barcode scanner integration
  ├── Unit details display
  ├── Expected units queue
  └── Unit history view

  PDI INTEGRATION
  ├── PDI data import API
  ├── PDI results display
  ├── PDI photo gallery
  ├── Issue tracking display
  └── PDI webhook receiver

  CHECKLIST ENGINE
  ├── Dynamic checklist loading
  ├── Checklist item rendering
  ├── Status marking (Pass/Issue/Fail)
  ├── Progress tracking
  ├── Auto-save functionality
  └── Resume interrupted checklist

  DELIVERABLES:
  • Complete VIN lookup/scan
  • PDI data visible to dealers
  • Functional checklist workflow


PHASE 3: DOCUMENTATION & SUBMISSION
───────────────────────────────────────────────────────────────────────────────

  PHOTO SYSTEM
  ├── Camera integration
  ├── Photo capture with metadata
  ├── Photo annotation tools
  ├── Photo gallery per item
  ├── Photo upload to cloud storage
  └── Thumbnail generation

  NOTES SYSTEM
  ├── Item-level notes
  ├── General acceptance notes
  ├── Voice-to-text integration
  └── Template responses

  SIGNATURE & SUBMISSION
  ├── Digital signature capture
  ├── Acceptance declaration
  ├── Submission workflow
  ├── Confirmation screen
  └── PDF generation

  DELIVERABLES:
  • Full photo documentation
  • Complete notes system
  • End-to-end acceptance submission


PHASE 4: OFFLINE & SYNC
───────────────────────────────────────────────────────────────────────────────

  OFFLINE CAPABILITY
  ├── Local data caching
  ├── Offline checklist completion
  ├── Photo queue for upload
  ├── Connectivity detection
  └── Offline mode UI indicators

  SYNC ENGINE
  ├── Background sync service
  ├── Conflict detection
  ├── Conflict resolution
  ├── Sync status tracking
  └── Retry logic with backoff

  DELIVERABLES:
  • Full offline functionality
  • Reliable sync mechanism
  • Conflict resolution


PHASE 5: REPORTING & ADMINISTRATION
───────────────────────────────────────────────────────────────────────────────

  WEB PORTAL
  ├── Admin dashboard
  ├── Acceptance history view
  ├── Search and filtering
  ├── Export functionality
  └── User management

  ANALYTICS & REPORTING
  ├── Acceptance metrics dashboard
  ├── Issue trend analysis
  ├── Dealer performance reports
  ├── Quality metrics for manufacturer
  └── Custom report builder

  CHECKLIST ADMINISTRATION
  ├── Checklist template builder
  ├── Version management
  ├── Model/option associations
  └── Conditional logic editor

  DELIVERABLES:
  • Complete admin portal
  • Analytics dashboard
  • Self-service checklist management


PHASE 6: INTEGRATION & POLISH
───────────────────────────────────────────────────────────────────────────────

  EXTERNAL INTEGRATIONS
  ├── ERP unit import
  ├── DMS integration
  ├── Warranty system export
  └── Email notifications

  OPTIMIZATION
  ├── Performance optimization
  ├── Battery usage optimization
  ├── Photo compression tuning
  └── API response caching

  POLISH
  ├── UI/UX refinements
  ├── Accessibility improvements
  ├── Error handling enhancement
  └── Help documentation

  DELIVERABLES:
  • Production-ready system
  • All integrations live
  • Optimized performance
```

### 10.2 Database Migration Strategy

```sql
-- MIGRATION STRATEGY
-- ═══════════════════════════════════════════════════════════════════════════

-- Migration 001: Core Tables
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address JSONB,
    phone VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID REFERENCES dealers(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100),
    active BOOLEAN DEFAULT true
);

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vin VARCHAR(17) UNIQUE NOT NULL,
    stock_number VARCHAR(50),
    dealer_id UUID REFERENCES dealers(id),
    model_id UUID REFERENCES models(id),
    model_year INTEGER NOT NULL,
    exterior_color VARCHAR(100),
    interior_color VARCHAR(100),
    chassis_type VARCHAR(100),
    ship_date TIMESTAMPTZ,
    receive_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'pending_pdi',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_units_vin ON units(vin);
CREATE INDEX idx_units_dealer ON units(dealer_id);
CREATE INDEX idx_units_status ON units(status);


-- Migration 002: PDI Tables
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE pdi_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) NOT NULL,
    inspector_id VARCHAR(100),
    inspector_name VARCHAR(255),
    completed_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'complete',
    total_items INTEGER,
    passed_items INTEGER,
    failed_items INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pdi_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pdi_id UUID REFERENCES pdi_records(id) NOT NULL,
    checklist_item_id UUID,
    item_code VARCHAR(50),
    item_description TEXT,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pdi_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pdi_item_id UUID REFERENCES pdi_items(id),
    pdi_id UUID REFERENCES pdi_records(id),
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    photo_type VARCHAR(50) DEFAULT 'general',
    captured_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Migration 003: Acceptance Tables
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE acceptance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    decision VARCHAR(50),
    conditions JSONB,
    general_notes TEXT,
    signature_data TEXT,
    signature_timestamp TIMESTAMPTZ,
    signature_ip VARCHAR(50),
    device_info JSONB,
    location_data JSONB,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE acceptance_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acceptance_id UUID REFERENCES acceptance_records(id) NOT NULL,
    checklist_item_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    is_issue BOOLEAN DEFAULT false,
    issue_severity VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE acceptance_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acceptance_item_id UUID REFERENCES acceptance_items(id),
    acceptance_id UUID REFERENCES acceptance_records(id),
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    original_filename VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    captured_at TIMESTAMPTZ NOT NULL,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    gps_accuracy DECIMAL(10, 2),
    annotations JSONB,
    file_hash VARCHAR(64),
    metadata JSONB,
    sync_status VARCHAR(20) DEFAULT 'synced',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_acceptance_unit ON acceptance_records(unit_id);
CREATE INDEX idx_acceptance_status ON acceptance_records(status);
CREATE INDEX idx_acceptance_items_acceptance ON acceptance_items(acceptance_id);


-- Migration 004: Checklist Templates
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    version INTEGER DEFAULT 1,
    description TEXT,
    model_ids UUID[],
    active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklist_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES checklist_templates(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    order_num INTEGER NOT NULL,
    required BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES checklist_categories(id) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    order_num INTEGER NOT NULL,
    required BOOLEAN DEFAULT true,
    photo_required BOOLEAN DEFAULT false,
    photo_required_on_issue BOOLEAN DEFAULT true,
    condition_logic JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Migration 005: Audit & Events
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE unit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    description TEXT,
    source VARCHAR(100),
    user_id UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    request_id VARCHAR(100)
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);


-- Migration 006: Sync Support
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    payload JSONB NOT NULL,
    client_timestamp TIMESTAMPTZ NOT NULL,
    server_timestamp TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_user_device ON sync_queue(user_id, device_id);
```

---

## 11. Testing Strategy

### 11.1 Test Pyramid

```
TEST PYRAMID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                          ┌─────────────────┐
                         /                   \
                        /    E2E / UI Tests   \         10%
                       /    (Playwright/Detox) \        Slowest
                      /─────────────────────────\       Most realistic
                     /                           \
                    /     Integration Tests       \     20%
                   /      (API, Database)          \    Medium speed
                  /─────────────────────────────────\   Component interaction
                 /                                   \
                /          Unit Tests                 \  70%
               /    (Jest, React Testing Library)      \ Fastest
              /─────────────────────────────────────────\ Isolated logic
             ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔


TEST CATEGORIES
───────────────────────────────────────────────────────────────────────────────

UNIT TESTS
├── Business Logic
│   ├── VIN validation
│   ├── Checklist completion rules
│   ├── Issue severity calculation
│   └── Sync conflict resolution
│
├── Data Transformations
│   ├── API response mapping
│   ├── Local storage serialization
│   └── Photo metadata extraction
│
├── UI Components
│   ├── Checklist item rendering
│   ├── Progress indicator
│   ├── Photo annotation tools
│   └── Signature capture

INTEGRATION TESTS
├── API Endpoints
│   ├── Authentication flow
│   ├── Unit CRUD operations
│   ├── Acceptance workflow
│   └── Photo upload
│
├── Database Operations
│   ├── Transaction integrity
│   ├── Constraint validation
│   └── Query performance
│
├── External Services
│   ├── Cloud storage upload
│   ├── Push notifications
│   └── PDI webhook processing

E2E TESTS
├── Critical User Journeys
│   ├── Complete acceptance happy path
│   ├── Conditional acceptance with issues
│   ├── Rejection workflow
│   └── Offline completion and sync
│
├── Cross-Platform
│   ├── iOS tablet
│   ├── Android tablet
│   └── Web portal
```

### 11.2 Test Scenarios

```
CRITICAL TEST SCENARIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENARIO 1: HAPPY PATH ACCEPTANCE
─────────────────────────────────────────────────────────────────────────────

  Given: A dealer technician is logged in
    And: A unit with completed PDI is available

  When:
    1. Technician selects unit from pending list
    2. Reviews PDI results
    3. Completes all checklist items (all pass)
    4. Adds 5 general documentation photos
    5. Signs acceptance
    6. Submits acceptance

  Then:
    • Acceptance record created with 'full_accept' decision
    • All photos uploaded and associated
    • Unit status updated to 'accepted'
    • Dealer admin notified
    • Manufacturer notified
    • Audit log entries created


SCENARIO 2: CONDITIONAL ACCEPTANCE WITH ISSUES
─────────────────────────────────────────────────────────────────────────────

  Given: A dealer technician is logged in
    And: A unit with completed PDI is available

  When:
    1. Technician selects unit
    2. During checklist, marks 2 items as "Issue"
    3. Adds photos to each issue
    4. Adds notes describing issues
    5. Selects "Conditional Acceptance"
    6. Specifies conditions (credit for damage, replacement part)
    7. Signs and submits

  Then:
    • Acceptance record created with 'conditional' decision
    • Conditions stored with acceptance
    • Issue items linked to photos and notes
    • Unit status updated to 'conditionally_accepted'
    • Warranty department notified of conditions
    • Follow-up workflow triggered


SCENARIO 3: OFFLINE COMPLETION AND SYNC
─────────────────────────────────────────────────────────────────────────────

  Given: A dealer technician is logged in
    And: Unit and checklist data are cached locally
    And: Device goes offline

  When:
    1. Technician starts acceptance offline
    2. Completes all checklist items
    3. Captures 10 photos (stored locally)
    4. Signs acceptance (signature stored locally)
    5. Submits acceptance (queued for sync)
    6. Device reconnects to network

  Then:
    • Sync engine detects pending operations
    • Photos uploaded in priority order
    • Acceptance data synced to server
    • Local records updated with server IDs
    • User notified of successful sync
    • No data loss


SCENARIO 4: SYNC CONFLICT RESOLUTION
─────────────────────────────────────────────────────────────────────────────

  Given: Technician A starts acceptance on unit offline
    And: Technician B (different device) also starts on same unit
    And: Both complete and submit offline
    And: Technician B's device syncs first

  When: Technician A's device syncs

  Then:
    • Conflict detected (unit already has completed acceptance)
    • Technician A's acceptance saved as "duplicate_pending_review"
    • Technician A notified of conflict
    • Admin receives conflict alert
    • Both acceptance records preserved for review
    • Neither record auto-deleted


SCENARIO 5: INTERRUPTED SESSION RECOVERY
─────────────────────────────────────────────────────────────────────────────

  Given: Technician is mid-checklist
    And: 50% of items completed
    And: App crashes / device dies / user logs out

  When: Technician reopens app and logs in

  Then:
    • "Resume" option shown for in-progress acceptance
    • All previous progress restored
    • Photos already captured still associated
    • Can continue from where left off
    • Progress percentage accurate


SCENARIO 6: LARGE PHOTO BATCH UPLOAD
─────────────────────────────────────────────────────────────────────────────

  Given: Technician completes acceptance with 50 photos
    And: Network is slow (3G equivalent)

  When: Technician submits acceptance

  Then:
    • Upload progress shown to user
    • Photos queued and uploaded sequentially
    • Failed uploads automatically retried
    • User can continue using app during upload
    • Submission confirmed once critical data synced
    • Photos continue uploading in background
```

---

## 12. Deployment & Operations

### 12.1 Deployment Architecture

```
DEPLOYMENT ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCTION ENVIRONMENT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  REGION: US-EAST-1 (Primary)           REGION: US-WEST-2 (DR)              │
│  ┌─────────────────────────────┐      ┌─────────────────────────────┐      │
│  │                             │      │                             │      │
│  │  ┌─────────────────────┐   │      │  ┌─────────────────────┐   │      │
│  │  │   CloudFront CDN    │   │      │  │   CloudFront CDN    │   │      │
│  │  └──────────┬──────────┘   │      │  └─────────────────────┘   │      │
│  │             │              │      │                             │      │
│  │  ┌──────────▼──────────┐   │      │                             │      │
│  │  │ Application Load    │   │      │                             │      │
│  │  │    Balancer         │   │      │                             │      │
│  │  └──────────┬──────────┘   │      │                             │      │
│  │             │              │      │                             │      │
│  │  ┌──────────▼──────────┐   │      │  ┌─────────────────────┐   │      │
│  │  │    EKS Cluster      │   │      │  │    EKS Cluster      │   │      │
│  │  │                     │   │      │  │    (Standby)        │   │      │
│  │  │  ┌───────────────┐  │   │      │  └─────────────────────┘   │      │
│  │  │  │ API Pods (3x) │  │   │      │                             │      │
│  │  │  └───────────────┘  │   │      │                             │      │
│  │  │  ┌───────────────┐  │   │      │                             │      │
│  │  │  │Worker Pods(2x)│  │   │      │                             │      │
│  │  │  └───────────────┘  │   │      │                             │      │
│  │  └─────────────────────┘   │      │                             │      │
│  │                             │      │                             │      │
│  │  ┌─────────────────────┐   │      │  ┌─────────────────────┐   │      │
│  │  │     RDS Primary     │───┼──────┼─▶│    RDS Replica     │   │      │
│  │  │     PostgreSQL      │   │      │  │    (Read Replica)   │   │      │
│  │  └─────────────────────┘   │      │  └─────────────────────┘   │      │
│  │                             │      │                             │      │
│  │  ┌─────────────────────┐   │      │                             │      │
│  │  │   ElastiCache       │   │      │                             │      │
│  │  │   Redis Cluster     │   │      │                             │      │
│  │  └─────────────────────┘   │      │                             │      │
│  │                             │      │                             │      │
│  │  ┌─────────────────────┐   │      │  ┌─────────────────────┐   │      │
│  │  │      S3 Bucket      │───┼──────┼─▶│   S3 Replica        │   │      │
│  │  │  (Photos/Assets)    │   │ CRR  │  │                     │   │      │
│  │  └─────────────────────┘   │      │  └─────────────────────┘   │      │
│  │                             │      │                             │      │
│  └─────────────────────────────┘      └─────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


CI/CD PIPELINE
──────────────────────────────────────────────────────────────────────────────

  ┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
  │            │     │            │     │            │     │            │
  │   Commit   │────▶│   Build    │────▶│    Test    │────▶│  Security  │
  │            │     │            │     │            │     │    Scan    │
  └────────────┘     └────────────┘     └────────────┘     └─────┬──────┘
                                                                 │
       ┌─────────────────────────────────────────────────────────┘
       │
       ▼
  ┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
  │            │     │            │     │            │     │            │
  │   Deploy   │────▶│   Deploy   │────▶│   Smoke    │────▶│  Promote   │
  │    Dev     │     │  Staging   │     │   Tests    │     │    Prod    │
  │            │     │            │     │            │     │            │
  └────────────┘     └────────────┘     └────────────┘     └────────────┘
                           │
                           │ Manual Approval Gate
                           ▼
                     ┌────────────┐
                     │            │
                     │  UAT Sign  │
                     │    Off     │
                     │            │
                     └────────────┘
```

### 12.2 Monitoring & Alerting

```
OBSERVABILITY STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│                          MONITORING ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DATA SOURCES                PROCESSING                 VISUALIZATION       │
│                                                                             │
│  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐     │
│  │ Application │            │             │            │             │     │
│  │   Logs      │──────────▶ │  CloudWatch │ ─────────▶ │  Grafana    │     │
│  └─────────────┘            │    Logs     │            │  Dashboards │     │
│                             │             │            │             │     │
│  ┌─────────────┐            └─────────────┘            └─────────────┘     │
│  │   Metrics   │                                                           │
│  │  (Prometheus│            ┌─────────────┐            ┌─────────────┐     │
│  │   format)   │──────────▶ │   Datadog   │ ─────────▶ │  Datadog    │     │
│  └─────────────┘            │     APM     │            │  Dashboard  │     │
│                             └─────────────┘            └─────────────┘     │
│  ┌─────────────┐                                                           │
│  │   Traces    │            ┌─────────────┐            ┌─────────────┐     │
│  │ (OpenTelemetry)─────────▶│  X-Ray /    │ ─────────▶ │   Trace     │     │
│  └─────────────┘            │   Jaeger    │            │   Viewer    │     │
│                             └─────────────┘            └─────────────┘     │
│  ┌─────────────┐                                                           │
│  │   Mobile    │            ┌─────────────┐            ┌─────────────┐     │
│  │   Crashes   │──────────▶ │  Sentry /   │ ─────────▶ │   Crash     │     │
│  └─────────────┘            │  Crashlytics│            │   Reports   │     │
│                             └─────────────┘            └─────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


KEY METRICS & ALERTS
────────────────────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│  METRIC                      │ WARNING         │ CRITICAL        │ ACTION  │
├──────────────────────────────┼─────────────────┼─────────────────┼─────────┤
│                              │                 │                 │         │
│  API Response Time (p95)     │ > 500ms         │ > 2000ms        │ Page    │
│  API Error Rate              │ > 1%            │ > 5%            │ Page    │
│  Database Connection Pool    │ > 80%           │ > 95%           │ Page    │
│  Photo Upload Failure Rate   │ > 5%            │ > 20%           │ Slack   │
│  Sync Queue Backlog          │ > 1000          │ > 5000          │ Page    │
│  Mobile Crash Rate           │ > 0.5%          │ > 2%            │ Slack   │
│  Login Failure Rate          │ > 5%            │ > 15%           │ Page    │
│  CPU Utilization             │ > 70%           │ > 90%           │ Auto-   │
│                              │                 │                 │ scale   │
│  Memory Utilization          │ > 80%           │ > 95%           │ Page    │
│  Disk Space                  │ < 30%           │ < 10%           │ Page    │
│  SSL Certificate Expiry      │ < 30 days       │ < 7 days        │ Ticket  │
│                              │                 │                 │         │
└─────────────────────────────────────────────────────────────────────────────┘


BUSINESS METRICS DASHBOARD
──────────────────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│                       DAILY OPERATIONS DASHBOARD                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TODAY'S ACTIVITY                           TRENDS (7 DAY)                 │
│  ┌────────────────────────────────┐        ┌────────────────────────────┐  │
│  │ Acceptances Started:    45     │        │ ▃▄▅▆▇█▇ Acceptances/Day   │  │
│  │ Acceptances Completed:  38     │        │                            │  │
│  │ Conditional:            12     │        │ ▂▃▃▄▄▅▄ Issues Found/Day  │  │
│  │ Rejections:              2     │        │                            │  │
│  │ Photos Uploaded:       847     │        │ ▁▂▂▃▄▅█ Photo Volume      │  │
│  └────────────────────────────────┘        └────────────────────────────┘  │
│                                                                             │
│  SYSTEM HEALTH                              TOP ISSUES TODAY               │
│  ┌────────────────────────────────┐        ┌────────────────────────────┐  │
│  │ API Status:        ✅ Healthy  │        │ 1. Exterior scratches (8)  │  │
│  │ Database:          ✅ Healthy  │        │ 2. Slide seal (5)          │  │
│  │ Photo Storage:     ✅ Healthy  │        │ 3. Step operation (4)      │  │
│  │ Sync Service:      ✅ Healthy  │        │ 4. A/C function (3)        │  │
│  │ Mobile App:        ✅ v2.3.1   │        │ 5. Documentation (2)       │  │
│  └────────────────────────────────┘        └────────────────────────────┘  │
│                                                                             │
│  DEALER PERFORMANCE                         PENDING SYNC                   │
│  ┌────────────────────────────────┐        ┌────────────────────────────┐  │
│  │ ABC RV:     ████████░░ 12/day  │        │ Photos pending:      234   │  │
│  │ XYZ Motors: ██████░░░░  8/day  │        │ Acceptances pending:  12   │  │
│  │ Best RV:    █████░░░░░  6/day  │        │ Oldest pending:    2 hrs   │  │
│  │ RV World:   ████░░░░░░  5/day  │        │ Avg sync time:     45 sec  │  │
│  └────────────────────────────────┘        └────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Risk Analysis & Mitigation

### 13.1 Risk Matrix

```
RISK ASSESSMENT MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                           IMPACT
                   Low        Medium       High
              ┌──────────┬──────────┬──────────┐
         High │   R5     │    R2    │   R1     │
              │          │    R7    │   R3     │
              ├──────────┼──────────┼──────────┤
LIKELIHOOD    │          │    R8    │   R4     │
       Medium │   R9     │    R10   │          │
              ├──────────┼──────────┼──────────┤
         Low  │   R11    │    R6    │          │
              │          │          │          │
              └──────────┴──────────┴──────────┘


RISK REGISTER
────────────────────────────────────────────────────────────────────────────────

┌────┬───────────────────────────────┬────────────┬────────────┬──────────────┐
│ ID │ Risk Description              │ Likelihood │ Impact     │ Score        │
├────┼───────────────────────────────┼────────────┼────────────┼──────────────┤
│ R1 │ Offline sync data loss        │ High       │ High       │ CRITICAL     │
│ R2 │ Photo upload failures at scale│ High       │ Medium     │ HIGH         │
│ R3 │ User adoption resistance      │ High       │ High       │ CRITICAL     │
│ R4 │ Integration failures with ERP │ Medium     │ High       │ HIGH         │
│ R5 │ Mobile app crashes            │ High       │ Low        │ MEDIUM       │
│ R6 │ Security breach / data leak   │ Low        │ Medium     │ MEDIUM       │
│ R7 │ Poor network at dealer lots   │ High       │ Medium     │ HIGH         │
│ R8 │ Checklist changes mid-rollout │ Medium     │ Medium     │ MEDIUM       │
│ R9 │ Device compatibility issues   │ Medium     │ Low        │ LOW          │
│ R10│ Performance degradation       │ Medium     │ Medium     │ MEDIUM       │
│ R11│ Third-party service outages   │ Low        │ Low        │ LOW          │
└────┴───────────────────────────────┴────────────┴────────────┴──────────────┘


DETAILED RISK MITIGATION
────────────────────────────────────────────────────────────────────────────────

R1: OFFLINE SYNC DATA LOSS (CRITICAL)
─────────────────────────────────────
Risk: Data entered while offline could be lost due to sync failures,
      conflicts, or app crashes.

Mitigation:
• Implement aggressive auto-save (every action)
• Store data in encrypted local database immediately
• Use write-ahead logging for all operations
• Implement retry queue with exponential backoff
• Show clear sync status to users
• Allow manual sync trigger
• Provide data export for emergency recovery
• Comprehensive conflict resolution with no data deletion

Monitoring:
• Track sync failure rates by user/device
• Alert on sync queue buildup
• Log all conflict resolutions


R2: PHOTO UPLOAD FAILURES AT SCALE (HIGH)
─────────────────────────────────────────
Risk: Large photo volumes could overwhelm upload capacity,
      especially on slow networks.

Mitigation:
• Client-side photo compression (80% quality JPEG)
• Chunked uploads with resume capability
• Background upload queue with prioritization
• CDN-accelerated upload endpoints
• Thumbnail-first strategy (upload thumbnail immediately)
• Retry logic with network quality detection
• Offline photo queue with progress visibility

Monitoring:
• Upload success rate by network type
• Average upload time by file size
• Queue depth and processing rate


R3: USER ADOPTION RESISTANCE (CRITICAL)
───────────────────────────────────────
Risk: Dealer technicians may resist changing from paper
      to digital workflow.

Mitigation:
• Design for speed (faster than paper)
• Minimize required fields
• Large, easy-to-tap buttons
• Voice input for notes
• Training materials and videos
• Champion program at early adopter dealers
• Feedback collection and rapid iteration
• Show value (PDI visibility, history access)
• Executive sponsorship and incentives

Monitoring:
• Usage rates by dealer
• Checklist completion times
• Feature adoption rates
• User satisfaction surveys


R4: INTEGRATION FAILURES WITH ERP (HIGH)
────────────────────────────────────────
Risk: ERP integration could fail, preventing unit data
      from flowing to the system.

Mitigation:
• Robust error handling in integration layer
• Queue-based processing with dead letter handling
• Manual unit entry fallback
• Health monitoring of integration endpoints
• Automatic alerting on integration failures
• Regular integration testing
• Documentation of data mapping

Monitoring:
• Integration success/failure rates
• Message queue depth
• Data freshness (time since last sync)


R7: POOR NETWORK AT DEALER LOTS (HIGH)
──────────────────────────────────────
Risk: Outdoor dealer lots often have poor cellular/WiFi
      coverage, impacting real-time functionality.

Mitigation:
• Offline-first architecture (core design principle)
• Aggressive data caching
• Background sync when connectivity improves
• Low-bandwidth mode option
• Progressive loading of images
• Compress all API responses
• Local-first validation

Monitoring:
• Offline usage rates
• Sync times by dealer location
• Network quality metrics from app
```

### 13.2 Contingency Plans

```
CONTINGENCY PLANS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTINGENCY 1: COMPLETE SYSTEM OUTAGE
─────────────────────────────────────────────────────────────────────────────

Trigger: API unavailable for > 15 minutes

Actions:
1. Activate status page with estimated recovery
2. Enable read-only mode from DR region
3. Mobile apps continue in offline mode
4. Push notification to all users about outage
5. Escalate to on-call engineering team
6. Begin incident response procedure

Recovery:
• Failover to DR region if > 1 hour
• Root cause analysis within 24 hours
• Post-mortem within 1 week


CONTINGENCY 2: PHOTO STORAGE FAILURE
─────────────────────────────────────────────────────────────────────────────

Trigger: S3/Blob storage unavailable or upload failures > 50%

Actions:
1. Redirect uploads to backup storage account
2. Queue photos locally with extended retention
3. Alert users of delayed photo processing
4. Disable photo-required validation temporarily
5. Monitor backup storage capacity

Recovery:
• Process backlog when primary restored
• Verify no photo loss
• Update monitoring thresholds


CONTINGENCY 3: MOBILE APP STORE REJECTION
─────────────────────────────────────────────────────────────────────────────

Trigger: Critical update rejected by Apple/Google

Actions:
1. Enable web app fallback (responsive mobile site)
2. Communicate workaround to dealers
3. Address rejection reasons immediately
4. Expedited review request
5. If privacy-related, engage legal team

Recovery:
• Resubmit within 48 hours
• Maintain web fallback until approved


CONTINGENCY 4: DATA BREACH
─────────────────────────────────────────────────────────────────────────────

Trigger: Suspected unauthorized data access

Actions:
1. Isolate affected systems immediately
2. Revoke all active sessions
3. Engage security incident response team
4. Preserve logs and evidence
5. Assess scope of breach
6. Notify legal and compliance teams
7. Prepare customer notification if required

Recovery:
• Complete security audit
• Implement additional controls
• Regulatory notifications if required
• Customer communication plan
```

---

## 14. Appendices

### 14.1 Glossary

| Term | Definition |
|------|------------|
| **PDI** | Pre-Delivery Inspection - Manufacturer inspection before shipping |
| **VIN** | Vehicle Identification Number - 17-character unique identifier |
| **DMS** | Dealer Management System - Software for dealer operations |
| **GVWR** | Gross Vehicle Weight Rating - Maximum loaded weight |
| **MSO** | Manufacturer Statement of Origin - Title document |
| **Conditional Acceptance** | Acceptance with documented issues requiring resolution |
| **Sync Queue** | Local queue of changes pending upload to server |
| **Offline-First** | Architecture where local operation is primary, sync secondary |

### 14.2 Reference Documents

1. RVIA Standards for RV Construction and Safety
2. NHTSA VIN Decoding Standards
3. SOC 2 Type II Compliance Requirements
4. Mobile App Store Guidelines (iOS/Android)
5. WCAG 2.1 Accessibility Guidelines
6. OWASP Mobile Security Testing Guide

### 14.3 Checklist Template Example

```yaml
# Example Checklist Template Structure
# ────────────────────────────────────────────────────────────────────────────

template:
  name: "Class A Motorhome - Standard Acceptance"
  version: 2.3
  effective_date: "2024-01-01"
  applies_to:
    - model_codes: ["ARIA", "PALAZZO", "VENETIAN"]
    - model_years: [2023, 2024, 2025]

categories:
  - name: "Exterior Inspection"
    code: "EXT"
    required: true
    items:
      - code: "EXT-001"
        description: "Front cap - no cracks, chips, or damage"
        instructions: "Inspect entire front cap surface under good lighting"
        required: true
        photo_required_on_issue: true

      - code: "EXT-002"
        description: "Headlights operational (low and high beam)"
        instructions: "Test both headlights in low and high beam modes"
        required: true

      - code: "EXT-003"
        description: "Awning extends and retracts properly"
        instructions: "Fully extend awning, check fabric, retract fully"
        required: true
        condition:
          option_required: "AWNING_POWER"

      - code: "EXT-004"
        description: "Solar panels secure and undamaged"
        instructions: "Inspect roof-mounted solar panels if equipped"
        required: true
        condition:
          option_required: "SOLAR_PACKAGE"

  - name: "Slideout Operation"
    code: "SLIDE"
    required: true
    condition:
      has_slideouts: true
    items:
      - code: "SLIDE-001"
        description: "Living room slide extends fully"
        instructions: "Extend slide, verify full extension, no binding"
        required: true
        photo_required: true
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | Development Team | Initial comprehensive plan |

---

**END OF DOCUMENT**
