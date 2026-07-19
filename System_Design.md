# System Design

This following section contains all the diagram and information like relationship of objects that are used to get the information about the working , implementation and Structure of the project. This includes the flows and methododlogies included in the project.

## System Architecture

```mermaid
flowchart TB

%% ==================================================
%% USERS
%% ==================================================

Guest([Guest])
Candidate([Candidate])
Recruiter([Recruiter])
Admin([Admin])

%% ==================================================
%% CLIENT LAYER
%% ==================================================

subgraph CLIENT["Presentation Layer (Next.js 15)"]

Landing[Landing Page]

CandidateDashboard[Candidate Dashboard]

RecruiterDashboard[Recruiter Dashboard]

AdminDashboard[Admin Dashboard]

SharedUI[Shared UI Components
ShadCN
Tailwind
Framer Motion]

end

Guest --> Landing
Candidate --> CandidateDashboard
Recruiter --> RecruiterDashboard
Admin --> AdminDashboard

Landing --> SharedUI
CandidateDashboard --> SharedUI
RecruiterDashboard --> SharedUI
AdminDashboard --> SharedUI

%% ==================================================
%% API GATEWAY
%% ==================================================

FrontendAPI["REST API
HTTPS
JWT"]

SharedUI --> FrontendAPI

%% ==================================================
%% BACKEND
%% ==================================================

subgraph BACKEND["Node.js + Express Backend"]

AuthService

CandidateService

RecruiterService

JobService

ApplicationService

InterviewService

AIService

ConsultationService

PaymentService

NotificationService

AdminService

SocketServer["Socket.io Server"]

end

FrontendAPI --> AuthService
FrontendAPI --> CandidateService
FrontendAPI --> RecruiterService
FrontendAPI --> JobService
FrontendAPI --> ApplicationService
FrontendAPI --> InterviewService
FrontendAPI --> AIService
FrontendAPI --> ConsultationService
FrontendAPI --> PaymentService
FrontendAPI --> NotificationService
FrontendAPI --> AdminService

NotificationService --> SocketServer

%% ==================================================
%% DATABASE
%% ==================================================

subgraph DATABASE

Postgres[(PostgreSQL)]

Prisma["Prisma ORM"]

end

AuthService --> Prisma
CandidateService --> Prisma
RecruiterService --> Prisma
JobService --> Prisma
ApplicationService --> Prisma
InterviewService --> Prisma
ConsultationService --> Prisma
PaymentService --> Prisma
NotificationService --> Prisma
AdminService --> Prisma

Prisma --> Postgres

%% ==================================================
%% THIRD PARTY SERVICES
%% ==================================================

subgraph External

OpenAI

Cloudinary

GoogleOAuth

Razorpay

SMTP

Agora

end

AuthService --> GoogleOAuth
AuthService --> SMTP

CandidateService --> Cloudinary

AIService --> OpenAI

PaymentService --> Razorpay

ConsultationService --> Agora

NotificationService --> SMTP
```

## UML Diagram

