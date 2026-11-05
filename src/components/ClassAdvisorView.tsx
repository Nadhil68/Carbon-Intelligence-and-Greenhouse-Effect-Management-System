import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Leaf,
  Wifi,
  Laptop,
  Lightbulb,
  Fan,
  Flame,
  Building2,
  Users,
  UserCheck,
  Phone,
  Mail,
  GraduationCap,
  Gauge,
  CheckCircle2,
  Search,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ClassAdvisorViewProps {
  mode: 'welcome_banner' | 'cabin' | 'class';
  onNavigateTab?: (tab: string) => void;
}

export interface AdvisorProfileData {
  id: 'ananthi' | 'selvanayagi';
  name: string;
  roleTitle: string;
  department: string;
  section: string;
  shortSection: string;
  qualification: string;
  joinedYear: number;
  email: string;
  altEmail: string;
  phone: string;
  facultyId: string;
  subjects: string[];
  cabin: {
    code: string;
    name: string;
    floor: string;
    voltageVolts: number;
    phase: string;
    liveCurrentAmps: number;
    powerFactor: number;
    breakerRatingAmps: number;
    solarOffsetDailyKg: number;
    workstation: {
      model: string;
      watts: number;
      dailyHours: number;
      dailyKWh: number;
      monthlyKWh: number;
      dailyCarbonKg: number;
      monthlyCarbonKg: number;
    };
    appliances: {
      name: string;
      spec: string;
      category: 'workstation' | 'ac' | 'lights' | 'fan' | 'network';
      watts: number;
      dailyHours: number;
      dailyKWh: number;
      monthlyKWh: number;
      dailyBillRs: number;
      monthlyBillRs: number;
      dailyCarbonKg: number;
      monthlyCarbonKg: number;
    }[];
  };
  classInfo: {
    sectionName: string;
    classRoom: string;
    semester: string;
    totalStudents: number;
    wifiApId: string;
    wifiModel: string;
    ssid: string;
    bandwidthMbps: number;
    equipment: {
      name: string;
      units: string;
      category: 'ac' | 'lights' | 'fans' | 'laptops' | 'wifi';
      watts: number;
      dailyHours: number;
      dailyKWh: number;
      monthlyKWh: number;
      dailyBillRs: number;
      monthlyBillRs: number;
      dailyCarbonKg: number;
      monthlyCarbonKg: number;
    }[];
    students: {
      rollNo: string;
      name: string;
      cgpa: string;
      laptopDailyKWh: number;
      dailyCarbonKg: number;
      monthlyCarbonKg: number;
    }[];
  };
}

const TARIFF_RATE = 8.5; // ₹8.50 per kWh
const EMISSION_FACTOR = 0.82; // 0.82 kg CO2e per kWh

