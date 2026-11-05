import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CampusDepartment, DesignationCategory, SimulatedEmail } from '../types';
import { StorageService } from '../utils/storage';
import { hashPassword, verifyPassword, generateSalt } from '../utils/crypto';
import { INITIAL_ADMIN_HASH, INITIAL_ADMIN_SALT } from '../utils/initialData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  simulatedEmails: SimulatedEmail[];
  unreadEmailCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User; status?: string }>;
  logout: () => void;
  quickSwitchUser: (userId: string) => void;
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department: CampusDepartment;
    designation: DesignationCategory;
    employeeOrStudentId: string;
    classSection?: string;
    phone?: string;
  }) => Promise<{ success: boolean; message: string; user?: User }>;
  adminCreateUser: (data: {
    name: string;
    email: string;
    role: 'operator' | 'viewer';
    department: CampusDepartment;
    designation: DesignationCategory;
    employeeOrStudentId: string;
    classSection?: string;
    phone?: string;
    password?: string;
    notes?: string;
    initialStatus?: 'accepted' | 'pending';
  }) => Promise<{ success: boolean; message: string; user?: User }>;
  approveUser: (userId: string) => Promise<boolean>;
  rejectUser: (userId: string, reason: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; resetToken?: string }>;
  completePasswordReset: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone' | 'employeeOrStudentId' | 'department' | 'designation'>>) => Promise<boolean>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  markEmailAsRead: (emailId: string) => void;
  clearEmails: () => void;
  checkStatusByEmail: (email: string) => User | null;
}

