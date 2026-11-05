import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmissions } from '../context/EmissionContext';
import { CampusDepartment } from '../types';
import { formatKgCO2e, formatTonsCO2e } from '../utils/calculations';
import {
  Building2,
  Zap,
  Flame,
  Sun,
  Users,
  FileSpreadsheet,
  Search,
  Download,
  CheckCircle2,
  ArrowRight,
  Award,
  Layers,
  Cpu,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Activity,
  MapPin,
} from 'lucide-react';

// ============================================================================
// 1. PRINCIPAL DATA: WHOLE COLLEGE DEPARTMENT-WISE CARBON & ELECTRICITY
// ============================================================================
interface WholeCollegeDeptSummary {
  dept: CampusDepartment;
  fullName: string;
  hodName: string;
  hodEmail: string;
  blockLocation: string;
  headcount: number;
  staffKwh: number;
  classesKwh: number;
  labsKwh: number;
  totalKwh: number;
  monthlyEbBillInr: number;
  scope1Tons: number;
  scope2Tons: number;
  scope3Tons: number;
  grossTons: number;
  solarOffsetTons: number;
  netTons: number;
  status: 'Optimal' | 'Moderate' | 'High Load';
}

export const WHOLE_COLLEGE_DEPT_CARBON_DATA: WholeCollegeDeptSummary[] = [
  {
    dept: 'CSE',
    fullName: 'Computer Science & Engineering (CSE)',
    hodName: 'Dr. S. Karthikeyan',
    hodEmail: 'hod-cse@mkce.ac.in',
    blockLocation: 'Tech Park & Computer Block',
    headcount: 840,
    staffKwh: 2150,
    classesKwh: 4320,
    labsKwh: 11980,
    totalKwh: 18450,
    monthlyEbBillInr: 156825,
    scope1Tons: 0.42,
    scope2Tons: 15.13,
    scope3Tons: 1.85,
    grossTons: 17.4,
    solarOffsetTons: 4.2,
    netTons: 13.2,
    status: 'High Load',
  },
  {
    dept: 'ECE',
    fullName: 'Electronics & Communication Engineering (ECE)',
    hodName: 'Dr. M. Rajaram',
    hodEmail: 'hod-ece@mkce.ac.in',
    blockLocation: 'Electronics Block - Floors 1 & 2',
    headcount: 680,
    staffKwh: 1680,
    classesKwh: 3450,
    labsKwh: 7470,
    totalKwh: 12600,
    monthlyEbBillInr: 107100,
    scope1Tons: 0.28,
    scope2Tons: 10.33,
    scope3Tons: 1.32,
    grossTons: 11.93,
    solarOffsetTons: 3.1,
    netTons: 8.83,
    status: 'Moderate',
  },
  {
    dept: 'EEE',
    fullName: 'Electrical & Electronics Engineering (EEE)',
    hodName: 'Dr. R. Prakash',
    hodEmail: 'hod-eee@mkce.ac.in',
    blockLocation: 'Power Systems & Electrical Block',
    headcount: 510,
    staffKwh: 1420,
    classesKwh: 2680,
    labsKwh: 6850,
    totalKwh: 10950,
    monthlyEbBillInr: 93075,
    scope1Tons: 0.35,
    scope2Tons: 8.98,
    scope3Tons: 0.98,
    grossTons: 10.31,
    solarOffsetTons: 5.6,
    netTons: 4.71,
    status: 'Optimal',
  },
  {
    dept: 'IT',
    fullName: 'Information Technology (IT)',
    hodName: 'Dr. P. Venkatesh',
    hodEmail: 'hod-it@mkce.ac.in',
    blockLocation: 'IT & Innovation Wing - 2nd Floor',
    headcount: 590,
    staffKwh: 1590,
    classesKwh: 3120,
    labsKwh: 8690,
    totalKwh: 13400,
    monthlyEbBillInr: 113900,
    scope1Tons: 0.22,
    scope2Tons: 10.99,
    scope3Tons: 1.24,
    grossTons: 12.45,
    solarOffsetTons: 2.9,
    netTons: 9.55,
    status: 'Moderate',
  },
  {
    dept: 'AIDS',
    fullName: 'Artificial Intelligence & Data Science (AIDS)',
    hodName: 'Dr. K. Sathishkumar',
    hodEmail: 'hod-aids@mkce.ac.in',
    blockLocation: 'AI Research Complex - 3rd Floor',
    headcount: 520,
    staffKwh: 1480,
    classesKwh: 2890,
    labsKwh: 9230,
    totalKwh: 13600,
    monthlyEbBillInr: 115600,
    scope1Tons: 0.19,
    scope2Tons: 11.15,
    scope3Tons: 1.15,
    grossTons: 12.49,
    solarOffsetTons: 2.8,
    netTons: 9.69,
    status: 'Moderate',
  },
  {
    dept: 'AIML',
    fullName: 'Artificial Intelligence & Machine Learning (AIML)',
    hodName: 'Dr. V. Deepa',
    hodEmail: 'hod-aiml@mkce.ac.in',
    blockLocation: 'AI Research Complex - 4th Floor',
    headcount: 460,
    staffKwh: 1320,
    classesKwh: 2540,
    labsKwh: 8140,
    totalKwh: 12000,
    monthlyEbBillInr: 102000,
    scope1Tons: 0.18,
    scope2Tons: 9.84,
    scope3Tons: 1.02,
    grossTons: 11.04,
    solarOffsetTons: 2.5,
    netTons: 8.54,
    status: 'Optimal',
  },
  {
    dept: 'MECH',
    fullName: 'Mechanical Engineering (MECH)',
    hodName: 'Dr. T. Senthilvelan',
    hodEmail: 'hod-mech@mkce.ac.in',
    blockLocation: 'Mechanical Workshop & Thermal Complex',
    headcount: 540,
    staffKwh: 1510,
    classesKwh: 2780,
    labsKwh: 9810,
    totalKwh: 14100,
    monthlyEbBillInr: 119850,
    scope1Tons: 2.45,
    scope2Tons: 11.56,
    scope3Tons: 1.48,
    grossTons: 15.49,
    solarOffsetTons: 3.4,
    netTons: 12.09,
    status: 'High Load',
  },
  {
    dept: 'CIVIL',
    fullName: 'Civil Engineering (CIVIL)',
    hodName: 'Prof. Geetha Raman',
    hodEmail: 'hod-civil@mkce.ac.in',
    blockLocation: 'Civil & Structural Engineering Block',
    headcount: 420,
    staffKwh: 1180,
    classesKwh: 2150,
    labsKwh: 4920,
    totalKwh: 8250,
    monthlyEbBillInr: 70125,
    scope1Tons: 0.31,
    scope2Tons: 6.77,
    scope3Tons: 0.89,
    grossTons: 7.97,
    solarOffsetTons: 2.4,
    netTons: 5.57,
    status: 'Optimal',
  },
  {
    dept: 'Freshman Engineering (1st Year)',
    fullName: 'Freshman Engineering (S&H - 1st Year Common)',
    hodName: 'Dr. N. Jayakumar',
    hodEmail: 'hod-fe@mkce.ac.in',
    blockLocation: 'First Year Science & Humanities Block',
    headcount: 960,
    staffKwh: 2240,
    classesKwh: 5480,
    labsKwh: 4680,
    totalKwh: 12400,
    monthlyEbBillInr: 105400,
    scope1Tons: 0.64,
    scope2Tons: 10.17,
    scope3Tons: 1.65,
    grossTons: 12.46,
    solarOffsetTons: 3.2,
    netTons: 9.26,
    status: 'Optimal',
  },
  {
    dept: 'Administration & Management',
    fullName: 'College Administration, Principal, Manager & Dean Offices',
    hodName: 'Vikram (Manager) & Dr. Logavel (Dean)',
    hodEmail: 'manager@mkce.ac.in',
    blockLocation: 'Main Administrative Heritage Block',
    headcount: 185,
    staffKwh: 6840,
    classesKwh: 1920,
    labsKwh: 5490,
    totalKwh: 14250,
    monthlyEbBillInr: 121125,
    scope1Tons: 0.95,
    scope2Tons: 11.69,
    scope3Tons: 1.12,
    grossTons: 13.76,
    solarOffsetTons: 3.8,
    netTons: 9.96,
    status: 'Moderate',
  },
  {
    dept: 'Hostels & Residential Blocks',
    fullName: 'Boys & Girls Hostels, Mess & Residential Quarters',
    hodName: 'Chief Warden Office',
    hodEmail: 'warden@mkce.ac.in',
    blockLocation: 'North & South Residential Enclave',
    headcount: 1850,
    staffKwh: 1950,
    classesKwh: 14200,
    labsKwh: 6450,
    totalKwh: 22600,
    monthlyEbBillInr: 192100,
    scope1Tons: 4.85,
    scope2Tons: 18.53,
    scope3Tons: 3.42,
    grossTons: 26.8,
    solarOffsetTons: 6.4,
    netTons: 20.4,
    status: 'High Load',
  },
  {
    dept: 'Transport & Fleet Facilities',
    fullName: 'Campus Bus Fleet (42 Buses) & Institutional EV Logistics',
    hodName: 'Transport Officer',
    hodEmail: 'transport@mkce.ac.in',
    blockLocation: 'Central Transport Yard & Fuel Bay',
    headcount: 110,
    staffKwh: 680,
    classesKwh: 420,
    labsKwh: 1850,
    totalKwh: 2950,
    monthlyEbBillInr: 25075,
    scope1Tons: 14.2,
    scope2Tons: 2.42,
    scope3Tons: 2.15,
    grossTons: 18.77,
    solarOffsetTons: 1.2,
    netTons: 17.57,
    status: 'High Load',
  },
];

// ============================================================================
// 2. MANAGER DATA: ALL COLLEGE OFFICE ELECTRICAL RECORDS
// ============================================================================
export interface CollegeOfficeElectricalRecord {
  id: string;
  officeName: string;
  inchargePerson: string;
  buildingFloor: string;
  subMeterSerial: string;
  connectedLoadKw: number;
  acUnitsDetail: string;
  computersAndServers: string;
  lightingAndUpsDetail: string;
  monthlyKwh: number;
  monthlyEbAmountInr: number;
  carbonEmissionKg: number;
  powerFactor: number;
  auditStatus: 'Verified' | 'Optimal' | 'Peak Alert';
}

