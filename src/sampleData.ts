import { Applicant, ApplicationStatus, Vacancy, Placement, SystemAuditLog } from './types';

export const SAMPLE_APPLICANTS: Applicant[] = [
  {
    id: "APP-58291",
    fullName: "Thabo Kabelo Balopi",
    omangNumber: "172481923",
    phoneNumber: "+267 71 829 401",
    email: "thabo.balopi@gmail.com",
    vacancySubject: "Mathematics (Senior Secondary)",
    highestQualification: "Bachelor of Science in Mathematics Education",
    experienceYears: 6,
    preferredRegion: "South East (Gaborone)",
    status: ApplicationStatus.SHORTLISTED,
    submittedAt: "2026-05-12T08:34:00Z",
    available: true,
    performanceScore: 4.8,
    completedPlacementsCount: 2,
    cvFile: {
      name: "Thabo_Balopi_CV.pdf",
      size: "1.2 MB",
      uploadedAt: "2026-05-12T08:15:00Z"
    },
    idFile: {
      name: "Thabo_Balopi_Omang_Certified.pdf",
      size: "820 KB",
      uploadedAt: "2026-05-12T08:18:00Z"
    },
    certificateFile: {
      name: "BSc_Maths_Certificate_UB.pdf",
      size: "2.4 MB",
      uploadedAt: "2026-05-12T08:25:00Z"
    },
    referenceFile: {
      name: "Recommendation_Letter_KanyeSec.pdf",
      size: "450 KB",
      uploadedAt: "2026-05-12T08:30:00Z"
    },
    logs: [
      {
        status: ApplicationStatus.RECEIVED,
        timestamp: "2026-05-12T08:34:00Z",
        updatedBy: "System",
        note: "Teacher registration portal submission."
      },
      {
        status: ApplicationStatus.UNDER_REVIEW,
        timestamp: "2026-05-15T11:20:00Z",
        updatedBy: "M. Kgosi (Senior HR Officer)",
        note: "Documents verified successfully. Transcripts align with mathematics guidelines."
      },
      {
        status: ApplicationStatus.SHORTLISTED,
        timestamp: "2026-05-28T14:45:00Z",
        updatedBy: "M. Kgosi (Senior HR Officer)",
        note: "Selected for general mathematics panel interview round."
      }
    ],
    notes: "Outstanding academic record at University of Botswana. Teaches with interactive whiteboard methodologies."
  },
  {
    id: "APP-41952",
    fullName: "Lesedi Same Phiri",
    omangNumber: "284192083",
    phoneNumber: "+267 72 491 582",
    email: "lesedi.phiri@outlook.com",
    vacancySubject: "Setswana (Junior Secondary)",
    highestQualification: "Diploma in Secondary Education (Setswana & History)",
    experienceYears: 3,
    preferredRegion: "Central (Serowe)",
    status: ApplicationStatus.UNDER_REVIEW,
    submittedAt: "2026-05-20T10:15:00Z",
    available: true,
    performanceScore: 4.2,
    completedPlacementsCount: 1,
    cvFile: {
      name: "Lesedi_Phiri_Resume.pdf",
      size: "980 KB",
      uploadedAt: "2026-05-20T09:45:00Z"
    },
    idFile: {
      name: "Certified_ID_Lesedi_Phiri.pdf",
      size: "740 KB",
      uploadedAt: "2026-05-20T09:50:00Z"
    },
    certificateFile: {
      name: "Diploma_Setswana_Tonota_COE.pdf",
      size: "1.8 MB",
      uploadedAt: "2026-05-20T10:05:00Z"
    },
    referenceFile: {
      name: "Reference_Principal_SwanengHill.pdf",
      size: "510 KB",
      uploadedAt: "2026-05-20T10:10:00Z"
    },
    logs: [
      {
        status: ApplicationStatus.RECEIVED,
        timestamp: "2026-05-20T10:15:00Z",
        updatedBy: "System",
        note: "Teacher registration portal submission."
      },
      {
        status: ApplicationStatus.UNDER_REVIEW,
        timestamp: "2026-05-24T09:12:00Z",
        updatedBy: "K. Ntuane (HR Assistant)",
        note: "Certified ID and Tonota College academic documents initial check completed."
      }
    ]
  },
  {
    id: "APP-30814",
    fullName: "Grace Bontle Sebele",
    omangNumber: "291038291",
    phoneNumber: "+267 74 112 345",
    email: "grace.b@sebele.co.bw",
    vacancySubject: "Primary School General",
    highestQualification: "Bachelor of Education (Early Childhood & Primary)",
    experienceYears: 8,
    preferredRegion: "Kgalagadi (Tshabong)",
    status: ApplicationStatus.SHORTLISTED,
    submittedAt: "2026-04-18T15:22:00Z",
    available: true,
    performanceScore: 4.9,
    completedPlacementsCount: 4,
    cvFile: {
      name: "Grace_Sebele_CV.pdf",
      size: "1.1 MB",
      uploadedAt: "2026-04-18T14:45:00Z"
    },
    idFile: {
      name: "Omang_Certified_G_Sebele.pdf",
      size: "610 KB",
      uploadedAt: "2026-04-18T14:50:00Z"
    },
    certificateFile: {
      name: "BEd_Primary_Degree_Certificate.pdf",
      size: "2.1 MB",
      uploadedAt: "2026-04-18T15:10:00Z"
    },
    referenceFile: {
      name: "Reference_Letter_Moeding_College.pdf",
      size: "390 KB",
      uploadedAt: "2026-04-18T15:15:00Z"
    },
    logs: [
      {
        status: ApplicationStatus.RECEIVED,
        timestamp: "2026-04-18T15:22:00Z",
        updatedBy: "System",
        note: "Teacher registration portal submission."
      },
      {
        status: ApplicationStatus.UNDER_REVIEW,
        timestamp: "2026-04-22T14:10:00Z",
        updatedBy: "M. Kgosi (Senior HR Officer)",
        note: "8 years of rural service verified. Ideal for Kgalagadi region placement."
      },
      {
        status: ApplicationStatus.SHORTLISTED,
        timestamp: "2026-05-02T10:30:00Z",
        updatedBy: "M. Kgosi (Senior HR Officer)",
        note: "Shortlisted due to stellar reference letter and extensive experience."
      }
    ],
    notes: "Particularly passionate about special needs integration in primary settings. Outstanding feedback."
  },
  {
    id: "APP-82910",
    fullName: "Joseph Onalethata Molale",
    omangNumber: "112839103",
    phoneNumber: "+267 76 902 443",
    email: "j.molale@yahoo.com",
    vacancySubject: "Science: Chemistry & Physics",
    highestQualification: "Post Graduate Diploma in Education (PGDE)",
    experienceYears: 1,
    preferredRegion: "North West (Maun)",
    status: ApplicationStatus.SHORTLISTED,
    submittedAt: "2026-06-02T16:40:00Z",
    available: true,
    performanceScore: 4.0,
    completedPlacementsCount: 0,
    cvFile: {
      name: "Joseph_Molale_CV_2026.pdf",
      size: "1.4 MB",
      uploadedAt: "2026-06-02T16:15:00Z"
    },
    idFile: {
      name: "Joseph_Molale_Omang_Scanned.pdf",
      size: "1.1 MB",
      uploadedAt: "2026-06-02T16:20:00Z"
    },
    certificateFile: {
      name: "PGDE_Cert_UB_Physics.pdf",
      size: "2.7 MB",
      uploadedAt: "2026-06-02T16:30:00Z"
    },
    referenceFile: {
      name: "Reference_Principal_MaunSec.pdf",
      size: "680 KB",
      uploadedAt: "2026-06-02T16:35:00Z"
    },
    logs: [
      {
        status: ApplicationStatus.RECEIVED,
        timestamp: "2026-06-02T16:40:00Z",
        updatedBy: "System",
        note: "Application submitted. Initial validation queue."
      },
      {
        status: ApplicationStatus.SHORTLISTED,
        timestamp: "2026-06-03T11:00:00Z",
        updatedBy: "K. Ntuane (HR Assistant)",
        note: "Physics credentials certified. Shortlisted."
      }
    ]
  },
  {
    id: "APP-90311",
    fullName: "Keone David Molefe",
    omangNumber: "159203817",
    phoneNumber: "+267 75 738 290",
    email: "keone.molefe@moesd-teachers.co.bw",
    vacancySubject: "English Language & Literature",
    highestQualification: "Bachelor of Humanities (English & Setswana)",
    experienceYears: 0,
    preferredRegion: "Chobe (Kasane)",
    status: ApplicationStatus.REJECTED,
    submittedAt: "2026-04-10T11:00:00Z",
    available: false,
    performanceScore: 0,
    completedPlacementsCount: 0,
    cvFile: {
      name: "Molefe_Keone_Resume.pdf",
      size: "720 KB",
      uploadedAt: "2026-04-10T10:30:00Z"
    },
    idFile: {
      name: "Omang_Valid_Keone.pdf",
      size: "440 KB",
      uploadedAt: "2026-04-10T10:35:00Z"
    },
    certificateFile: {
      name: "Degree_Humanities_Molefe.pdf",
      size: "1.5 MB",
      uploadedAt: "2026-04-10T10:45:00Z"
    },
    referenceFile: {
      name: "Recommendation_Academic_Tutor.pdf",
      size: "310 KB",
      uploadedAt: "2026-04-10T10:55:00Z"
    },
    logs: [
      {
        status: ApplicationStatus.RECEIVED,
        timestamp: "2026-04-10T11:00:00Z",
        updatedBy: "System",
        note: "Teacher registration portal submission."
      },
      {
        status: ApplicationStatus.UNDER_REVIEW,
        timestamp: "2026-04-14T09:15:00Z",
        updatedBy: "K. Ntuane (HR Assistant)",
        note: "Graduate credentials complete. No professional teaching qualification (PGDE) completed yet."
      },
      {
        status: ApplicationStatus.REJECTED,
        timestamp: "2026-04-20T10:00:00Z",
        updatedBy: "M. Kgosi (Senior HR Officer)",
        note: "Candidate lack of professional teaching qualification. Under Education guidelines, humanities scope requires PGDE."
      }
    ],
    notes: "Highly enthusiastic candidate, but lacks PGDE. Recommend they resubmit upon secondary training certification."
  }
];

