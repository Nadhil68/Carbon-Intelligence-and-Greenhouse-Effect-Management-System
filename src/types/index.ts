export type UserRole = 'admin' | 'operator' | 'viewer';
export type AccountStatus = 'pending' | 'accepted' | 'rejected';

export type DesignationCategory =
  | 'Principal'
  | 'Manager'
  | 'Dean'
  | 'HOD'
  | 'AHOD'
  | 'Department Staffs'
  | 'Class Advisors'
  | 'Students'
  | 'Controller of Examinations (COE)'
  | 'Supporting Staff';

export type CampusDepartment =
  | 'CSE'
  | 'ECE'
  | 'EEE'
  | 'MECH'
  | 'CIVIL'
  | 'IT'
  | 'AIDS'
  | 'AIML'
  | 'Cyber Security'
  | 'Technology Innovation Hub (TIH)'
  | 'Mathematics (Freshman Engineering)'
  | 'Engineering Chemistry (Freshman Engineering)'
  | 'Engineering Physics (Freshman Engineering)'
  | 'Freshman Engineering (1st Year)'
  | 'Hostels & Residential Blocks'
  | 'Administration & Management'
  | 'Transport & Fleet Facilities'
  | 'Central Library & Labs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  department: CampusDepartment;
  designation: DesignationCategory;
  classSection?: string; // For Class Advisors & Students (e.g., "III Year CSE-B")
  phone?: string;
  employeeOrStudentId: string; // Official ID
  passwordHash: string;
  passwordSalt: string;
  registrationDate: string;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export type EmissionScope = 'Scope 1' | 'Scope 2' | 'Scope 3';

export type EmissionSourceCategory =
  | 'department_electricity'
  | 'hostel_electricity'
  | 'transportation'
  | 'laboratory_chemicals'
  | 'campus_waste'
  | 'solar_renewable_offset';

export type LogApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ProofAttachmentType = 'photo' | 'pdf';

export const AI_CARBON_LOGO_URL =
  'https://www.shutterstock.com/shutterstock/photos/2177824425/display_1500/stock-vector-carbon-c-icon-structure-chemical-element-round-shape-circle-light-blue-chemical-element-of-2177824425.jpg';
export const AI_CARBON_LOGO_FALLBACK = '/assets/aistudio/image_8793c7a1.png';

export interface EmissionRecord {
  id: string;
  title: string;
  date: string;
  month: string; // e.g., '2026-03'
  category: EmissionSourceCategory;
  scope: EmissionScope;
  department: CampusDepartment;
  facilityLocation: string;
  activityValue: number;
  unit: string;
  emissionFactor: number;
  totalEmissionKgCO2e: number;
  reportedBy: {
    userId: string;
    userName: string;
    userRole: UserRole;
    userEmail?: string;
  };
  notes?: string;
  verifiedByAdmin?: boolean;
  approvalStatus?: LogApprovalStatus;
  proofType?: ProofAttachmentType;
  proofUrl?: string;
  proofFileName?: string;
  proofFileSize?: string;
  meterReadingNumber?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  adminRemarks?: string;
}

export interface InstitutionalPerson {
  id: string;
  name: string;
  category: DesignationCategory;
  department: CampusDepartment;
  email: string;
  phone: string;
  officeLocation: string;
  responsibility: string;
  joinedYear: number;
  classSection?: string;
}

export interface SimulatedEmail {
  id: string;
  toEmail: string;
  toName: string;
  from: string;
  subject: string;
  sentAt: string;
  type: 'account_approved' | 'account_rejected' | 'password_reset' | 'data_alert';
  htmlContent: string;
  read: boolean;
  actionToken?: string;
}

export interface MitigationPlan {
  id: string;
  title: string;
  department: CampusDepartment;
  category: string;
  status: 'In Progress' | 'Planned' | 'Completed';
  targetReductionTonsCO2e: number;
  actualSavedTonsCO2e: number;
  targetDate: string;
  costEstimate: string;
  leadPerson: string;
  description: string;
}