export const ALL_COLLEGE_OFFICE_ELECTRICAL_RECORDS: CollegeOfficeElectricalRecord[] = [
  {
    id: 'OFF-EL-01',
    officeName: 'Principal Executive Office & Secretariat',
    inchargePerson: 'Dr. Balamurugan (Principal)',
    buildingFloor: 'Main Admin Block · 1st Floor (Room A-101)',
    subMeterSerial: 'MTR-ADM-PRIN-001',
    connectedLoadKw: 12.5,
    acUnitsDetail: '3 × 2.0 Ton Inverter Split ACs',
    computersAndServers: '6 All-in-One Desktops, 1 Smart Interactive Wall, 2 Laser Printers',
    lightingAndUpsDetail: '28 LED Panel Lights (18W), 5 kVA Online UPS',
    monthlyKwh: 1480,
    monthlyEbAmountInr: 12580,
    carbonEmissionKg: 1213.6,
    powerFactor: 0.98,
    auditStatus: 'Optimal',
  },
  {
    id: 'OFF-EL-02',
    officeName: 'College Manager & Estate Management Office',
    inchargePerson: 'Mr. Vikram (Manager)',
    buildingFloor: 'Main Admin Block · Ground Floor (Room A-004)',
    subMeterSerial: 'MTR-ADM-MGR-002',
    connectedLoadKw: 9.8,
    acUnitsDetail: '2 × 1.5 Ton 5-Star Inverter ACs',
    computersAndServers: '8 BMS Workstations, CCTV & Smart Grid Telemetry Wall, 2 Plotters',
    lightingAndUpsDetail: '22 LED Downlights, 3 kVA Sinewave UPS',
    monthlyKwh: 1190,
    monthlyEbAmountInr: 10115,
    carbonEmissionKg: 975.8,
    powerFactor: 0.99,
    auditStatus: 'Optimal',
  },
  {
    id: 'OFF-EL-03',
    officeName: 'Dean Office (Academic & Corporate Outreach)',
    inchargePerson: 'Dr. Logavel (Dean)',
    buildingFloor: 'Academic Complex · 2nd Floor (Room AC-204)',
    subMeterSerial: 'MTR-ADM-DEAN-003',
    connectedLoadKw: 11.2,
    acUnitsDetail: '2 × 2.0 Ton Cassette ACs + 1 × 1.5 Ton Split AC',
    computersAndServers: '7 Desktops, Video Conferencing System, 2 High-Speed Copiers',
    lightingAndUpsDetail: '26 LED Recessed Lights, 5 kVA Modular UPS',
    monthlyKwh: 1360,
    monthlyEbAmountInr: 11560,
    carbonEmissionKg: 1115.2,
    powerFactor: 0.97,
    auditStatus: 'Verified',
  },
  {
    id: 'OFF-EL-04',
    officeName: 'Central Admission Office & Counseling Complex',
    inchargePerson: 'Dr. Logavel (Dean) & Admission Officer',
    buildingFloor: 'Main Administrative Reception Wing · Ground Floor (Rooms A-010 to A-014)',
    subMeterSerial: 'MTR-ADM-ADMS-004',
    connectedLoadKw: 18.6,
    acUnitsDetail: '4 × 2.0 Ton Cassette ACs (Counseling Hall & Lounge)',
    computersAndServers: '16 Admission Counter PCs, 4 Document Scanners, 3 Digital Signage Totems',
    lightingAndUpsDetail: '44 LED Tube/Panel Lights, 10 kVA Central UPS',
    monthlyKwh: 2280,
    monthlyEbAmountInr: 19380,
    carbonEmissionKg: 1869.6,
    powerFactor: 0.96,
    auditStatus: 'Peak Alert',
  },
  {
    id: 'OFF-EL-05',
    officeName: 'Controller of Examinations (COE) Confidential Office',
    inchargePerson: 'Dr. K. Murugesan (COE)',
    buildingFloor: 'Autonomous Exam Wing · 1st Floor (Room EX-102)',
    subMeterSerial: 'MTR-ADM-COE-005',
    connectedLoadKw: 16.4,
    acUnitsDetail: '3 × 2.0 Ton Precision Split ACs',
    computersAndServers: '14 Valuation Terminals, 2 Secure Blade Servers, 4 Heavy Duty Printers',
    lightingAndUpsDetail: '34 LED Luminaires, 15 kVA Redundant Dual UPS',
    monthlyKwh: 1940,
    monthlyEbAmountInr: 16490,
    carbonEmissionKg: 1590.8,
    powerFactor: 0.98,
    auditStatus: 'Verified',
  },
  {
    id: 'OFF-EL-06',
    officeName: 'Accounts, Finance & Fee Collection Office',
    inchargePerson: 'Chief Finance Officer',
    buildingFloor: 'Main Admin Block · East Wing Ground Floor (Room A-008)',
    subMeterSerial: 'MTR-ADM-FIN-006',
    connectedLoadKw: 10.5,
    acUnitsDetail: '2 × 2.0 Ton Split ACs',
    computersAndServers: '12 Accounting & Tally ERP Terminals, 5 Thermal Receipt/Passbook Printers',
    lightingAndUpsDetail: '28 LED Lights, 6 Air Circulator Fans, 5 kVA UPS',
    monthlyKwh: 1290,
    monthlyEbAmountInr: 10965,
    carbonEmissionKg: 1057.8,
    powerFactor: 0.97,
    auditStatus: 'Optimal',
  },
  {
    id: 'OFF-EL-07',
    officeName: 'Training, Placement & Corporate Relations Office',
    inchargePerson: 'Placement Officer & Industry Team',
    buildingFloor: 'Placement & Career Block · 1st Floor (Room PL-101)',
    subMeterSerial: 'MTR-ADM-PLC-007',
    connectedLoadKw: 15.0,
    acUnitsDetail: '3 × 1.5 Ton Split ACs (GD Rooms & Interview Cabins) + 1 × 2.0 Ton AC',
    computersAndServers: '10 Workstations, 2 Smart Interview Displays, PA Audio System',
    lightingAndUpsDetail: '32 LED Lights, 7.5 kVA Online UPS',
    monthlyKwh: 1680,
    monthlyEbAmountInr: 14280,
    carbonEmissionKg: 1377.6,
    powerFactor: 0.97,
    auditStatus: 'Verified',
  },
  {
    id: 'OFF-EL-08',
    officeName: 'Central ERP, Server Room & Network Control Office',
    inchargePerson: 'System & Network Administrator',
    buildingFloor: 'Admin IT Hub · Ground Floor (Room A-019)',
    subMeterSerial: 'MTR-ADM-SRV-008',
    connectedLoadKw: 22.0,
    acUnitsDetail: '3 × 2.5 Ton 24×7 Precision Cooling Units',
    computersAndServers: '6 Rack Servers, Core Fiber Switches, Firewall Cluster, 4 Admin Consoles',
    lightingAndUpsDetail: '16 LED Batten Lights, 20 kVA 24×7 Online UPS Bank',
    monthlyKwh: 2980,
    monthlyEbAmountInr: 25330,
    carbonEmissionKg: 2443.6,
    powerFactor: 0.99,
    auditStatus: 'Peak Alert',
  },
  {
    id: 'OFF-EL-09',
    officeName: 'IQAC, NAAC & Autonomous Governance Office',
    inchargePerson: 'IQAC Coordinator',
    buildingFloor: 'Main Admin Block · 2nd Floor (Room A-205)',
    subMeterSerial: 'MTR-ADM-IQAC-009',
    connectedLoadKw: 7.4,
    acUnitsDetail: '2 × 1.5 Ton Inverter Split ACs',
    computersAndServers: '6 Desktops, 1 High-Volume Document Scanner/Archiver',
    lightingAndUpsDetail: '18 LED Panel Lights, 3 kVA UPS',
    monthlyKwh: 820,
    monthlyEbAmountInr: 6970,
    carbonEmissionKg: 672.4,
    powerFactor: 0.98,
    auditStatus: 'Optimal',
  },
  {
    id: 'OFF-EL-10',
    officeName: 'Main Boardroom, VIP Lounge & Reception',
    inchargePerson: 'Mr. Vikram (Manager)',
    buildingFloor: 'Main Admin Block · Central Atrium & Room A-105',
    subMeterSerial: 'MTR-ADM-BRD-010',
    connectedLoadKw: 14.2,
    acUnitsDetail: '3 × 2.0 Ton Cassette ACs',
    computersAndServers: '4K LED Video Wall, 18-Mic Digital Conference Array, 2 Kiosks',
    lightingAndUpsDetail: '40 Architectural LED Lights, 5 kVA UPS',
    monthlyKwh: 1120,
    monthlyEbAmountInr: 9520,
    carbonEmissionKg: 918.4,
    powerFactor: 0.98,
    auditStatus: 'Optimal',
  },
];

// ============================================================================
// 3. DEAN (DR. LOGAVEL) DATA: DEAN OFFICE & ADMISSION OFFICE DETAILS
// ============================================================================
export interface DeanAdmissionSubUnit {
  id: string;
  wing: 'Dean Office' | 'Admission Office';
  roomCode: string;
  unitName: string;
  incharge: string;
  subMeterId: string;
  acConfiguration: string;
  itAndOfficeSystems: string;
  lightingAndFans: string;
  avgDailyHours: number;
  monthlyKwh: number;
  monthlyEbCostInr: number;
  monthlyCarbonKg: number;
  occupancyPerDay: string;
  remarks: string;
}