export const SAMPLE_VACANCIES: Vacancy[] = [
  {
    id: "VAC-101",
    schoolName: "Ledumang Senior Secondary School",
    subject: "Mathematics (Senior Secondary)",
    level: "Senior Secondary",
    type: "Maternity",
    urgency: "High",
    duration: "4 months",
    salary: "BWP 8,240 / month",
    reportedAt: "2026-06-01T08:00:00Z",
    status: "Open"
  },
  {
    id: "VAC-102",
    schoolName: "Gaborone West Junior Secondary School",
    subject: "Setswana (Junior Secondary)",
    level: "Junior Secondary",
    type: "Medical Leave",
    urgency: "Medium",
    duration: "2 months",
    salary: "BWP 6,850 / month",
    reportedAt: "2026-06-02T10:30:00Z",
    status: "Open"
  },
  {
    id: "VAC-103",
    schoolName: "Maun General Primary School",
    subject: "Primary School General",
    level: "Primary",
    type: "Emergency Absence",
    urgency: "High",
    duration: "3 months",
    salary: "BWP 5,900 / month",
    reportedAt: "2026-06-03T14:15:00Z",
    status: "Open"
  },
  {
    id: "VAC-104",
    schoolName: "Shashe River Secondary School",
    subject: "Science: Chemistry & Physics",
    level: "Senior Secondary",
    type: "Permanent Vacancy Gap",
    urgency: "High",
    duration: "6 months",
    salary: "BWP 8,900 / month",
    reportedAt: "2026-05-25T09:00:00Z",
    status: "Open"
  },
  {
    id: "VAC-105",
    schoolName: "Tshabong Primary School",
    subject: "Primary School General",
    level: "Primary",
    type: "Resignation",
    urgency: "Normal",
    duration: "5 months",
    salary: "BWP 5,900 / month",
    reportedAt: "2026-05-28T11:00:00Z",
    status: "Open"
  },
  {
    id: "VAC-106",
    schoolName: "Kanye Junior Secondary School",
    subject: "English Language & Literature",
    level: "Junior Secondary",
    type: "Maternity",
    urgency: "Medium",
    duration: "3 months",
    salary: "BWP 6,850 / month",
    reportedAt: "2026-05-15T08:00:00Z",
    status: "Filled",
    assignedTeacherId: "APP-58291",
    assignedTeacherName: "Thabo Kabelo Balopi"
  }
];

