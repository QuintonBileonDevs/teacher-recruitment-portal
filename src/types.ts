export enum UserRole {
  TEACHER = 'Teacher',
  SCHOOL_LEADER = 'School Leader',
  OFFICIAL_SUB_REGIONAL = 'Sub-Regional Official',
  OFFICIAL_REGIONAL = 'Regional Official',
  OFFICIAL_MINISTRY = 'Ministry Official',
  SUPER_ADMIN = 'Super Admin'
}

export enum TeacherType {
  PERMANENT = 'Permanent Teacher',
  PERMANENT_TEACHER_AIDE = 'Permanent Teacher Aide',
  NEWLY_EMPLOYED = 'Newly Employed Teacher',
  NEWLY_EMPLOYED_TEACHER_AIDE = 'Newly Employed Teacher Aide',
  TEMPORARY = 'Temporary Teacher',
  TEMPORARY_TEACHER_AIDE = 'Temporary Teacher Aide'
}

export enum SchoolLeaderType {
  SCHOOLHEAD = 'Schoolhead',
  DEPUTY_SCHOOLHEAD = 'Deputy Schoolhead'
}

export interface PreviousSchool {
  schoolName: string;
  fromYear: string;
  toYear: string;
  roleHeld: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  teacherType?: TeacherType;
  schoolLeaderType?: SchoolLeaderType;
  omangNumber?: string;
  schoolName?: string;
  region?: string;
  profileCompleted?: boolean;
  phoneNumber?: string;
  highestQualification?: string;
  experienceYears?: number;
  subjectSpeciality?: string;
  schoolLevel?: string;
  dob?: string;
  gender?: string;
  contactAddress?: string;
  alternativePhone?: string;
  dateOfFirstAppointment?: string;
  dateIntoCurrentSchool?: string;
  previousSchools?: PreviousSchool[];
  contractStatus?: string;
  contractEndDate?: string;
  aideSpecialty?: string;
  availabilityStatus?: string;
  preferredContractDuration?: string;
  salaryScale?: string;
  currentPosition?: string;
  avatarUrl?: string;
  notifications?: UserNotification[];
  documents?: DocumentMeta[];
  backupEmail?: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "info" | "success" | "warning";
}

export interface LeaveRequest {
  id: string;
  leaveType: 'Annual' | 'Casual' | 'Sick' | 'Maternity' | 'Study';
  startDate: string;
  endDate: string;
  workingDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface RedirectionRequest {
  id: string;
  currentSchool: string;
  targetRegion: string;
  targetSchool: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface SwapRequest {
  id: string;
  teacherName: string;
  teacherEmail: string;
  currentSchool: string;
  currentRegion: string;
  subject: string;
  targetRegion: string;
  targetSchool: string;
  contactPhone: string;
  status: 'Active' | 'Matched' | 'Completed';
  submittedAt: string;
}

export interface ProfileUpgrade {
  id: string;
  requestedScale: string;
  requestedLevel: string;
  requestedPosition: string;
  motivation: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export enum ApplicationStatus {
  RECEIVED = 'Received',
  UNDER_REVIEW = 'Under Review',
  SHORTLISTED = 'Shortlisted',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  REJECTED = 'Rejected',
  APPOINTED = 'Appointed'
}

export interface DocumentMeta {
  name: string;
  size: string;
  uploadedAt: string;
}

export interface StatusLog {
  status: ApplicationStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface Applicant {
  id: string;
  fullName: string;
  omangNumber: string; // Botswana National ID
  phoneNumber: string;
  email: string;
  vacancySubject: string;
  highestQualification: string;
  experienceYears: number;
  preferredRegion: string;
  cvFile?: DocumentMeta;
  idFile?: DocumentMeta;
  certificateFile?: DocumentMeta;
  referenceFile?: DocumentMeta;
  status: ApplicationStatus;
  submittedAt: string;
  logs: StatusLog[];
  interviewDate?: string;
  notes?: string;
  // ITMDS Additional Attributes
  available?: boolean;
  performanceScore?: number; // 0 - 5 stars
  completedPlacementsCount?: number;
  pendingOffer?: {
    vacancyId: string;
    schoolName: string;
    subject: string;
    duration: string;
    salary: string;
    urgency: string;
  };
}

export interface Vacancy {
  id: string;
  schoolName: string;
  subject: string;
  level: 'Primary' | 'Junior Secondary' | 'Senior Secondary';
  type: 'Medical Leave' | 'Maternity' | 'Emergency Absence' | 'Permanent Vacancy Gap' | 'Resignation' | 'STEM Vacancy Shortage conversion';
  urgency: 'High' | 'Medium' | 'Normal';
  duration: string;
  salary: string;
  reportedAt: string;
  status: 'Open' | 'Shortlisted' | 'Offered' | 'Filled';
  assignedTeacherId?: string;
  assignedTeacherName?: string;
}

export interface Placement {
  id: string;
  schoolName: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed';
  rating?: number; // 1-5
  reviewText?: string;
  reviewedAt?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface SystemAuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  browser: string;
  severity: "info" | "warning" | "critical";
}

