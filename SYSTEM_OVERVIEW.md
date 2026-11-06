# Gaborone & Regional MoESD Teacher Placement & Transfer Hub
## Operational Manual & System Architecture Guide

This comprehensive document details the functional specifications, underlying business logic, and code-level design of the **Botswana MoESD (Ministry of Education and Skills Development) Teacher Placement & Transfer Hub**.

---

### 1. Executive Summary & Core Mandate

The **MoESD Teacher Placement & Transfer Hub** is a modernized, high-performance web dashboard engineered to streamline, audit, and regulate the allocation, emergency replacement, and periodic rotation of educators across Botswana's national schools.

By automating traditional spreadsheet tracking and physical letter submissions, the application implements a unified platform that solves three critical challenges in school staffing:
1. **Emergency Teacher Vacancies**: Speedy identification of staff shortages due to maternity leaves, medical absences, sudden resignations, or STEM Conversions.
2. **Point-Based Applicant Allocation**: Matching certified educators to open vacancies using objective performance indices and qualification checking.
3. **Sub-Regional Tenure Rotation**: Identifying educators who have overstayed at a single physical campus (beyond the MoESD 8-year recommended tenure limit) and coordinating their structural rotation to understaffed rural and urban schools.

---

### 2. Multi-Role Architectural Portals

The application implements a safe, secure, role-based boundary system allowing five distinct categories of users to execute their specific mandates.

#### A. Applicant Portal (The Educator Interface)
Designed for local, certified teachers looking for new permanent placements, active transfers, or temporary relief duties:
* **Mogopolo (Omang) Number Tracking**: Secure login and verification using Botswana's national Omang ID structure (preconfigured around unique identification profiles like `172481923`).
* **Interactive Timeline Logs**: Real-time status tracker following MoESD review loops: `RECEIVED` $\rightarrow$ `UNDER REVIEW` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `PLACED` $\rightarrow$ `REJECTED`.
* **Document Verification Locker**: Secure mock storage showing certification states of crucial administrative proofs:
  * Certified copies of National ID (Omang)
  * Academic transcripts and teaching certificates (e.g., from the University of Botswana or Tonota College of Education)
  * Signed letters of recommendation and performance evaluations.

#### B. Institutional Head Portal (The Schoolhead Interface)
Tailored to administrative workflows of local school principals (e.g., Gaborone Secondary, Swaneng Hill, Kanye Secondary):
* **Live Staffing Gaps & Vacancy Logging**: Facility supervisors can create staffing shortfall items immediately.
* **Typified Vacancies**: Define vacancies across specific categories including:
  * *Medical Leave*
  * *Maternity*
  * *Emergency Absence*
  * *Resignation*
  * *Permanent Vacancy Gap*
  * *STEM Vacancy Shortage conversion*
* **Urgency & Duration Configurator**: Prioritize openings by setting them to *High*, *Medium*, or *Normal* urgency, complete with corresponding salary and duration parameters.

#### C. Sub-Regional Gaborone Coordination Cabinet
The focal steering committee coordinating regional compliance and educational optimization:
* **Roster Auditing**: Live view of current staff distributed throughout regional clusters.
* **8-Year Overstay Monitoring**: Identifies and flags teachers overstaying the regional rotation policy—providing proactive recommendations for transfer routing.
* **Administrative Compliance Dispatch**: Directly triggers simulated official memos via integrated WhatsApp communication pipelines directly to specific school leaders' mobile lines.

#### D. Central District Administration Cabinet
The primary administrative center overseeing regional and district allocations:
* **Placement Matching Pipeline**: Centralized hub displaying lists of shortlisted candidates and corresponding vacant slots. Helps staff match and assign vacancies to qualified educators.
* **Audit Trail Terminal**: Real-time readouts of secure, immutable system events complete with detailed action payloads, user metadata, and severity flags.

#### E. Super Admin Portal (The Ministry Oversight Executive)
Provides ultimate MoESD operational controls:
* **System-Wide Dashboard**: Monitors cumulative statistics (Active Placements, Outstanding Vacancies, Registered Candidates, Critical Alerts).
* **Interactive Policy Editor**: Toggles MoESD national thresholds such as the tenure overstay warning limit.
* **System Health Monitor**: Live charts displaying application usage statistics and audit logs.