export const SAMPLE_PLACEMENTS: Placement[] = [
  {
    id: "PLC-901",
    schoolName: "Kanye Junior Secondary School",
    teacherId: "APP-58291",
    teacherName: "Thabo Kabelo Balopi",
    subject: "Mathematics (Senior Secondary)",
    startDate: "2026-05-18",
    endDate: "2026-08-18",
    status: "Active"
  },
  {
    id: "PLC-801",
    schoolName: "Gaborone West Junior Secondary School",
    teacherId: "APP-30814",
    teacherName: "Grace Bontle Sebele",
    subject: "Primary School General",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    status: "Completed",
    rating: 5,
    reviewText: "Outstanding engagement. Adapted instantly to our classroom protocols and is dearly loved by the basic science and primary streams.",
    reviewedAt: "2025-12-16T11:00:00Z"
  }
];

export const VACANCIES = [
  "Mathematics (Senior Secondary)",
  "English Language & Literature",
  "Setswana (Junior Secondary)",
  "Science: Chemistry & Physics",
  "Biology & Agriculture",
  "Social Studies & Geography",
  "Primary School General",
  "Early Childhood Education",
  "Design & Technology",
  "ICT & Computer Studies"
];

export const REGIONS = [
  "Any",
  "Central",
  "Kgalagadi",
  "South",
  "Gantsi",
  "South East",
  "Kgatleng",
  "North East",
  "Kweneng",
  "Chobe",
  "North West"
];