export const DEAN_AND_ADMISSION_OFFICE_DETAILS: DeanAdmissionSubUnit[] = [
  // DEAN OFFICE UNITS
  {
    id: 'DN-01',
    wing: 'Dean Office',
    roomCode: 'AC-204A',
    unitName: 'Dean Executive Chamber (Dr. Logavel)',
    incharge: 'Dr. Logavel (Dean)',
    subMeterId: 'MTR-DEAN-204A',
    acConfiguration: '1 × 2.0 Ton Daikin 5-Star Inverter Split AC',
    itAndOfficeSystems: '2 Executive Workstations, 55" Smart Telemetry Display, 1 Laser Printer',
    lightingAndFans: '8 × 18W Recessed LED Panels, 2 BLDC Ceiling Fans',
    avgDailyHours: 9.0,
    monthlyKwh: 420,
    monthlyEbCostInr: 3570,
    monthlyCarbonKg: 344.4,
    occupancyPerDay: '1 Executive + 15–25 Visitors/Faculty',
    remarks: 'Smart occupancy thermostat set at 24°C; solar-assisted UPS feeder.',
  },
  {
    id: 'DN-02',
    wing: 'Dean Office',
    roomCode: 'AC-204B',
    unitName: 'Dean Secretariat & Academic Governance Desk',
    incharge: 'Executive Secretary to Dean',
    subMeterId: 'MTR-DEAN-204B',
    acConfiguration: '1 × 1.5 Ton Inverter Split AC',
    itAndOfficeSystems: '3 Desktop PCs, 1 Network Photocopier/Scanner, VoIP EPABX Console',
    lightingAndFans: '10 × 18W LED Lights, 3 BLDC Fans, 3 kVA UPS',
    avgDailyHours: 9.5,
    monthlyKwh: 380,
    monthlyEbCostInr: 3230,
    monthlyCarbonKg: 311.6,
    occupancyPerDay: '4 Secretariat Staff',
    remarks: 'Paperless digital circular workflow active; 38% paper carbon reduction.',
  },
  {
    id: 'DN-03',
    wing: 'Dean Office',
    roomCode: 'AC-205',
    unitName: 'Corporate Outreach & Industry MoU Suite',
    incharge: 'Dr. Logavel & Corporate Relations Coordinator',
    subMeterId: 'MTR-DEAN-205',
    acConfiguration: '1 × 2.0 Ton Cassette AC',
    itAndOfficeSystems: '2 Laptops, 75" Interactive Video Conferencing Board, Conference Audio',
    lightingAndFans: '8 × 18W Warm LED Downlights, 2 Wall Fans',
    avgDailyHours: 6.5,
    monthlyKwh: 310,
    monthlyEbCostInr: 2635,
    monthlyCarbonKg: 254.2,
    occupancyPerDay: '12–20 Corporate Guests / HODs',
    remarks: 'Used for industry MoU signings, corporate advisory board & accreditation reviews.',
  },
  {
    id: 'DN-04',
    wing: 'Dean Office',
    roomCode: 'AC-206',
    unitName: 'Dean Records & Curriculum Audit Cell',
    incharge: 'Academic Audit Assistant',
    subMeterId: 'MTR-DEAN-206',
    acConfiguration: '1 × 1.0 Ton Split AC',
    itAndOfficeSystems: '2 Desktops, 1 High-Speed Document Scanner, NAS Backup Drive',
    lightingAndFans: '6 × 18W LED Tubes, 2 Ceiling Fans',
    avgDailyHours: 8.0,
    monthlyKwh: 250,
    monthlyEbCostInr: 2125,
    monthlyCarbonKg: 205.0,
    occupancyPerDay: '3 Staff Members',
    remarks: 'Connected to rooftop solar net-metered circuit.',
  },

  // ADMISSION OFFICE UNITS
  {
    id: 'ADM-01',
    wing: 'Admission Office',
    roomCode: 'A-010',
    unitName: 'Central Admission Cell & Enquiry Front Office',
    incharge: 'Dr. Logavel (Dean) & Chief Admission Officer',
    subMeterId: 'MTR-ADMS-010',
    acConfiguration: '2 × 2.0 Ton Ceiling Cassette ACs',
    itAndOfficeSystems: '6 Front-Desk CRM Computers, 2 Token Display Screens, 2 Printers',
    lightingAndFans: '16 × 18W LED Panels, 4 BLDC Fans, 5 kVA UPS',
    avgDailyHours: 10.0,
    monthlyKwh: 780,
    monthlyEbCostInr: 6630,
    monthlyCarbonKg: 639.6,
    occupancyPerDay: '8 Staff + 60–120 Applicants/Parents',
    remarks: 'High daytime footfall during TNEA & Management quota admission window.',
  },
  {
    id: 'ADM-02',
    wing: 'Admission Office',
    roomCode: 'A-011',
    unitName: 'Student & Parent Admission Counseling Hall',
    incharge: 'Dr. Logavel & Department Counseling Panel',
    subMeterId: 'MTR-ADMS-011',
    acConfiguration: '2 × 2.0 Ton Inverter Split ACs',
    itAndOfficeSystems: '4 Counseling Laptops, 2 LED Course Availability Projectors, PA System',
    lightingAndFans: '14 × 20W LED Battens, 6 Ceiling Fans',
    avgDailyHours: 8.5,
    monthlyKwh: 690,
    monthlyEbCostInr: 5865,
    monthlyCarbonKg: 565.8,
    occupancyPerDay: '50–100 Students & Parents',
    remarks: 'Zonal AC control enabled so second AC runs only when occupancy > 30.',
  },
  {
    id: 'ADM-03',
    wing: 'Admission Office',
    roomCode: 'A-012',
    unitName: 'Digital Application Processing & Certificate Verification Bay',
    incharge: 'Admission Data Verification Lead',
    subMeterId: 'MTR-ADMS-012',
    acConfiguration: '1 × 1.5 Ton Split AC',
    itAndOfficeSystems: '6 Verification Desktops, 4 High-Speed Duplex Scanners, Biometric/Photo Kit',
    lightingAndFans: '8 × 18W LED Lights, 3 Ceiling Fans, 5 kVA Online UPS',
    avgDailyHours: 9.0,
    monthlyKwh: 490,
    monthlyEbCostInr: 4165,
    monthlyCarbonKg: 401.8,
    occupancyPerDay: '6 Verification Officers',
    remarks: '100% digital certificate verification reduces photocopy waste.',
  },
  {
    id: 'ADM-04',
    wing: 'Admission Office',
    roomCode: 'A-014',
    unitName: 'Parent Waiting Lounge, Scholarship Helpdesk & Digital Totems',
    incharge: 'Admission Hospitality Coordinator',
    subMeterId: 'MTR-ADMS-014',
    acConfiguration: '1 × 1.5 Ton Split AC + HVLS Ventilation',
    itAndOfficeSystems: '2 Scholarship Helpdesk PCs, 2 Interactive Campus Tour Kiosks, RO Water Cooler',
    lightingAndFans: '10 × 15W LED Downlights, 4 BLDC Fans',
    avgDailyHours: 9.0,
    monthlyKwh: 320,
    monthlyEbCostInr: 2720,
    monthlyCarbonKg: 262.4,
    occupancyPerDay: '40–80 Visitors/Parents',
    remarks: 'Equipped with energy-star RO dispenser and auto-dimming LED corridors.',
  },
];

// ============================================================================
// 4. HOD DEPARTMENT DATA GENERATOR (1. STAFF, 2. CLASSES, 3. LABS)
// ============================================================================
export interface HodStaffRecord {
  id: string;
  cabinOrRoom: string;
  staffName: string;
  designation: string;
  subMeterId: string;
  appliances: string;
  monthlyKwh: number;
  monthlyEbInr: number;
  carbonKg: number;
}

export interface HodClassRecord {
  id: string;
  className: string;
  roomNumber: string;
  classAdvisor: string;
  studentCount: number;
  appliances: string;
  monthlyKwh: number;
  monthlyEbInr: number;
  carbonKg: number;
}

export interface HodLabRecord {
  id: string;
  labName: string;
  labCode: string;
  labIncharge: string;
  subMeterId: string;
  equipmentAndSystems: string;
  acAndUpsLoad: string;
  monthlyKwh: number;
  monthlyEbInr: number;
  carbonKg: number;
}