```mermaid
classDiagram

%% ===========================
%% USER & ROLE PROFILES
%% ===========================

class User{
    +UUID id
    +String name
    +String email
    +String passwordHash
    +Role role
    +Boolean isVerified
    +String googleId
    +DateTime createdAt
    +DateTime updatedAt
}

class Candidate{
    +UUID id
    +UUID userId
    +String resumeUrl
    +Integer atsScore
    +String[] skills
    +Integer profileCompletion
}

class Recruiter{
    +UUID id
    +UUID userId
    +String companyName
    +String companyWebsite
    +Boolean verified
}

class Admin{
    +UUID id
    +UUID userId
    +Integer permissionLevel
}

User "1" --> "0..1" Candidate
User "1" --> "0..1" Recruiter
User "1" --> "0..1" Admin


%% ===========================
%% JOBS
%% ===========================

class Job{
    +UUID id
    +UUID recruiterId
    +String title
    +Text description
    +String[] skillsRequired
    +String salaryRange
    +String location
    +JobStatus status
    +DateTime createdAt
}

Recruiter "1" --> "*" Job : posts


%% ===========================
%% APPLICATIONS
%% ===========================

class Application{
    +UUID id
    +UUID candidateId
    +UUID jobId
    +ApplicationStatus status
    +DateTime appliedAt
}

Candidate "1" --> "*" Application
Job "1" --> "*" Application


%% ===========================
%% INTERVIEWS
%% ===========================

class Interview{
    +UUID id
    +UUID applicationId
    +DateTime scheduledAt
    +InterviewMode mode
    +InterviewStatus status
    +String feedback
}

Application "1" --> "*" Interview


%% ===========================
%% RESUME ANALYSIS
%% ===========================

class ResumeAnalysis{
    +UUID id
    +UUID candidateId
    +JSON extractedSkills
    +JSON atsBreakdown
    +Text suggestions
    +DateTime createdAt
}

Candidate "1" --> "*" ResumeAnalysis


%% ===========================
%% AI REPORTS
%% ===========================

class AIReport{
    +UUID id
    +UUID userId
    +ReportType reportType
    +JSON payload
    +DateTime createdAt
}

User "1" --> "*" AIReport


%% ===========================
%% CONSULTATIONS
%% ===========================

class Consultant{
    +UUID id
    +String name
    +String specialization
    +String designation
    +Decimal hourlyRate
}

class Consultation{
    +UUID id
    +UUID candidateId
    +UUID consultantId
    +ConsultationType type
    +DateTime scheduledAt
    +ConsultationStatus status
    +Integer rating
}

Candidate "1" --> "*" Consultation
Consultant "1" --> "*" Consultation


%% ===========================
%% PAYMENTS
%% ===========================

class Payment{
    +UUID id
    +UUID userId
    +Decimal amount
    +PaymentType type
    +String razorpayOrderId
    +PaymentStatus status
    +DateTime createdAt
}

User "1" --> "*" Payment


%% ===========================
%% SUBSCRIPTIONS
%% ===========================

class Subscription{
    +UUID id
    +UUID userId
    +SubscriptionPlan plan
    +SubscriptionStatus status
    +DateTime startDate
    +DateTime endDate
    +String razorpaySubscriptionId
}

User "1" --> "0..1" Subscription


%% ===========================
%% NOTIFICATIONS
%% ===========================

class Notification{
    +UUID id
    +UUID receiverId
    +String message
    +NotificationType type
    +Boolean isRead
    +DateTime createdAt
}

User "1" --> "*" Notification


%% ===========================
%% SAVED JOBS
%% ===========================

class SavedJob{
    +UUID id
    +UUID candidateId
    +UUID jobId
    +DateTime createdAt
}

Candidate "1" --> "*" SavedJob
Job "1" --> "*" SavedJob


%% ===========================
%% ENUMS
%% ===========================

class Role{
<<enumeration>>
Candidate
Recruiter
Admin
}

class JobStatus{
<<enumeration>>
Draft
Published
Closed
}

class ApplicationStatus{
<<enumeration>>
Applied
Shortlisted
Interviewing
Rejected
Offered
Hired
}

class InterviewMode{
<<enumeration>>
Online
Offline
}

class InterviewStatus{
<<enumeration>>
Scheduled
Completed
Cancelled
}

class ConsultationType{
<<enumeration>>
Audio
Video
Mentorship
}

class ConsultationStatus{
<<enumeration>>
Booked
Completed
Cancelled
}

class PaymentStatus{
<<enumeration>>
Pending
Paid
Failed
Refunded
}

class SubscriptionStatus{
<<enumeration>>
Active
Expired
Cancelled
}

class NotificationType{
<<enumeration>>
Application
Interview
Payment
Consultation
System
}

class PaymentType{
<<enumeration>>
Subscription
Consultation
Mentorship
}

class ReportType{
<<enumeration>>
ResumeAnalysis
CareerGuidance
SalaryPrediction
InterviewPreparation
SkillGapAnalysis
}
```

## Internal Backend Structure

```mermaid
flowchart LR

Client

Client --> Routes

subgraph Express API

Routes

Controllers

Middlewares

Services

Repositories

PrismaORM

Database

end

Routes --> Middlewares

Middlewares --> Controllers

Controllers --> Services

Services --> Repositories

Repositories --> PrismaORM

PrismaORM --> Database

%% External Integrations

Services --> OpenAI

Services --> Razorpay

Services --> Cloudinary

Services --> SMTP

Services --> SocketIO

Services --> Agora
```

<br>
<br>
<br>

---

---

<br>
<br>
<br>

# Database Design

This section of the file contains the Database related

## Database Tables

```
Authentication
│
├── User
├── Candidate
├── Recruiter
├── Admin
├── RefreshToken
├── OTPVerification
└── PasswordResetToken


Company
│
├── Company
└── CompanyDocument


Jobs
│
├── Job
├── JobSkill
├── SavedJob
├── Application
└── Interview


AI
│
├── ResumeAnalysis
├── AIReport
├── Skill
├── CandidateSkill
└── JobRecommendation


Consultation
│
├── Consultant
├── ConsultantAvailability
├── Consultation
└── Review


Payments
│
├── Payment
├── Invoice
├── Subscription
└── Coupon


Communication
│
├── Notification
├── ChatRoom
├── Message
└── Attachment


Administration
│
├── AuditLog
├── ActivityLog
└── SystemSettings
```

## Tables Schema

**Users:** `id `_(PK)_ , `name` , `email `_(Unique)_ , `phone` , `passwordHash` , `role` , `googleId` , `avatar` , `isVerified` , `status` , `lastLogin` , `createdAt` , `updatedAt` , `deletedAt`.

**Candidate:** `id` , `userId `_(FK)_, `headline`, `bio`, `resumeUrl`, `ATSScore`, `profileCompletion`, `experienceYears`,`preferredRole`, `preferredLocation`, `expectedSalary`, `createdAt`

**Recruiter:** `id` , `userId` _(FK)_, `companyId` _(FK)_, `designation`, `verified`, `createdAt`

**Company:** `id`, `name`, `website`, `industry`, `description`, `logo`, `employeeCount`, `headquarters`, `verified`