export const SUB_REGIONS_BY_REGION: Record<string, string[]> = {
  "Any": ["Any"],
  "Central": ["Bobirwa", "Boteti", "Mahalapye", "Palapye", "Sefhare", "Selibe Phikwe", "Serowe", "Shoshong", "Tonota", "Tutume"],
  "Kgalagadi": ["Kgalagadi South", "Kgalagadi North"],
  "South": ["Goodhope", "Kanye", "Lobatse", "Moshupa", "Jwaneng/Mabutsane"],
  "Gantsi": ["Gantsi", "Charleshill"],
  "South East": ["Gaborone", "South-East"],
  "Kgatleng": ["Kgatleng"],
  "North East": ["Francistown", "North-East"],
  "Kweneng": ["Lentsweletau", "Letlhakeng", "Molepolole", "Mogoditshane/Thamaga"],
  "Chobe": ["Chobe"],
  "North West": ["Gumare", "Maun", "Shakawe"]
};

export const ALL_SUB_REGIONS = Object.values(SUB_REGIONS_BY_REGION).flat();

export const SAMPLE_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: "LOG-10023",
    userId: "SYS-CRON",
    userName: "System Automated Gateway",
    userEmail: "cron@mewbe.gov.bw",
    userRole: "System",
    action: "SYSTEM_ROUTINE",
    details: "Automated daily alignment checks run successfully. Processed 42 regional secondary gaps and matched 3 qualified candidates.",
    timestamp: "2026-06-10T05:00:00Z",
    ipAddress: "127.0.0.1",
    browser: "Node-CronService/v2.1",
    severity: "info"
  },
  {
    id: "LOG-10022",
    userId: "USR-00439",
    userName: "Mpho Sannah Kgosi",
    userEmail: "mpho.kgosi@mewbe.gov.bw",
    userRole: "Ministry Official",
    action: "STATUS_CHANGE",
    details: "Status updated for applicant ID APP-58291 (Thabo Kabelo Balopi) to 'Shortlisted'. Note: Selected for general mathematics panel interview round.",
    timestamp: "2026-06-10T04:45:00Z",
    ipAddress: "10.240.12.87",
    browser: "Chrome 125.0.0",
    severity: "info"
  },
  {
    id: "LOG-10021",
    userId: "USR-00121",
    userName: "Kabelo Molefe",
    userEmail: "k.molefe@lobatse.gov.bw",
    userRole: "School Leader",
    action: "VACANCY_CREATE",
    details: "New vacancy registered for Lobatse Secondary School: Science (Junior Secondary), Urgency: HIGH.",
    timestamp: "2026-06-09T16:30:12Z",
    ipAddress: "168.167.23.4",
    browser: "Firefox 126.0",
    severity: "info"
  },
  {
    id: "LOG-10020",
    userId: "SYS-BOT",
    userName: "WhatsApp Gateway",
    userEmail: "support-bot@mewbe.gov.bw",
    userRole: "System",
    action: "WHATSAPP_ALERT",
    details: "Automated WhatsApp SMS delivery successfully sent to applicant G. Setlamelo confirming document receipt (Reference ID: REF-9281).",
    timestamp: "2026-06-09T14:15:22Z",
    ipAddress: "127.0.0.1",
    browser: "WhatsAppWebhook/v1",
    severity: "info"
  },
  {
    id: "LOG-10019",
    userId: "USR-00812",
    userName: "Lorato Segokgo",
    userEmail: "l.segokgo@candidate.bw",
    userRole: "Teacher",
    action: "PROFILE_COMPLETE",
    details: "Lorato Segokgo successfully completed National Teacher Database Profile verification setup (Omang: 182749129).",
    timestamp: "2026-06-09T11:02:44Z",
    ipAddress: "129.23.88.192",
    browser: "Chrome Mobile / Android 14",
    severity: "info"
  },
  {
    id: "LOG-10018",
    userId: "USR-UNKNOWN",
    userName: "Anonymous Guest",
    userEmail: "anonymous@guest.bw",
    userRole: "Guest",
    action: "AUTH_FAILURE",
    details: "Failed login attempt detected for administrative account 'admin@mewbe.gov.bw'. Password mismatch.",
    timestamp: "2026-06-09T08:55:01Z",
    ipAddress: "196.220.14.77",
    browser: "Safari 17.4",
    severity: "warning"
  },
  {
    id: "LOG-10017",
    userId: "USR-00439",
    userName: "Mpho Sannah Kgosi",
    userEmail: "mpho.kgosi@mewbe.gov.bw",
    userRole: "Ministry Official",
    action: "LOGIN",
    details: "Administrative login succeeded for Mpho Sannah Kgosi (Session token: SEC-778AC9). Verified via Security clearance A.",
    timestamp: "2026-06-09T07:45:00Z",
    ipAddress: "10.240.12.87",
    browser: "Chrome 125.0.0",
    severity: "info"
  },
  {
    id: "LOG-10016",
    userId: "SYS-SECURITY",
    userName: "Gateway Guard",
    userEmail: "shield@mewbe.gov.bw",
    userRole: "System",
    action: "SECURITY_SCAN",
    details: "Critical block warning triggered: Multiple rapid requests from IP 196.220.14.77 blocked by rate-limiting middleware.",
    timestamp: "2026-06-08T22:30:00Z",
    ipAddress: "196.220.14.77",
    browser: "SecurityMonitor/v5",
    severity: "critical"
  }
];