export const CSE_CLASS_ADVISORS: Record<'ananthi' | 'selvanayagi', AdvisorProfileData> = {
  ananthi: {
    id: 'ananthi',
    name: 'Prof. Ananthi',
    roleTitle: 'Class Advisor (IV Year CSE - Sec IV-A) & Senior Assistant Professor',
    department: 'CSE',
    section: 'IV Year CSE (Sec IV-A)',
    shortSection: 'CSE IV-A',
    qualification: 'M.E. (Computer Science & Engineering)',
    joinedYear: 2015,
    email: 'ananthi@mkce.ac.in',
    altEmail: 'ananthi.cse@campus.edu',
    phone: '+91 94435 50105',
    facultyId: 'FAC-CSE-105',
    subjects: ['Design & Analysis of Algorithms', 'Compiler Design'],
    cabin: {
      code: 'CS-105',
      name: 'Computer Block - Cabin CS-105',
      floor: '1st Floor, CSE Faculty Wing',
      voltageVolts: 230,
      phase: 'Single-Phase AC 50Hz',
      liveCurrentAmps: 4.6,
      powerFactor: 0.97,
      breakerRatingAmps: 16,
      solarOffsetDailyKg: 0.68,
      workstation: {
        model: 'Dell Precision 3450 Small Form Factor Workstation',
        watts: 125,
        dailyHours: 8.0,
        dailyKWh: 1.0,
        monthlyKWh: 25.0,
        dailyCarbonKg: 0.82,
        monthlyCarbonKg: 20.5,
      },
      appliances: [
        {
          name: 'Faculty Workstation PC',
          spec: 'Dell Precision 3450 Small Form Factor (Core i7, 16GB RAM)',
          category: 'workstation',
          watts: 125,
          dailyHours: 8.0,
          dailyKWh: 1.0,
          monthlyKWh: 25.0,
          dailyBillRs: +(1.0 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(25.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(1.0 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(25.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin Split AC (Duct Share)',
          spec: '0.8 Ton Inverter Split AC Cabin Cooling Zone',
          category: 'ac',
          watts: 420,
          dailyHours: 4.0,
          dailyKWh: 1.68,
          monthlyKWh: 42.0,
          dailyBillRs: +(1.68 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(42.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(1.68 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(42.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin LED Illumination',
          spec: '2 x 18W Philips Anti-Glare Recessed LED Panels',
          category: 'lights',
          watts: 36,
          dailyHours: 7.0,
          dailyKWh: 0.25,
          monthlyKWh: 6.25,
          dailyBillRs: +(0.25 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(6.25 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.25 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(6.25 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin BLDC Ceiling Fan',
          spec: '1 x 32W Atomberg Renesa Smart BLDC Fan',
          category: 'fan',
          watts: 32,
          dailyHours: 7.0,
          dailyKWh: 0.22,
          monthlyKWh: 5.5,
          dailyBillRs: +(0.22 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(5.5 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.22 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(5.5 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin VoIP & Wi-Fi Telemetry Node',
          spec: 'Cisco IP Phone 7821 + Aruba PoE Cabin Link',
          category: 'network',
          watts: 12,
          dailyHours: 4.2,
          dailyKWh: 0.05,
          monthlyKWh: 1.25,
          dailyBillRs: +(0.05 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(1.25 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.05 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(1.25 * EMISSION_FACTOR).toFixed(2),
        },
      ],
    },
    classInfo: {
      sectionName: 'IV Year CSE (Sec IV-A)',
      classRoom: 'CS Seminar Hall 401',
      semester: 'Semester 7 & 8 (Final Year)',
      totalStudents: 84,
      wifiApId: 'MKCE-AP-CSE-401',
      wifiModel: 'Aruba AP-555 Enterprise Wi-Fi 6 Dedicated',
      ssid: 'MKCE-CAMPUS-WIFI-6',
      bandwidthMbps: 750,
      equipment: [
        {
          name: 'Classroom Split Air Conditioning',
          units: '2 x 2.0 Ton Inverter Split AC Units',
          category: 'ac',
          watts: 3600,
          dailyHours: 5.0,
          dailyKWh: 18.0,
          monthlyKWh: 450.0,
          dailyBillRs: +(18.0 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(450.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(18.0 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(450.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'High-Lumen Classroom LED Lighting',
          units: '12 x 28W High-Efficiency LED Batten Fixtures',
          category: 'lights',
          watts: 336,
          dailyHours: 8.0,
          dailyKWh: 2.69,
          monthlyKWh: 67.25,
          dailyBillRs: +(2.69 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(67.25 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(2.69 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(67.25 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'BLDC Energy-Saving Ceiling Fans',
          units: '8 x 55W BLDC Brushless Ceiling Fans',
          category: 'fans',
          watts: 440,
          dailyHours: 8.0,
          dailyKWh: 3.52,
          monthlyKWh: 88.0,
          dailyBillRs: +(3.52 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(88.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(3.52 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(88.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Student Cohort Computing & Laptops (84 Students)',
          units: '84 Student Laptops & Smart Podium Projector (65W avg)',
          category: 'laptops',
          watts: 5460,
          dailyHours: 6.0,
          dailyKWh: 32.76,
          monthlyKWh: 819.0,
          dailyBillRs: +(32.76 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(819.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(32.76 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(819.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Dedicated Classroom Wi-Fi 6 Access Point',
          units: 'Aruba AP-555 Enterprise (MKCE-AP-CSE-401)',
          category: 'wifi',
          watts: 22.5,
          dailyHours: 24.0,
          dailyKWh: 0.54,
          monthlyKWh: 13.5,
          dailyBillRs: +(0.54 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(13.5 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.54 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(13.5 * EMISSION_FACTOR).toFixed(2),
        },
      ],
      students: [
        { rollNo: '21CS001', name: 'Rahul Kumar', cgpa: '8.9', laptopDailyKWh: 0.44, dailyCarbonKg: 0.36, monthlyCarbonKg: 9.0 },
        { rollNo: '21CS002', name: 'Ragul', cgpa: '8.6', laptopDailyKWh: 0.42, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS003', name: 'Ratheenesh', cgpa: '9.1', laptopDailyKWh: 0.45, dailyCarbonKg: 0.37, monthlyCarbonKg: 9.25 },
        { rollNo: '21CS004', name: 'Sanjaykumar', cgpa: '8.8', laptopDailyKWh: 0.40, dailyCarbonKg: 0.33, monthlyCarbonKg: 8.25 },
        { rollNo: '21CS005', name: 'Sanjivkumar', cgpa: '8.7', laptopDailyKWh: 0.41, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS006', name: 'Nadhil R', cgpa: '9.2', laptopDailyKWh: 0.46, dailyCarbonKg: 0.38, monthlyCarbonKg: 9.5 },
        { rollNo: '21CS007', name: 'Pradeep R', cgpa: '9.0', laptopDailyKWh: 0.43, dailyCarbonKg: 0.35, monthlyCarbonKg: 8.75 },
        { rollNo: '21CS008', name: 'Pradeep S', cgpa: '8.9', laptopDailyKWh: 0.42, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS009', name: 'Pranith Sriram G', cgpa: '9.4', laptopDailyKWh: 0.47, dailyCarbonKg: 0.39, monthlyCarbonKg: 9.75 },
        { rollNo: '21CS010', name: 'Sriram', cgpa: '9.3', laptopDailyKWh: 0.45, dailyCarbonKg: 0.37, monthlyCarbonKg: 9.25 },
        { rollNo: '21CS011', name: 'Mohammed Muzammil', cgpa: '9.1', laptopDailyKWh: 0.44, dailyCarbonKg: 0.36, monthlyCarbonKg: 9.0 },
        { rollNo: '21CS012', name: 'Mydhelingam', cgpa: '8.8', laptopDailyKWh: 0.41, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS013', name: 'Sanjai C', cgpa: '9.0', laptopDailyKWh: 0.43, dailyCarbonKg: 0.35, monthlyCarbonKg: 8.75 },
        { rollNo: '21CS014', name: 'Tamiliniyan C', cgpa: '9.2', laptopDailyKWh: 0.46, dailyCarbonKg: 0.38, monthlyCarbonKg: 9.5 },
        { rollNo: '21CS015', name: 'Nithish Khanna S', cgpa: '8.9', laptopDailyKWh: 0.42, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS016', name: 'Nishok Khanna', cgpa: '9.0', laptopDailyKWh: 0.43, dailyCarbonKg: 0.35, monthlyCarbonKg: 8.75 },
        { rollNo: '21CS017', name: 'Vishwandh', cgpa: '8.7', laptopDailyKWh: 0.40, dailyCarbonKg: 0.33, monthlyCarbonKg: 8.25 },
      ],
    },
  },
  selvanayagi: {
    id: 'selvanayagi',
    name: 'Prof. A. Selvanayagi',
    roleTitle: 'Class Advisor (IV Year CSE - Sec IV-B) & Senior Assistant Professor',
    department: 'CSE',
    section: 'IV Year CSE (Sec IV-B)',
    shortSection: 'CSE IV-B',
    qualification: 'M.E. (Computer Science & Engineering)',
    joinedYear: 2015,
    email: 'selvanayagi@mkce.ac.in',
    altEmail: 'selvanayagi.cse@campus.edu',
    phone: '+91 94435 50106',
    facultyId: 'FAC-CSE-106',
    subjects: ['Artificial Intelligence Foundations', 'Software Engineering Principles'],
    cabin: {
      code: 'CS-106',
      name: 'Computer Block - Cabin CS-106',
      floor: '1st Floor, CSE Faculty Wing',
      voltageVolts: 230,
      phase: 'Single-Phase AC 50Hz',
      liveCurrentAmps: 4.5,
      powerFactor: 0.97,
      breakerRatingAmps: 16,
      solarOffsetDailyKg: 0.68,
      workstation: {
        model: 'Lenovo ThinkCentre M70q Tiny Workstation',
        watts: 120,
        dailyHours: 8.0,
        dailyKWh: 0.96,
        monthlyKWh: 24.0,
        dailyCarbonKg: 0.79,
        monthlyCarbonKg: 19.75,
      },
      appliances: [
        {
          name: 'Faculty Workstation PC',
          spec: 'Lenovo ThinkCentre M70q Tiny (Core i7, 16GB RAM, NVMe)',
          category: 'workstation',
          watts: 120,
          dailyHours: 8.0,
          dailyKWh: 0.96,
          monthlyKWh: 24.0,
          dailyBillRs: +(0.96 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(24.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.96 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(24.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin Split AC (Duct Share)',
          spec: '0.8 Ton Inverter Split AC Cabin Cooling Zone',
          category: 'ac',
          watts: 420,
          dailyHours: 4.0,
          dailyKWh: 1.68,
          monthlyKWh: 42.0,
          dailyBillRs: +(1.68 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(42.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(1.68 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(42.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin LED Illumination',
          spec: '2 x 18W Philips Anti-Glare Recessed LED Panels',
          category: 'lights',
          watts: 36,
          dailyHours: 7.0,
          dailyKWh: 0.25,
          monthlyKWh: 6.25,
          dailyBillRs: +(0.25 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(6.25 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.25 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(6.25 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin BLDC Ceiling Fan',
          spec: '1 x 32W Atomberg Renesa Smart BLDC Fan',
          category: 'fan',
          watts: 32,
          dailyHours: 7.0,
          dailyKWh: 0.22,
          monthlyKWh: 5.5,
          dailyBillRs: +(0.22 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(5.5 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.22 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(5.5 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Cabin VoIP & Wi-Fi Telemetry Node',
          spec: 'Cisco IP Phone 7821 + Aruba PoE Cabin Link',
          category: 'network',
          watts: 12,
          dailyHours: 4.2,
          dailyKWh: 0.05,
          monthlyKWh: 1.25,
          dailyBillRs: +(0.05 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(1.25 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.05 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(1.25 * EMISSION_FACTOR).toFixed(2),
        },
      ],
    },
    classInfo: {
      sectionName: 'IV Year CSE (Sec IV-B)',
      classRoom: 'CS Seminar Hall 402',
      semester: 'Semester 7 & 8 (Final Year)',
      totalStudents: 82,
      wifiApId: 'MKCE-AP-CSE-402',
      wifiModel: 'Aruba AP-555 Enterprise Wi-Fi 6 Dedicated',
      ssid: 'MKCE-CAMPUS-WIFI-6',
      bandwidthMbps: 740,
      equipment: [
        {
          name: 'Classroom Split Air Conditioning',
          units: '2 x 2.0 Ton Inverter Split AC Units',
          category: 'ac',
          watts: 3600,
          dailyHours: 5.0,
          dailyKWh: 18.0,
          monthlyKWh: 450.0,
          dailyBillRs: +(18.0 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(450.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(18.0 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(450.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'High-Lumen Classroom LED Lighting',
          units: '12 x 28W High-Efficiency LED Batten Fixtures',
          category: 'lights',
          watts: 336,
          dailyHours: 8.0,
          dailyKWh: 2.69,
          monthlyKWh: 67.25,
          dailyBillRs: +(2.69 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(67.25 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(2.69 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(67.25 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'BLDC Energy-Saving Ceiling Fans',
          units: '8 x 55W BLDC Brushless Ceiling Fans',
          category: 'fans',
          watts: 440,
          dailyHours: 8.0,
          dailyKWh: 3.52,
          monthlyKWh: 88.0,
          dailyBillRs: +(3.52 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(88.0 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(3.52 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(88.0 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Student Cohort Computing & Laptops (82 Students)',
          units: '82 Student Laptops & Smart Podium Projector (65W avg)',
          category: 'laptops',
          watts: 5330,
          dailyHours: 6.0,
          dailyKWh: 31.98,
          monthlyKWh: 799.5,
          dailyBillRs: +(31.98 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(799.5 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(31.98 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(799.5 * EMISSION_FACTOR).toFixed(2),
        },
        {
          name: 'Dedicated Classroom Wi-Fi 6 Access Point',
          units: 'Aruba AP-555 Enterprise (MKCE-AP-CSE-402)',
          category: 'wifi',
          watts: 22.5,
          dailyHours: 24.0,
          dailyKWh: 0.54,
          monthlyKWh: 13.5,
          dailyBillRs: +(0.54 * TARIFF_RATE).toFixed(2),
          monthlyBillRs: +(13.5 * TARIFF_RATE).toFixed(2),
          dailyCarbonKg: +(0.54 * EMISSION_FACTOR).toFixed(2),
          monthlyCarbonKg: +(13.5 * EMISSION_FACTOR).toFixed(2),
        },
      ],
      students: [
        { rollNo: '21CS018', name: 'Sudharshan', cgpa: '9.1', laptopDailyKWh: 0.45, dailyCarbonKg: 0.37, monthlyCarbonKg: 9.25 },
        { rollNo: '21CS019', name: 'Dharshan', cgpa: '8.8', laptopDailyKWh: 0.42, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS020', name: 'Harirharan', cgpa: '8.9', laptopDailyKWh: 0.43, dailyCarbonKg: 0.35, monthlyCarbonKg: 8.75 },
        { rollNo: '21CS021', name: 'Ganesh', cgpa: '8.7', laptopDailyKWh: 0.41, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS022', name: 'Vishnu', cgpa: '9.2', laptopDailyKWh: 0.46, dailyCarbonKg: 0.38, monthlyCarbonKg: 9.5 },
        { rollNo: '21CS023', name: 'Sudeep', cgpa: '9.0', laptopDailyKWh: 0.44, dailyCarbonKg: 0.36, monthlyCarbonKg: 9.0 },
        { rollNo: '21CS024', name: 'Srivelan', cgpa: '9.3', laptopDailyKWh: 0.47, dailyCarbonKg: 0.39, monthlyCarbonKg: 9.75 },
        { rollNo: '21CS025', name: 'Rhithick Seelan A', cgpa: '9.1', laptopDailyKWh: 0.45, dailyCarbonKg: 0.37, monthlyCarbonKg: 9.25 },
        { rollNo: '21CS026', name: 'Musthafa Ashik', cgpa: '9.2', laptopDailyKWh: 0.46, dailyCarbonKg: 0.38, monthlyCarbonKg: 9.5 },
        { rollNo: '21CS027', name: 'Vinith M', cgpa: '8.8', laptopDailyKWh: 0.42, dailyCarbonKg: 0.34, monthlyCarbonKg: 8.5 },
        { rollNo: '21CS028', name: 'Logavel Balaji', cgpa: '9.0', laptopDailyKWh: 0.44, dailyCarbonKg: 0.36, monthlyCarbonKg: 9.0 },
        { rollNo: '21CS029', name: 'Sabaresh K S', cgpa: '9.4', laptopDailyKWh: 0.47, dailyCarbonKg: 0.39, monthlyCarbonKg: 9.75 },
        { rollNo: '21CS030', name: 'Kavin Kishore Paneer', cgpa: '9.5', laptopDailyKWh: 0.48, dailyCarbonKg: 0.39, monthlyCarbonKg: 9.75 },
        { rollNo: '21CS031', name: 'Sudharshan K S', cgpa: '8.9', laptopDailyKWh: 0.43, dailyCarbonKg: 0.35, monthlyCarbonKg: 8.75 },
        { rollNo: '21CS032', name: 'Pravin Raj G', cgpa: '9.1', laptopDailyKWh: 0.45, dailyCarbonKg: 0.37, monthlyCarbonKg: 9.25 },
        { rollNo: '21CS033', name: 'Rohith', cgpa: '9.0', laptopDailyKWh: 0.44, dailyCarbonKg: 0.36, monthlyCarbonKg: 9.0 },
      ],
    },
  },
};

export const ClassAdvisorView: React.FC<ClassAdvisorViewProps> = ({ mode, onNavigateTab }) => {
  const { currentUser } = useAuth();

  // Detect whether current user is Selvanayagi or Ananthi (default to Ananthi if another user views it)
  const resolvedDefaultKey: 'ananthi' | 'selvanayagi' =
    currentUser?.name?.toLowerCase().includes('selvanayagi') ||
    currentUser?.email?.toLowerCase().includes('selvanayagi') ||
    currentUser?.classSection?.includes('IV-B')
      ? 'selvanayagi'
      : 'ananthi';

  const [selectedAdvisorKey, setSelectedAdvisorKey] = useState<'ananthi' | 'selvanayagi'>(
    resolvedDefaultKey
  );
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    setSelectedAdvisorKey(resolvedDefaultKey);
  }, [resolvedDefaultKey]);

  const advisor = CSE_CLASS_ADVISORS[selectedAdvisorKey];

  // Calculate Cabin Totals
  const cabinDailyKWh = +advisor.cabin.appliances
    .reduce((acc, item) => acc + item.dailyKWh, 0)
    .toFixed(2);
  const cabinMonthlyKWh = +advisor.cabin.appliances
    .reduce((acc, item) => acc + item.monthlyKWh, 0)
    .toFixed(2);
  const cabinDailyBillRs = +advisor.cabin.appliances
    .reduce((acc, item) => acc + item.dailyBillRs, 0)
    .toFixed(2);
  const cabinMonthlyBillRs = +advisor.cabin.appliances
    .reduce((acc, item) => acc + item.monthlyBillRs, 0)
    .toFixed(2);
  const cabinDailyCarbonKg = +advisor.cabin.appliances
    .reduce((acc, item) => acc + item.dailyCarbonKg, 0)
    .toFixed(2);
  const cabinMonthlyCarbonKg = +advisor.cabin.appliances
    .reduce((acc, item) => acc + item.monthlyCarbonKg, 0)
    .toFixed(2);
  const cabinNetDailyCarbonKg = Math.max(
    0,
    +(cabinDailyCarbonKg - advisor.cabin.solarOffsetDailyKg).toFixed(2)
  );

  // Calculate Class Totals
  const classDailyKWh = +advisor.classInfo.equipment
    .reduce((acc, item) => acc + item.dailyKWh, 0)
    .toFixed(2);
  const classMonthlyKWh = +advisor.classInfo.equipment
    .reduce((acc, item) => acc + item.monthlyKWh, 0)
    .toFixed(2);
  const classDailyBillRs = +advisor.classInfo.equipment
    .reduce((acc, item) => acc + item.dailyBillRs, 0)
    .toFixed(2);
  const classMonthlyBillRs = +advisor.classInfo.equipment
    .reduce((acc, item) => acc + item.monthlyBillRs, 0)
    .toFixed(2);
  const classDailyCarbonKg = +advisor.classInfo.equipment
    .reduce((acc, item) => acc + item.dailyCarbonKg, 0)
    .toFixed(2);
  const classMonthlyCarbonKg = +advisor.classInfo.equipment
    .reduce((acc, item) => acc + item.monthlyCarbonKg, 0)
    .toFixed(2);

  const filteredStudents = advisor.classInfo.students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // ---------------------------------------------------------------------------
  // MODE 1: WELCOME BANNER ON DASHBOARD
  // ---------------------------------------------------------------------------
  if (mode === 'welcome_banner') {
    return (
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-red-950 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-red-700/60">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-mono uppercase tracking-wider text-amber-200">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>
                CSE Class Advisor Portal · {advisor.cabin.code} · {advisor.classInfo.classRoom}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser?.name || advisor.name}!
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 max-w-2xl">
              {advisor.roleTitle} — Real-time monitoring of your Faculty Cabin ({advisor.cabin.name})
              electricity &amp; carbon emissions and your assigned class ({advisor.classInfo.sectionName})
              sustainability metrics.
            </p>
          </div>

          {/* Quick Module Jump Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('advisor_cabin')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Cabin Electricity &amp; Carbon ({advisor.cabin.code})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('advisor_class')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Class Carbon Details ({advisor.shortSection})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Summary Strip for Cabin + Class */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-rose-200">Faculty Cabin ({advisor.cabin.code})</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-0.5">
              {cabinDailyKWh} kWh/day
            </div>
            <div className="text-[11px] text-rose-100/80 font-mono">
              ₹{cabinMonthlyBillRs}/mo · {cabinDailyCarbonKg} kg CO₂e/day
            </div>
          </div>

          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-rose-200">Cabin Workstation</div>
            <div className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
              {advisor.cabin.workstation.model.split(' ').slice(0, 3).join(' ')}
            </div>
            <div className="text-[11px] text-emerald-300 font-mono">
              {advisor.cabin.workstation.watts}W · {advisor.cabin.workstation.dailyCarbonKg} kg CO₂e/day
            </div>
          </div>

          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-rose-200">
              Assigned Class ({advisor.shortSection})
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">
              {advisor.classInfo.totalStudents} Students
            </div>
            <div className="text-[11px] text-rose-100/80 font-mono">
              {advisor.classInfo.classRoom}
            </div>
          </div>

          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-rose-200">Class Carbon Footprint</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-300 mt-0.5">
              {classDailyCarbonKg} kg CO₂e/day
            </div>
            <div className="text-[11px] text-rose-100/80 font-mono">
              {classMonthlyCarbonKg} kg CO₂e/mo ({classDailyKWh} kWh/d)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Advisor Selector Bar (Allows switching between Prof. Ananthi and Prof. A. Selvanayagi)
  const renderAdvisorSelector = () => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
          Department of Computer Science &amp; Engineering (CSE)
        </div>
        <div className="text-sm font-bold text-slate-900">
          Select CSE Class Advisor to Inspect Telemetry
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(['ananthi', 'selvanayagi'] as const).map((key) => {
          const item = CSE_CLASS_ADVISORS[key];
          const isSelected = selectedAdvisorKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedAdvisorKey(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <div className="text-left">
                <div>{item.name}</div>
                <div
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {item.shortSection} · Cabin {item.cabin.code}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // MODE 2: CABIN ELECTRICITY & CARBON EMISSION DETAILS
  // ---------------------------------------------------------------------------
  if (mode === 'cabin') {
    return (
      <div className="space-y-6 w-full max-w-full">
        {renderAdvisorSelector()}

        {/* Cabin Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>
                  {advisor.cabin.name} ({advisor.cabin.floor})
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {advisor.name} — Cabin Electricity &amp; Carbon Emission Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                {advisor.roleTitle} · Qualification: {advisor.qualification}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{advisor.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{advisor.phone}</span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-amber-300">
                  <span>ID: {advisor.facultyId}</span>
                </span>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-4 min-w-[240px]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
                Subjects Handled ({advisor.shortSection})
              </div>
              <ul className="mt-1.5 space-y-1 text-xs text-white font-medium">
                {advisor.subjects.map((sub) => (
                  <li key={sub} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Cabin KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold">Cabin Daily Electricity</span>
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Zap className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {cabinDailyKWh} <span className="text-xs font-normal text-slate-500">kWh/day</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 font-mono">
              Monthly: <strong className="text-slate-800">{cabinMonthlyKWh} kWh/mo</strong>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold">Cabin Electricity Bill</span>
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Gauge className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-blue-700">
              ₹{cabinDailyBillRs.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">/ day</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 font-mono">
              Monthly: <strong className="text-slate-800">₹{cabinMonthlyBillRs.toFixed(2)}</strong>{' '}
              (@ ₹8.50/kWh)
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold">Workstation PC Carbon</span>
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Cpu className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {advisor.cabin.workstation.dailyCarbonKg}{' '}
              <span className="text-xs font-normal text-slate-500">kg CO₂e/day</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 truncate" title={advisor.cabin.workstation.model}>
              {advisor.cabin.workstation.model} ({advisor.cabin.workstation.watts}W)
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold">Gross / Net Cabin Carbon</span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Leaf className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-rose-600">
              {cabinDailyCarbonKg}{' '}
              <span className="text-xs font-normal text-slate-500">kg CO₂e/day</span>
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-mono font-semibold">
              Net after Solar: {cabinNetDailyCarbonKg} kg/d ({cabinMonthlyCarbonKg} kg/mo gross)
            </div>
          </div>
        </div>

        {/* Live Cabin Electrical Sub-Meter Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Cabin Sub-Meter ID</span>
            <span className="font-mono font-bold text-slate-900">
              MTR-CSE-{advisor.cabin.code}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Supply Voltage</span>
            <span className="font-mono font-bold text-slate-900">
              {advisor.cabin.voltageVolts}V ({advisor.cabin.phase})
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Live Current Draw</span>
            <span className="font-mono font-bold text-blue-700">
              {advisor.cabin.liveCurrentAmps} Amperes
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Power Factor</span>
            <span className="font-mono font-bold text-emerald-700">
              {advisor.cabin.powerFactor} PF
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">MCB Protection</span>
            <span className="font-mono font-bold text-slate-900">
              {advisor.cabin.breakerRatingAmps}A Type-C Breaker
            </span>
          </div>
        </div>

        {/* Detailed Cabin Appliance Electricity & Carbon Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cabin Appliance-Wise Electricity &amp; Carbon Audit ({advisor.cabin.name})
              </h2>
              <p className="text-xs text-slate-500">
                Complete breakdown of workstation, air conditioning, LED illumination, BLDC fan, and network node
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
              Tariff: ₹8.50/kWh · Factor: 0.82 kg CO₂e/kWh
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase font-mono text-[11px]">
                  <th className="py-3 px-4">Cabin Appliance / System</th>
                  <th className="py-3 px-3 text-right">Power (W)</th>
                  <th className="py-3 px-3 text-right">Hrs/Day</th>
                  <th className="py-3 px-3 text-right">Daily kWh</th>
                  <th className="py-3 px-3 text-right">Monthly kWh</th>
                  <th className="py-3 px-3 text-right">Daily Bill (₹)</th>
                  <th className="py-3 px-3 text-right">Monthly Bill (₹)</th>
                  <th className="py-3 px-4 text-right">Carbon (kg CO₂e/d)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {advisor.cabin.appliances.map((app) => (
                  <tr key={app.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{app.name}</div>
                      <div className="text-[11px] text-slate-500">{app.spec}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">{app.watts} W</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {app.dailyHours} hrs
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                      {app.dailyKWh.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {app.monthlyKWh.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-blue-700 font-semibold">
                      ₹{app.dailyBillRs.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-blue-800 font-bold">
                      ₹{app.monthlyBillRs.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {app.dailyCarbonKg.toFixed(2)} kg
                      <span className="block text-[10px] font-normal text-slate-500">
                        ({app.monthlyCarbonKg.toFixed(2)} kg/mo)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-mono text-xs font-bold">
                  <td className="py-3.5 px-4">TOTAL CABIN ({advisor.cabin.code})</td>
                  <td className="py-3.5 px-3 text-right">
                    {advisor.cabin.appliances.reduce((a, b) => a + b.watts, 0)} W
                  </td>
                  <td className="py-3.5 px-3 text-right">—</td>
                  <td className="py-3.5 px-3 text-right text-amber-300">
                    {cabinDailyKWh.toFixed(2)} kWh
                  </td>
                  <td className="py-3.5 px-3 text-right">{cabinMonthlyKWh.toFixed(2)} kWh</td>
                  <td className="py-3.5 px-3 text-right text-amber-300">
                    ₹{cabinDailyBillRs.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-amber-300">
                    ₹{cabinMonthlyBillRs.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-300">
                    {cabinDailyCarbonKg.toFixed(2)} kg/d ({cabinMonthlyCarbonKg.toFixed(1)} kg/mo)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MODE 3: CLASS CARBON EMISSION DETAILS
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6 w-full max-w-full">
      {renderAdvisorSelector()}

      {/* Class Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>
                {advisor.classInfo.sectionName} · {advisor.classInfo.classRoom}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {advisor.classInfo.sectionName} — Class Carbon Emission &amp; Electricity Details
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Class Advisor: <strong>{advisor.name}</strong> ({advisor.phone}) · Total Cohort
              Strength: <strong>{advisor.classInfo.totalStudents} Students</strong> · Classroom:{' '}
              <strong>{advisor.classInfo.classRoom}</strong>
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-xl p-4 min-w-[240px] space-y-1 text-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <span>Classroom Wi-Fi Telemetry</span>
            </div>
            <div className="font-bold text-white">{advisor.classInfo.wifiModel}</div>
            <div className="text-emerald-200 font-mono text-[11px]">
              AP ID: {advisor.classInfo.wifiApId} · {advisor.classInfo.bandwidthMbps} Mbps
            </div>
          </div>
        </div>
      </div>

      {/* 4 Class Carbon & Electricity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">Class Daily Carbon Emission</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600">
            {classDailyCarbonKg}{' '}
            <span className="text-xs font-normal text-slate-500">kg CO₂e/day</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Monthly: <strong className="text-slate-900">{classMonthlyCarbonKg} kg CO₂e/mo</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">Class Electricity Consumption</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {classDailyKWh} <span className="text-xs font-normal text-slate-500">kWh/day</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Monthly: <strong className="text-slate-900">{classMonthlyKWh} kWh/mo</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">Classroom Electricity Bill</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Gauge className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700">
            ₹{classDailyBillRs.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-500">/ day</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Monthly: <strong className="text-slate-900">₹{classMonthlyBillRs.toFixed(2)}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold">Per-Student Carbon Share</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {(classDailyCarbonKg / advisor.classInfo.totalStudents).toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-500">kg/student/d</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Across {advisor.classInfo.totalStudents} Students in {advisor.classInfo.classRoom}
          </div>
        </div>
      </div>

      {/* Classroom Equipment Carbon & Electricity Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {advisor.classInfo.classRoom} — Classroom Infrastructure Carbon &amp; Power Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Air conditioning, LED lighting, BLDC fans, student laptop cohort load, and Wi-Fi 6 router
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-semibold">
            Advisor: {advisor.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase font-mono text-[11px]">
                <th className="py-3 px-4">Classroom Equipment</th>
                <th className="py-3 px-3 text-right">Load (W)</th>
                <th className="py-3 px-3 text-right">Hrs/Day</th>
                <th className="py-3 px-3 text-right">Daily kWh</th>
                <th className="py-3 px-3 text-right">Monthly kWh</th>
                <th className="py-3 px-3 text-right">Daily Bill (₹)</th>
                <th className="py-3 px-3 text-right">Daily CO₂e</th>
                <th className="py-3 px-4 text-right">Monthly CO₂e</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {advisor.classInfo.equipment.map((eq) => (
                <tr key={eq.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{eq.name}</div>
                    <div className="text-[11px] text-slate-500">{eq.units}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">{eq.watts} W</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    {eq.dailyHours} hrs
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                    {eq.dailyKWh.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    {eq.monthlyKWh.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-blue-700 font-semibold">
                    ₹{eq.dailyBillRs.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                    {eq.dailyCarbonKg.toFixed(2)} kg
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {eq.monthlyCarbonKg.toFixed(2)} kg
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-mono text-xs font-bold">
                <td className="py-3.5 px-4">
                  TOTAL CLASS ({advisor.classInfo.sectionName})
                </td>
                <td className="py-3.5 px-3 text-right">
                  {advisor.classInfo.equipment.reduce((a, b) => a + b.watts, 0)} W
                </td>
                <td className="py-3.5 px-3 text-right">—</td>
                <td className="py-3.5 px-3 text-right text-amber-300">
                  {classDailyKWh.toFixed(2)} kWh
                </td>
                <td className="py-3.5 px-3 text-right">{classMonthlyKWh.toFixed(2)} kWh</td>
                <td className="py-3.5 px-3 text-right text-amber-300">
                  ₹{classDailyBillRs.toFixed(2)}
                </td>
                <td className="py-3.5 px-3 text-right text-rose-300">
                  {classDailyCarbonKg.toFixed(2)} kg/d
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-300">
                  {classMonthlyCarbonKg.toFixed(2)} kg/mo
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Student-Wise Carbon Emission Roster */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {advisor.classInfo.sectionName} — Student Laptop &amp; Carbon Emission Roster
            </h2>
            <p className="text-xs text-slate-500">
              Individual student computing power &amp; carbon emission audit under {advisor.name}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search student name or roll no..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase font-mono text-[11px]">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Section &amp; Hall</th>
                <th className="py-3 px-3 text-right">CGPA</th>
                <th className="py-3 px-3 text-right">Laptop Daily kWh</th>
                <th className="py-3 px-3 text-right">Daily Carbon (kg CO₂e)</th>
                <th className="py-3 px-4 text-right">Monthly Carbon (kg CO₂e)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((stu) => (
                <tr key={stu.rollNo} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700">{stu.rollNo}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{stu.name}</td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {advisor.shortSection} ({advisor.classInfo.classRoom})
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700">
                    {stu.cgpa}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                    {stu.laptopDailyKWh.toFixed(2)} kWh
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                    {stu.dailyCarbonKg.toFixed(2)} kg
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-900">
                    {stu.monthlyCarbonKg.toFixed(2)} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
