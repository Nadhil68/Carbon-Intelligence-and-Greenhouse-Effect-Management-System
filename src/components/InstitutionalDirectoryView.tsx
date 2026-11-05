import React, { useState, useMemo } from 'react';
import {
  ENGINEERING_DEPARTMENTS,
  PLACEMENT_DATA,
  FRESHMAN_ENGINEERING_DATA,
  TRANSPORT_DATA,
  OFFICE_DATA,
  HOSTEL_DATA,
  CAMPUS_EXECUTIVE_DATA,
  StaffRecord,
  StudentBatchRecord,
  LabRecord,
  CollegeBusRecord,
  OfficeEmployeeRecord,
  Freshman1stYearStudentBatch,
} from '../data/campusDirectoryData';
import {
  Users,
  Building2,
  GraduationCap,
  FlaskConical,
  Wifi,
  Cpu,
  Zap,
  Leaf,
  Briefcase,
  Bus,
  FileText,
  ChevronRight,
  ArrowLeft,
  Search,
  Folder,
  FolderOpen,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  Calendar,
  UserCheck,
  User,
  ArrowUpRight,
  SlidersHorizontal,
  ShieldCheck,
  Bed,
  Utensils,
  Dumbbell,
  Crown,
  Award,
} from 'lucide-react';
import { IndividualFacultyView, DetailedFacultyData } from './IndividualFacultyView';
import { IndividualStudentView, DetailedStudentData } from './IndividualStudentView';

type MainViewType = 'departments_grid' | 'eng_dept' | 'placement' | 'freshman' | 'transport' | 'office' | 'hostel' | 'executive';
type EngSubTab = 'staffs' | 'students' | 'labs';
type FreshmanSubTab = 'faculty' | 'students';
type FreshmanDeptKey = 'maths' | 'physics' | 'chemistry' | 'english';