export function getHodDepartmentStructuredData(dept: CampusDepartment): {
  hodName: string;
  hodEmail: string;
  hodPass: string;
  blockName: string;
  staffRecords: HodStaffRecord[];
  classRecords: HodClassRecord[];
  labRecords: HodLabRecord[];
} {
  const code =
    dept === 'Freshman Engineering (1st Year)'
      ? 'FE'
      : dept.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 5) || 'CSE';
  const lowerCode = code.toLowerCase();

  const deptMetaMap: Record<
    string,
    {
      hodName: string;
      ahodName: string;
      blockName: string;
      advisors: string[];
      labs: { name: string; incharge: string; equip: string; acUps: string; kwh: number }[];
    }
  > = {
    CSE: {
      hodName: 'Dr. S. Karthikeyan',
      ahodName: 'Dr. R. Subramanian',
      blockName: 'Tech Park & Computer Block (Block-C)',
      advisors: [
        'Prof. Ananthi (IV-A)',
        'Prof. A. Selvanayagi (IV-B)',
        'Prof. K. Senthil (III-A)',
        'Prof. M. Divya (III-B)',
        'Prof. S. Vignesh (II-A)',
        'Prof. P. Kavitha (II-B)',
      ],
      labs: [
        {
          name: 'Full Stack & Cloud Computing Lab',
          incharge: 'Prof. K. Senthil',
          equip: '68 i7 Workstations, 2 Rack Servers, Smart Board',
          acUps: '4 × 2.0T Inverter ACs · 20 kVA Online UPS',
          kwh: 3420,
        },
        {
          name: 'Data Structures & Algorithms Programming Lab',
          incharge: 'Prof. M. Divya',
          equip: '65 Desktop Systems, 1 Linux Compilation Server',
          acUps: '3 × 2.0T Split ACs · 15 kVA UPS',
          kwh: 2980,
        },
        {
          name: 'Networks, Cyber Security & IoT Systems Lab',
          incharge: 'Prof. S. Vignesh',
          equip: '60 Systems, Cisco Router Rack, IoT Sensor Kits',
          acUps: '3 × 2.0T Split ACs · 15 kVA UPS',
          kwh: 2840,
        },
        {
          name: 'AI & Deep Learning GPU Cluster Lab',
          incharge: 'Dr. R. Subramanian',
          equip: '48 Workstation PCs + 4 NVIDIA GPU Nodes',
          acUps: '3 × 2.5T Precision ACs · 25 kVA UPS',
          kwh: 2740,
        },
      ],
    },
    ECE: {
      hodName: 'Dr. M. Rajaram',
      ahodName: 'Dr. S. Meenakshi',
      blockName: 'Electronics & Communication Block (Block-E)',
      advisors: [
        'Prof. R. Balaji (IV-A)',
        'Prof. S. Charulatha (IV-B)',
        'Prof. K. Gokulnath (III-A)',
        'Prof. P. Hemalatha (III-B)',
        'Prof. M. Vignesh (II-A)',
        'Prof. V. Abinaya (II-B)',
      ],
      labs: [
        {
          name: 'VLSI Design & Embedded Systems Lab',
          incharge: 'Dr. S. Meenakshi',
          equip: '45 Cadence/Xilinx Workstations, FPGA Kits',
          acUps: '3 × 2.0T Split ACs · 15 kVA UPS',
          kwh: 2350,
        },
        {
          name: 'Digital Signal Processing & Microprocessor Lab',
          incharge: 'Prof. R. Balaji',
          equip: '42 Systems, DSOs, DSP Trainer Boards',
          acUps: '2 × 2.0T Split ACs · 10 kVA UPS',
          kwh: 1890,
        },
        {
          name: 'RF, Microwave & Optical Communication Lab',
          incharge: 'Prof. K. Gokulnath',
          equip: 'Spectrum Analyzers, Klystron Benches, 25 PCs',
          acUps: '2 × 1.5T Split ACs · 10 kVA UPS',
          kwh: 1680,
        },
        {
          name: 'Linear Integrated Circuits & PCB Prototyping Lab',
          incharge: 'Prof. P. Hemalatha',
          equip: '35 Function Generators, CROs, PCB Milling Unit',
          acUps: '2 × 1.5T Split ACs · 7.5 kVA UPS',
          kwh: 1550,
        },
      ],
    },
    EEE: {
      hodName: 'Dr. R. Prakash',
      ahodName: 'Dr. Anand Verma',
      blockName: 'Power Systems & Electrical Block (Block-EE)',
      advisors: [
        'Dr. Anand Verma (IV-A)',
        'Prof. S. Karthik (III-A)',
        'Prof. L. Priya (III-B)',
        'Prof. N. Ramesh (II-A)',
        'Prof. K. Saranya (II-B)',
      ],
      labs: [
        {
          name: 'Electrical Machines & Drives Lab',
          incharge: 'Prof. N. Ramesh',
          equip: 'DC/AC Motor-Generator Sets, Loading Rheostats, VFD Panels',
          acUps: 'Industrial HVLS Fans + Control Room 1.5T AC',
          kwh: 2480,
        },
        {
          name: 'Power Systems Simulation & Smart Grid Lab',
          incharge: 'Dr. Anand Verma',
          equip: '45 MATLAB/ETAP PCs, Solar Inverter Telemetry Bench',
          acUps: '3 × 1.5T Inverter ACs · 15 kVA UPS',
          kwh: 1920,
        },
        {
          name: 'Power Electronics & Renewable Energy Lab',
          incharge: 'Prof. S. Karthik',
          equip: 'IGBT/MOSFET Converters, Solar PV Emulator, 25 PCs',
          acUps: '2 × 1.5T Split ACs · 10 kVA UPS',
          kwh: 1380,
        },
        {
          name: 'Control Systems & Measurements Lab',
          incharge: 'Prof. L. Priya',
          equip: 'PLC/SCADA Benches, Servo Trainer Kits, 20 PCs',
          acUps: '2 × 1.5T Split ACs · 7.5 kVA UPS',
          kwh: 1070,
        },
      ],
    },
    MECH: {
      hodName: 'Dr. T. Senthilvelan',
      ahodName: 'Dr. K. Rajendran',
      blockName: 'Mechanical & Thermal Engineering Complex (Block-M)',
      advisors: [
        'Prof. M. Suresh (IV-A)',
        'Prof. R. Dinesh (IV-B)',
        'Prof. A. Prakash (III-A)',
        'Prof. V. Manikandan (II-A)',
        'Prof. S.Arun (II-B)',
      ],
      labs: [
        {
          name: 'CAD/CAM, CAE & CNC Machining Center',
          incharge: 'Dr. K. Rajendran',
          equip: '55 SolidWorks/ANSYS Workstations, 2 CNC Lathe/Mill Centers',
          acUps: '3 × 2.0T Split ACs · 20 kVA Stabilizer & UPS',
          kwh: 3150,
        },
        {
          name: 'Thermal Engineering & IC Engines Lab',
          incharge: 'Prof. M. Suresh',
          equip: 'Multi-Cylinder Test Rigs, Dynamometers, Exhaust Gas Analyzer',
          acUps: 'Industrial Exhaust + Instrumentation 1.5T AC',
          kwh: 2680,
        },
        {
          name: 'Fluid Mechanics & Hydraulic Machinery Lab',
          incharge: 'Prof. R. Dinesh',
          equip: 'Pelton/Francis/Kaplan Turbine Rigs, High-Head Pumps',
          acUps: '3-Phase Pump Starters & Digital Flow Telemetry',
          kwh: 2180,
        },
        {
          name: 'Metrology, Robotics & Additive Manufacturing Lab',
          incharge: 'Prof. A. Prakash',
          equip: 'CMM, 6-Axis Industrial Robot Arm, 4 Industrial 3D Printers',
          acUps: '2 × 2.0T Precision ACs · 10 kVA UPS',
          kwh: 1800,
        },
      ],
    },
    CIVIL: {
      hodName: 'Prof. Geetha Raman',
      ahodName: 'Dr. S. Balamurali',
      blockName: 'Civil & Environmental Engineering Block (Block-CV)',
      advisors: [
        'Prof. K. Natarajan (IV-A)',
        'Prof. R. Sindhu (III-A)',
        'Prof. M. Mohan (II-A)',
        'Prof. S. Lavanya (II-B)',
      ],
      labs: [
        {
          name: 'Strength of Materials & Structural Testing Lab',
          incharge: 'Dr. S. Balamurali',
          equip: '100T Universal Testing Machine (UTM), Compression Testing Rig',
          acUps: '3-Phase Heavy Hydraulic Power Pack',
          kwh: 1620,
        },
        {
          name: 'Environmental & Water Quality Engineering Lab',
          incharge: 'Prof. Geetha Raman',
          equip: 'BOD Incubators, Spectrophotometers, COD Digesters, Autoclave',
          acUps: '2 × 1.5T Split ACs · 5 kVA UPS',
          kwh: 1240,
        },
        {
          name: 'Computer Aided Structural Design (STAAD/Revit) Lab',
          incharge: 'Prof. R. Sindhu',
          equip: '45 BIM & STAAD.Pro Workstations, Wide-Format Plotter',
          acUps: '2 × 2.0T Split ACs · 10 kVA UPS',
          kwh: 1180,
        },
        {
          name: 'Geotechnical & Highway Materials Lab',
          incharge: 'Prof. K. Natarajan',
          equip: 'Triaxial Shear Apparatus, CBR Test Rig, Hot Air Ovens',
          acUps: '1 × 1.5T Split AC · Industrial Exhaust',
          kwh: 880,
        },
      ],
    },
    IT: {
      hodName: 'Dr. P. Venkatesh',
      ahodName: 'Dr. S. Anitha',
      blockName: 'Information Technology Block (Block-IT)',
      advisors: [
        'Prof. K. Rajesh (IV-A)',
        'Prof. M. Nithya (IV-B)',
        'Prof. S. Harish (III-A)',
        'Prof. R. Keerthana (II-A)',
      ],
      labs: [
        {
          name: 'Enterprise Web & Mobile App Development Lab',
          incharge: 'Dr. S. Anitha',
          equip: '64 i7 Desktops, iOS/Android Build Server',
          acUps: '3 × 2.0T Inverter ACs · 15 kVA UPS',
          kwh: 2650,
        },
        {
          name: 'Cloud DevOps & Microservices Lab',
          incharge: 'Prof. K. Rajesh',
          equip: '60 Systems, Kubernetes Cluster Rack',
          acUps: '3 × 2.0T Split ACs · 15 kVA UPS',
          kwh: 2380,
        },
        {
          name: 'Database & Business Intelligence Lab',
          incharge: 'Prof. M. Nithya',
          equip: '58 Systems, Oracle/PostgreSQL Server',
          acUps: '3 × 1.5T Split ACs · 10 kVA UPS',
          kwh: 1920,
        },
        {
          name: 'Cyber Forensics & Network Security Lab',
          incharge: 'Prof. S. Harish',
          equip: '48 Workstations, Hardware Firewall Testbed',
          acUps: '2 × 2.0T Split ACs · 10 kVA UPS',
          kwh: 1740,
        },
      ],
    },
    AIDS: {
      hodName: 'Dr. K. Sathishkumar',
      ahodName: 'Dr. M. Janani',
      blockName: 'AI & Data Science Research Block (3rd Floor)',
      advisors: [
        'Prof. V. Aravind (IV-A)',
        'Prof. S. Gayathri (III-A)',
        'Prof. P. Naveen (III-B)',
        'Prof. R. Sneha (II-A)',
      ],
      labs: [
        {
          name: 'Big Data Analytics & Apache Spark Cluster Lab',
          incharge: 'Dr. M. Janani',
          equip: '62 High-Memory Workstations, Hadoop/Spark Nodes',
          acUps: '3 × 2.0T Inverter ACs · 20 kVA UPS',
          kwh: 2890,
        },
        {
          name: 'Predictive Modeling & Statistical Computing Lab',
          incharge: 'Prof. V. Aravind',
          equip: '60 Python/R Workstations, Interactive Display',
          acUps: '3 × 2.0T Split ACs · 15 kVA UPS',
          kwh: 2420,
        },
        {
          name: 'Generative AI & Natural Language Processing Lab',
          incharge: 'Prof. S. Gayathri',
          equip: '52 GPU-Accelerated PCs, Edge AI Kits',
          acUps: '3 × 2.0T Split ACs · 15 kVA UPS',
          kwh: 2180,
        },
        {
          name: 'Data Visualization & BI Studio',
          incharge: 'Prof. P. Naveen',
          equip: '48 Systems, Dual-Monitor Analytics Desks',
          acUps: '2 × 2.0T Split ACs · 10 kVA UPS',
          kwh: 1740,
        },
      ],
    },
    AIML: {
      hodName: 'Dr. V. Deepa',
      ahodName: 'Dr. G. Prabhu',
      blockName: 'AI & Machine Learning Wing (4th Floor)',
      advisors: [
        'Prof. S. Barath (IV-A)',
        'Prof. K. Deepika (III-A)',
        'Prof. M. Hari (II-A)',
        'Prof. T. Kavya (II-B)',
      ],
      labs: [
        {
          name: 'Machine Learning & Neural Networks Lab',
          incharge: 'Dr. G. Prabhu',
          equip: '60 GPU Workstations, TensorFlow Cluster Server',
          acUps: '3 × 2.0T Inverter ACs · 20 kVA UPS',
          kwh: 2640,
        },
        {
          name: 'Computer Vision & Autonomous Robotics Lab',
          incharge: 'Prof. S. Barath',
          equip: '50 Systems, Jetson Nano Kits, Drone Vision Testbed',
          acUps: '3 × 1.5T Split ACs · 15 kVA UPS',
          kwh: 2150,
        },
        {
          name: 'Reinforcement Learning & Simulation Lab',
          incharge: 'Prof. K. Deepika',
          equip: '50 Workstations, Smart Simulation Wall',
          acUps: '2 × 2.0T Split ACs · 10 kVA UPS',
          kwh: 1820,
        },
        {
          name: 'Speech & Cognitive Computing Lab',
          incharge: 'Prof. M. Hari',
          equip: '45 Systems, Acoustic Array Sensors',
          acUps: '2 × 1.5T Split ACs · 10 kVA UPS',
          kwh: 1530,
        },
      ],
    },
    FE: {
      hodName: 'Dr. N. Jayakumar',
      ahodName: 'Dr. S.Banumathi',
      blockName: 'First Year Freshman Engineering Block (S&H)',
      advisors: [
        'Dr. S. Banumathi (I-A)',
        'Prof. R. Kumaravel (I-B)',
        'Prof. M. Chitra (I-C)',
        'Prof. P. Senthil (I-D)',
        'Prof. K. Revathi (I-E)',
      ],
      labs: [
        {
          name: 'Engineering Physics & Laser Optics Lab',
          incharge: 'Dr. S. Banumathi',
          equip: 'Spectrometers, He-Ne Lasers, Ultrasonic Interferometers',
          acUps: '2 × 1.5T Split ACs (Darkroom) · 5 kVA UPS',
          kwh: 1180,
        },
        {
          name: 'Engineering Chemistry & Environmental Analysis Lab',
          incharge: 'Prof. Priya Chandran',
          equip: 'Digital pH/Conductivity Meters, Distillation Units, Fume Hoods',
          acUps: 'Industrial Exhaust + 1 × 1.5T AC · 5 kVA UPS',
          kwh: 1320,
        },
        {
          name: 'First Year Python & C Programming Lab',
          incharge: 'Prof. R. Kumaravel',
          equip: '65 Desktop Systems, Smart Projector',
          acUps: '3 × 2.0T Split ACs · 15 kVA UPS',
          kwh: 1450,
        },
        {
          name: 'English Communication & Digital Language Lab',
          incharge: 'Prof. M. Chitra',
          equip: '60 Audio-Visual Consoles, Lingua Server',
          acUps: '2 × 1.5T Split ACs · 10 kVA UPS',
          kwh: 730,
        },
      ],
    },
  };

  const meta = deptMetaMap[code] || deptMetaMap.CSE;

  // 1. FIRST: STAFF RECORDS (HOD Cabin, AHOD Cabin, Class Advisor Cabins, Main Staff Rooms)
  const staffRecords: HodStaffRecord[] = [
    {
      id: `${code}-STF-01`,
      cabinOrRoom: `${code}-101 · HOD Executive Cabin`,
      staffName: meta.hodName,
      designation: `HOD (${dept})`,
      subMeterId: `MTR-${code}-HOD-101`,
      appliances: '1 × 1.5T Inverter Split AC, 2 Desktops, 1 Laser Printer, 6 LED Panels, 2 BLDC Fans',
      monthlyKwh: 380,
      monthlyEbInr: 3230,
      carbonKg: 311.6,
    },
    {
      id: `${code}-STF-02`,
      cabinOrRoom: `${code}-102 · AHOD Cabin`,
      staffName: meta.ahodName,
      designation: `AHOD (${dept})`,
      subMeterId: `MTR-${code}-AHOD-102`,
      appliances: '1 × 1.5T Split AC, 1 Desktop, 1 All-in-One Printer, 4 LED Panels, 2 Fans',
      monthlyKwh: 310,
      monthlyEbInr: 2635,
      carbonKg: 254.2,
    },
    {
      id: `${code}-STF-03`,
      cabinOrRoom: `${code}-105 · Senior Class Advisors Cabin 1`,
      staffName: `${meta.advisors[0]} & ${meta.advisors[1] || 'Advisor Team'}`,
      designation: 'Class Advisors',
      subMeterId: `MTR-${code}-CA-105`,
      appliances: '1 × 1.5T Split AC, 3 Faculty PCs, 1 Scanner/Printer, 6 LED Tubes, 3 Fans',
      monthlyKwh: 340,
      monthlyEbInr: 2890,
      carbonKg: 278.8,
    },
    {
      id: `${code}-STF-04`,
      cabinOrRoom: `${code}-106 · Class Advisors Cabin 2`,
      staffName: `${meta.advisors[2] || 'Class Advisor III'} & ${meta.advisors[3] || 'Class Advisor II'}`,
      designation: 'Class Advisors',
      subMeterId: `MTR-${code}-CA-106`,
      appliances: '2 Faculty Desktops, 1 Network Printer, 6 LED Tubes, 4 BLDC Ceiling Fans',
      monthlyKwh: 240,
      monthlyEbInr: 2040,
      carbonKg: 196.8,
    },
    {
      id: `${code}-STF-05`,
      cabinOrRoom: `${code}-108 · Main Department Staff Room - Wing A (14 Faculty)`,
      staffName: `${dept} Senior & Associate Professors`,
      designation: 'Department Staffs',
      subMeterId: `MTR-${code}-SR-108`,
      appliances: '14 Faculty Desktops, 2 Network Copiers, 16 LED Battens, 8 Ceiling Fans, Water Dispenser',
      monthlyKwh: 520,
      monthlyEbInr: 4420,
      carbonKg: 426.4,
    },
    {
      id: `${code}-STF-06`,
      cabinOrRoom: `${code}-109 · Department Staff Room - Wing B & Dept Office (12 Faculty)`,
      staffName: `${dept} Assistant Professors & Dept Admin`,
      designation: 'Department Staffs',
      subMeterId: `MTR-${code}-SR-109`,
      appliances: '12 Faculty PCs, 1 High-Speed Printer, 14 LED Battens, 7 Ceiling Fans, 3 kVA UPS',
      monthlyKwh: 460,
      monthlyEbInr: 3910,
      carbonKg: 377.2,
    },
  ];

  // 2. SECOND: CLASSES RECORDS (Year-wise & Section-wise Smart Classrooms & Seminar Hall)
  const classRecords: HodClassRecord[] = [
    {
      id: `${code}-CLS-01`,
      className: `IV Year ${code} — Section A`,
      roomNumber: `${code} Lecture Hall 401`,
      classAdvisor: meta.advisors[0] || 'Senior Class Advisor',
      studentCount: 62,
      appliances: '1 × 1.5T AC, Smart Interactive Board, 4K Projector, 8 BLDC Fans, 12 LED Lights',
      monthlyKwh: 680,
      monthlyEbInr: 5780,
      carbonKg: 557.6,
    },
    {
      id: `${code}-CLS-02`,
      className: `IV Year ${code} — Section B`,
      roomNumber: `${code} Lecture Hall 402`,
      classAdvisor: meta.advisors[1] || 'Class Advisor IV-B',
      studentCount: 60,
      appliances: '1 × 1.5T AC, Smart Interactive Board, Projector, 8 BLDC Fans, 12 LED Lights',
      monthlyKwh: 650,
      monthlyEbInr: 5525,
      carbonKg: 533.0,
    },
    {
      id: `${code}-CLS-03`,
      className: `III Year ${code} — Section A`,
      roomNumber: `${code} Lecture Hall 301`,
      classAdvisor: meta.advisors[2] || 'Class Advisor III-A',
      studentCount: 64,
      appliances: 'Smart Projector, Lecture Capture Mic, 8 Ceiling Fans, 12 LED Tube Lights',
      monthlyKwh: 490,
      monthlyEbInr: 4165,
      carbonKg: 401.8,
    },
    {
      id: `${code}-CLS-04`,
      className: `III Year ${code} — Section B`,
      roomNumber: `${code} Lecture Hall 302`,
      classAdvisor: meta.advisors[3] || 'Class Advisor III-B',
      studentCount: 63,
      appliances: 'Smart Projector, Audio Amplifier, 8 Ceiling Fans, 12 LED Tube Lights',
      monthlyKwh: 475,
      monthlyEbInr: 4038,
      carbonKg: 389.5,
    },
    {
      id: `${code}-CLS-05`,
      className: `II Year ${code} — Section A`,
      roomNumber: `${code} Lecture Hall 201`,
      classAdvisor: meta.advisors[4] || 'Class Advisor II-A',
      studentCount: 64,
      appliances: 'LCD Projector, Podium PC, 8 Ceiling Fans, 12 LED Tube Lights',
      monthlyKwh: 460,
      monthlyEbInr: 3910,
      carbonKg: 377.2,
    },
    {
      id: `${code}-CLS-06`,
      className: `II Year ${code} — Section B`,
      roomNumber: `${code} Lecture Hall 202`,
      classAdvisor: meta.advisors[5] || 'Class Advisor II-B',
      studentCount: 62,
      appliances: 'LCD Projector, Podium PC, 8 Ceiling Fans, 12 LED Tube Lights',
      monthlyKwh: 450,
      monthlyEbInr: 3825,
      carbonKg: 369.0,
    },
    {
      id: `${code}-CLS-07`,
      className: `${dept} Department Air-Conditioned Seminar Hall`,
      roomNumber: `${code} Seminar Hall 110 (140 Seats)`,
      classAdvisor: meta.hodName,
      studentCount: 140,
      appliances: '3 × 2.0T Cassette ACs, Laser Projector, Digital PA System, 24 LED Recessed Lights',
      monthlyKwh: 890,
      monthlyEbInr: 7565,
      carbonKg: 729.8,
    },
  ];

  // 3. THIRD: LABS RECORDS (Department Laboratories & Research Centers)
  const labRecords: HodLabRecord[] = meta.labs.map((lab, idx) => ({
    id: `${code}-LAB-0${idx + 1}`,
    labName: lab.name,
    labCode: `${code}-LAB-${201 + idx}`,
    labIncharge: lab.incharge,
    subMeterId: `MTR-${code}-LAB-0${idx + 1}`,
    equipmentAndSystems: lab.equip,
    acAndUpsLoad: lab.acUps,
    monthlyKwh: lab.kwh,
    monthlyEbInr: Math.round(lab.kwh * 8.5),
    carbonKg: Number((lab.kwh * 0.82).toFixed(1)),
  }));

  return {
    hodName: meta.hodName,
    hodEmail: `hod-${lowerCode}@mkce.ac.in`,
    hodPass: `${lowerCode}hod@2026`,
    blockName: meta.blockName,
    staffRecords,
    classRecords,
    labRecords,
  };
}