---

### 3. Core Business Logic & Administrative Algorism

```
+-----------------------------------+
|      Schoolhead Logs Gap          |
| (e.g. Maternity / STEM Conversion)|
+------------------+----------------+
                   |
                   v
+------------------+----------------+
|     Sub-Regional Advisory Board   |
|   evaluates local overstay limits |
+------------------+----------------+
                   |
                   v
+------------------+----------------+
|     Central Admin Panel Matches   |
| Applicants based on Qualifications|
+------------------+----------------+
                   |
                   v
+------------------+----------------+
|   System triggers WhatsApp Memo   |
|   and commits Ledger Audit Log    |
+------------------+----------------+
```

#### The Point-Based Matching Criteria
When candidate matching takes place, several parameters are verified to ensure maximum administrative fit:
1. **Academic Qualification**: Ensuring the level specified (Primary, Junior Secondary, or Senior Secondary) exactly aligns with the applicant's prior certified track-record.
2. **Subject Competency**: Filtering allocations to match specialized stems like *Mathematics*, *Physics*, *Setswana*, *Social Studies*, and *Design & Technology*.
3. **Specialized Status Conversion**: Direct tracking of "STEM Conversion" policies, enabling high-urgency placement overrides for computer science and scientific disciplines.

#### Localized State Engine (Synchronized Cache)
To support robust data persistence across browser closures and hard resets, the application implements active local synchronization structures under dedicated storage keys:
* `moesd_applicants`: Serialized storage for registered teacher candidates and qualification reviews.
* `moesd_vacancies`: The register of active facility requests, categorized by urgent levels.
* `moesd_placements`: Historic and active school assignment schedules.
* `moesd_audit_logs`: The operational compliance ledger tracking system changes.
* `moesd_chat_messages`: Dispatched memo logs for mobile alert reporting.

---

### 4. Technical Architecture

* **UI Framework**: React 18+ paired with **Vite** as the build and development engine.
* **Design & Styling**: **Tailwind CSS** with a curated **Inter** (sans-serif) and **JetBrains Mono** (metric and logging visualization) font stack.
* **Micro-Animations**: Custom **motion/react** (`animatepresence` and layout-driven `motion` blocks) for fluid and cohesive portal switching.
* **Icons Elements**: **Lucide React** utilized exclusively.
* **Data Visualizations**: Responsive charts tracking staffing trends, vacancy breakdowns, and applicant statistics.

---

### 5. Regulatory Auditing Ledger

Every structural mutation, portal authorization, or notification transmission automatically commits a schema-compliant record to the **System Audit Ledger** (`SystemAuditLog` structure defined in `/src/types.ts`):

```typescript
export interface SystemAuditLog {
  id: string;          // Unique logical identifier (e.g., LOG-1681284-829)
  userId: string;      // The actor ID making the modification
  userName: string;    // Full name of the authenticated user
  userEmail: string;   // Corporate or individual email domain
  userRole: UserRole;   // Role context used to perform action
  action: string;      // Logical action signature
  details: string;     // Textual parameters outlining modification scope
  timestamp: string;   // High-precision ISO date-time sequence
  ipAddress: string;   // Simulated subnet address tracking (168.167.*.*)
  browser: string;     // Device user agent trace
  severity: 'info' | 'warning' | 'critical'; // Severity tier
}
```

These logs are displayed in the Admin portals with color-coded severity pill badges and comprehensive text search filters.

---

### 6. Interactive WhatsApp Simulation Dispatcher

A focal component of the system's external interaction framework is the **WhatsApp Simulation Terminal**. When official notifications are issued (such as when a sub-regional officer dispatches a physical placement memo, or when a schoolhead approves an onboarding), the system triggers a background dispatch routine:
1. Converts the textual administrative mandate into a formal, structured memo.
2. Commits a message object with properties tracking incoming status, recipient phone lines (e.g. `+267 71 000 000`), and timestamp fields.
3. Automatically triggers reactive state UI modals to alert the supervisor of a successfully targeted mobile broadcast message.