**Job:** `id`, `companyId` _(FK)_, `recruiterId` _(FK)_, `title`, `description`, `salaryMin`, `salaryMax`, `employmentType`, `experienceLevel`, `location`, `status`, `deadline`, `createdAt`, `updatedAt`

**Application**: `id`, `jobId` _(FK)_, `candidateId` _(FK)_, `status`, `resumeVersion`, `coverLetter`, `appliedAt`, `updatedAt`

**Interview:** `id`, `applicationId` _(FK)_, `mode`, `meetingLink`, `scheduledAt`, `status`, `feedback`, `rating`, `createdAt`, `updatedAt`

**ResumeAnalysis:** `id`, `candidateId` _(FK)_, `resumeUrl`, `ATSScore`, `extractedSkills`, `ATSBreakdown`, `suggestions`, `createdAt`

**AIReport:** `id`, `candidateId` _(FK)_, `reportType`, `payload`, `tokensUsed`, `cost`, `createdAt`

**Skill:** `id`, `name`, `category`, `createdAt`

**CandidateSkill:** `id`, `candidateId` _(FK)_, `skillId` _(FK)_, `level`, `experienceYears`

**JobSkill:** `id`, `jobId` _(FK)_, `skillId` _(FK)_, `importance`

**SavedJob:** `id`, `candidateId` _(FK)_, `jobId` _(FK)_, `createdAt`

**Consultant:** `id`, `name`, `email`, `phone`, `specialization`, `bio`, `experienceYears`, `hourlyRate`, `profileImage`, `rating`, `createdAt`

**ConsultantAvailability:** `id`, `consultantId` _(FK)_, `day`, `startTime`, `endTime`, `isBooked`

**Consultation:** `id`, `candidateId` _(FK)_, `consultantId` _(FK)_, `paymentId` _(FK)_, `type`, `scheduledAt`, `meetingLink`, `status`, `createdAt`

**Review:** `id`, `consultationId` _(FK)_, `candidateId` _(FK)_, `rating`, `comment`, `createdAt`

**Payment:** `id`, `userId` _(FK)_, `amount`, `currency`, `paymentType`, `status`, `razorpayOrderId`, `razorpayPaymentId`, `createdAt`

**Invoice:** `id`, `paymentId` _(FK)_, `invoiceNumber`, `GST`, `pdfUrl`, `createdAt`

**Subscription:** `id`, `userId` _(FK)_, `plan`, `status`, `startDate`, `endDate`, `razorpaySubscriptionId`, `createdAt`

**Notification:** `id`, `userId` _(FK)_, `title`, `message`, `type`, `isRead`, `createdAt`

**ChatRoom:** `id`, `candidateId` _(FK)_, `recruiterId` _(FK)_, `createdAt`

**Message:** `id`, `chatRoomId` _(FK)_, `senderId` _(FK)_, `message`, `attachmentUrl`, `isSeen`, `createdAt`

**RefreshToken:** `id`, `userId` _(FK)_, `token`, `expiresAt`, `revoked`, `createdAt`

**OTPVerification:** `id`, `userId` _(FK)_, `otp`, `purpose`, `expiresAt`, `verified`, `createdAt`

**PasswordResetToken:** `id`, `userId` _(FK)_, `token`, `expiresAt`, `createdAt`

**AuditLog:** `id`, `userId` _(FK)_, `action`, `module`, `oldValue`, `newValue`, `ipAddress`, `createdAt`

## ER Diagram

```mermaid

erDiagram

    User ||--o| Candidate : has
    User ||--o| Recruiter : has
    User ||--o| Admin : has

    Company ||--o{ Recruiter : employs
    Company ||--o{ Job : posts

    Recruiter ||--o{ Job : creates

    Candidate ||--o{ Application : applies
    Job ||--o{ Application : receives

    Application ||--o{ Interview : schedules

    Candidate ||--o{ ResumeAnalysis : owns
    Candidate ||--o{ AIReport : generates

    Candidate ||--o{ CandidateSkill : has
    Skill ||--o{ CandidateSkill : belongs

    Job ||--o{ JobSkill : requires
    Skill ||--o{ JobSkill : maps

    Candidate ||--o{ SavedJob : bookmarks
    Job ||--o{ SavedJob : saved

    Candidate ||--o{ Consultation : books
    Consultant ||--o{ Consultation : conducts

    Consultant ||--o{ ConsultantAvailability : manages

    Consultation ||--|| Review : receives
    Candidate ||--o{ Review : writes

    User ||--o{ Payment : makes
    Payment ||--|| Invoice : generates

    User ||--o| Subscription : owns

    User ||--o{ Notification : receives

    Candidate ||--o{ ChatRoom : joins
    Recruiter ||--o{ ChatRoom : joins

    ChatRoom ||--o{ Message : contains
    User ||--o{ Message : sends

    User ||--o{ RefreshToken : owns
    User ||--o{ OTPVerification : verifies
    User ||--o{ PasswordResetToken : resets

    User ||--o{ AuditLog : performs

```