export const InstitutionalDirectoryView: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<MainViewType>('departments_grid');
  const [selectedEngDept, setSelectedEngDept] = useState<string>('CSE');
  const [engSubTab, setEngSubTab] = useState<EngSubTab>('staffs');
  const [studentYearFilter, setStudentYearFilter] = useState<'all' | '2nd Year' | '3rd Year' | '4th Year'>('all');

  // Individual Detail Pages State
  const [selectedFaculty, setSelectedFaculty] = useState<DetailedFacultyData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<DetailedStudentData | null>(null);

  // Placement Sub Tabs
  const [placementTab, setPlacementTab] = useState<'coordinator' | 'staffs'>('coordinator');

  // Hostel Sub Tabs
  const [hostelTab, setHostelTab] = useState<'boys' | 'girls'>('boys');

  // Freshman Engineering Sub State
  const [freshmanTab, setFreshmanTab] = useState<FreshmanSubTab>('faculty');
  const [freshmanDept, setFreshmanDept] = useState<FreshmanDeptKey>('maths');
  const [freshmanBranchFilter, setFreshmanBranchFilter] = useState<string>('ALL');

  // Transport View State
  const [transportTab, setTransportTab] = useState<'officer' | 'buses_folder'>('buses_folder');
  const [selectedBus, setSelectedBus] = useState<CollegeBusRecord | null>(null);

  // Office View State
  const [officeTab, setOfficeTab] = useState<'manager' | 'employees'>('manager');

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Top level departments list (17 Divisions across Engineering, Freshman, Placement, Transport, Office, Hostel, Executive)
  const primaryDepts = [
    { code: 'CIVIL', name: 'CIVIL', desc: 'Civil Engineering', color: 'from-amber-600 to-orange-700', type: 'eng', staffCount: 18, stuCount: 310, labsCount: 5, carbonKg: 52.4 },
    { code: 'ME', name: 'ME', desc: 'Mechanical Engineering', color: 'from-blue-700 to-indigo-800', type: 'eng', staffCount: 22, stuCount: 420, labsCount: 7, carbonKg: 68.5 },
    { code: 'AIDS', name: 'AIDS', desc: 'AI & Data Science', color: 'from-emerald-600 to-teal-800', type: 'eng', staffCount: 20, stuCount: 360, labsCount: 6, carbonKg: 62.1 },
    { code: 'AIML', name: 'AIML', desc: 'AI & Machine Learning', color: 'from-cyan-600 to-blue-800', type: 'eng', staffCount: 19, stuCount: 340, labsCount: 5, carbonKg: 58.7 },
    { code: 'CSE', name: 'CSE', desc: 'Computer Science', color: 'from-indigo-600 to-blue-900', type: 'eng', staffCount: 28, stuCount: 580, labsCount: 6, carbonKg: 94.2 },
    { code: 'IT', name: 'IT', desc: 'Information Technology', color: 'from-violet-700 to-purple-900', type: 'eng', staffCount: 24, stuCount: 460, labsCount: 7, carbonKg: 78.6 },
    { code: 'ECE', name: 'ECE', desc: 'Electronics & Comm.', color: 'from-amber-700 to-yellow-800', type: 'eng', staffCount: 26, stuCount: 520, labsCount: 8, carbonKg: 88.4 },
    { code: 'EEE', name: 'EEE', desc: 'Electrical & Electronics', color: 'from-yellow-600 to-amber-800', type: 'eng', staffCount: 21, stuCount: 380, labsCount: 6, carbonKg: 85.2 },
    { code: 'VLSC', name: 'VLSC', desc: 'VLSI Design & Tech', color: 'from-rose-600 to-red-900', type: 'eng', staffCount: 16, stuCount: 240, labsCount: 4, carbonKg: 44.8 },
    { code: 'CYBER', name: 'Cyber Security', desc: 'Defensive Security & Threat Intel', color: 'from-slate-800 to-cyan-900', type: 'eng', staffCount: 16, stuCount: 280, labsCount: 4, carbonKg: 64.2 },
    { code: 'TIH', name: 'TIH & IEEE Hub', desc: 'Tech Innovation Hub & IEEE', color: 'from-blue-700 to-indigo-950', type: 'eng', staffCount: 14, stuCount: 220, labsCount: 3, carbonKg: 56.5 },
    { code: 'Placement', name: 'Placement', desc: 'Placement & Training Cell', color: 'from-blue-600 to-cyan-700', type: 'special', staffCount: 7, stuCount: 1120, labsCount: 3, carbonKg: 28.5 },
    { code: 'Freshman', name: 'Freshman Engg', desc: '1st Year Foundation', color: 'from-teal-600 to-emerald-800', type: 'special', staffCount: 32, stuCount: 1072, labsCount: 8, carbonKg: 182.4 },
    { code: 'Transport', name: 'Transport', desc: 'Fleet & College Buses', color: 'from-orange-600 to-amber-700', type: 'special', staffCount: 26, stuCount: 1850, labsCount: 1, carbonKg: 124.6 },
    { code: 'Office', name: 'Office', desc: 'Manager & Admin Staff', color: 'from-slate-700 to-slate-900', type: 'special', staffCount: 16, stuCount: 0, labsCount: 1, carbonKg: 34.8 },
    { code: 'Hostel', name: 'Hostel & Mess', desc: 'Octa, Veda & Girls Hostels', color: 'from-rose-600 to-pink-800', type: 'special', staffCount: 12, stuCount: 1700, labsCount: 3, carbonKg: 504.6 },
    { code: 'Executive', name: 'Executive & Gym', desc: 'Principal, Dean-Admission, Gym', color: 'from-blue-900 to-indigo-950', type: 'special', staffCount: 6, stuCount: 0, labsCount: 1, carbonKg: 42.5 },
  ];

  // Helper to open Individual Department Page
  const handleSelectDepartment = (code: string) => {
    setSelectedFaculty(null);
    setSelectedStudent(null);
    if (code === 'Placement') {
      setCurrentView('placement');
      setPlacementTab('coordinator');
    } else if (code === 'Freshman') {
      setCurrentView('freshman');
      setFreshmanTab('faculty');
      setFreshmanDept('maths');
    } else if (code === 'Transport') {
      setCurrentView('transport');
      setTransportTab('buses_folder');
    } else if (code === 'Office') {
      setCurrentView('office');
      setOfficeTab('manager');
    } else if (code === 'Hostel') {
      setCurrentView('hostel');
      setHostelTab('boys');
    } else if (code === 'Executive') {
      setCurrentView('executive');
    } else {
      setSelectedEngDept(code);
      setCurrentView('eng_dept');
      setEngSubTab('staffs');
      setStudentYearFilter('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Individual Faculty Page
  const openFacultyPage = (
    staff: StaffRecord,
    deptCode: string,
    deptName: string,
    allStaffsInDept?: StaffRecord[]
  ) => {
    const detailed: DetailedFacultyData = {
      id: staff.id,
      name: staff.name,
      designation: staff.designation,
      roleTag: staff.roleTag,
      qualification: staff.qualification,
      departmentCode: deptCode,
      departmentName: deptName,
      cabin: staff.cabin,
      email: staff.email,
      phone: staff.phone,
      joinedYear: staff.joinedYear,
      employeeId: `MKCE-${deptCode}-${staff.id.replace(/[^a-zA-Z0-9]/g, '').slice(-3).toUpperCase()}`,
      subjects: staff.subjects,
      systemModel: staff.systemModel,
      systemPowerWatts: staff.systemPowerWatts,
      systemDailyKWh: staff.systemDailyKWh,
      systemCarbonKgCO2e: staff.systemCarbonKgCO2e,
      electricityDailyKWh: staff.electricityDailyKWh,
      electricityCarbonKgCO2e: staff.electricityCarbonKgCO2e,
      wifiAp: `AP-${deptCode}-FACULTY-WIFI6`,
      wifiSpeed: '120 Mbps Dedicated',
      colleagues: allStaffsInDept
        ? allStaffsInDept
            .filter((s) => s.id !== staff.id)
            .map((s) => ({
              id: s.id,
              name: s.name,
              designation: s.designation,
              cabin: s.cabin,
            }))
        : undefined,
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Individual Student Page
  const openStudentPage = (
    st: { rollNo: string; name: string; cgpa: string; laptopDailyKWh: number; carbonKgCO2e: number },
    batch: StudentBatchRecord | Freshman1stYearStudentBatch,
    deptCode: string,
    deptName: string
  ) => {
    const isFreshman = 'curriculum' in batch;
    const detailed: DetailedStudentData = {
      id: `${deptCode}-${st.rollNo}`,
      rollNo: st.rollNo,
      name: st.name,
      departmentCode: deptCode,
      departmentName: deptName,
      year: isFreshman ? '1st Year' : (batch as StudentBatchRecord).year,
      semester: isFreshman ? 'Semester I & II' : (batch as StudentBatchRecord).semester,
      section: batch.section,
      classAdvisor: batch.classAdvisor,
      advisorContact: batch.advisorContact,
      classRoom: batch.classRoom,
      cgpa: st.cgpa,
      laptopDailyKWh: st.laptopDailyKWh,
      carbonKgCO2e: st.carbonKgCO2e,
      monthlyElectricityKWh: isFreshman ? 850 : (batch as StudentBatchRecord).monthlyElectricityKWh,
      curriculumOrSubjects: isFreshman
        ? (batch as Freshman1stYearStudentBatch).curriculum
        : `Core Engineering Curriculum · Section ${batch.section}`,
      batchYears: isFreshman ? '2024 - 2028 Academic Batch' : '2023 - 2027 Academic Batch',
      peers: (batch.sampleStudents || []).map((p) => ({
        rollNo: p.rollNo,
        name: p.name,
        cgpa: p.cgpa,
        laptopDailyKWh: p.laptopDailyKWh,
        carbonKgCO2e: p.carbonKgCO2e,
      })),
    };
    setSelectedStudent(detailed);
    setSelectedFaculty(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Placement Coordinator Page
  const openPlacementCoordinatorPage = () => {
    const coord = PLACEMENT_DATA.coordinator;
    const detailed: DetailedFacultyData = {
      id: 'placement-coordinator',
      name: coord.name,
      designation: coord.designation,
      roleTag: 'Office Head - Placement Directorate & Career Guidance Director',
      qualification: 'M.E., Ph.D. (Engineering Education & Corporate Liaison)',
      departmentCode: 'Placement',
      departmentName: 'Placement & Training Directorate',
      cabin: coord.cabin,
      email: coord.email,
      phone: coord.phone,
      joinedYear: 2012,
      employeeId: 'MKCE-TPO-001',
      subjects: ['Campus Recruitment Training', 'Corporate Soft Skills & Aptitude', 'Technical Interview Prep'],
      systemModel: 'Dell OptiPlex 7090 Micro',
      systemPowerWatts: 150,
      systemDailyKWh: 1.2,
      systemCarbonKgCO2e: 0.98,
      electricityDailyKWh: coord.cabinElectricity.totalDailyKWh,
      electricityCarbonKgCO2e: coord.cabinCarbonGeneration.dailyKgCO2e,
      wifiAp: coord.wifi.routerId,
      wifiSpeed: '250 Mbps High-Speed Fiber',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Placement Staff Page
  const openPlacementStaffPage = (st: (typeof PLACEMENT_DATA.staffRecords)[0]) => {
    const detailed: DetailedFacultyData = {
      id: st.id,
      name: st.name,
      designation: st.designation,
      roleTag: st.designation,
      qualification: 'M.E. / M.B.A., Corporate Executive',
      departmentCode: 'Placement',
      departmentName: 'Placement Directorate',
      cabin: st.desk,
      email: st.email,
      phone: st.phone,
      joinedYear: 2018,
      employeeId: `MKCE-TPO-${st.id.slice(-2)}`,
      subjects: ['Corporate Aptitude Training', 'Coding Assessment Rounds'],
      systemModel: st.system.model,
      systemPowerWatts: 140,
      systemDailyKWh: st.system.dailyKWh,
      systemCarbonKgCO2e: st.system.systemCarbonKgCO2e,
      electricityDailyKWh: st.electricity.lightingAndAcShareKWh,
      electricityCarbonKgCO2e: st.electricity.electricityCarbonKgCO2e,
      wifiAp: 'AP-PLACEMENT-OFFICE',
      wifiSpeed: '150 Mbps High-Speed Fiber',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Freshman Leadership Page
  const openFreshmanLeadershipPage = (role: 'hod' | 'ahod') => {
    const lead = FRESHMAN_ENGINEERING_DATA.overallLeadership[role];
    const detailed: DetailedFacultyData = {
      id: `fe-overall-${role}`,
      name: lead.name,
      designation: role === 'hod' ? 'Overall HOD' : 'Overall AHOD',
      roleTag: lead.title,
      qualification: lead.qualification,
      departmentCode: 'Freshman',
      departmentName: 'Freshman Engineering Division (1st Year)',
      cabin: lead.cabin,
      email: lead.email,
      phone: lead.phone,
      joinedYear: lead.joinedYear,
      employeeId: `MKCE-FED-${role.toUpperCase()}`,
      subjects: ['Applied Mathematics & Calculus', 'Engineering Foundations'],
      systemModel: 'HP EliteDesk 800 G6 Tower',
      systemPowerWatts: 160,
      systemDailyKWh: lead.dailySystemKWh,
      systemCarbonKgCO2e: lead.systemCarbonKgCO2e,
      electricityDailyKWh: lead.cabinElectricityDailyKWh,
      electricityCarbonKgCO2e: lead.cabinCarbonKgCO2e,
      wifiAp: 'AP-SH-BLOCK-ADMIN',
      wifiSpeed: '120 Mbps Enterprise',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Freshman Subject Faculty Page
  const openFreshmanSubjectFacultyPage = (
    fac: {
      name: string;
      designation: string;
      qualification: string;
      cabin: string;
      email?: string;
      phone?: string;
      subjectsHandled?: string[];
      systemKWh?: number;
      carbonKgCO2e?: number;
    },
    subjectDeptName: string
  ) => {
    const detailed: DetailedFacultyData = {
      id: `fe-fac-${fac.name.replace(/[^a-zA-Z]/g, '').toLowerCase()}`,
      name: fac.name,
      designation: fac.designation,
      roleTag: `${fac.designation} (${subjectDeptName})`,
      qualification: fac.qualification,
      departmentCode: 'Freshman',
      departmentName: `Freshman Engineering - ${subjectDeptName}`,
      cabin: fac.cabin,
      email: fac.email || `${fac.name.toLowerCase().replace(/[^a-z]/g, '')}@campus.edu`,
      phone: fac.phone || '+91 94441 55000',
      joinedYear: 2017,
      employeeId: `MKCE-FE-${fac.name.slice(0, 3).toUpperCase()}`,
      subjects: fac.subjectsHandled || [subjectDeptName, 'Engineering Foundations'],
      systemModel: 'Dell OptiPlex 5080 Micro',
      systemPowerWatts: 140,
      systemDailyKWh: fac.systemKWh || 1.0,
      systemCarbonKgCO2e: fac.carbonKgCO2e || 0.82,
      electricityDailyKWh: 2.4,
      electricityCarbonKgCO2e: 1.96,
      wifiAp: 'AP-SH-BLOCK-FACULTY',
      wifiSpeed: '100 Mbps Dedicated',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Transport Officer Page
  const openTransportOfficerPage = () => {
    const off = TRANSPORT_DATA.officer;
    const detailed: DetailedFacultyData = {
      id: 'transport-officer',
      name: off.name,
      designation: off.designation,
      roleTag: 'Chief Transport Officer & Fleet Administrator',
      qualification: 'B.E. (Automobile Engg), Diploma in Fleet Logistics',
      departmentCode: 'Transport',
      departmentName: 'Transportation & Logistics Directorate',
      cabin: off.cabin,
      email: off.email,
      phone: off.phone,
      joinedYear: off.joinedYear,
      employeeId: 'MKCE-FLT-001',
      subjects: ['Institutional Fleet Logistics', 'Campus Transit Safety & Emission Audits'],
      systemModel: 'Lenovo ThinkCentre M70s Desktop',
      systemPowerWatts: 150,
      systemDailyKWh: off.cabinStats.workstationKWh,
      systemCarbonKgCO2e: +(off.cabinStats.workstationKWh * 0.82).toFixed(2),
      electricityDailyKWh: off.cabinStats.totalDailyKWh,
      electricityCarbonKgCO2e: off.cabinStats.carbonGenerationDailyKg,
      wifiAp: off.cabinStats.wifiRouterId,
      wifiSpeed: '100 Mbps Dedicated',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Office Manager Page
  const openOfficeManagerPage = () => {
    const mgr = OFFICE_DATA.manager;
    const detailed: DetailedFacultyData = {
      id: 'office-manager',
      name: mgr.name,
      designation: mgr.designation,
      roleTag: 'General Administrative Manager',
      qualification: 'B.E. (Admin & Systems Engg), MBA (Operations)',
      departmentCode: 'Office',
      departmentName: 'Administrative & General Office',
      cabin: mgr.cabin,
      email: mgr.email,
      phone: mgr.phone,
      joinedYear: mgr.joinedYear,
      employeeId: 'MKCE-ADM-001',
      subjects: ['College Institutional Administration', 'Campus Energy & Facilities Management'],
      systemModel: 'HP EliteDesk 800 G6',
      systemPowerWatts: 160,
      systemDailyKWh: mgr.cabinDetails.electricity.managerWorkstationKWh,
      systemCarbonKgCO2e: +(mgr.cabinDetails.electricity.managerWorkstationKWh * 0.82).toFixed(2),
      electricityDailyKWh: mgr.cabinDetails.electricity.totalDailyKWh,
      electricityCarbonKgCO2e: mgr.cabinDetails.cabinCarbon.dailyKgCO2e,
      wifiAp: mgr.cabinDetails.wifi.routerId,
      wifiSpeed: '150 Mbps Fiber',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Office Employee Page
  const openOfficeEmployeePage = (emp: (typeof OFFICE_DATA.employees)[0]) => {
    const detailed: DetailedFacultyData = {
      id: emp.id,
      name: emp.name,
      designation: emp.designation,
      roleTag: emp.designation,
      qualification: 'B.Sc. / B.Com / M.B.A., Office Executive',
      departmentCode: 'Office',
      departmentName: 'Administrative Office',
      cabin: emp.cabinOrDesk,
      email: emp.email,
      phone: emp.phone,
      joinedYear: 2018,
      employeeId: `MKCE-ADM-${emp.id.slice(-2)}`,
      subjects: ['Administrative Records & Accounting', 'Institutional Secretarial Office'],
      systemModel: emp.system.pcSpecs,
      systemPowerWatts: 140,
      systemDailyKWh: emp.system.dailyKWh,
      systemCarbonKgCO2e: emp.system.carbonKgCO2e,
      electricityDailyKWh: emp.electricity.lightingAndFanKWh,
      electricityCarbonKgCO2e: emp.electricity.carbonKgCO2e,
      wifiAp: 'AP-ADMIN-OFFICE-MAIN',
      wifiSpeed: '100 Mbps Dedicated',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Executive Leadership (Principal, Dean-Admission, Gym Incharge)
  const openExecutivePersonPage = (personType: 'principal' | 'deanAdmission' | 'gym') => {
    let detailed: DetailedFacultyData;
    if (personType === 'principal') {
      const p = CAMPUS_EXECUTIVE_DATA.principal;
      detailed = {
        id: 'exec-principal',
        name: p.name,
        designation: p.designation,
        roleTag: p.fullTitle,
        qualification: p.qualification,
        departmentCode: 'Executive',
        departmentName: 'Principal Secretariat & Head of Institution',
        cabin: p.cabin,
        email: p.email,
        phone: p.phone,
        joinedYear: p.joinedYear,
        employeeId: 'MKCE-PRIN-001',
        subjects: ['Academic Council Chairman', 'Institutional Governance & Research Policy'],
        systemModel: p.cabinSpecs.systemModel,
        systemPowerWatts: 220,
        systemDailyKWh: p.cabinSpecs.systemDailyKWh,
        systemCarbonKgCO2e: p.cabinSpecs.systemCarbonKgCO2e,
        electricityDailyKWh: p.cabinSpecs.lightingAndAcKWh,
        electricityCarbonKgCO2e: p.cabinSpecs.electricityCarbonKgCO2e,
        wifiAp: p.cabinSpecs.wifiAp,
        wifiSpeed: `${p.cabinSpecs.bandwidthMbps} Mbps High-Speed Fiber`,
      };
    } else if (personType === 'deanAdmission') {
      const d = CAMPUS_EXECUTIVE_DATA.deanAdmission;
      detailed = {
        id: 'exec-dean-admission',
        name: d.name,
        designation: d.designation,
        roleTag: d.fullTitle,
        qualification: d.qualification,
        departmentCode: 'Executive',
        departmentName: 'Admissions & Student Welfare Directorate',
        cabin: d.cabin,
        email: d.email,
        phone: d.phone,
        joinedYear: d.joinedYear,
        employeeId: 'MKCE-DEAN-ADM-01',
        subjects: ['Pan-India Admissions Administration', 'Eco-Scholarship Strategy'],
        systemModel: d.cabinSpecs.systemModel,
        systemPowerWatts: 160,
        systemDailyKWh: d.cabinSpecs.systemDailyKWh,
        systemCarbonKgCO2e: d.cabinSpecs.systemCarbonKgCO2e,
        electricityDailyKWh: d.cabinSpecs.lightingAndAcKWh,
        electricityCarbonKgCO2e: d.cabinSpecs.electricityCarbonKgCO2e,
        wifiAp: d.cabinSpecs.wifiAp,
        wifiSpeed: `${d.cabinSpecs.bandwidthMbps} Mbps Dedicated`,
      };
    } else {
      const g = CAMPUS_EXECUTIVE_DATA.gym;
      detailed = {
        id: 'exec-gym-incharge',
        name: g.incharge,
        designation: g.designation,
        roleTag: g.fullTitle,
        qualification: g.qualification,
        departmentCode: 'Executive',
        departmentName: 'Campus Physical Education & Fitness Pavilion',
        cabin: g.cabin,
        email: g.email,
        phone: g.phone,
        joinedYear: g.joinedYear,
        employeeId: 'MKCE-GYM-001',
        subjects: ['Physical Training & Athlete Conditioning', 'High-Performance Sports Fitness'],
        systemModel: 'Rugged Fitness Control Desktop & Sensor Monitor',
        systemPowerWatts: 120,
        systemDailyKWh: 0.85,
        systemCarbonKgCO2e: 0.7,
        electricityDailyKWh: g.facility.electricity.totalDailyKWh,
        electricityCarbonKgCO2e: g.facility.carbon.dailyKgCO2e,
        wifiAp: g.facility.wifi.ssid,
        wifiSpeed: '300 Mbps Fitness Pavilion Wi-Fi',
      };
    }
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to open Hostel Staff / Warden Page
  const openHostelStaffPage = (st: {
    id: string;
    name: string;
    designation: string;
    roleTag: string;
    qualification?: string;
    cabin?: string;
    email?: string;
    phone?: string;
    department?: string;
    systemDailyKWh?: number;
    electricityDailyKWh?: number;
  }) => {
    const detailed: DetailedFacultyData = {
      id: st.id,
      name: st.name,
      designation: st.designation,
      roleTag: st.roleTag,
      qualification: st.qualification || 'M.E. / M.Tech / M.Sc., Resident Warden',
      departmentCode: 'Hostel',
      departmentName: 'Hostels & Residential Directorate',
      cabin: st.cabin || 'Hostel Administrative Office',
      email: st.email || `${st.name.toLowerCase().replace(/[^a-z]/g, '')}.hostel@campus.edu`,
      phone: st.phone || '+91 94440 14000',
      joinedYear: 2017,
      employeeId: `MKCE-HST-${st.id.slice(-3).toUpperCase()}`,
      subjects: ['Student Residential Living Administration', 'Hostel Eco-Energy & Waste Management'],
      systemModel: 'Dell OptiPlex 3090 Resident Station',
      systemPowerWatts: 130,
      systemDailyKWh: st.systemDailyKWh || 1.1,
      systemCarbonKgCO2e: +((st.systemDailyKWh || 1.1) * 0.82).toFixed(2),
      electricityDailyKWh: st.electricityDailyKWh || 3.0,
      electricityCarbonKgCO2e: +((st.electricityDailyKWh || 3.0) * 0.82).toFixed(2),
      wifiAp: 'MKCE-HOSTEL-ENTERPRISE-WIFI',
      wifiSpeed: '200 Mbps Mesh Fiber',
    };
    setSelectedFaculty(detailed);
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global search matches computation
  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return null;
    const q = globalSearch.toLowerCase().trim();

    // Faculty matches across engineering
    const matchedStaff: { staff: StaffRecord; deptCode: string; deptName: string; allStaffs: StaffRecord[] }[] = [];
    Object.values(ENGINEERING_DEPARTMENTS).forEach((d) => {
      d.staffs.forEach((s) => {
        if (
          s.name.toLowerCase().includes(q) ||
          s.designation.toLowerCase().includes(q) ||
          s.cabin.toLowerCase().includes(q) ||
          s.subjects.some((sub) => sub.toLowerCase().includes(q))
        ) {
          matchedStaff.push({ staff: s, deptCode: d.code, deptName: d.fullName, allStaffs: d.staffs });
        }
      });
    });

    // Placement Directorate staff & Office Head matches
    if (
      PLACEMENT_DATA.coordinator.name.toLowerCase().includes(q) ||
      PLACEMENT_DATA.coordinator.designation.toLowerCase().includes(q) ||
      'placement'.includes(q)
    ) {
      matchedStaff.push({
        staff: {
          id: 'placement-office-head',
          name: PLACEMENT_DATA.coordinator.name,
          designation: 'HOD',
          roleTag: PLACEMENT_DATA.coordinator.designation,
          qualification: 'M.E., Ph.D.',
          subjects: ['Career Guidance', 'Corporate Relations & Placement'],
          cabin: PLACEMENT_DATA.coordinator.cabin,
          email: PLACEMENT_DATA.coordinator.email,
          phone: PLACEMENT_DATA.coordinator.phone,
          joinedYear: 2012,
          systemModel: 'Dell OptiPlex 7090 Micro',
          systemPowerWatts: 150,
          systemDailyKWh: 1.2,
          systemCarbonKgCO2e: 0.98,
          electricityDailyKWh: PLACEMENT_DATA.coordinator.cabinElectricity.totalDailyKWh,
          electricityCarbonKgCO2e: PLACEMENT_DATA.coordinator.cabinCarbonGeneration.dailyKgCO2e,
        },
        deptCode: 'Placement',
        deptName: 'Placement & Training Directorate',
        allStaffs: [],
      });
    }

    PLACEMENT_DATA.staffRecords.forEach((st) => {
      if (
        st.name.toLowerCase().includes(q) ||
        st.designation.toLowerCase().includes(q) ||
        st.desk.toLowerCase().includes(q)
      ) {
        matchedStaff.push({
          staff: {
            id: st.id,
            name: st.name,
            designation: 'Subject Staff',
            roleTag: st.designation,
            qualification: 'M.E. / M.B.A.',
            subjects: [st.designation, 'Campus Recruitment Training'],
            cabin: st.desk,
            email: st.email,
            phone: st.phone,
            joinedYear: 2018,
            systemModel: st.system.model,
            systemPowerWatts: st.system.powerWatts,
            systemDailyKWh: st.system.dailyKWh,
            systemCarbonKgCO2e: st.system.systemCarbonKgCO2e,
            electricityDailyKWh: st.electricity.lightingAndAcShareKWh,
            electricityCarbonKgCO2e: st.electricity.electricityCarbonKgCO2e,
          },
          deptCode: 'Placement',
          deptName: 'Placement Directorate',
          allStaffs: [],
        });
      }
    });

    // Student matches
    const matchedStudents: {
      student: { rollNo: string; name: string; cgpa: string; laptopDailyKWh: number; carbonKgCO2e: number };
      batch: StudentBatchRecord | Freshman1stYearStudentBatch;
      deptCode: string;
      deptName: string;
    }[] = [];

    Object.values(ENGINEERING_DEPARTMENTS).forEach((d) => {
      d.students.forEach((batch) => {
        batch.sampleStudents.forEach((st) => {
          if (
            st.name.toLowerCase().includes(q) ||
            st.rollNo.toLowerCase().includes(q)
          ) {
            matchedStudents.push({ student: st, batch, deptCode: d.code, deptName: d.fullName });
          }
        });
      });
    });

    // Freshman student matches
    FRESHMAN_ENGINEERING_DATA.firstYearStudents.forEach((batch) => {
      (batch.sampleStudents || []).forEach((st) => {
        if (
          st.name.toLowerCase().includes(q) ||
          st.rollNo.toLowerCase().includes(q)
        ) {
          matchedStudents.push({
            student: st,
            batch,
            deptCode: 'Freshman',
            deptName: `${batch.department} 1st Year`,
          });
        }
      });
    });

    // Department matches
    const matchedDepts = primaryDepts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q)
    );

    return {
      staff: matchedStaff.slice(0, 6),
      students: matchedStudents.slice(0, 6),
      departments: matchedDepts.slice(0, 4),
    };
  }, [globalSearch]);

  const currentEngData = ENGINEERING_DEPARTMENTS[selectedEngDept] || ENGINEERING_DEPARTMENTS.CSE;

  // =========================================================================
  // VIEW ROUTING: IF AN INDIVIDUAL FACULTY IS SELECTED, RENDER FACULTY PAGE
  // =========================================================================
  if (selectedFaculty) {
    return (
      <IndividualFacultyView
        faculty={selectedFaculty}
        onBack={() => {
          setSelectedFaculty(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectColleague={(colleagueId) => {
          const dept = ENGINEERING_DEPARTMENTS[selectedFaculty.departmentCode];
          if (dept) {
            const col = dept.staffs.find((s) => s.id === colleagueId);
            if (col) {
              openFacultyPage(col, dept.code, dept.fullName, dept.staffs);
            }
          }
        }}
      />
    );
  }

  // =========================================================================
  // VIEW ROUTING: IF AN INDIVIDUAL STUDENT IS SELECTED, RENDER STUDENT PAGE
  // =========================================================================
  if (selectedStudent) {
    return (
      <IndividualStudentView
        student={selectedStudent}
        onBack={() => {
          setSelectedStudent(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectPeer={(peerRollNo) => {
          const peer = selectedStudent.peers?.find((p) => p.rollNo === peerRollNo);
          if (peer) {
            const updated: DetailedStudentData = {
              ...selectedStudent,
              rollNo: peer.rollNo,
              name: peer.name,
              cgpa: peer.cgpa,
              laptopDailyKWh: peer.laptopDailyKWh,
              carbonKgCO2e: peer.carbonKgCO2e,
            };
            setSelectedStudent(updated);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    );
  }

  // =========================================================================
  // VIEW 1: CAMPUS DIRECTORY HOME (13 DIVISIONS OVERVIEW GRID)
  // =========================================================================
  if (currentView === 'departments_grid') {
    return (
      <div className="space-y-6 w-full max-w-full overflow-hidden animate-fade-in">
        {/* Header Banner & Global Search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-semibold text-blue-700 uppercase tracking-wider">
                  M.Kumarasamy College of Engineering
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">Campus Institutional Directory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <span>Campus Institutional Directory</span>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  17 Divisions Active
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Click on any <strong>Department</strong>, <strong>Faculty</strong>, or <strong>Student</strong> below to open their dedicated individual page with verified rosters, cabins, Wi-Fi telemetries, and electrical carbon audits.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search faculty, student, roll no, department..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Quick Institutional Stats Strip */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Campus Divisions</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">13 Active</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Verified Faculty</div>
              <div className="text-sm sm:text-base font-bold text-blue-700 mt-0.5">230+ Staff</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Student Enrolment</div>
              <div className="text-sm sm:text-base font-bold text-emerald-700 mt-0.5">3,450+ Enrolled</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Laboratories</div>
              <div className="text-sm sm:text-base font-bold text-purple-700 mt-0.5">52 Labs</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Fleet Buses</div>
              <div className="text-sm sm:text-base font-bold text-orange-700 mt-0.5">24 Routes</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="text-[11px] text-emerald-700 font-medium">Campus Carbon</div>
              <div className="text-sm sm:text-base font-bold text-emerald-900 mt-0.5">895 kg CO2e/day</div>
            </div>
          </div>
        </div>

        {/* Global Search Results Panel (when searching) */}
        {searchResults && (
          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Search Results for "{globalSearch}"</span>
              </h3>
              <button
                onClick={() => setGlobalSearch('')}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {/* Matched Faculty */}
            {searchResults.staff.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Faculty Matches:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {searchResults.staff.map(({ staff, deptCode, deptName, allStaffs }) => (
                    <button
                      key={staff.id}
                      onClick={() => openFacultyPage(staff, deptCode, deptName, allStaffs)}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-300 text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 text-xs">
                        {staff.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {staff.designation} · {deptCode}
                      </div>
                      <div className="mt-1 text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                        <span>Open Faculty Page</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Students */}
            {searchResults.students.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Student Matches:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {searchResults.students.map(({ student, batch, deptCode, deptName }) => (
                    <button
                      key={student.rollNo}
                      onClick={() => openStudentPage(student, batch, deptCode, deptName)}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs flex justify-between">
                        <span>{student.name}</span>
                        <span className="font-mono text-blue-700">{student.rollNo}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {deptCode} · CGPA {student.cgpa}
                      </div>
                      <div className="mt-1 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <span>Open Student Page</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Departments */}
            {searchResults.departments.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Department Matches:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {searchResults.departments.map((d) => (
                    <button
                      key={d.code}
                      onClick={() => handleSelectDepartment(d.code)}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 text-xs">
                        {d.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{d.desc}</div>
                      <div className="mt-1 text-[10px] text-blue-700 font-semibold">
                        Open Department Page →
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 13 Campus Divisions Grid: Click to Open Individual Department Page */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Select Any Division to Open Its Individual Department Page</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every division opens into a dedicated individual department page with staff directories, students, and laboratories.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
              15 Divisions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {primaryDepts.map((dept) => (
              <div
                key={dept.code}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} text-white font-black text-sm flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      {dept.code === 'Placement' ? (
                        <Briefcase className="w-6 h-6 text-white" />
                      ) : dept.code === 'Freshman' ? (
                        <GraduationCap className="w-6 h-6 text-white" />
                      ) : dept.code === 'Transport' ? (
                        <Bus className="w-6 h-6 text-white" />
                      ) : dept.code === 'Office' ? (
                        <FileText className="w-6 h-6 text-white" />
                      ) : dept.code === 'CYBER' ? (
                        <ShieldCheck className="w-6 h-6 text-white" />
                      ) : dept.code === 'TIH' ? (
                        <Sparkles className="w-6 h-6 text-white" />
                      ) : (
                        dept.code
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {dept.code}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{dept.desc}</p>

                  {/* Division Stats Grid */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Faculty:</span>
                      <strong className="text-slate-800">{dept.staffCount} Members</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Students:</span>
                      <strong className="text-slate-800">
                        {dept.stuCount > 0 ? `${dept.stuCount} Enrolled` : 'Admin Staff'}
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Labs / Units:</span>
                      <strong className="text-slate-800">{dept.labsCount} Dedicated</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50/60">
                      <span className="text-[10px] text-emerald-600 block">Carbon Load:</span>
                      <strong className="text-emerald-800">{dept.carbonKg} kg CO2e</strong>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button: Open Department Individual Page */}
                <button
                  onClick={() => handleSelectDepartment(dept.code)}
                  className="w-full mt-4 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer group/btn"
                >
                  <span>Open {dept.name} Individual Page</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INDIVIDUAL DEPARTMENT PAGE (ENGINEERING, PLACEMENT, FRESHMAN, TRANSPORT, OFFICE)
  // =========================================================================
  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden animate-fade-in">
      {/* 1. Header Navigation Bar with "Back to Campus Directory" and Quick Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => setCurrentView('departments_grid')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>All Campus Departments</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-900 text-sm">
            {currentView === 'eng_dept' && `${currentEngData.fullName} (${currentEngData.code})`}
            {currentView === 'placement' && 'Placement & Corporate Training Directorate'}
            {currentView === 'freshman' && 'Freshman Engineering Division (1st Year)'}
            {currentView === 'transport' && 'Transportation & Fleet Logistics'}
            {currentView === 'office' && 'Administrative & General Office'}
          </span>
        </div>

        {/* Quick Division Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden md:inline">Switch Division:</span>
          <select
            value={
              currentView === 'eng_dept'
                ? selectedEngDept
                : currentView === 'placement'
                ? 'Placement'
                : currentView === 'freshman'
                ? 'Freshman'
                : currentView === 'transport'
                ? 'Transport'
                : 'Office'
            }
            onChange={(e) => handleSelectDepartment(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <optgroup label="Engineering & Innovation Departments">
              {['CIVIL', 'ME', 'AIDS', 'AIML', 'CSE', 'IT', 'ECE', 'EEE', 'VLSC', 'CYBER', 'TIH'].map((code) => (
                <option key={code} value={code}>
                  {code} - {ENGINEERING_DEPARTMENTS[code]?.name || code}
                </option>
              ))}
            </optgroup>
            <optgroup label="Special Divisions">
              <option value="Placement">Placement Directorate</option>
              <option value="Freshman">Freshman Engineering (1st Year)</option>
              <option value="Transport">Transportation & Buses</option>
              <option value="Office">Administrative Office</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INDIVIDUAL DEPARTMENT VIEW: ENGINEERING DEPARTMENTS */}
      {/* ========================================================================= */}
      {currentView === 'eng_dept' && (
        <div className="space-y-6">
          {/* Department Banner Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${currentEngData.accentColor} text-white font-black text-xl flex items-center justify-center shadow-sm shrink-0`}
              >
                {currentEngData.code}
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-700 font-mono uppercase">
                  Engineering Department
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{currentEngData.fullName}</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{currentEngData.tagline}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <div className="text-xs text-slate-400 font-medium">Total Staff</div>
                <div className="text-sm font-bold text-slate-800">{currentEngData.stats.totalStaff} Members</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <div className="text-xs text-slate-400 font-medium">Students (2nd-4th)</div>
                <div className="text-sm font-bold text-slate-800">{currentEngData.stats.totalStudents} Enrolled</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <div className="text-xs text-slate-400 font-medium">Laboratories</div>
                <div className="text-sm font-bold text-slate-800">{currentEngData.stats.totalLabs} Dedicated</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                <div className="text-xs text-emerald-600 font-medium">Daily Carbon Load</div>
                <div className="text-sm font-bold text-emerald-800">{currentEngData.stats.avgDailyCarbonKg} kg CO2e</div>
              </div>
            </div>
          </div>

          {/* 3 MANDATORY SUB-TABS: Staffs, Students, Labs */}
          <div className="bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 w-full max-w-xl mx-auto shadow-inner">
            <button
              onClick={() => setEngSubTab('staffs')}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                engSubTab === 'staffs'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span>1. Staffs</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 font-mono">
                {currentEngData.staffs.length}
              </span>
            </button>

            <button
              onClick={() => setEngSubTab('students')}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                engSubTab === 'students'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>2. Students (2nd-4th Yr)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-mono">
                3 Batches
              </span>
            </button>

            <button
              onClick={() => setEngSubTab('labs')}
              className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                engSubTab === 'labs'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-purple-600 shrink-0" />
              <span>3. Labs (Wi-Fi & Current)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 font-mono">
                {currentEngData.labs.length}
              </span>
            </button>
          </div>

          {/* SUB-TAB 1: STAFFS ROSTER WITH INDIVIDUAL PAGE TRIGGER */}
          {engSubTab === 'staffs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Staff Details: HOD, AHOD to All Working & Subject Staffs</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({currentEngData.fullName})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any staff card below to open their full individual faculty profile page.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEngData.staffs.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-2xs">
                            {staff.name.charAt(staff.name.startsWith('Dr.') ? 4 : 0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{staff.name}</div>
                            <div className="text-xs font-semibold text-blue-700">{staff.roleTag}</div>
                            <div className="text-[11px] text-slate-500">{staff.qualification}</div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            staff.designation === 'HOD'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : staff.designation === 'AHOD'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {staff.designation}
                        </span>
                      </div>

                      {/* Subjects Handled */}
                      <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Subjects Handled / Specialization:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {staff.subjects.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* System & Electricity Carbon Audit */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                          <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-blue-600" />
                            <span>System Energy</span>
                          </div>
                          <div className="font-bold text-slate-800 mt-0.5">
                            {staff.systemDailyKWh} kWh/day
                          </div>
                          <div className="text-[10px] text-slate-500 truncate" title={staff.systemModel}>
                            {staff.systemModel}
                          </div>
                          <div className="text-[10px] font-mono font-semibold text-rose-600 mt-1">
                            CO2e: {staff.systemCarbonKgCO2e} kg/day
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                          <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-600" />
                            <span>Electricity (Cabin)</span>
                          </div>
                          <div className="font-bold text-slate-800 mt-0.5">
                            {staff.electricityDailyKWh} kWh/day
                          </div>
                          <div className="text-[10px] text-slate-500">Lighting, Fans & Share</div>
                          <div className="text-[10px] font-mono font-semibold text-rose-600 mt-1">
                            CO2e: {staff.electricityCarbonKgCO2e} kg/day
                          </div>
                        </div>
                      </div>

                      {/* Location & Contact */}
                      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{staff.cabin}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-600">{staff.email}</span>
                          <span className="font-mono text-slate-600">{staff.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Open Individual Faculty Page */}
                    <button
                      onClick={() => openFacultyPage(staff, currentEngData.code, currentEngData.fullName, currentEngData.staffs)}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer group/btn"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Faculty Individual Page</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: STUDENTS ROSTER WITH INDIVIDUAL PAGE TRIGGER */}
          {engSubTab === 'students' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Student Data (2nd Year to 4th Year) · {currentEngData.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any student below to open their full individual student profile page with computing carbon telemetry.
                  </p>
                </div>

                {/* Filter Years */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['all', '2nd Year', '3rd Year', '4th Year'] as const).map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setStudentYearFilter(yr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        studentYearFilter === yr
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {yr === 'all' ? 'All (2nd-4th)' : yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentEngData.students
                  .filter((b) => studentYearFilter === 'all' || b.year === studentYearFilter)
                  .map((batch) => (
                    <div
                      key={batch.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              {batch.year}
                            </span>
                            <span className="text-xs font-bold text-slate-600">{batch.semester}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">{batch.section}</h4>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Classroom: <strong>{batch.classRoom}</strong> · Total Students:{' '}
                            <strong>{batch.totalStudents}</strong>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-right">
                          <div className="text-[11px] text-slate-500">Designated Class Advisor</div>
                          <div className="text-xs font-bold text-slate-900">{batch.classAdvisor}</div>
                          <div className="text-[11px] text-blue-700 font-mono mt-0.5">
                            {batch.advisorContact}
                          </div>
                        </div>
                      </div>

                      {/* Clickable Student Records Sample */}
                      <div className="mb-4">
                        <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span>Registered Student Records Sample:</span>
                          <span className="text-[11px] text-blue-700 font-medium">
                            Click any student to view their individual page →
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                          {batch.sampleStudents.map((st) => (
                            <button
                              key={st.rollNo}
                              onClick={() => openStudentPage(st, batch, currentEngData.code, currentEngData.fullName)}
                              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all text-left text-xs cursor-pointer group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-blue-700 group-hover:text-emerald-700">
                                  {st.rollNo}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                                  CGPA {st.cgpa}
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 truncate mt-1 flex items-center justify-between">
                                <span>{st.name}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                                <span>Laptop {st.laptopDailyKWh} kWh/day</span>
                                <span className="text-rose-600 font-mono font-medium">
                                  {st.carbonKgCO2e} kg CO2e
                                </span>
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                <span>Open Student Individual Page →</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cumulative Footprint */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-slate-700">
                            Batch Monthly Lecture Electricity Units:
                          </span>
                          <strong className="text-slate-900">{batch.monthlyElectricityKWh} kWh</strong>
                        </div>
                        <div className="flex items-center gap-2 font-mono font-bold text-rose-700">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                          <span>Carbon Emission Generation:</span>
                          <span>{batch.monthlyCarbonKgCO2e} kg CO2e/month</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: LABS (WI-FI, CURRENT, SYSTEM & CARBON) */}
          {engSubTab === 'labs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                    <span>Laboratory Telemetry: Wi-Fi, Current, Systems & Carbon Records</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time monitoring across 4 mandatory criteria for {currentEngData.fullName}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {currentEngData.labs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800">
                            {lab.code}
                          </span>
                          <h4 className="text-base font-bold text-slate-900">{lab.name}</h4>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Location: <strong>{lab.location}</strong> · In-charge: <strong>{lab.incharge}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {lab.carbon.rating}
                        </span>
                      </div>
                    </div>

                    {/* 4 MANDATORY LAB BLOCKS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {/* 1. Wi-Fi Records */}
                      <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1.5">
                        <div className="font-bold text-sky-900 flex items-center gap-1.5">
                          <Wifi className="w-3.5 h-3.5 text-sky-600" />
                          <span>1. Wi-Fi Records</span>
                        </div>
                        <div className="text-[11px] text-slate-600">SSID: <strong>{lab.wifi.ssid}</strong></div>
                        <div className="text-[11px] text-slate-600">AP: {lab.wifi.apId} ({lab.wifi.routerModel})</div>
                        <div className="text-[11px] text-slate-600">Bandwidth: <strong>{lab.wifi.bandwidthMbps} Mbps</strong></div>
                        <div className="pt-1.5 border-t border-sky-200/60 flex justify-between font-mono font-bold text-slate-800">
                          <span>Daily kWh: {lab.wifi.dailyKWh}</span>
                          <span className="text-rose-600">CO2: {lab.wifi.carbonKgCO2e} kg</span>
                        </div>
                      </div>

                      {/* 2. System Units */}
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                        <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                          <span>2. System Units</span>
                        </div>
                        <div className="text-[11px] text-slate-600">Workstations: <strong>{lab.systemUnits.workstationCount} Units</strong></div>
                        <div className="text-[11px] text-slate-600 truncate" title={lab.systemUnits.specs}>{lab.systemUnits.specs}</div>
                        <div className="text-[11px] text-slate-600">Avg Power: {lab.systemUnits.avgWattagePerPc} W/PC</div>
                        <div className="pt-1.5 border-t border-indigo-200/60 flex justify-between font-mono font-bold text-slate-800">
                          <span>Daily: {lab.systemUnits.dailyKWh} kWh</span>
                          <span className="text-rose-600">{lab.systemUnits.systemCarbonKgCO2e} kg</span>
                        </div>
                      </div>

                      {/* 3. Current Taking */}
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1.5">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          <span>3. Current Taking</span>
                        </div>
                        <div className="text-[11px] text-slate-600">Voltage: <strong>{lab.currentTaking.voltageVolts}V ({lab.currentTaking.phase})</strong></div>
                        <div className="text-[11px] text-amber-800 font-bold">Live: {lab.currentTaking.liveCurrentAmperes} Amperes</div>
                        <div className="text-[11px] text-slate-600">Breaker: {lab.currentTaking.breakerRatingAmps}A (PF {lab.currentTaking.powerFactor})</div>
                        <div className="pt-1.5 border-t border-amber-200/60 flex justify-between font-mono font-bold text-slate-800">
                          <span>Daily Total:</span>
                          <span>{lab.currentTaking.dailyTotalKWh} kWh</span>
                        </div>
                      </div>

                      {/* 4. Carbon Emission */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
                        <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                          <span>4. Carbon Records</span>
                        </div>
                        <div className="text-[11px] text-slate-600">Gross Daily: <strong>{lab.carbon.dailyKgCO2e} kg CO2e</strong></div>
                        <div className="text-[11px] text-emerald-700">Solar Offset: -{lab.carbon.solarOffsetKgCO2e} kg</div>
                        <div className="text-[11px] text-slate-600">Monthly: {lab.carbon.monthlyKgCO2e} kg</div>
                        <div className="pt-1.5 border-t border-emerald-200/60 flex justify-between font-mono font-bold text-emerald-900">
                          <span>Net Daily CO2e:</span>
                          <span className="text-sm">{lab.carbon.netCarbonKgCO2e} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INDIVIDUAL DEPARTMENT VIEW: PLACEMENT & TRAINING DIRECTORATE */}
      {/* ========================================================================= */}
      {currentView === 'placement' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 text-white flex items-center justify-center shadow-sm shrink-0">
                <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-700 font-mono uppercase">
                  Directorate Division
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Placement & Corporate Training Directorate</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Corporate Relations, Technical Training, Interview Cabins & Placement Drives</p>
              </div>
            </div>

            {/* Sub Tabs: Coordinator vs Staffs */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto max-w-sm">
              <button
                onClick={() => setPlacementTab('coordinator')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  placementTab === 'coordinator'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>1. Office Head Cabin</span>
              </button>
              <button
                onClick={() => setPlacementTab('staffs')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  placementTab === 'staffs'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>2. Staff Records</span>
              </button>
            </div>
          </div>

          {/* PLACEMENT TAB 1: COORDINATOR / OFFICE HEAD */}
          {placementTab === 'coordinator' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-base flex items-center justify-center shadow-xs">
                      OH
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{PLACEMENT_DATA.coordinator.name}</h3>
                      <div className="text-xs font-semibold text-blue-700">
                        {PLACEMENT_DATA.coordinator.designation}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{PLACEMENT_DATA.coordinator.cabin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Open Individual Page Button for Coordinator */}
                  <button
                    onClick={openPlacementCoordinatorPage}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Open Office Head Profile Page</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 SPECIFIC COORDINATOR RECORD BLOCKS: Wi-Fi, Current, Carbon Generation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Wi-Fi Records */}
                  <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1.5 text-xs">
                    <div className="font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5 mb-2">
                      <Wifi className="w-4 h-4 text-sky-600" />
                      <span>Coordinator Cabin Wi-Fi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Router ID:</span>
                      <strong className="text-slate-800">{PLACEMENT_DATA.coordinator.wifi.routerId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Connected Devices:</span>
                      <strong className="text-sky-700">{PLACEMENT_DATA.coordinator.wifi.connectedDevices} Units</strong>
                    </div>
                    <div className="pt-2 border-t border-sky-200/60 flex justify-between font-mono font-bold text-rose-600">
                      <span>Wi-Fi Daily Carbon:</span>
                      <span>{PLACEMENT_DATA.coordinator.wifi.carbonGenerationKgCO2e} kg CO2e</span>
                    </div>
                  </div>

                  {/* Current Units */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1.5 text-xs">
                    <div className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Cabin Current & Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Live Current Taking:</span>
                      <strong className="text-amber-800 font-mono text-sm">
                        {PLACEMENT_DATA.coordinator.cabinElectricity.liveCurrentTakingAmperes} Amperes
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Total Units:</span>
                      <strong className="text-amber-900">{PLACEMENT_DATA.coordinator.cabinElectricity.totalDailyKWh} kWh/day</strong>
                    </div>
                    <div className="pt-2 border-t border-amber-200/60 flex justify-between font-mono font-bold text-slate-800">
                      <span>Monthly Units:</span>
                      <span>{PLACEMENT_DATA.coordinator.cabinElectricity.monthlyKWh} kWh</span>
                    </div>
                  </div>

                  {/* Carbon Generation */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1.5 text-xs">
                    <div className="font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-2">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Cabin Carbon Generation</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Carbon Footprint:</span>
                      <strong className="text-rose-600 font-mono text-sm">
                        {PLACEMENT_DATA.coordinator.cabinCarbonGeneration.dailyKgCO2e} kg CO2e
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Projected:</span>
                      <strong className="text-slate-800">{PLACEMENT_DATA.coordinator.cabinCarbonGeneration.monthlyKgCO2e} kg CO2e</strong>
                    </div>
                    <div className="pt-2 border-t border-emerald-200/60 flex justify-between font-semibold text-emerald-800">
                      <span>Rating:</span>
                      <span>Tier-1 Energy Cabin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLACEMENT TAB 2: STAFF RECORDS */}
          {placementTab === 'staffs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLACEMENT_DATA.staffRecords.map((st) => (
                  <div
                    key={st.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                          <div className="text-xs font-semibold text-blue-700">{st.designation}</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{st.desk}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs my-3">
                        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                          <span className="text-[10px] text-blue-700 font-bold uppercase">System Compute</span>
                          <div className="font-bold text-slate-800 mt-0.5">{st.system.dailyKWh} kWh/day</div>
                          <div className="text-[10px] font-mono text-rose-600">CO2e: {st.system.systemCarbonKgCO2e} kg</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                          <span className="text-[10px] text-amber-800 font-bold uppercase">Electricity Share</span>
                          <div className="font-bold text-slate-800 mt-0.5">{st.electricity.lightingAndAcShareKWh} kWh/day</div>
                          <div className="text-[10px] font-mono text-rose-600">CO2e: {st.electricity.electricityCarbonKgCO2e} kg</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openPlacementStaffPage(st)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Staff Individual Page</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INDIVIDUAL DEPARTMENT VIEW: FRESHMAN ENGINEERING (1ST YEAR) */}
      {/* ========================================================================= */}
      {currentView === 'freshman' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white flex items-center justify-center shadow-sm shrink-0">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-xs font-semibold text-teal-700 font-mono uppercase">
                  First Year Academic Division
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Freshman Engineering</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Overall HOD & AHOD leadership, 4 fundamental departments (Maths, Physics, Chemistry, English), and 1st year students of all branches alone.
                </p>
              </div>
            </div>

            {/* Sub Tabs: Faculty vs Students */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto max-w-sm">
              <button
                onClick={() => setFreshmanTab('faculty')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  freshmanTab === 'faculty'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-teal-600" />
                <span>1. Faculty</span>
              </button>
              <button
                onClick={() => setFreshmanTab('students')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  freshmanTab === 'students'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>2. Students (1st Yr Only)</span>
              </button>
            </div>
          </div>

          {/* FRESHMAN TAB 1: FACULTY */}
          {freshmanTab === 'faculty' && (
            <div className="space-y-6">
              {/* Overall Leadership */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="text-xs font-bold font-mono uppercase tracking-wider text-teal-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Freshman Engineering Overall Leadership: HOD & AHOD Record</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Overall HOD */}
                  <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white">
                        OVERALL HOD
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">
                        {FRESHMAN_ENGINEERING_DATA.overallLeadership.hod.name}
                      </h4>
                      <div className="text-xs text-teal-800 font-medium">
                        {FRESHMAN_ENGINEERING_DATA.overallLeadership.hod.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {FRESHMAN_ENGINEERING_DATA.overallLeadership.hod.qualification} · {FRESHMAN_ENGINEERING_DATA.overallLeadership.hod.cabin}
                      </div>
                    </div>

                    <button
                      onClick={() => openFreshmanLeadershipPage('hod')}
                      className="mt-3 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Overall HOD Profile Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Overall AHOD */}
                  <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        OVERALL AHOD
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">
                        {FRESHMAN_ENGINEERING_DATA.overallLeadership.ahod.name}
                      </h4>
                      <div className="text-xs text-teal-800 font-medium">
                        {FRESHMAN_ENGINEERING_DATA.overallLeadership.ahod.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {FRESHMAN_ENGINEERING_DATA.overallLeadership.ahod.qualification} · {FRESHMAN_ENGINEERING_DATA.overallLeadership.ahod.cabin}
                      </div>
                    </div>

                    <button
                      onClick={() => openFreshmanLeadershipPage('ahod')}
                      className="mt-3 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Overall AHOD Profile Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Fundamental Departments Tabs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    4 Fundamental Science & Humanities Departments:
                  </h3>
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
                    {[
                      { key: 'maths', label: 'Engineering Maths' },
                      { key: 'physics', label: 'Engineering Physics' },
                      { key: 'chemistry', label: 'Engineering Chemistry' },
                      { key: 'english', label: 'Technical English' },
                    ].map((d) => (
                      <button
                        key={d.key}
                        onClick={() => setFreshmanDept(d.key as FreshmanDeptKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          freshmanDept === d.key
                            ? 'bg-white text-teal-800 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Fundamental Dept */}
                {(() => {
                  const d = FRESHMAN_ENGINEERING_DATA.facultyDepartments[freshmanDept];
                  return (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dept HOD */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                              DEPARTMENT HOD
                            </span>
                            <div className="text-sm font-bold text-slate-900 mt-1">{d.hod.name}</div>
                            <div className="text-xs text-teal-700 font-semibold">{d.hod.designation}</div>
                            <div className="text-[11px] text-slate-500">{d.hod.qualification} · {d.hod.cabin}</div>
                          </div>
                          <button
                            onClick={() => openFreshmanSubjectFacultyPage(d.hod, d.name)}
                            className="mt-3 py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white border border-teal-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Open HOD Page →</span>
                          </button>
                        </div>

                        {/* Dept AHOD */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                              DEPARTMENT AHOD
                            </span>
                            <div className="text-sm font-bold text-slate-900 mt-1">{d.ahod.name}</div>
                            <div className="text-xs text-indigo-700 font-semibold">{d.ahod.designation}</div>
                            <div className="text-[11px] text-slate-500">{d.ahod.qualification} · {d.ahod.cabin}</div>
                          </div>
                          <button
                            onClick={() => openFreshmanSubjectFacultyPage(d.ahod, d.name)}
                            className="mt-3 py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-800 hover:text-white border border-indigo-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Open AHOD Page →</span>
                          </button>
                        </div>
                      </div>

                      {/* Working Faculty List */}
                      <div>
                        <div className="text-xs font-bold text-slate-700 mb-2">
                          Working Faculty Members & Subject Staffs in {d.name}:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {d.facultyList.map((fac, idx: number) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 text-xs flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-bold text-slate-900">{fac.name}</div>
                                    <div className="text-[11px] text-teal-700 font-medium">
                                      {fac.designation}
                                    </div>
                                    <div className="text-[10px] text-slate-400">{fac.qualification}</div>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-500">{fac.cabin}</span>
                                </div>

                                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                                  <strong>Subjects:</strong> {fac.subjectsHandled.join(', ')}
                                </div>
                              </div>

                              <button
                                onClick={() => openFreshmanSubjectFacultyPage(fac, d.name)}
                                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-teal-600 text-teal-800 hover:text-white border border-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                <span>Open Faculty Profile Page →</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* FRESHMAN TAB 2: 1ST YEAR STUDENTS OF ALL BRANCHES */}
          {freshmanTab === 'students' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    First Year Students Alone (All Branches: ECE, EEE, CSE, IT, ME, AIDS, AIML, VLSC)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any student below to open their full individual 1st year student profile page.
                  </p>
                </div>

                {/* Branch Quick Filter */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                  {['ALL', 'ECE', 'EEE', 'CSE', 'IT', 'ME', 'AIDS', 'AIML', 'VLSC'].map((br) => (
                    <button
                      key={br}
                      onClick={() => setFreshmanBranchFilter(br)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        freshmanBranchFilter === br
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FRESHMAN_ENGINEERING_DATA.firstYearStudents
                  .filter((b) => freshmanBranchFilter === 'ALL' || b.department === freshmanBranchFilter)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                              {b.department} 1st Year
                            </span>
                            <span className="text-xs font-bold text-slate-800">{b.section}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Classroom: <strong>{b.classRoom}</strong> · Total Students:{' '}
                            <strong className="text-teal-700">{b.studentCount}</strong>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <div className="text-[10px] text-slate-400">Class Advisor</div>
                          <div className="font-bold text-slate-800">{b.classAdvisor}</div>
                          <div className="text-[10px] font-mono text-blue-700">{b.advisorContact}</div>
                        </div>
                      </div>

                      {/* Clickable 1st Year Students Sample */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-700 mb-2">
                          1st Year Enrolled Students (Click to open individual page):
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(b.sampleStudents || []).map((st) => (
                            <button
                              key={st.rollNo}
                              onClick={() => openStudentPage(st, b, b.department, `${b.department} Engineering`)}
                              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/70 hover:border-teal-300 transition-all text-left text-xs cursor-pointer group"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-mono font-bold text-teal-800">{st.rollNo}</span>
                                <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                                  CGPA {st.cgpa}
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 truncate mt-1 flex items-center justify-between">
                                <span>{st.name}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                Laptop: {st.laptopDailyKWh} kWh/day
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INDIVIDUAL DEPARTMENT VIEW: TRANSPORTATION & FLEET LOGISTICS */}
      {/* ========================================================================= */}
      {currentView === 'transport' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-700 text-white flex items-center justify-center shadow-sm shrink-0">
                <Bus className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-700 font-mono uppercase">
                  Institutional Fleet Directorate
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Transportation & Fleet Operations</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Transport Officer details and College Buses folder with routes, petrol/diesel rates, driver records, and travel carbon emissions.
                </p>
              </div>
            </div>

            {/* Sub Tabs: Officer vs Buses Folder */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto max-w-sm">
              <button
                onClick={() => setTransportTab('officer')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  transportTab === 'officer'
                    ? 'bg-white text-orange-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-orange-600" />
                <span>1. Transport Officer</span>
              </button>
              <button
                onClick={() => setTransportTab('buses_folder')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  transportTab === 'buses_folder'
                    ? 'bg-white text-orange-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FolderOpen className="w-4 h-4 text-orange-600" />
                <span>2. Buses Folder (24)</span>
              </button>
            </div>
          </div>

          {/* TRANSPORT TAB 1: OFFICER */}
          {transportTab === 'officer' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-700 text-white font-black text-base flex items-center justify-center shadow-xs">
                    TO
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{TRANSPORT_DATA.officer.name}</h3>
                    <div className="text-xs font-semibold text-orange-700">
                      {TRANSPORT_DATA.officer.designation}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{TRANSPORT_DATA.officer.cabin}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={openTransportOfficerPage}
                  className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Open Transport Officer Profile Page</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800">System Energy</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{TRANSPORT_DATA.officer.cabinStats.workstationKWh} kWh/day</div>
                  <div className="text-[11px] text-rose-600 font-mono">CO2e: {(TRANSPORT_DATA.officer.cabinStats.workstationKWh * 0.82).toFixed(2)} kg</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800">Cabin Electricity</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{TRANSPORT_DATA.officer.cabinStats.totalDailyKWh} kWh/day</div>
                  <div className="text-[11px] text-rose-600 font-mono">CO2e: {TRANSPORT_DATA.officer.cabinStats.carbonGenerationDailyKg} kg</div>
                </div>
                <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-100">
                  <div className="font-bold text-orange-900">Fleet Supervised</div>
                  <div className="text-sm font-bold text-orange-900 mt-1">24 Active College Buses</div>
                  <div className="text-[11px] text-slate-500">100% BS-VI Diesel Standard</div>
                </div>
              </div>
            </div>
          )}

          {/* TRANSPORT TAB 2: BUSES FOLDER */}
          {transportTab === 'buses_folder' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TRANSPORT_DATA.buses.map((bus) => (
                  <div
                    key={bus.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                          {bus.busNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1.5">{bus.route}</h4>
                        <div className="text-[11px] text-slate-500 font-mono">{bus.registrationNo}</div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-[10px] text-slate-400 block">Fuel Rate:</span>
                        <strong className="text-slate-800">₹{bus.dieselRatePerLitre}/L</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="font-bold text-slate-800">Driver: {bus.driver.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{bus.driver.phone} · Lic: {bus.driver.licenseNumber}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Trip: {bus.distanceKmPerDay} km</span>
                      <span className="font-mono font-bold text-rose-600">
                        CO2e: {bus.travelEmissions.dailyKgCO2e} kg/day
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. INDIVIDUAL DEPARTMENT VIEW: ADMINISTRATIVE & GENERAL OFFICE */}
      {/* ========================================================================= */}
      {currentView === 'office' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600 font-mono uppercase">
                  Central Administration Division
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Administrative & General Office</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Central Campus Management, Institutional Record Directorate & Energy Monitoring</p>
              </div>
            </div>

            {/* Sub Tabs: Manager vs Employees */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto max-w-sm">
              <button
                onClick={() => setOfficeTab('manager')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  officeTab === 'manager'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span>1. Manager Cabin</span>
              </button>
              <button
                onClick={() => setOfficeTab('employees')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  officeTab === 'employees'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-slate-700" />
                <span>2. Office Employees</span>
              </button>
            </div>
          </div>

          {/* OFFICE TAB 1: MANAGER */}
          {officeTab === 'manager' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white font-black text-base flex items-center justify-center shadow-xs">
                    GM
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{OFFICE_DATA.manager.name}</h3>
                    <div className="text-xs font-semibold text-slate-700">
                      {OFFICE_DATA.manager.designation}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{OFFICE_DATA.manager.cabin}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={openOfficeManagerPage}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Open Manager Profile Page</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800">Live Current Taking</div>
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {OFFICE_DATA.manager.cabinDetails.electricity.liveCurrentTakingAmperes} Amperes
                  </div>
                  <div className="text-[11px] text-slate-500">230V AC Single Phase</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800">Daily Electricity Units</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {OFFICE_DATA.manager.cabinDetails.electricity.totalDailyKWh} kWh/day
                  </div>
                  <div className="text-[11px] text-slate-500">AC, PC & Lighting Units</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="font-bold text-emerald-900">Cabin Daily Carbon</div>
                  <div className="text-sm font-bold text-rose-600 mt-1 font-mono">
                    {OFFICE_DATA.manager.cabinDetails.cabinCarbon.dailyKgCO2e} kg CO2e
                  </div>
                  <div className="text-[11px] text-slate-500">Projected: {OFFICE_DATA.manager.cabinDetails.cabinCarbon.monthlyKgCO2e} kg/mo</div>
                </div>
              </div>
            </div>
          )}

          {/* OFFICE TAB 2: EMPLOYEES */}
          {officeTab === 'employees' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OFFICE_DATA.employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                          <div className="text-xs font-semibold text-slate-700">{emp.designation}</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{emp.cabinOrDesk}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs my-3">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">System Compute</span>
                          <div className="font-bold text-slate-800 mt-0.5">{emp.system.dailyKWh} kWh/day</div>
                          <div className="text-[10px] font-mono text-rose-600">CO2e: {emp.system.carbonKgCO2e} kg</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                          <span className="text-[10px] text-amber-800 font-bold uppercase">Electricity Share</span>
                          <div className="font-bold text-slate-800 mt-0.5">{emp.electricity.lightingAndFanKWh} kWh/day</div>
                          <div className="text-[10px] font-mono text-rose-600">CO2e: {emp.electricity.carbonKgCO2e} kg</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openOfficeEmployeePage(emp)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-200 hover:border-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Employee Individual Page</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. INDIVIDUAL DEPARTMENT VIEW: HOSTEL & MESS */}
      {/* ========================================================================= */}
      {currentView === 'hostel' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setCurrentView('departments_grid')}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                title="Back to All Divisions"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-800 text-white flex items-center justify-center shadow-sm shrink-0">
                <Bed className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-xs font-semibold text-rose-700 font-mono uppercase">
                  Residential Infrastructure
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Hostels & Residential Directorate</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  OCTA Senior Boys, VEDA 1st Yrs Boys, Girls Residence & Clean Energy Dining Facilities
                </p>
              </div>
            </div>

            {/* Sub Tabs: Boys vs Girls */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto max-w-sm">
              <button
                onClick={() => setHostelTab('boys')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  hostelTab === 'boys'
                    ? 'bg-white text-rose-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-rose-600" />
                <span>1. Boys Hostel (Octa & Veda)</span>
              </button>
              <button
                onClick={() => setHostelTab('girls')}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  hostelTab === 'girls'
                    ? 'bg-white text-pink-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bed className="w-4 h-4 text-pink-600" />
                <span>2. Girls Hostel & Mess</span>
              </button>
            </div>
          </div>

          {/* HOSTEL TAB 1: BOYS HOSTEL */}
          {hostelTab === 'boys' && (
            <div className="space-y-6">
              {/* General Warden & Assistant General Warden Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-bold text-slate-900">Boys Hostel Central Administration</h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    1,020 Residing Students
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* General Warden: Prof. Yuvaraj (ECE Staff) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          GENERAL WARDEN (FOR BOYS)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">ECE Staff</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{HOSTEL_DATA.boysHostel.generalWarden.name}</h4>
                      <div className="text-xs text-slate-600 font-medium">{HOSTEL_DATA.boysHostel.generalWarden.designation}</div>
                      <div className="text-xs text-slate-500 mt-1">{HOSTEL_DATA.boysHostel.generalWarden.qualification}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">
                        Cabin: {HOSTEL_DATA.boysHostel.generalWarden.cabin} · Phone: {HOSTEL_DATA.boysHostel.generalWarden.phone}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        openHostelStaffPage({
                          id: 'hw-yuvaraj',
                          name: HOSTEL_DATA.boysHostel.generalWarden.name,
                          designation: HOSTEL_DATA.boysHostel.generalWarden.designation,
                          roleTag: 'General Warden (Boys Hostel) - ECE Staff',
                          qualification: HOSTEL_DATA.boysHostel.generalWarden.qualification,
                          cabin: HOSTEL_DATA.boysHostel.generalWarden.cabin,
                          email: HOSTEL_DATA.boysHostel.generalWarden.email,
                          phone: HOSTEL_DATA.boysHostel.generalWarden.phone,
                          department: 'ECE',
                          systemDailyKWh: HOSTEL_DATA.boysHostel.generalWarden.systemDailyKWh,
                          electricityDailyKWh: HOSTEL_DATA.boysHostel.generalWarden.electricityDailyKWh,
                        })
                      }
                      className="mt-4 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open General Warden Individual Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Assistant General Warden: Prof. Sathishkumar */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          ASS. WARDEN (GENERAL)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Hostel Directorate</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{HOSTEL_DATA.boysHostel.assGeneralWarden.name}</h4>
                      <div className="text-xs text-slate-600 font-medium">{HOSTEL_DATA.boysHostel.assGeneralWarden.designation}</div>
                      <div className="text-xs text-slate-500 mt-1">{HOSTEL_DATA.boysHostel.assGeneralWarden.qualification}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">
                        Cabin: {HOSTEL_DATA.boysHostel.assGeneralWarden.cabin} · Phone: {HOSTEL_DATA.boysHostel.assGeneralWarden.phone}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        openHostelStaffPage({
                          id: 'hw-sathish-gen',
                          name: HOSTEL_DATA.boysHostel.assGeneralWarden.name,
                          designation: HOSTEL_DATA.boysHostel.assGeneralWarden.designation,
                          roleTag: 'Assistant General Warden (Boys Hostel)',
                          qualification: HOSTEL_DATA.boysHostel.assGeneralWarden.qualification,
                          cabin: HOSTEL_DATA.boysHostel.assGeneralWarden.cabin,
                          email: HOSTEL_DATA.boysHostel.assGeneralWarden.email,
                          phone: HOSTEL_DATA.boysHostel.assGeneralWarden.phone,
                          systemDailyKWh: HOSTEL_DATA.boysHostel.assGeneralWarden.systemDailyKWh,
                          electricityDailyKWh: HOSTEL_DATA.boysHostel.assGeneralWarden.electricityDailyKWh,
                        })
                      }
                      className="mt-4 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Assistant Warden Individual Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Residential Blocks: OCTA and VEDA */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Block 1: OCTA */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        OCTA COMPLEX · SENIOR BOYS
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">OCTA Hostel Block</h4>
                      <div className="text-xs text-slate-500">Target: II, III & IV Year Engineering Boys</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">540 Beds</div>
                      <div className="text-[11px] text-slate-500">135 Living Rooms</div>
                    </div>
                  </div>

                  {/* Wardens in OCTA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">WARDEN</div>
                      <div className="font-bold text-slate-900">Prof. Sathishkumar</div>
                      <div className="text-[11px] font-mono text-slate-500">+91 94440 14002</div>
                      <button
                        onClick={() =>
                          openHostelStaffPage({
                            id: 'hw-octa-warden',
                            name: 'Prof. Sathishkumar',
                            designation: 'Warden (OCTA Block)',
                            roleTag: 'Warden - OCTA Senior Boys Block',
                            cabin: 'OCTA Warden Office G-01',
                            phone: '+91 94440 14002',
                            email: 'sathishkumar.octa@campus.edu',
                          })
                        }
                        className="mt-2 text-blue-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <span>Individual Page</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">ASS. WARDEN</div>
                      <div className="font-bold text-slate-900">Prof. Chandrashekar</div>
                      <div className="text-[11px] font-mono text-slate-500">+91 94440 14003</div>
                      <button
                        onClick={() =>
                          openHostelStaffPage({
                            id: 'hw-octa-ass',
                            name: 'Prof. Chandrashekar',
                            designation: 'Assistant Warden (OCTA Block)',
                            roleTag: 'Assistant Warden - OCTA Senior Boys Block',
                            cabin: 'OCTA Warden Office G-02',
                            phone: '+91 94440 14003',
                            email: 'chandrashekar.octa@campus.edu',
                          })
                        }
                        className="mt-2 text-blue-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <span>Individual Page</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Energy & Carbon Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-500 block">Daily Electricity</span>
                      <strong className="text-slate-800 text-sm">185 kWh</strong>
                      <span className="text-[10px] text-slate-400 block">5,550 kWh/mo</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                      <span className="text-[10px] text-rose-800 block">Daily Carbon</span>
                      <strong className="text-rose-700 text-sm font-mono">151.7 kg</strong>
                      <span className="text-[10px] text-rose-600 block">Net: 109.2 kg</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                      <span className="text-[10px] text-emerald-800 block">Solar Geyser</span>
                      <strong className="text-emerald-700 text-sm font-mono">-42.5 kg</strong>
                      <span className="text-[10px] text-emerald-600 block">Offset Daily</span>
                    </div>
                  </div>
                </div>

                {/* Block 2: VEDA */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        VEDA COMPLEX · 1ST YEAR FRESHMEN
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">VEDA Hostel Block (1st Yrs)</h4>
                      <div className="text-xs text-slate-500">Target: Freshman Engineering 1st Year Boys</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">480 Beds</div>
                      <div className="text-[11px] text-slate-500">120 Living Rooms</div>
                    </div>
                  </div>

                  {/* Wardens in VEDA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">WARDEN</div>
                      <div className="font-bold text-slate-900">Prof. Moorthy</div>
                      <div className="text-[11px] font-mono text-slate-500">+91 94440 14004</div>
                      <button
                        onClick={() =>
                          openHostelStaffPage({
                            id: 'hw-veda-warden',
                            name: 'Prof. Moorthy',
                            designation: 'Warden (VEDA Block)',
                            roleTag: 'Warden - VEDA 1st Year Boys Block',
                            cabin: 'VEDA Warden Office Room 101',
                            phone: '+91 94440 14004',
                            email: 'moorthy.veda@campus.edu',
                          })
                        }
                        className="mt-2 text-teal-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <span>Individual Page</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">ASS. WARDEN</div>
                      <div className="font-bold text-slate-900">Prof. Arjun</div>
                      <div className="text-[11px] font-mono text-slate-500">+91 94440 14005</div>
                      <button
                        onClick={() =>
                          openHostelStaffPage({
                            id: 'hw-veda-ass',
                            name: 'Prof. Arjun',
                            designation: 'Assistant Warden (VEDA Block)',
                            roleTag: 'Assistant Warden - VEDA 1st Year Boys Block',
                            cabin: 'VEDA Warden Office Room 102',
                            phone: '+91 94440 14005',
                            email: 'arjun.veda@campus.edu',
                          })
                        }
                        className="mt-2 text-teal-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <span>Individual Page</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Energy & Carbon Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-500 block">Daily Electricity</span>
                      <strong className="text-slate-800 text-sm">172 kWh</strong>
                      <span className="text-[10px] text-slate-400 block">5,160 kWh/mo</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                      <span className="text-[10px] text-rose-800 block">Daily Carbon</span>
                      <strong className="text-rose-700 text-sm font-mono">141.04 kg</strong>
                      <span className="text-[10px] text-rose-600 block">Net: 103.04 kg</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                      <span className="text-[10px] text-emerald-800 block">Solar Geyser</span>
                      <strong className="text-emerald-700 text-sm font-mono">-38.0 kg</strong>
                      <span className="text-[10px] text-emerald-600 block">Offset Daily</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MESS BOYS SECTION */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black text-base flex items-center justify-center shadow-xs">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase text-amber-700">MESS BOYS</div>
                      <h4 className="text-base font-bold text-slate-900">Mr. Shativel</h4>
                      <div className="text-xs text-slate-500">
                        Mess Incharge & Catering Supervisor (Boys Dining) · Phone: +91 94440 14006
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      openHostelStaffPage({
                        id: 'hw-shativel-mess',
                        name: 'Mr. Shativel',
                        designation: 'Mess Incharge (Boys Dining)',
                        roleTag: 'Boys Hostel Central Mess Supervisor',
                        cabin: 'Boys Dining Central Office M-01',
                        phone: '+91 94440 14006',
                        email: 'shativel.mess@campus.edu',
                      })
                    }
                    className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Open Mess Supervisor Individual Page</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Dining Capacity</span>
                    <strong className="text-slate-900 text-sm">1,100 Students</strong>
                    <span className="text-[10px] text-slate-500 block">3,300 Meals Served / Day</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Eco Boiler System</span>
                    <strong className="text-slate-900 text-sm">Briquette + Solar Steam</strong>
                    <span className="text-[10px] text-slate-500 block">65 LPG Cylinders Monthly</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase">Organic Waste</span>
                    <strong className="text-emerald-700 text-sm font-mono">100% Diverted</strong>
                    <span className="text-[10px] text-emerald-600 block">Campus Biogas Plant Input</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase">Food Waste Telemetry</span>
                    <strong className="text-amber-700 text-sm font-mono">0.08 kg / student</strong>
                    <span className="text-[10px] text-amber-600 block">Gold Grade Energy Rating</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOSTEL TAB 2: GIRLS HOSTEL */}
          {hostelTab === 'girls' && (
            <div className="space-y-6">
              {/* Girls Hostel Leadership */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-pink-500" />
                    <h3 className="text-base font-bold text-slate-900">Girls Hostel Residence Administration</h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-pink-50 text-pink-700 border border-pink-200">
                    680 Residing Students
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Warden: Prof. Rani */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                          GIRLS HOSTEL WARDEN
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Women Residence</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">Prof. Rani</h4>
                      <div className="text-xs text-slate-600 font-medium">Chief Resident Warden (Girls Hostel)</div>
                      <div className="text-xs text-slate-500 mt-1">M.E., Assistant Professor</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">
                        Cabin: Girls Residence Main Complex Room G-01 · Phone: +91 94440 14007
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        openHostelStaffPage({
                          id: 'hw-rani',
                          name: 'Prof. Rani',
                          designation: 'Warden (Girls Hostel)',
                          roleTag: 'Girls Hostel Chief Resident Warden',
                          qualification: 'M.E., Assistant Professor',
                          cabin: 'Girls Residence Main Complex Room G-01',
                          phone: '+91 94440 14007',
                          email: 'rani.hostel@campus.edu',
                          systemDailyKWh: 1.15,
                          electricityDailyKWh: 3.1,
                        })
                      }
                      className="mt-4 py-2 px-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Warden Individual Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ass. Warden: Prof. Bhumika */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          ASS. WARDEN (GIRLS HOSTEL)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">ECE Staff</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">Prof. Bhumika</h4>
                      <div className="text-xs text-slate-600 font-medium">Assistant Warden (Girls Residence) & ECE Faculty</div>
                      <div className="text-xs text-slate-500 mt-1">M.E. (Communication Systems)</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">
                        Cabin: Girls Residence Wing B Office Room G-02 · Phone: +91 94440 14008
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        openHostelStaffPage({
                          id: 'hw-bhumika',
                          name: 'Prof. Bhumika',
                          designation: 'Assistant Warden (Girls Hostel)',
                          roleTag: 'Assistant Warden (Girls Hostel) & ECE Faculty',
                          qualification: 'M.E. (Communication Systems)',
                          cabin: 'Girls Residence Wing B Office Room G-02',
                          phone: '+91 94440 14008',
                          email: 'bhumika.hostel@campus.edu',
                          department: 'ECE',
                          systemDailyKWh: 1.05,
                          electricityDailyKWh: 2.8,
                        })
                      }
                      className="mt-4 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Assistant Warden Individual Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* GIRLS MESS SECTION */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-700 text-white font-black text-base flex items-center justify-center shadow-xs">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase text-pink-700">MESS (GIRLS HOSTEL)</div>
                      <h4 className="text-base font-bold text-slate-900">Ms. Aathvika</h4>
                      <div className="text-xs text-slate-500">
                        Mess Incharge & Nutrition Lead (Girls Residence Dining) · Phone: +91 94440 14010
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      openHostelStaffPage({
                        id: 'hw-aathvika-mess',
                        name: 'Ms. Aathvika',
                        designation: 'Mess Incharge (Girls Dining)',
                        roleTag: 'Girls Hostel Central Mess Supervisor',
                        cabin: 'Girls Dining Main Pavilion Office M-02',
                        phone: '+91 94440 14010',
                        email: 'aathvika.mess@campus.edu',
                      })
                    }
                    className="py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Open Mess Incharge Individual Page</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Dining Capacity</span>
                    <strong className="text-slate-900 text-sm">750 Students</strong>
                    <span className="text-[10px] text-slate-500 block">2,250 Meals Served / Day</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Daily Electricity</span>
                    <strong className="text-slate-900 text-sm">195 kWh</strong>
                    <span className="text-[10px] text-slate-500 block">5,850 kWh Monthly</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                    <span className="text-[10px] text-rose-800 font-bold block uppercase">Daily Carbon</span>
                    <strong className="text-rose-700 text-sm font-mono">159.9 kg CO2e</strong>
                    <span className="text-[10px] text-rose-600 block">Net: 114.9 kg Daily</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase">Solar Thermal Offset</span>
                    <strong className="text-emerald-700 text-sm font-mono">-45.0 kg</strong>
                    <span className="text-[10px] text-emerald-600 block">Solar Water Heating</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. INDIVIDUAL DEPARTMENT VIEW: EXECUTIVE LEADERSHIP & GYM */}
      {/* ========================================================================= */}
      {currentView === 'executive' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setCurrentView('departments_grid')}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                title="Back to All Divisions"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex items-center justify-center shadow-sm shrink-0">
                <Crown className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-700 font-mono uppercase">
                  Institutional Governance
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Executive Leadership & Campus Pavilion</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Principal Secretariat, Admissions Directorate, and High-Performance Sports Gymnasium
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
                Executive Administration
              </span>
            </div>
          </div>

          {/* 1. PRINCIPAL CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-800 to-indigo-900 text-white font-black text-xl flex items-center justify-center shadow-xs">
                  PR
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    HEAD OF INSTITUTION
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.principal.name}</h3>
                  <div className="text-xs text-slate-600 font-semibold">{CAMPUS_EXECUTIVE_DATA.principal.designation} · {CAMPUS_EXECUTIVE_DATA.principal.fullTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {CAMPUS_EXECUTIVE_DATA.principal.cabin} · Phone: {CAMPUS_EXECUTIVE_DATA.principal.phone}
                  </div>
                </div>
              </div>

              <button
                onClick={() => openExecutivePersonPage('principal')}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Open Principal Individual Page</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Workstation Compute</span>
                <div className="font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.principal.cabinSpecs.systemDailyKWh} kWh/day</div>
                <div className="text-[10px] font-mono text-slate-500">Core i9 64GB Desktop</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Cabin Daily Power</span>
                <div className="font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.principal.cabinSpecs.totalDailyKWh} kWh/day</div>
                <div className="text-[10px] font-mono text-slate-500">AC, Lighting & Computing</div>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="text-[10px] text-rose-800 font-bold uppercase block">Daily Carbon Footprint</span>
                <div className="font-bold text-rose-700 font-mono mt-1">{CAMPUS_EXECUTIVE_DATA.principal.cabinSpecs.totalDailyCarbonKgCO2e} kg CO2e</div>
                <div className="text-[10px] text-rose-600 font-mono">Net: {CAMPUS_EXECUTIVE_DATA.principal.cabinSpecs.netDailyCarbonKgCO2e} kg</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Solar PV Offset</span>
                <div className="font-bold text-emerald-700 font-mono mt-1">-{CAMPUS_EXECUTIVE_DATA.principal.cabinSpecs.solarOffsetDailyKgCO2e} kg CO2e</div>
                <div className="text-[10px] text-emerald-600 font-mono">Secretariat Rooftop PV</div>
              </div>
            </div>
          </div>

          {/* 2. DEAN ADMISSION CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-900 text-white font-black text-xl flex items-center justify-center shadow-xs">
                  DA
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    DIRECTORATE OF ADMISSIONS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.deanAdmission.name}</h3>
                  <div className="text-xs text-slate-600 font-semibold">{CAMPUS_EXECUTIVE_DATA.deanAdmission.designation} · {CAMPUS_EXECUTIVE_DATA.deanAdmission.fullTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {CAMPUS_EXECUTIVE_DATA.deanAdmission.cabin} · Phone: {CAMPUS_EXECUTIVE_DATA.deanAdmission.phone}
                  </div>
                </div>
              </div>

              <button
                onClick={() => openExecutivePersonPage('deanAdmission')}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Open Dean-Admission Individual Page</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Admissions Workstation</span>
                <div className="font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.deanAdmission.cabinSpecs.systemDailyKWh} kWh/day</div>
                <div className="text-[10px] font-mono text-slate-500">HP EliteDesk 800 G8</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Cabin Power</span>
                <div className="font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.deanAdmission.cabinSpecs.totalDailyKWh} kWh/day</div>
                <div className="text-[10px] font-mono text-slate-500">Lighting & AC Units</div>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="text-[10px] text-rose-800 font-bold uppercase block">Daily Carbon Generation</span>
                <div className="font-bold text-rose-700 font-mono mt-1">{CAMPUS_EXECUTIVE_DATA.deanAdmission.cabinSpecs.totalDailyCarbonKgCO2e} kg CO2e</div>
                <div className="text-[10px] font-mono text-rose-600">Net: {CAMPUS_EXECUTIVE_DATA.deanAdmission.cabinSpecs.netDailyCarbonKgCO2e} kg</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Solar PV Offset</span>
                <div className="font-bold text-emerald-700 font-mono mt-1">-{CAMPUS_EXECUTIVE_DATA.deanAdmission.cabinSpecs.solarOffsetDailyKgCO2e} kg CO2e</div>
                <div className="text-[10px] text-emerald-600 font-mono">Green Energy Share</div>
              </div>
            </div>
          </div>

          {/* 3. GYM INCHARGE & FITNESS ARENA */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black text-xl flex items-center justify-center shadow-xs">
                  <Dumbbell className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CAMPUS PHYSICAL EDUCATION & FITNESS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.gym.incharge}</h3>
                  <div className="text-xs text-slate-600 font-semibold">{CAMPUS_EXECUTIVE_DATA.gym.designation} · {CAMPUS_EXECUTIVE_DATA.gym.fullTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {CAMPUS_EXECUTIVE_DATA.gym.facility.name} · Phone: {CAMPUS_EXECUTIVE_DATA.gym.phone}
                  </div>
                </div>
              </div>

              <button
                onClick={() => openExecutivePersonPage('gym')}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Open Gym Incharge Individual Page</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Gym Equipment & Arena Stats */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-emerald-600" />
                <span>High-Performance Equipment Roster & Active Users</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs pt-1">
                {CAMPUS_EXECUTIVE_DATA.gym.facility.equipmentRoster.map((eq, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{eq}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Student Users</span>
                <div className="font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.gym.facility.activeStudentUsersDaily} Students/Day</div>
                <div className="text-[10px] font-mono text-slate-500">Floor Area: 6,500 sq ft</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Motor & Cardio Power</span>
                <div className="font-bold text-slate-900 mt-1">{CAMPUS_EXECUTIVE_DATA.gym.facility.electricity.cardioMachinesMotorPowerKWh} kWh/day</div>
                <div className="text-[10px] font-mono text-slate-500">Total: 22.7 kWh/day</div>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="text-[10px] text-rose-800 font-bold uppercase block">Facility Carbon Draw</span>
                <div className="font-bold text-rose-700 font-mono mt-1">{CAMPUS_EXECUTIVE_DATA.gym.facility.carbon.dailyKgCO2e} kg CO2e</div>
                <div className="text-[10px] font-mono text-rose-600">Net: {CAMPUS_EXECUTIVE_DATA.gym.facility.carbon.netDailyCarbonKgCO2e} kg</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Solar PV Offset</span>
                <div className="font-bold text-emerald-700 font-mono mt-1">-{CAMPUS_EXECUTIVE_DATA.gym.facility.carbon.rooftopSolarOffsetKgCO2e} kg CO2e</div>
                <div className="text-[10px] font-mono text-emerald-600">Pavilion Rooftop PV</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