// ============================================================================
// COMPONENT 1: PRINCIPAL — WHOLE COLLEGE DEPARTMENT CARBON WISE VIEW
// ============================================================================
export const PrincipalDeptCarbonView: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Optimal' | 'Moderate' | 'High Load'>('All');

  const filteredDepts = useMemo(() => {
    return WHOLE_COLLEGE_DEPT_CARBON_DATA.filter((d) => {
      const matchSearch =
        d.dept.toLowerCase().includes(search.toLowerCase()) ||
        d.fullName.toLowerCase().includes(search.toLowerCase()) ||
        d.hodName.toLowerCase().includes(search.toLowerCase()) ||
        d.blockLocation.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totals = useMemo(() => {
    return WHOLE_COLLEGE_DEPT_CARBON_DATA.reduce(
      (acc, d) => {
        acc.headcount += d.headcount;
        acc.staffKwh += d.staffKwh;
        acc.classesKwh += d.classesKwh;
        acc.labsKwh += d.labsKwh;
        acc.totalKwh += d.totalKwh;
        acc.ebBill += d.monthlyEbBillInr;
        acc.grossTons += d.grossTons;
        acc.solarTons += d.solarOffsetTons;
        acc.netTons += d.netTons;
        return acc;
      },
      {
        headcount: 0,
        staffKwh: 0,
        classesKwh: 0,
        labsKwh: 0,
        totalKwh: 0,
        ebBill: 0,
        grossTons: 0,
        solarTons: 0,
        netTons: 0,
      }
    );
  }, []);

  const exportWholeCollegeCsv = () => {
    const headers = [
      'Department',
      'HOD / Incharge',
      'Block Location',
      'Staff kWh',
      'Classes kWh',
      'Labs kWh',
      'Total Electricity (kWh)',
      'Monthly EB Bill (INR)',
      'Gross Emissions (tCO2e)',
      'Solar Offset (tCO2e)',
      'Net Carbon Footprint (tCO2e)',
      'Status',
    ];
    const rows = filteredDepts.map((d) => [
      `"${d.fullName}"`,
      `"${d.hodName}"`,
      `"${d.blockLocation}"`,
      d.staffKwh,
      d.classesKwh,
      d.labsKwh,
      d.totalKwh,
      d.monthlyEbBillInr,
      d.grossTons.toFixed(2),
      d.solarOffsetTons.toFixed(2),
      d.netTons.toFixed(2),
      d.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'MKCE_Principal_Whole_College_Dept_Carbon_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header for Principal Balamurugan */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-blue-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Principal Executive Module 2 · Whole College Carbon Audit
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                ID: principle@mkce.ac.in · Balamurugan
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Department-Wise Carbon Footprint — Whole College Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Principal <strong>{currentUser?.name || 'Balamurugan'}</strong> — Consolidated department-wise greenhouse gas emissions, Staff + Class + Lab electricity consumption, solar offsets, and net carbon rankings across all MKCE departments.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={exportWholeCollegeCsv}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Whole College CSV</span>
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                ← Back to Normal Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Whole College Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-slate-300">Whole College Gross Carbon</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white mt-0.5">
              {totals.grossTons.toFixed(2)} <span className="text-xs font-normal text-slate-300">tCO₂e/mo</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across all 12 departments & units</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-emerald-300">Rooftop Solar Offset</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-300 mt-0.5">
              -{totals.solarTons.toFixed(2)} <span className="text-xs font-normal text-emerald-200">tCO₂e/mo</span>
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-0.5">350 kWp Campus Solar Array</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-cyan-300">Whole College Net Carbon</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-300 mt-0.5">
              {totals.netTons.toFixed(2)} <span className="text-xs font-normal text-cyan-200">tCO₂e/mo</span>
            </div>
            <div className="text-[11px] text-cyan-200/80 mt-0.5">Net = Gross − Solar Offset</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-amber-300">Total College Electricity</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-300 mt-0.5">
              {totals.totalKwh.toLocaleString()} <span className="text-xs font-normal text-amber-200">kWh</span>
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">
              EB Bill: ₹{totals.ebBill.toLocaleString('en-IN')} / mo
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search department (CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML, Freshman...), HOD, or block..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['All', 'Optimal', 'Moderate', 'High Load'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Bar Comparison of Net Carbon by Department */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Whole College Department-Wise Net Carbon Ranking (tCO₂e / Month)
            </h2>
            <p className="text-xs text-slate-500">
              Includes combined Staff Cabins + Classrooms + Laboratories electricity & fuel scopes minus rooftop solar allocation
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
            12 Institutional Units
          </span>
        </div>

        <div className="space-y-3">
          {filteredDepts.map((d) => {
            const pct = Math.min(100, Math.round((d.netTons / 22) * 100));
            return (
              <div key={d.dept} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-[11px]">
                      {d.dept}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{d.fullName}</span>
                    <span className="text-[11px] text-slate-500 hidden md:inline">
                      · HOD/Lead: {d.hodName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-600">
                      Electricity: <strong>{d.totalKwh.toLocaleString()} kWh</strong>
                    </span>
                    <span className="text-emerald-700">
                      Solar: <strong>-{d.solarOffsetTons.toFixed(1)}t</strong>
                    </span>
                    <span className="text-slate-900 font-extrabold">
                      Net: {d.netTons.toFixed(2)} tCO₂e
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.status === 'High Load'
                        ? 'bg-rose-500'
                        : d.status === 'Moderate'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Department-Wise Audit Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Complete Department-Wise Carbon & Electricity Ledger (Whole College)
            </h2>
            <p className="text-xs text-slate-500">
              Audited breakdown across Staff Rooms, Classrooms, Laboratories, Scope 1/2/3 GHG, and EB Expenditure
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600">
            Showing {filteredDepts.length} of {WHOLE_COLLEGE_DEPT_CARBON_DATA.length} Departments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Department & HOD</th>
                <th className="py-3 px-3 text-right">Staff (kWh)</th>
                <th className="py-3 px-3 text-right">Classes (kWh)</th>
                <th className="py-3 px-3 text-right">Labs (kWh)</th>
                <th className="py-3 px-3 text-right">Total kWh</th>
                <th className="py-3 px-3 text-right">EB Bill (₹)</th>
                <th className="py-3 px-3 text-right">Gross tCO₂e</th>
                <th className="py-3 px-3 text-right">Solar Offset</th>
                <th className="py-3 px-3 text-right">Net tCO₂e</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredDepts.map((d) => (
                <tr key={d.dept} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{d.fullName}</div>
                    <div className="text-[11px] text-slate-500">
                      {d.hodName} · <span className="font-mono text-blue-700">{d.hodEmail}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{d.blockLocation}</div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {d.staffKwh.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {d.classesKwh.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-700">
                    {d.labsKwh.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-blue-700">
                    {d.totalKwh.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-800">
                    ₹{d.monthlyEbBillInr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800">
                    {d.grossTons.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-emerald-700">
                    -{d.solarOffsetTons.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-extrabold text-slate-900">
                    {d.netTons.toFixed(2)} t
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        d.status === 'Optimal'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : d.status === 'Moderate'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-mono text-xs font-bold">
                <td className="py-3.5 px-4">WHOLE COLLEGE TOTAL (ALL DEPARTMENTS)</td>
                <td className="py-3.5 px-3 text-right">{totals.staffKwh.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right">{totals.classesKwh.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right">{totals.labsKwh.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right text-amber-300">
                  {totals.totalKwh.toLocaleString()} kWh
                </td>
                <td className="py-3.5 px-3 text-right">
                  ₹{totals.ebBill.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3 text-right">{totals.grossTons.toFixed(2)} t</td>
                <td className="py-3.5 px-3 text-right text-emerald-300">
                  -{totals.solarTons.toFixed(2)} t
                </td>
                <td className="py-3.5 px-3 text-right text-cyan-300">
                  {totals.netTons.toFixed(2)} tCO₂e
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-300">AUDITED</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 2: MANAGER (VIKRAM) — ALL COLLEGE OFFICE ELECTRICAL RECORDS VIEW
// ============================================================================
export const ManagerOfficeElectricalView: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');

  const filteredOffices = useMemo(() => {
    return ALL_COLLEGE_OFFICE_ELECTRICAL_RECORDS.filter(
      (o) =>
        o.officeName.toLowerCase().includes(search.toLowerCase()) ||
        o.inchargePerson.toLowerCase().includes(search.toLowerCase()) ||
        o.buildingFloor.toLowerCase().includes(search.toLowerCase()) ||
        o.subMeterSerial.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totals = useMemo(() => {
    return ALL_COLLEGE_OFFICE_ELECTRICAL_RECORDS.reduce(
      (acc, o) => {
        acc.loadKw += o.connectedLoadKw;
        acc.kwh += o.monthlyKwh;
        acc.ebAmount += o.monthlyEbAmountInr;
        acc.carbonKg += o.carbonEmissionKg;
        return acc;
      },
      { loadKw: 0, kwh: 0, ebAmount: 0, carbonKg: 0 }
    );
  }, []);

  const exportOfficesCsv = () => {
    const headers = [
      'Office ID',
      'College Office Name',
      'Incharge Officer',
      'Location',
      'Sub-Meter Serial',
      'Connected Load (kW)',
      'AC / HVAC Units',
      'Computers & Servers',
      'Monthly Electricity (kWh)',
      'Monthly EB Bill (INR)',
      'Carbon Emission (kg CO2e)',
    ];
    const rows = filteredOffices.map((o) => [
      o.id,
      `"${o.officeName}"`,
      `"${o.inchargePerson}"`,
      `"${o.buildingFloor}"`,
      o.subMeterSerial,
      o.connectedLoadKw,
      `"${o.acUnitsDetail}"`,
      `"${o.computersAndServers}"`,
      o.monthlyKwh,
      o.monthlyEbAmountInr,
      o.carbonEmissionKg,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'MKCE_Manager_Vikram_All_College_Office_Electrical_Records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Manager Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-indigo-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                College Manager Module · Estate & Electrical Utility Audit
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                ID: manager@mkce.ac.in · Vikram
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              All College Office Electrical Records & Carbon Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              College Manager <strong>{currentUser?.name || 'Vikram'}</strong> — Complete electrical sub-meter readings, HVAC/AC loads, IT server systems, monthly TANGEDCO EB bills, and Scope 2 carbon emissions across all administrative and governance offices of MKCE.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={exportOfficesCsv}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Office Electrical CSV</span>
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-slate-300">Total College Offices</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white mt-0.5">
              {ALL_COLLEGE_OFFICE_ELECTRICAL_RECORDS.length} Offices
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Connected Load: {totals.loadKw.toFixed(1)} kW</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-amber-300">Monthly Office Electricity</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-300 mt-0.5">
              {totals.kwh.toLocaleString()} <span className="text-xs font-normal">kWh</span>
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">Sub-metered TANGEDCO HT/LT</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-emerald-300">Monthly Office EB Bill</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-300 mt-0.5">
              ₹{totals.ebAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-200/80 mt-0.5">@ ₹8.50 / kWh institutional tariff</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-3.5">
            <div className="text-[10px] font-mono uppercase text-cyan-300">Office Carbon Emission</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-300 mt-0.5">
              {(totals.carbonKg / 1000).toFixed(2)} <span className="text-xs font-normal">tCO₂e</span>
            </div>
            <div className="text-[11px] text-cyan-200/80 mt-0.5">
              {totals.carbonKg.toLocaleString()} kg CO₂e/mo
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search college office (Principal Office, Manager Office, Dean Office, Admission Office, COE, Accounts, Placement, Server Room...)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Office Electrical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOffices.map((off) => (
          <div
            key={off.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold text-[10px]">
                      {off.subMeterSerial}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Load: <strong>{off.connectedLoadKw} kW</strong> · PF: {off.powerFactor}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                    {off.officeName}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Incharge: <strong className="text-slate-700">{off.inchargePerson}</strong> · {off.buildingFloor}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                    off.auditStatus === 'Optimal'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : off.auditStatus === 'Verified'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {off.auditStatus}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="font-semibold text-slate-700">AC / Cooling: </span>
                  <span className="text-slate-600">{off.acUnitsDetail}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">IT & Office Equip: </span>
                  <span className="text-slate-600">{off.computersAndServers}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Lighting & UPS: </span>
                  <span className="text-slate-600">{off.lightingAndUpsDetail}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-2">
                <div className="text-[10px] font-mono uppercase text-amber-800">Monthly Units</div>
                <div className="text-sm font-extrabold font-mono text-slate-900">
                  {off.monthlyKwh.toLocaleString()} kWh
                </div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-lg p-2">
                <div className="text-[10px] font-mono uppercase text-emerald-800">Monthly EB Bill</div>
                <div className="text-sm font-extrabold font-mono text-emerald-800">
                  ₹{off.monthlyEbAmountInr.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-blue-50/70 border border-blue-200/70 rounded-lg p-2">
                <div className="text-[10px] font-mono uppercase text-blue-800">Carbon Footprint</div>
                <div className="text-sm font-extrabold font-mono text-blue-900">
                  {off.carbonEmissionKg.toFixed(1)} kg
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 3: DEAN (DR. LOGAVEL) — DEAN OFFICE & ADMISSION OFFICE DETAILS
// ============================================================================
export const DeanOfficeAdmissionView: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const [activeWing, setActiveWing] = useState<'all' | 'Dean Office' | 'Admission Office'>('all');

  const deanUnits = DEAN_AND_ADMISSION_OFFICE_DETAILS.filter((u) => u.wing === 'Dean Office');
  const admissionUnits = DEAN_AND_ADMISSION_OFFICE_DETAILS.filter(
    (u) => u.wing === 'Admission Office'
  );

  const deanTotals = deanUnits.reduce(
    (acc, u) => ({
      kwh: acc.kwh + u.monthlyKwh,
      eb: acc.eb + u.monthlyEbCostInr,
      carbon: acc.carbon + u.monthlyCarbonKg,
    }),
    { kwh: 0, eb: 0, carbon: 0 }
  );

  const admissionTotals = admissionUnits.reduce(
    (acc, u) => ({
      kwh: acc.kwh + u.monthlyKwh,
      eb: acc.eb + u.monthlyEbCostInr,
      carbon: acc.carbon + u.monthlyCarbonKg,
    }),
    { kwh: 0, eb: 0, carbon: 0 }
  );

  const renderUnitList = (title: string, badgeText: string, units: DeanAdmissionSubUnit[]) => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
            {badgeText}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{title}</h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold">
            Total: {units.reduce((s, u) => s + u.monthlyKwh, 0).toLocaleString()} kWh/mo
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            ₹{units.reduce((s, u) => s + u.monthlyEbCostInr, 0).toLocaleString('en-IN')} / mo
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-bold">
            {units.reduce((s, u) => s + u.monthlyCarbonKg, 0).toFixed(1)} kg CO₂e
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {units.map((u) => (
          <div key={u.id} className="p-5 hover:bg-slate-50/70 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-[11px]">
                    Room {u.roomCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[11px] font-bold">
                    Sub-Meter: {u.subMeterId}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Avg Operation: <strong>{u.avgDailyHours} hrs/day</strong> · Occupancy: {u.occupancyPerDay}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{u.unitName}</h3>
                <div className="text-xs text-slate-600">
                  Incharge Officer: <strong className="text-slate-900">{u.incharge}</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      HVAC / Air Conditioning
                    </div>
                    <div className="text-slate-800 font-medium mt-0.5">{u.acConfiguration}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Computers, Displays & Printers
                    </div>
                    <div className="text-slate-800 font-medium mt-0.5">{u.itAndOfficeSystems}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Lighting, BLDC Fans & Backup
                    </div>
                    <div className="text-slate-800 font-medium mt-0.5">{u.lightingAndFans}</div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-700 font-medium pt-1">
                  Audit Note: {u.remarks}
                </div>
              </div>

              {/* Right Metrics Box */}
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 shrink-0 lg:w-48">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center">
                  <div className="text-[10px] font-mono uppercase text-amber-800">Electricity</div>
                  <div className="text-sm sm:text-base font-extrabold font-mono text-slate-900">
                    {u.monthlyKwh} kWh
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                  <div className="text-[10px] font-mono uppercase text-emerald-800">Monthly EB Bill</div>
                  <div className="text-sm sm:text-base font-extrabold font-mono text-emerald-800">
                    ₹{u.monthlyEbCostInr.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center">
                  <div className="text-[10px] font-mono uppercase text-blue-800">Carbon Emission</div>
                  <div className="text-sm sm:text-base font-extrabold font-mono text-blue-900">
                    {u.monthlyCarbonKg.toFixed(1)} kg CO₂e
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Banner for Dr. Logavel (Dean) */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-teal-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                Dean Executive Module · Academic & Admissions Governance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                ID: dean@mkce.ac.in · Dr. Logavel
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Dean Office & Admission Office — Electricity & Carbon Emission Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Welcome <strong>{currentUser?.name || 'Dr. Logavel'}</strong> (Dean) — Dedicated room-by-room electrical consumption, HVAC loads, sub-meter readings, monthly EB bills, and carbon footprint details for the <strong>Dean Office (Room AC-204)</strong> and <strong>Central Admission Office (Rooms A-010 to A-014)</strong>.
            </p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>

        {/* Summary Comparison Cards: Dean Office vs Admission Office */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10">
          <div className="bg-white/5 border border-white/15 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-teal-300 font-bold">
                1. Dean Office (Academic Complex Room 204)
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white mt-0.5">
                {deanTotals.kwh.toLocaleString()} kWh · ₹{deanTotals.eb.toLocaleString('en-IN')}/mo
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Carbon Footprint: <strong className="text-teal-300">{deanTotals.carbon.toFixed(1)} kg CO₂e</strong> (4 Executive Sub-Units)
              </div>
            </div>
            <button
              onClick={() => setActiveWing('Dean Office')}
              className="px-3 py-1.5 bg-teal-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              Focus Dean Office
            </button>
          </div>

          <div className="bg-white/5 border border-white/15 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-300 font-bold">
                2. Central Admission Office (Main Wing A-010 to A-014)
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white mt-0.5">
                {admissionTotals.kwh.toLocaleString()} kWh · ₹{admissionTotals.eb.toLocaleString('en-IN')}/mo
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Carbon Footprint: <strong className="text-amber-300">{admissionTotals.carbon.toFixed(1)} kg CO₂e</strong> (4 Admission Sub-Units)
              </div>
            </div>
            <button
              onClick={() => setActiveWing('Admission Office')}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              Focus Admission Office
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'Dean Office', 'Admission Office'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveWing(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeWing === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' ? 'Show Both: Dean Office & Admission Office' : tab}
          </button>
        ))}
      </div>

      {(activeWing === 'all' || activeWing === 'Dean Office') &&
        renderUnitList(
          'Dean Office — Chambers, Corporate Outreach & Academic Secretariat (Academic Complex 2nd Floor)',
          'WING 1 · DEAN OFFICE DETAILS',
          deanUnits
        )}

      {(activeWing === 'all' || activeWing === 'Admission Office') &&
        renderUnitList(
          'Admission Office — Central Admission Cell, Counseling Hall & Digital Verification Bay',
          'WING 2 · ADMISSION OFFICE DETAILS',
          admissionUnits
        )}
    </div>
  );
};

// ============================================================================
// COMPONENT 4: HOD DEPARTMENT RECORDS VIEW (1. STAFF, 2. CLASSES, 3. LABS)
// ============================================================================
export const HodDepartmentRecordsView: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { records } = useEmissions();

  const availableDepts: CampusDepartment[] = [
    'CSE',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
    'IT',
    'AIDS',
    'AIML',
    'Freshman Engineering (1st Year)',
  ];

  const defaultDept: CampusDepartment =
    currentUser?.department && availableDepts.includes(currentUser.department)
      ? currentUser.department
      : 'CSE';

  const [selectedDept, setSelectedDept] = useState<CampusDepartment>(defaultDept);
  const [activeSection, setActiveSection] = useState<'all' | 'staff' | 'classes' | 'labs'>('all');

  const deptData = useMemo(() => getHodDepartmentStructuredData(selectedDept), [selectedDept]);

  const staffTotals = useMemo(
    () =>
      deptData.staffRecords.reduce(
        (acc, r) => ({
          kwh: acc.kwh + r.monthlyKwh,
          eb: acc.eb + r.monthlyEbInr,
          carbon: acc.carbon + r.carbonKg,
        }),
        { kwh: 0, eb: 0, carbon: 0 }
      ),
    [deptData]
  );

  const classTotals = useMemo(
    () =>
      deptData.classRecords.reduce(
        (acc, r) => ({
          kwh: acc.kwh + r.monthlyKwh,
          eb: acc.eb + r.monthlyEbInr,
          carbon: acc.carbon + r.carbonKg,
        }),
        { kwh: 0, eb: 0, carbon: 0 }
      ),
    [deptData]
  );

  const labTotals = useMemo(
    () =>
      deptData.labRecords.reduce(
        (acc, r) => ({
          kwh: acc.kwh + r.monthlyKwh,
          eb: acc.eb + r.monthlyEbInr,
          carbon: acc.carbon + r.carbonKg,
        }),
        { kwh: 0, eb: 0, carbon: 0 }
      ),
    [deptData]
  );

  const deptLiveLogs = useMemo(
    () => records.filter((r) => r.department === selectedDept),
    [records, selectedDept]
  );

  return (
    <div className="space-y-6">
      {/* HOD Department Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                HOD Department Carbon Portal · Ordered: 1. Staff → 2. Classes → 3. Labs
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                ID: {deptData.hodEmail} · Pass: {deptData.hodPass}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {selectedDept} Department Records — 1. Staff · 2. Classes · 3. Laboratories
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Head of Department: <strong>{currentUser?.name || deptData.hodName}</strong> ({deptData.blockName}) — Structured departmental audit displaying <strong>First: Staff Cabins & Staff Rooms</strong>, <strong>Second: Year-wise Classrooms & Seminar Halls</strong>, and <strong>Third: Specialized Department Laboratories</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as CampusDepartment)}
              className="bg-slate-800 border border-slate-600 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cyan-400"
            >
              {availableDepts.map((d) => (
                <option key={d} value={d}>
                  Dept: {d}
                </option>
              ))}
            </select>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* 3-Pillar Summary Cards in Exact Order: 1. Staff, 2. Classes, 3. Labs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10">
          <div
            onClick={() => setActiveSection('staff')}
            className="bg-white/5 hover:bg-white/10 border border-cyan-400/30 rounded-xl p-4 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                FIRST · 1. DEPARTMENT STAFF & CABINS
              </span>
              <Users className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-xl font-extrabold font-mono text-white mt-1">
              {staffTotals.kwh.toLocaleString()} kWh · {staffTotals.carbon.toFixed(1)} kg CO₂e
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              HOD Cabin, AHOD Cabin, Advisor Cabins & Staff Rooms · ₹{staffTotals.eb.toLocaleString('en-IN')}/mo
            </div>
          </div>

          <div
            onClick={() => setActiveSection('classes')}
            className="bg-white/5 hover:bg-white/10 border border-amber-400/30 rounded-xl p-4 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold">
                SECOND · 2. DEPARTMENT CLASSES & HALLS
              </span>
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-xl font-extrabold font-mono text-white mt-1">
              {classTotals.kwh.toLocaleString()} kWh · {classTotals.carbon.toFixed(1)} kg CO₂e
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              II, III, IV Year Sections & Dept Seminar Hall · ₹{classTotals.eb.toLocaleString('en-IN')}/mo
            </div>
          </div>

          <div
            onClick={() => setActiveSection('labs')}
            className="bg-white/5 hover:bg-white/10 border border-emerald-400/30 rounded-xl p-4 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold">
                THIRD · 3. DEPARTMENT LABORATORIES
              </span>
              <Cpu className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-xl font-extrabold font-mono text-white mt-1">
              {labTotals.kwh.toLocaleString()} kWh · {labTotals.carbon.toFixed(1)} kg CO₂e
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {deptData.labRecords.length} Specialized Labs & Computing Clusters · ₹{labTotals.eb.toLocaleString('en-IN')}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Show All 3 Sections in Order (1. Staff → 2. Classes → 3. Labs)
        </button>
        <button
          onClick={() => setActiveSection('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'staff'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          1. Staff Cabins & Staff Rooms ({deptData.staffRecords.length})
        </button>
        <button
          onClick={() => setActiveSection('classes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'classes'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          2. Classes & Lecture Halls ({deptData.classRecords.length})
        </button>
        <button
          onClick={() => setActiveSection('labs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'labs'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          3. Department Labs ({deptData.labRecords.length})
        </button>
      </div>

      {/* =====================================================================
          SECTION 1 (FIRST): STAFF CABINS & DEPARTMENT STAFF ROOMS
          ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'staff') && (
        <div className="bg-white border-2 border-cyan-500/30 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 bg-cyan-50/60 border-b border-cyan-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-700 text-white">
                SECTION 1 (FIRST) · DEPARTMENT STAFF RECORDS
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                1. {selectedDept} Staff Cabins & Faculty Staff Rooms — Electricity & Carbon Records
              </h2>
              <p className="text-xs text-slate-600">
                Includes HOD Cabin, AHOD Cabin, Class Advisor Cabins, and Department Faculty Staff Rooms
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-cyan-200 text-slate-900">
                {staffTotals.kwh.toLocaleString()} kWh
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                ₹{staffTotals.eb.toLocaleString('en-IN')}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-cyan-100 border border-cyan-300 text-cyan-950">
                {staffTotals.carbon.toFixed(1)} kg CO₂e
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4">Cabin / Staff Room</th>
                  <th className="py-3 px-3">Staff / Faculty Incharge</th>
                  <th className="py-3 px-3">Sub-Meter ID</th>
                  <th className="py-3 px-3">Connected Appliances & HVAC</th>
                  <th className="py-3 px-3 text-right">Monthly kWh</th>
                  <th className="py-3 px-3 text-right">EB Bill (₹)</th>
                  <th className="py-3 px-4 text-right">Carbon (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {deptData.staffRecords.map((stf) => (
                  <tr key={stf.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{stf.cabinOrRoom}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{stf.staffName}</div>
                      <div className="text-[10px] font-mono text-cyan-700">{stf.designation}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-blue-700 font-semibold">
                      {stf.subMeterId}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-md">{stf.appliances}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                      {stf.monthlyKwh} kWh
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                      ₹{stf.monthlyEbInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-cyan-900">
                      {stf.carbonKg.toFixed(1)} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 2 (SECOND): DEPARTMENT CLASSES & LECTURE HALLS
          ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'classes') && (
        <div className="bg-white border-2 border-amber-500/30 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 bg-amber-50/60 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-600 text-white">
                SECTION 2 (SECOND) · DEPARTMENT CLASSES RECORDS
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                2. {selectedDept} Classrooms & Seminar Halls — Electricity & Carbon Records
              </h2>
              <p className="text-xs text-slate-600">
                Section-wise lecture halls (II Year, III Year, IV Year) with Class Advisors, student strength, and smart classroom loads
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-slate-900">
                {classTotals.kwh.toLocaleString()} kWh
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                ₹{classTotals.eb.toLocaleString('en-IN')}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-950">
                {classTotals.carbon.toFixed(1)} kg CO₂e
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-3">Lecture Hall</th>
                  <th className="py-3 px-3">Class Advisor</th>
                  <th className="py-3 px-3 text-center">Students</th>
                  <th className="py-3 px-3">Classroom Equipment (Projector/AC/Fans)</th>
                  <th className="py-3 px-3 text-right">Monthly kWh</th>
                  <th className="py-3 px-3 text-right">EB Bill (₹)</th>
                  <th className="py-3 px-4 text-right">Carbon (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {deptData.classRecords.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{cls.className}</td>
                    <td className="py-3.5 px-3 font-mono text-blue-700 font-semibold">
                      {cls.roomNumber}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">{cls.classAdvisor}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                      {cls.studentCount}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-md">{cls.appliances}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                      {cls.monthlyKwh} kWh
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                      ₹{cls.monthlyEbInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-amber-900">
                      {cls.carbonKg.toFixed(1)} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 3 (THIRD): DEPARTMENT LABORATORIES & RESEARCH CENTERS
          ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'labs') && (
        <div className="bg-white border-2 border-emerald-500/30 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 bg-emerald-50/60 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-700 text-white">
                SECTION 3 (THIRD) · DEPARTMENT LABORATORIES RECORDS
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                3. {selectedDept} Specialized Laboratories — Electricity & Carbon Records
              </h2>
              <p className="text-xs text-slate-600">
                High-density computing clusters, heavy lab machinery, precision air-conditioning, and online UPS systems
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-slate-900">
                {labTotals.kwh.toLocaleString()} kWh
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                ₹{labTotals.eb.toLocaleString('en-IN')}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-950">
                {labTotals.carbon.toFixed(1)} kg CO₂e
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4">Laboratory Name & Code</th>
                  <th className="py-3 px-3">Lab Incharge</th>
                  <th className="py-3 px-3">Sub-Meter Serial</th>
                  <th className="py-3 px-3">Systems & Lab Machinery</th>
                  <th className="py-3 px-3">AC & Online UPS Load</th>
                  <th className="py-3 px-3 text-right">Monthly kWh</th>
                  <th className="py-3 px-3 text-right">EB Bill (₹)</th>
                  <th className="py-3 px-4 text-right">Carbon (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {deptData.labRecords.map((lab) => (
                  <tr key={lab.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{lab.labName}</div>
                      <div className="text-[10px] font-mono text-emerald-700">{lab.labCode}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">{lab.labIncharge}</td>
                    <td className="py-3.5 px-3 font-mono text-blue-700 font-semibold">
                      {lab.subMeterId}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-xs">{lab.equipmentAndSystems}</td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-xs">{lab.acAndUpsLoad}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                      {lab.monthlyKwh.toLocaleString()} kWh
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                      ₹{lab.monthlyEbInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-900">
                      {lab.carbonKg.toFixed(1)} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Operator-Submitted Emission Logs for this Department */}
      {deptLiveLogs.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Operator Telemetry Logs Submitted for {selectedDept}
              </h3>
              <p className="text-xs text-slate-500">
                Verified & pending emission entries recorded by system operators
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs font-bold">
              {deptLiveLogs.length} Logs
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deptLiveLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{log.title}</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {log.facilityLocation} · {log.date} · By {log.reportedBy.userName}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-slate-900">
                    {formatKgCO2e(log.totalEmissionKgCO2e)}
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                      log.approvalStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {log.approvalStatus || 'approved'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