const STUDENT_ROSTER_MAP: Record<string, { name: string; section: string; dept: CampusDepartment }> = {
  // CSE IV-A (Class Advisor: Prof. Ananthi · CS Seminar Hall 401)
  '21CS001': { name: 'Rahul Kumar', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS002': { name: 'Ragul', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS003': { name: 'Ratheenesh', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS004': { name: 'Sanjaykumar', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS005': { name: 'Sanjivkumar', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS006': { name: 'Nadhil R', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS007': { name: 'Pradeep R', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS008': { name: 'Pradeep S', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS009': { name: 'Pranith Sriram G', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS010': { name: 'Sriram', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS011': { name: 'Mohammed Muzammil', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS012': { name: 'Mydhelingam', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS013': { name: 'Sanjai C', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS014': { name: 'Tamiliniyan C', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS015': { name: 'Nithish Khanna S', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS016': { name: 'Nishok Khanna', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },
  '21CS017': { name: 'Vishwandh', section: 'IV Year CSE (Sec IV-A)', dept: 'CSE' },

  // CSE IV-B (Class Advisor: Prof. A. Selvanayagi · CS Seminar Hall 402)
  '21CS018': { name: 'Sudharshan', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS019': { name: 'Dharshan', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS020': { name: 'Harirharan', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS021': { name: 'Ganesh', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS022': { name: 'Vishnu', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS023': { name: 'Sudeep', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS024': { name: 'Srivelan', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS025': { name: 'Rhithick Seelan A', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS026': { name: 'Musthafa Ashik', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS027': { name: 'Vinith M', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS028': { name: 'Logavel Balaji', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS029': { name: 'Sabaresh K S', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS030': { name: 'Kavin Kishore Paneer', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS031': { name: 'Sudharshan K S', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS032': { name: 'Pravin Raj G', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },
  '21CS033': { name: 'Rohith', section: 'IV Year CSE (Sec IV-B)', dept: 'CSE' },

  // AIML
  '22ML001': { name: 'Barath Raj S', section: 'IV Year AIML', dept: 'AIML' },
  '22ML002': { name: 'Deepika M', section: 'IV Year AIML', dept: 'AIML' },
  '22ML003': { name: 'Hari Prasath R', section: 'IV Year AIML', dept: 'AIML' },
  '22ML004': { name: 'Kavya S', section: 'IV Year AIML', dept: 'AIML' },
  '22ML005': { name: 'Logeshwaran K', section: 'IV Year AIML', dept: 'AIML' },

  // IT
  '22IT001': { name: 'Premnath', section: 'IV Year IT (Final Year)', dept: 'IT' },
  '22IT002': { name: 'Faisal Ahamed', section: 'IV Year IT (Final Year)', dept: 'IT' },
  '22IT003': { name: 'Kishore', section: 'IV Year IT (Final Year)', dept: 'IT' },
  '22IT004': { name: 'Anbuselavan', section: 'IV Year IT (Final Year)', dept: 'IT' },
  '22IT005': { name: 'Harshan', section: 'IV Year IT (Final Year)', dept: 'IT' },

  // ECE
  '22EC001': { name: 'Abinaya V', section: 'IV Year ECE (Sec A)', dept: 'ECE' },
  '22EC002': { name: 'Balaji R', section: 'IV Year ECE (Sec A)', dept: 'ECE' },
  '22EC003': { name: 'Charu Latha S', section: 'IV Year ECE (Sec A)', dept: 'ECE' },
  '22EC004': { name: 'Gokulnath K', section: 'IV Year ECE (Sec A)', dept: 'ECE' },
  '22EC005': { name: 'Hemalatha P', section: 'IV Year ECE (Sec A)', dept: 'ECE' },
  '22EC006': { name: 'Vignesh M', section: 'IV Year ECE (Sec A)', dept: 'ECE' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>(() => StorageService.getEmails());
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedId = StorageService.getCurrentUserId();
    const all = StorageService.getUsers();
    return all.find((u) => u.id === storedId) || all.find((u) => u.role === 'admin') || null;
  });

  useEffect(() => {
    StorageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    StorageService.saveEmails(simulatedEmails);
  }, [simulatedEmails]);

  useEffect(() => {
    StorageService.setCurrentUserId(currentUser ? currentUser.id : null);
  }, [currentUser]);

  const unreadEmailCount = simulatedEmails.filter((e) => !e.read).length;

  const sendEmailInternal = (email: Omit<SimulatedEmail, 'id' | 'sentAt' | 'read'>) => {
    const newMail: SimulatedEmail = {
      ...email,
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sentAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };
    setSimulatedEmails((prev) => [newMail, ...prev]);
  };

  const login = async (email: string, passwordAttempt: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const passClean = passwordAttempt.trim();
    const passLower = passClean.toLowerCase();

    let user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        (u.employeeOrStudentId && u.employeeOrStudentId.toLowerCase() === cleanEmail) ||
        ((cleanEmail === 'principle@mkce.ac.in' ||
          cleanEmail === 'principal@mkce.ac.in' ||
          cleanEmail === 'principle' ||
          cleanEmail === 'principal') &&
          (u.email.toLowerCase() === 'principle@mkce.ac.in' ||
            u.email.toLowerCase() === 'principal@mkce.ac.in')) ||
        ((cleanEmail === 'manager@mkce.ac.in' || cleanEmail === 'manager' || cleanEmail === 'vikram') &&
          u.email.toLowerCase() === 'manager@mkce.ac.in') ||
        ((cleanEmail === 'dean@mkce.ac.in' ||
          cleanEmail === 'logavel@mkce.ac.in' ||
          cleanEmail === 'dean' ||
          cleanEmail === 'logavel') &&
          (u.email.toLowerCase() === 'dean@mkce.ac.in' ||
            u.email.toLowerCase() === 'logavel@mkce.ac.in')) ||
        (cleanEmail === 'operator' && u.email.toLowerCase() === 'operator@mkce.ac.in') ||
        (cleanEmail === 'opr' && u.email.toLowerCase() === 'operator@mkce.ac.in') ||
        (cleanEmail === 'opr@mkce.ac.in' && u.email.toLowerCase() === 'operator@mkce.ac.in') ||
        (cleanEmail === 'nadhil' && u.email.toLowerCase() === 'nadhilnadhil68@gamil.com') ||
        (cleanEmail === 'nadhilnadhil68@gmail.com' && u.email.toLowerCase() === 'nadhilnadhil68@gamil.com') ||
        (cleanEmail === 'pradeep' && u.email.toLowerCase() === 'pradeepravi076@gmail.com') ||
        (cleanEmail === 'santhosh' && u.email.toLowerCase() === 'santhoshmeswaran@gmail.com') ||
        (cleanEmail === 'ananthi' && u.email.toLowerCase() === 'ananthi@mkce.ac.in') ||
        (cleanEmail === 'ananthi.cse@campus.edu' && u.email.toLowerCase() === 'ananthi@mkce.ac.in') ||
        (cleanEmail === 'selvanayagi' && u.email.toLowerCase() === 'selvanayagi@mkce.ac.in') ||
        (cleanEmail === 'selvanayagi.cse@campus.edu' && u.email.toLowerCase() === 'selvanayagi@mkce.ac.in')
    );

    // Dynamic HOD pattern: hod-<dept>@mkce.ac.in or hod.<dept>@mkce.ac.in
    const hodMatch = cleanEmail.match(/^hod[-_.]([a-z0-9]+)(@mkce\.ac\.in|@campus\.edu)?$/i);
    if (!user && hodMatch) {
      const rawDept = hodMatch[1].toLowerCase();
      const deptMap: Record<string, { dept: CampusDepartment; name: string }> = {
        cse: { dept: 'CSE', name: 'Dr. S. Karthikeyan (HOD - CSE)' },
        cs: { dept: 'CSE', name: 'Dr. S. Karthikeyan (HOD - CSE)' },
        ece: { dept: 'ECE', name: 'Dr. M. Rajaram (HOD - ECE)' },
        eee: { dept: 'EEE', name: 'Dr. R. Prakash (HOD - EEE)' },
        mech: { dept: 'MECH', name: 'Dr. T. Senthilvelan (HOD - MECH)' },
        civil: { dept: 'CIVIL', name: 'Prof. Geetha Raman (HOD - CIVIL)' },
        it: { dept: 'IT', name: 'Dr. P. Venkatesh (HOD - IT)' },
        aids: { dept: 'AIDS', name: 'Dr. K. Sathishkumar (HOD - AIDS)' },
        aiml: { dept: 'AIML', name: 'Dr. V. Deepa (HOD - AIML)' },
        fe: { dept: 'Freshman Engineering (1st Year)', name: 'Dr. N. Jayakumar (HOD - Freshman Engg)' },
        sh: { dept: 'Freshman Engineering (1st Year)', name: 'Dr. N. Jayakumar (HOD - Freshman Engg)' },
      };
      const resolved = deptMap[rawDept] || {
        dept: 'CSE' as CampusDepartment,
        name: `Dr. HOD (${rawDept.toUpperCase()})`,
      };
      const hodEmail = `hod-${rawDept}@mkce.ac.in`;
      const autoHodUser: User = {
        id: `usr-hod-${rawDept}`,
        name: resolved.name,
        email: hodEmail,
        role: 'viewer',
        status: 'accepted',
        department: resolved.dept,
        designation: 'HOD',
        employeeOrStudentId: `HOD-${rawDept.toUpperCase()}-01`,
        phone: '+91 98412 11220',
        passwordSalt: 'hod_salt_2026',
        passwordHash: 'dummy_hash_hod',
        registrationDate: '2025-08-12',
        reviewedAt: '2025-08-12',
        reviewedBy: 'PRANITH SRIRAM G',
        notes: `HOD ${resolved.dept} (Pass: ${rawDept}hod@2026) - Viewing Dept Records: 1. Staff, 2. Classes, 3. Labs`,
      };
      setUsers((prev) => [...prev, autoHodUser]);
      user = autoHodUser;
    }

    // Dynamic institutional student roll number auto-authentication (e.g. 21CS001 or 21CS001@mkce.ac.in)
    if (!user) {
      const rollMatch = cleanEmail.match(/^([0-9]{2}[a-z]{2,5}[0-9]{2,4})(@mkce\.ac\.in)?$/i);
      if (
        rollMatch &&
        (passClean === 'stu@2026' || passClean === 'stu@@026' || passClean === 'Pass@2026')
      ) {
        const rollNo = rollMatch[1].toUpperCase();
        const studentEmail = `${rollNo.toLowerCase()}@mkce.ac.in`;

        // Check if student is in known roster
        const rosterMatch = STUDENT_ROSTER_MAP[rollNo];
        const studentName = rosterMatch ? rosterMatch.name : `Student (${rollNo})`;
        const studentSection = rosterMatch ? rosterMatch.section : 'IV Year';

        // Resolve branch from roll number code
        let dept: CampusDepartment = rosterMatch ? rosterMatch.dept : 'CSE';
        if (!rosterMatch) {
          const code = rollNo.substring(2, 4);
          if (code === 'CS') dept = 'CSE';
          else if (code === 'EC') dept = 'ECE';
          else if (code === 'EE') dept = 'EEE';
          else if (code === 'IT') dept = 'IT';
          else if (code === 'AD') dept = 'AIDS';
          else if (code === 'AL') dept = 'AIML';
          else if (code === 'ME') dept = 'MECH';
          else if (code === 'CE') dept = 'CIVIL';
        }

        const autoStudentUser: User = {
          id: `usr-stu-${rollNo}`,
          name: studentName,
          email: studentEmail,
          role: 'viewer',
          status: 'accepted',
          department: dept,
          designation: 'Students',
          classSection: studentSection,
          employeeOrStudentId: rollNo,
          phone: '+91 94440 00000',
          passwordSalt: 'stu_salt_2026',
          passwordHash: 'dummy_hash_stu',
          registrationDate: new Date().toISOString().split('T')[0],
          reviewedAt: new Date().toISOString().split('T')[0],
          reviewedBy: 'Institutional Roll No Verification',
          notes: `Student Roll No ${rollNo} verified with student password stu@2026`,
        };

        setUsers((prev) => [...prev, autoStudentUser]);
        user = autoStudentUser;
      } else if (
        cleanEmail.endsWith('@mkce.ac.in') ||
        cleanEmail.endsWith('@mksce.ac.in') ||
        cleanEmail.endsWith('@campus.edu') ||
        cleanEmail.endsWith('@gmail.com') ||
        cleanEmail === 'ananthi' ||
        cleanEmail === 'selvanayagi' ||
        cleanEmail === 'operator' ||
        cleanEmail === 'opr' ||
        cleanEmail === 'principle' ||
        cleanEmail === 'principal' ||
        cleanEmail === 'manager' ||
        cleanEmail === 'dean'
      ) {
        // Dynamic staff / executive / operator account generation
        const staffPrefix = cleanEmail.split('@')[0].split('.')[0].toLowerCase();
        if (staffPrefix === 'principle' || staffPrefix === 'principal') {
          if (passLower === 'principal@2026' || passLower === 'principle@2026') {
            const prinUser: User = {
              id: 'usr-exec-principal',
              name: 'Balamurugan',
              email: 'principle@mkce.ac.in',
              role: 'viewer',
              status: 'accepted',
              department: 'Administration & Management',
              designation: 'Principal',
              employeeOrStudentId: 'MKCE-PRIN-01',
              phone: '+91 94440 10001',
              passwordSalt: 'principal_salt_2026',
              passwordHash: 'dummy_hash_principal',
              registrationDate: '2025-08-01',
              reviewedAt: '2025-08-01',
              reviewedBy: 'PRANITH SRIRAM G',
              notes: 'College Principal (principle@mkce.ac.in / principal@2026)',
            };
            setUsers((prev) => [...prev, prinUser]);
            user = prinUser;
          }
        } else if (staffPrefix === 'manager' || staffPrefix === 'vikram') {
          if (passLower === 'man@2026' || passLower === 'manager@2026') {
            const mgrUser: User = {
              id: 'usr-exec-manager',
              name: 'Vikram',
              email: 'manager@mkce.ac.in',
              role: 'viewer',
              status: 'accepted',
              department: 'Administration & Management',
              designation: 'Manager',
              employeeOrStudentId: 'MKCE-MGR-02',
              phone: '+91 94440 20002',
              passwordSalt: 'manager_salt_2026',
              passwordHash: 'dummy_hash_manager_vikram',
              registrationDate: '2025-08-05',
              reviewedAt: '2025-08-05',
              reviewedBy: 'PRANITH SRIRAM G',
              notes: 'College Manager (manager@mkce.ac.in / man@2026)',
            };
            setUsers((prev) => [...prev, mgrUser]);
            user = mgrUser;
          }
        } else if (staffPrefix === 'ananthi') {
          if (
            passClean === 'staff@2026' ||
            passClean === 'Pass@2026' ||
            passClean === 'ca@2026'
          ) {
            const ananthiUser: User = {
              id: 'usr-ca-ananthi',
              name: 'Prof. Ananthi',
              email: 'ananthi@mkce.ac.in',
              role: 'viewer',
              status: 'accepted',
              department: 'CSE',
              designation: 'Class Advisors',
              classSection: 'IV Year CSE (Sec IV-A)',
              employeeOrStudentId: 'FAC-CSE-105',
              phone: '+91 94435 50105',
              passwordSalt: 'ananthi_salt_2026',
              passwordHash: 'dummy_hash_ananthi',
              registrationDate: '2025-08-20',
              reviewedAt: '2025-08-20',
              reviewedBy: 'PRANITH SRIRAM G',
              notes: 'CSE Class Advisor IV-A (CS Seminar Hall 401) · Cabin: Computer Block - CS-105 (Class Advisor Only · Pass: staff@2026)',
            };
            setUsers((prev) => [...prev, ananthiUser]);
            user = ananthiUser;
          }
        } else if (staffPrefix === 'selvanayagi') {
          if (
            passClean === 'staff@2026' ||
            passClean === 'Pass@2026' ||
            passClean === 'ca@2026'
          ) {
            const selvanayagiUser: User = {
              id: 'usr-ca-selvanayagi',
              name: 'Prof. A. Selvanayagi',
              email: 'selvanayagi@mkce.ac.in',
              role: 'viewer',
              status: 'accepted',
              department: 'CSE',
              designation: 'Class Advisors',
              classSection: 'IV Year CSE (Sec IV-B)',
              employeeOrStudentId: 'FAC-CSE-106',
              phone: '+91 94435 50106',
              passwordSalt: 'selvanayagi_salt_2026',
              passwordHash: 'dummy_hash_selvanayagi',
              registrationDate: '2025-08-20',
              reviewedAt: '2025-08-20',
              reviewedBy: 'PRANITH SRIRAM G',
              notes: 'CSE Class Advisor IV-B (CS Seminar Hall 402) · Cabin: Computer Block - CS-106 (Class Advisor Only · Pass: staff@2026)',
            };
            setUsers((prev) => [...prev, selvanayagiUser]);
            user = selvanayagiUser;
          }
        } else if (staffPrefix === 'kaviarasu' || staffPrefix === 'gym') {
          if (passLower === 'gym@2026' || passLower === 'opr@2026') {
            const gymUser: User = {
              id: 'usr-gym-kaviarasu',
              name: 'Prof. Kaviarasu',
              email: 'kaviarasu@mkce.ac.in',
              role: 'operator',
              status: 'accepted',
              department: 'Administration & Management',
              designation: 'Department Staffs',
              employeeOrStudentId: 'GYM-DIR-01',
              phone: '+91 94440 10009',
              passwordSalt: 'gym_salt_2026',
              passwordHash: 'dummy_hash_gym',
              registrationDate: '2025-08-15',
              reviewedAt: '2025-08-15',
              reviewedBy: 'PRANITH SRIRAM G',
              notes: 'Gym Incharge & Physical Education Director (Pass: gym@2026)',
            };
            setUsers((prev) => [...prev, gymUser]);
            user = gymUser;
          }
        } else if (staffPrefix === 'logavel' || staffPrefix === 'dean') {
          if (passLower === 'dean@2026') {
            const deanUser: User = {
              id: 'usr-exec-dean-main',
              name: 'Dr. Logavel',
              email: 'dean@mkce.ac.in',
              role: 'viewer',
              status: 'accepted',
              department: 'Administration & Management',
              designation: 'Dean',
              employeeOrStudentId: 'EXEC-DEAN-01',
              phone: '+91 94440 10005',
              passwordSalt: 'dean_salt_2026',
              passwordHash: 'dummy_hash_dean',
              registrationDate: '2025-08-10',
              reviewedAt: '2025-08-10',
              reviewedBy: 'PRANITH SRIRAM G',
              notes: 'Dean - Admissions & Corporate Outreach (Pass: dean@2026)',
            };
            setUsers((prev) => [...prev, deanUser]);
            user = deanUser;
          }
        } else if (
          passLower === 'opr@2026' ||
          passLower === 'staff@2026' ||
          passClean === 'Pass@2026'
        ) {
          // Operator / Department staff login with default operator password opr@2026
          const resolvedEmail = cleanEmail.includes('@') ? cleanEmail : `${staffPrefix}@mkce.ac.in`;
          const staffUser: User = {
            id: `usr-op-${staffPrefix}`,
            name: staffPrefix.charAt(0).toUpperCase() + staffPrefix.slice(1),
            email: resolvedEmail,
            role: 'operator',
            status: 'accepted',
            department: 'CSE',
            designation: 'Supporting Staff',
            employeeOrStudentId: `MKCE-OP-${staffPrefix.toUpperCase()}`,
            phone: '+91 94440 00000',
            passwordSalt: 'opr_salt_2026',
            passwordHash: 'dummy_hash_opr',
            registrationDate: new Date().toISOString().split('T')[0],
            reviewedAt: new Date().toISOString().split('T')[0],
            reviewedBy: 'PRANITH SRIRAM G',
            notes: `System Operator (${resolvedEmail}) verified with default operator password opr@2026`,
          };
          setUsers((prev) => [...prev, staffUser]);
          user = staffUser;
        }
      }
    }

    if (!user) {
      return { success: false, message: 'No registered institutional account found with this email ID or Roll Number.' };
    }

    // Check account approval status
    if (user.status === 'pending') {
      return {
        success: false,
        status: 'pending',
        message: 'Your registration is currently PENDING login approval by Administrator PRANITH SRIRAM G. You will receive an email once reviewed.',
        user,
      };
    }

    if (user.status === 'rejected') {
      return {
        success: false,
        status: 'rejected',
        message: `Your registration request was REJECTED: "${user.rejectionReason || 'Institution eligibility criteria not met'}"`,
        user,
      };
    }

    // Verify Password Hash & Role Default Passwords
    let isValid = false;
    const normEmail = user.email.toLowerCase();
    const hodEmailMatch = normEmail.match(/^hod[-_.]([a-z0-9]+)@/i);

    if (normEmail === 'sriramacess2302@gmail.com') {
      // Super Administrator / Dean Admin password
      if (
        passClean === 'Admin@2026' ||
        passLower === 'dean@2026' ||
        passLower === 'admin' ||
        passLower === 'admin123'
      ) {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (
      normEmail === 'principal@mkce.ac.in' ||
      normEmail === 'principle@mkce.ac.in' ||
      user.designation === 'Principal'
    ) {
      // Principal account (principle@mkce.ac.in / principal@mkce.ac.in): principal@2026
      if (passLower === 'principal@2026' || passLower === 'principle@2026') {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (normEmail === 'manager@mkce.ac.in' || user.designation === 'Manager') {
      // Manager account (Vikram): man@2026
      if (passLower === 'man@2026' || passLower === 'manager@2026') {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (
      normEmail === 'dean@mkce.ac.in' ||
      normEmail === 'logavel@mkce.ac.in' ||
      (user.designation === 'Dean' && user.role !== 'admin') ||
      user.name.toLowerCase().includes('logavel')
    ) {
      // Dean account (Dr. Logavel): dean@2026
      if (passLower === 'dean@2026') {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (hodEmailMatch || (user.designation === 'HOD' && user.role !== 'operator')) {
      // HOD account: hod-<dept>@mkce.ac.in -> <dept>hod@2026 (also accepts hod@2026)
      const deptSlug = hodEmailMatch
        ? hodEmailMatch[1].toLowerCase()
        : user.department === 'Freshman Engineering (1st Year)'
        ? 'fe'
        : user.department.toLowerCase();
      if (
        passLower === `${deptSlug}hod@2026` ||
        passLower === 'hod@2026' ||
        passLower === `hod${deptSlug}@2026` ||
        (deptSlug === 'cse' && passLower === 'cshod@2026') ||
        passLower === 'opr@2026'
      ) {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (
      normEmail === 'kaviarasu@mkce.ac.in' ||
      normEmail.includes('gym') ||
      user.name.toLowerCase().includes('kaviarasu')
    ) {
      // Gym Incharge: gym@2026 or opr@2026
      if (passLower === 'gym@2026' || passLower === 'opr@2026') {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (
      user.designation === 'Students' ||
      normEmail.includes('student') ||
      normEmail.match(/^[0-9]{2}[a-z]{2,5}[0-9]{2,4}@mkce\.ac\.in$/i)
    ) {
      // Students default password: stu@2026 (also supports Roll No IDs and stu@@026)
      if (passLower === 'stu@2026' || passLower === 'stu@@026' || passClean === 'Pass@2026') {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (
      user.role === 'operator' ||
      ['Department Staffs', 'Class Advisors', 'HOD', 'AHOD', 'Supporting Staff'].includes(user.designation) ||
      normEmail.endsWith('@mkce.ac.in') ||
      normEmail.endsWith('@mksce.ac.in')
    ) {
      // Operators default password: opr@2026 (also accepts staff@2026 for Class Advisors / Staff)
      if (
        passLower === 'opr@2026' ||
        passLower === 'staff@2026' ||
        passClean === 'Pass@2026'
      ) {
        isValid = true;
      } else {
        isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
      }
    } else if (user.passwordHash.startsWith('dummy_hash')) {
      isValid = true;
    } else {
      isValid = await verifyPassword(passClean, user.passwordHash, user.passwordSalt);
    }

    if (!isValid) {
      return {
        success: false,
        message:
          'Invalid password. Use principal@2026 (Principal), man@2026 (Manager), dean@2026 (Dean), <dept>hod@2026 (HODs), or opr@2026 (Operators).',
      };
    }

    setCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.name}!`, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickSwitchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department: CampusDepartment;
    designation: DesignationCategory;
    employeeOrStudentId: string;
    classSection?: string;
    phone?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this institutional email address already exists.' };
    }

    // Hash the password securely with WebCrypto PBKDF2 + SHA-256 + 16-byte random salt
    const salt = generateSalt();
    const hashRes = await hashPassword(data.password, salt);

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      status: 'pending', // Starts strictly in Pending state as required!
      department: data.department,
      designation: data.designation,
      classSection: data.classSection?.trim() || undefined,
      employeeOrStudentId: data.employeeOrStudentId.trim(),
      phone: data.phone?.trim() || '',
      passwordSalt: hashRes.salt,
      passwordHash: hashRes.hash,
      registrationDate: new Date().toISOString().split('T')[0],
      notes: `Self-registered ${data.role.toUpperCase()} login application waiting for Admin approval`,
    };

    const updated = [newUser, ...users];
    setUsers(updated);

    // Send confirmation email simulation to user
    sendEmailInternal({
      toEmail: newUser.email,
      toName: newUser.name,
      from: 'noreply.carbon@campus.edu',
      subject: 'Registration Received: Carbon Intelligence Login Application Waiting for Approval',
      type: 'account_approved',
      htmlContent: `
        <p>Dear <strong>${newUser.name}</strong>,</p>
        <p>Your registration request for <strong>${newUser.role.toUpperCase()}</strong> role in department <em>${newUser.department}</em> has been successfully received.</p>
        <p><strong>Current Status:</strong> <span style="color:#f59e0b;font-weight:bold;">WAITING FOR ADMIN LOGIN APPROVAL</span></p>
        <p>Your application is placed in the login approval queue for Admin <strong>PRANITH SRIRAM G</strong>. You will receive an email notification when your account is approved or rejected.</p>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;" />
        <p style="font-size:12px;color:#64748b;">Carbon Intelligence & Greenhouse Effect Management System</p>
      `,
    });

    return {
      success: true,
      message: 'Account registration submitted! Status is Waiting for Admin Login Approval.',
      user: newUser,
    };
  };

  const adminCreateUser = async (data: {
    name: string;
    email: string;
    role: 'operator' | 'viewer';
    department: CampusDepartment;
    designation: DesignationCategory;
    employeeOrStudentId: string;
    classSection?: string;
    phone?: string;
    password?: string;
    notes?: string;
    initialStatus?: 'accepted' | 'pending';
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: `An account with ${cleanEmail} already exists in the registry.` };
    }

    const salt = generateSalt();
    const passToUse =
      data.password && data.password.trim().length >= 6
        ? data.password
        : data.role === 'operator'
        ? 'opr@2026'
        : data.designation === 'Students'
        ? 'stu@2026'
        : 'staff@2026';
    const hashRes = await hashPassword(passToUse, salt);
    const nowStr = new Date().toISOString().split('T')[0];
    const targetStatus = data.initialStatus || 'accepted';

    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      status: targetStatus,
      department: data.department,
      designation: data.designation,
      classSection: data.classSection?.trim() || undefined,
      employeeOrStudentId: data.employeeOrStudentId.trim() || `MKCE-${data.role.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      phone: data.phone?.trim() || '',
      passwordSalt: hashRes.salt,
      passwordHash: hashRes.hash,
      registrationDate: nowStr,
      reviewedAt: targetStatus === 'accepted' ? nowStr : undefined,
      reviewedBy: targetStatus === 'accepted' ? currentUser?.name || 'PRANITH SRIRAM G' : undefined,
      notes:
        data.notes ||
        (targetStatus === 'pending'
          ? `Added to Login Approval Queue (Default Pass: ${passToUse})`
          : `Authorized ${data.role} provisioned by Administrator (Default Pass: ${passToUse})`),
    };

    setUsers((prev) => [newUser, ...prev]);

    sendEmailInternal({
      toEmail: newUser.email,
      toName: newUser.name,
      from: 'noreply.carbon@campus.edu',
      subject:
        targetStatus === 'pending'
          ? `[Pending Login Approval] Your ${newUser.role.toUpperCase()} account is queued for verification`
          : `[Authorized] Your ${newUser.role.toUpperCase()} account has been created by Administrator`,
      type: 'account_approved',
      htmlContent: `
        <div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
          <h2 style="color:#059669;margin-top:0;">${
            targetStatus === 'pending' ? 'Login Queued for Approval' : 'Account Provisioned by Administrator'
          }</h2>
          <p>Dear <strong>${newUser.name}</strong>,</p>
          <p>Administrator <strong>PRANITH SRIRAM G</strong> has registered your account as <strong>${newUser.role.toUpperCase()}</strong> for <em>${newUser.department}</em>.</p>
          <p>Email: <code>${newUser.email}</code> | Default Password: <code>${passToUse}</code></p>
        </div>
      `,
    });

    return {
      success: true,
      message:
        targetStatus === 'pending'
          ? `Added ${newUser.name} (${newUser.role.toUpperCase()}) to the Login Approval Queue!`
          : `Successfully provisioned ${newUser.role.toUpperCase()} account for ${newUser.name} (Pass: ${passToUse}).`,
      user: newUser,
    };
  };

  const approveUser = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return false;

    const reviewerName = currentUser ? currentUser.name : 'PRANITH SRIRAM G';
    const nowStr = new Date().toISOString().split('T')[0];

    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            status: 'accepted' as const,
            reviewedAt: nowStr,
            reviewedBy: reviewerName,
            rejectionReason: undefined,
          }
        : u
    );

    setUsers(updatedUsers);

    // Send outbound approval email notification to registered email
    sendEmailInternal({
      toEmail: target.email,
      toName: target.name,
      from: 'noreply.carbon@campus.edu',
      subject: `[Approved] Your Carbon Intelligence ${target.role.toUpperCase()} Account is Active`,
      type: 'account_approved',
      htmlContent: `
        <div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
          <h2 style="color:#059669;margin-top:0;">Account Registration Approved</h2>
          <p>Dear <strong>${target.name}</strong>,</p>
          <p>We are pleased to inform you that your registration application for the <strong>Carbon Intelligence and Greenhouse Effect Management System</strong> has been <span style="color:#059669;font-weight:700;">ACCEPTED</span> by Administrator <strong>${reviewerName}</strong>.</p>
          <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:12px;margin:16px 0;border-radius:4px;">
            <p style="margin:2px 0;"><strong>Role:</strong> ${target.role.toUpperCase()}</p>
            <p style="margin:2px 0;"><strong>Department:</strong> ${target.department}</p>
            <p style="margin:2px 0;"><strong>Designation:</strong> ${target.designation}</p>
            <p style="margin:2px 0;"><strong>Status:</strong> ACCEPTED / ACTIVE</p>
          </div>
          <p>You can now sign in using your registered email and access your authorized dashboard capabilities.</p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;" />
          <p style="font-size:12px;color:#64748b;">Office of Green Campus & Carbon Intelligence | ${reviewerName}</p>
        </div>
      `,
    });

    return true;
  };

  const rejectUser = async (userId: string, reason: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return false;

    const reviewerName = currentUser ? currentUser.name : 'PRANITH SRIRAM G';
    const nowStr = new Date().toISOString().split('T')[0];

    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            status: 'rejected' as const,
            reviewedAt: nowStr,
            reviewedBy: reviewerName,
            rejectionReason: reason || 'Application did not meet departmental access verification guidelines.',
          }
        : u
    );

    setUsers(updatedUsers);

    // Send outbound rejection email notification to registered email
    sendEmailInternal({
      toEmail: target.email,
      toName: target.name,
      from: 'noreply.carbon@campus.edu',
      subject: `[Notice] Carbon Intelligence Account Application Update`,
      type: 'account_rejected',
      htmlContent: `
        <div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
          <h2 style="color:#dc2626;margin-top:0;">Registration Application Decision</h2>
          <p>Dear <strong>${target.name}</strong>,</p>
          <p>Thank you for submitting a registration application for the Carbon Intelligence platform. After review by the institutional administration, your request has been <span style="color:#dc2626;font-weight:700;">REJECTED</span>.</p>
          <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px;margin:16px 0;border-radius:4px;">
            <p style="margin:2px 0;font-weight:600;color:#991b1b;">Administrator Feedback / Reason:</p>
            <p style="margin:4px 0;color:#7f1d1d;">${reason || 'Application did not meet departmental access verification guidelines.'}</p>
          </div>
          <p>If you believe this decision is in error or your institutional role requires modification, please contact your department chair or reapply with verified credentials.</p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;" />
          <p style="font-size:12px;color:#64748b;">Office of Green Campus & Carbon Intelligence | ${reviewerName}</p>
        </div>
      `,
    });

    return true;
  };

  const deleteUser = async (userId: string) => {
    if (userId === 'usr-admin-01') return false; // Prevent removing primary admin
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return true;
  };

  const requestPasswordReset = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'No registered user found with this email ID.' };
    }

    const resetToken = `RST-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const tokens = StorageService.getResetTokens();
    tokens[resetToken] = {
      email: cleanEmail,
      expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
      token: resetToken,
    };
    StorageService.saveResetTokens(tokens);

    // Send simulated email with reset link and token
    sendEmailInternal({
      toEmail: cleanEmail,
      toName: user.name,
      from: 'security.carbon@campus.edu',
      subject: `[Security] Password Reset Request - Carbon Intelligence Portal`,
      type: 'password_reset',
      actionToken: resetToken,
      htmlContent: `
        <div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
          <h2 style="color:#0284c7;margin-top:0;">Password Recovery Request</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password for the Carbon Intelligence and Greenhouse Effect Management System.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;padding:14px;border-radius:6px;margin:16px 0;text-align:center;">
            <p style="margin:0 0 6px 0;font-size:13px;color:#0369a1;">Your Secure Verification Reset Code:</p>
            <span style="font-family:monospace;font-size:22px;font-weight:700;letter-spacing:2px;color:#0c4a6e;background:#e0f2fe;padding:4px 12px;border-radius:4px;display:inline-block;">${resetToken}</span>
          </div>
          <p style="font-size:13px;">This token expires in 60 minutes. Use this token in the Password Reset dialog to configure your new secure password.</p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;" />
          <p style="font-size:12px;color:#64748b;">If you did not request this reset, your account is secure and you may safely disregard this notification.</p>
        </div>
      `,
    });

    return {
      success: true,
      message: `A secure password reset link and token have been dispatched to ${cleanEmail}. Check the Outbound Mailbox notification.`,
      resetToken,
    };
  };

  const completePasswordReset = async (token: string, newPassword: string) => {
    const cleanToken = token.trim();
    const tokens = StorageService.getResetTokens();
    const record = tokens[cleanToken];

    if (!record || record.expiresAt < Date.now()) {
      return { success: false, message: 'Invalid or expired reset token. Please request a new recovery link.' };
    }

    const user = users.find((u) => u.email.toLowerCase() === record.email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Associated account not found.' };
    }

    const salt = generateSalt();
    const hashRes = await hashPassword(newPassword, salt);

    const updated = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            passwordSalt: hashRes.salt,
            passwordHash: hashRes.hash,
          }
        : u
    );

    setUsers(updated);

    // Clean token
    delete tokens[cleanToken];
    StorageService.saveResetTokens(tokens);

    sendEmailInternal({
      toEmail: user.email,
      toName: user.name,
      from: 'security.carbon@campus.edu',
      subject: `[Confirmed] Password Successfully Updated`,
      type: 'password_reset',
      htmlContent: `
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Your password for the Carbon Intelligence portal was successfully updated on ${new Date().toLocaleString()}.</p>
        <p>If you did not make this change, please contact Administrator <strong>PRANITH SRIRAM G</strong> immediately.</p>
      `,
    });

    return { success: true, message: 'Password has been securely updated! You can now sign in.' };
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'phone' | 'employeeOrStudentId' | 'department' | 'designation'>>) => {
    if (!currentUser) return false;

    const updatedUser = { ...currentUser, ...updates };
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));

    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    return true;
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: 'User not signed in.' };

    const isMatch = await verifyPassword(currentPass, currentUser.passwordHash, currentUser.passwordSalt);
    // Allow admin bypass if admin initial pass
    const isInitialAdmin = currentUser.email === 'sriramacess2302@gmail.com' && (currentPass === 'Admin@2026' || currentPass === 'admin');

    if (!isMatch && !isInitialAdmin) {
      return { success: false, message: 'Current password does not match.' };
    }

    const newSalt = generateSalt();
    const hashRes = await hashPassword(newPass, newSalt);

    const updatedUser = {
      ...currentUser,
      passwordSalt: hashRes.salt,
      passwordHash: hashRes.hash,
    };

    setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);

    return { success: true, message: 'Password updated successfully!' };
  };

  const markEmailAsRead = (emailId: string) => {
    setSimulatedEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true } : e))
    );
  };

  const clearEmails = () => {
    setSimulatedEmails([]);
  };

  const checkStatusByEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    return users.find((u) => u.email.toLowerCase() === clean) || null;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        simulatedEmails,
        unreadEmailCount,
        login,
        logout,
        quickSwitchUser,
        registerUser,
        adminCreateUser,
        approveUser,
        rejectUser,
        deleteUser,
        requestPasswordReset,
        completePasswordReset,
        updateProfile,
        changePassword,
        markEmailAsRead,
        clearEmails,
        checkStatusByEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
