import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TRANSPORT_DATA } from '../data/campusDirectoryData';
import {
  Zap,
  Leaf,
  Wifi,
  Bus,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  Clock,
  Gauge,
  Activity,
  Fuel,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Fan,
  Laptop,
  Flame,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface StudentDashboardAddonProps {
  selectedSection?: string;
  initialModule?: 'all' | 'welcome_only' | 'class_bills' | 'lab_rates' | 'electricity_bills' | 'dayscholar' | 'ai_current';
  onNavigateTab?: (tab: string) => void;
}

export const StudentDashboardAddon: React.FC<StudentDashboardAddonProps> = ({
  selectedSection,
  initialModule = 'all',
  onNavigateTab,
}) => {
  const { currentUser } = useAuth();

  // Resolve student metadata
  const studentName = currentUser?.name || 'Rahul Kumar';
  const rollNo = currentUser?.employeeOrStudentId || '21CS001';
  const department = currentUser?.department || 'CSE';
  const classSection = currentUser?.classSection || 'IV Year CSE (Sec IV-A)';

  // Active sub-view or filter in student intelligence
  const [activeModule, setActiveModule] = useState<
    'all' | 'welcome_only' | 'class_bills' | 'lab_rates' | 'electricity_bills' | 'dayscholar' | 'ai_current'
  >(initialModule);

  React.useEffect(() => {
    if (initialModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule]);

  // Dayscholar transport state
  const [commuteMode, setCommuteMode] = useState<'collegebus' | 'by_own' | 'public'>('collegebus');
  const [selectedBusIndex, setSelectedBusIndex] = useState(0); // Bus No. 01 by default
  const [selectedStop, setSelectedStop] = useState('Gandhigramam');
  const [ownVehicleType, setOwnVehicleType] = useState<'two_wheeler' | 'car' | 'ev_bike'>('two_wheeler');
  const [oneWayKm, setOneWayKm] = useState(18); // 18 km one-way = 36 km roundtrip

  // Selected Lab for inspection
  const [selectedLabId, setSelectedLabId] = useState('cse-lab-01');

  // AI Current Assistant state
  const [aiAnalysisType, setAiAnalysisType] = useState<'all' | 'classroom' | 'labs' | 'commute'>('all');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // College buses from transport data
  const busList = TRANSPORT_DATA.buses || [];
  const currentBus = busList[selectedBusIndex] || busList[0];

  // Classroom Electrical & Wi-Fi Telemetry breakdown (CS Seminar Hall 401 / 402)
  const classEquipmentBills = {
    room: classSection.includes('IV-B') ? 'CS Seminar Hall 402' : 'CS Seminar Hall 401',
    advisor: classSection.includes('IV-B') ? 'Prof. A. Selvanayagi' : 'Prof. Ananthi',
    advisorPhone: classSection.includes('IV-B') ? '+91 94435 50106' : '+91 94435 50105',
    tariffRatePerKWh: 8.50, // TANGEDCO HT educational rate ₹/kWh
    ac: {
      units: '2 x 2.0 Ton Inverter Split AC Units',
      powerWatts: 3600,
      dailyHours: 5.0,
      dailyKWh: 18.0,
      monthlyKWh: 450.0,
      dailyBillRs: +(18.0 * 8.50).toFixed(2), // ₹153.00
      monthlyBillRs: +(450.0 * 8.50).toFixed(2), // ₹3,825.00
      carbonDailyKg: +(18.0 * 0.82).toFixed(2), // 14.76 kg CO2e
      monthlyCarbonKg: +(450.0 * 0.82).toFixed(2),
    },
    lights: {
      units: '12 x 28W High-Efficiency LED Batten Fixtures',
      powerWatts: 336,
      dailyHours: 8.0,
      dailyKWh: 2.69,
      monthlyKWh: 67.25,
      dailyBillRs: +(2.69 * 8.50).toFixed(2), // ₹22.87
      monthlyBillRs: +(67.25 * 8.50).toFixed(2), // ₹571.63
      carbonDailyKg: +(2.69 * 0.82).toFixed(2), // 2.21 kg CO2e
      monthlyCarbonKg: +(67.25 * 0.82).toFixed(2),
    },
    fans: {
      units: '8 x 55W BLDC Energy-Saving Ceiling Fans',
      powerWatts: 440,
      dailyHours: 8.0,
      dailyKWh: 3.52,
      monthlyKWh: 88.0,
      dailyBillRs: +(3.52 * 8.50).toFixed(2), // ₹29.92
      monthlyBillRs: +(88.0 * 8.50).toFixed(2), // ₹748.00
      carbonDailyKg: +(3.52 * 0.82).toFixed(2), // 2.89 kg CO2e
      monthlyCarbonKg: +(88.0 * 0.82).toFixed(2),
    },
    systems: {
      units: 'Class Cohort Computing Rig / Laptops (84 Students active)',
      avgWattsPerStudent: 65,
      dailyHours: 6.0,
      dailyKWhTotal: 32.76, // 84 students share
      dailyKWhPerStudent: 0.39,
      monthlyKWhTotal: 819.0,
      dailyBillRs: +(32.76 * 8.50).toFixed(2), // ₹278.46 total
      studentShareDailyRs: +(0.39 * 8.50).toFixed(2), // ₹3.32
      monthlyBillRs: +(819.0 * 8.50).toFixed(2),
      carbonDailyKg: +(32.76 * 0.82).toFixed(2), // 26.86 kg CO2e total
      monthlyCarbonKg: +(819.0 * 0.82).toFixed(2),
    },
    wifi: {
      apId: 'MKCE-AP-CSE-401',
      model: 'Aruba AP-555 Enterprise Wi-Fi 6 Dedicated',
      ssid: 'MKCE-CAMPUS-WIFI-6',
      bandwidthMbps: 750,
      dailyHours: 24,
      dailyKWh: 0.54,
      monthlyKWh: 16.2,
      dailyBillRs: +(0.54 * 8.50).toFixed(2), // ₹4.59
      monthlyBillRs: +(16.2 * 8.50).toFixed(2), // ₹137.70
      carbonDailyKg: +(0.54 * 0.82).toFixed(2), // 0.44 kg CO2e
      monthlyCarbonKg: +(16.2 * 0.82).toFixed(2),
    },
  };

  const totalClassDailyKWh = +(
    classEquipmentBills.ac.dailyKWh +
    classEquipmentBills.lights.dailyKWh +
    classEquipmentBills.fans.dailyKWh +
    classEquipmentBills.systems.dailyKWhTotal +
    classEquipmentBills.wifi.dailyKWh
  ).toFixed(2);

  const totalClassDailyBillRs = +(
    classEquipmentBills.ac.dailyBillRs +
    classEquipmentBills.lights.dailyBillRs +
    classEquipmentBills.fans.dailyBillRs +
    classEquipmentBills.systems.dailyBillRs +
    classEquipmentBills.wifi.dailyBillRs
  ).toFixed(2);

  const totalClassMonthlyBillRs = +(totalClassDailyBillRs * 25).toFixed(2);
  const totalClassDailyCarbon = +(totalClassDailyKWh * 0.82).toFixed(2);

  // Labs in CSE
  const cseLabs = [
    {
      id: 'cse-lab-01',
      name: 'CSE LAB 1 (Core Computing & R&D)',
      code: 'CS-LAB-01',
      location: 'CS Block 1st Floor Room 108',
      incharge: 'Dr. Pradeep D (HOD CSE)',
      currentTaking: {
        voltageVolts: 415,
        phase: '3-Phase AC 50Hz',
        liveAmperes: 52.4,
        peakDemandKVA: 26.2,
        powerFactor: 0.95,
        breakerRatingAmps: 100,
        dailyTotalKWh: 88.5,
        monthlyTotalKWh: 2212.5,
        dailyBillRs: +(88.5 * 8.50).toFixed(2),
        monthlyBillRs: +(2212.5 * 8.50).toFixed(2),
        dailyCarbonKg: 72.57,
      },
      ac: {
        specs: '4 x 3.0 Ton Daikin Inverter Cassette AC Units',
        dailyKWh: 24.5,
        dailyBillRs: +(24.5 * 8.50).toFixed(2),
        carbonDailyKg: 20.09,
      },
      lights: {
        specs: '24 x 36W Recessed LED Grid Panels',
        dailyKWh: 6.2,
        dailyBillRs: +(6.2 * 8.50).toFixed(2),
        carbonDailyKg: 5.08,
      },
      fans: {
        specs: '12 x High-Airflow Commercial Wall-Mount Fans',
        dailyKWh: 5.8,
        dailyBillRs: +(5.8 * 8.50).toFixed(2),
        carbonDailyKg: 4.76,
      },
      systems: {
        specs: '72 x Dell OptiPlex 7090 (Core i7-11700, 16GB RAM, Fast SSDs)',
        dailyKWh: 58.3,
        dailyBillRs: +(58.3 * 8.50).toFixed(2),
        carbonDailyKg: 47.81,
      },
      wifi: {
        specs: 'MKCE-AP-CSE-01 (Aruba AP-555, Wi-Fi 6, 750 Mbps)',
        dailyKWh: 0.54,
        dailyBillRs: +(0.54 * 8.50).toFixed(2),
        carbonDailyKg: 0.44,
      },
    },
    {
      id: 'cse-lab-virtusa',
      name: 'VIRTUSA LAB (Industry Center of Excellence)',
      code: 'CS-VIRTUSA-01',
      location: 'CS Block 2nd Floor Room 220',
      incharge: 'Prof. Ananthi (Virtusa Industry CoE Coordinator)',
      currentTaking: {
        voltageVolts: 415,
        phase: '3-Phase AC',
        liveAmperes: 46.8,
        peakDemandKVA: 23.4,
        powerFactor: 0.97,
        breakerRatingAmps: 80,
        dailyTotalKWh: 74.5,
        monthlyTotalKWh: 1862.5,
        dailyBillRs: +(74.5 * 8.50).toFixed(2),
        monthlyBillRs: +(1862.5 * 8.50).toFixed(2),
        dailyCarbonKg: 61.09,
      },
      ac: {
        specs: '3 x 3.0 Ton Split Inverter Units',
        dailyKWh: 21.0,
        dailyBillRs: +(21.0 * 8.50).toFixed(2),
        carbonDailyKg: 17.22,
      },
      lights: {
        specs: '18 x 36W LED Softlight Luminaires',
        dailyKWh: 5.2,
        dailyBillRs: +(5.2 * 8.50).toFixed(2),
        carbonDailyKg: 4.26,
      },
      fans: {
        specs: '8 x BLDC Wall Circulation Blowers',
        dailyKWh: 3.8,
        dailyBillRs: +(3.8 * 8.50).toFixed(2),
        carbonDailyKg: 3.12,
      },
      systems: {
        specs: '60 x HP EliteDesk 800 G8 (Cloud & Full-Stack Deployment Units)',
        dailyKWh: 50.4,
        dailyBillRs: +(50.4 * 8.50).toFixed(2),
        carbonDailyKg: 41.33,
      },
      wifi: {
        specs: 'MKCE-AP-VIRTUSA-01 (Wi-Fi 6 Dedicated, 800 Mbps)',
        dailyKWh: 0.52,
        dailyBillRs: +(0.52 * 8.50).toFixed(2),
        carbonDailyKg: 0.43,
      },
    },
    {
      id: 'cse-lab-rd',
      name: 'CSE R&D LAB (DeepTech & AI Workstations)',
      code: 'CS-RD-01',
      location: 'CS Block 2nd Floor Room 210',
      incharge: 'Dr. Padmini Devi (AHOD CSE)',
      currentTaking: {
        voltageVolts: 415,
        phase: '3-Phase AC',
        liveAmperes: 48.2,
        peakDemandKVA: 24.1,
        powerFactor: 0.96,
        breakerRatingAmps: 80,
        dailyTotalKWh: 82.0,
        monthlyTotalKWh: 2050.0,
        dailyBillRs: +(82.0 * 8.50).toFixed(2),
        monthlyBillRs: +(2050.0 * 8.50).toFixed(2),
        dailyCarbonKg: 67.24,
      },
      ac: {
        specs: '3 x 3.0 Ton Precision Cooling Units',
        dailyKWh: 23.5,
        dailyBillRs: +(23.5 * 8.50).toFixed(2),
        carbonDailyKg: 19.27,
      },
      lights: {
        specs: '16 x 36W LED Panels',
        dailyKWh: 4.8,
        dailyBillRs: +(4.8 * 8.50).toFixed(2),
        carbonDailyKg: 3.94,
      },
      fans: {
        specs: '6 x BLDC Auxiliary Wall Fans',
        dailyKWh: 2.8,
        dailyBillRs: +(2.8 * 8.50).toFixed(2),
        carbonDailyKg: 2.30,
      },
      systems: {
        specs: '55 x HP Z2 Tower Rigs with RTX 3060 Dedicated Compute GPUs',
        dailyKWh: 59.4,
        dailyBillRs: +(59.4 * 8.50).toFixed(2),
        carbonDailyKg: 48.71,
      },
      wifi: {
        specs: 'MKCE-AP-CSE-RD-01 (680 Mbps Ultra-low Latency)',
        dailyKWh: 0.48,
        dailyBillRs: +(0.48 * 8.50).toFixed(2),
        carbonDailyKg: 0.39,
      },
    },
  ];

  const selectedLab = cseLabs.find((l) => l.id === selectedLabId) || cseLabs[0];

  // Dayscholar Calculations
  // College Bus Telemetry
  const busDailyKm = oneWayKm * 2; // roundtrip (e.g. 36 km)
  const busTotalPassengers = 45; // average seating
  const busFuelEfficiency = currentBus.travelEmissions?.efficiencyKmPerLitre || 4.0; // km/L
  const busDieselRate = currentBus.dieselRatePerLitre || 94.50; // ₹/L
  const busTotalDailyLitres = +(busDailyKm / busFuelEfficiency).toFixed(2);
  const busStudentShareLitres = +(busTotalDailyLitres / busTotalPassengers).toFixed(3);
  const busStudentDailyFuelBill = +(busStudentShareLitres * busDieselRate).toFixed(2);
  const busStudentMonthlyFuelBill = +(busStudentDailyFuelBill * 25).toFixed(2);
  const busStudentMonthlyPassFee = 2400.0; // institutional bus pass
  // GHG emissions: Diesel factor 2.68 kg CO2e / Litre
  const busStudentDailyCarbonKg = +(busStudentShareLitres * 2.68).toFixed(2); // ~1.07 kg CO2e
  const busStudentMonthlyCarbonKg = +(busStudentDailyCarbonKg * 25).toFixed(1);
  const busGhgRatePerKm = +((busStudentDailyCarbonKg * 1000) / busDailyKm).toFixed(1); // g CO2e / km

  // By Own Vehicle Telemetry
  const ownDailyKm = oneWayKm * 2; // roundtrip: home -> college -> home
  const petrolRatePerLitre = 102.80; // Tamil Nadu current petrol rate
  let ownMileage = 45.0; // km / L for 2-wheeler
  let ownEmissionFactor = 2.31; // kg CO2e per Litre of Petrol
  let ownVehicleName = 'Two-Wheeler (Motorcycle / Scooter)';

  if (ownVehicleType === 'car') {
    ownMileage = 15.0;
    ownVehicleName = 'Private Car (Petrol Hatchback / Sedan)';
  } else if (ownVehicleType === 'ev_bike') {
    ownMileage = 999;
    ownEmissionFactor = 0.05; // clean grid
    ownVehicleName = 'Electric Two-Wheeler (EV Scooter)';
  }

  const ownDailyLitres = ownVehicleType === 'ev_bike' ? 0 : +(ownDailyKm / ownMileage).toFixed(2);
  const ownDailyPetrolBill = ownVehicleType === 'ev_bike'
    ? 9.50 // charging electricity cost
    : +(ownDailyLitres * petrolRatePerLitre).toFixed(2);
  const ownMonthlyPetrolBill = +(ownDailyPetrolBill * 25).toFixed(2);

  // Carbon release rate
  const ownDailyCarbonKg = ownVehicleType === 'ev_bike'
    ? 0.28 // EV grid emission
    : +(ownDailyLitres * ownEmissionFactor).toFixed(2);
  const ownMonthlyCarbonKg = +(ownDailyCarbonKg * 25).toFixed(1);
  const ownGhgRatePerKm = +((ownDailyCarbonKg * 1000) / ownDailyKm).toFixed(1);

  // Handle trigger AI advice
  const handleRegenerateAi = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
    }, 600);
  };

  if (activeModule === 'welcome_only') {
    return (
      <div className="w-full max-w-full overflow-hidden">
        {/* 1. Personalized Student Welcome Banner with Red Color Background */}
        <div className="relative bg-gradient-to-r from-red-800 via-rose-800 to-red-950 text-white rounded-2xl p-5 sm:p-7 shadow-xl overflow-hidden border border-red-700/60 ring-1 ring-red-500/30">
          {/* Abstract background decorative shapes */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-32 top-0 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>STUDENT CARBON & CURRENT INTELLIGENCE</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {studentName}!
              </h1>
              <p className="text-xs sm:text-sm text-rose-100 max-w-3xl leading-relaxed">
                Enrolled: <strong className="text-white font-mono">{rollNo}</strong> · Section:{' '}
                <strong className="text-white">{classSection}</strong> · Room:{' '}
                <strong className="text-white">{classEquipmentBills.room}</strong> · Advisor:{' '}
                <strong className="text-white">{classEquipmentBills.advisor}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* 1. Personalized Student Welcome Banner with Red Color Background */}
      <div className="relative bg-gradient-to-r from-red-800 via-rose-800 to-red-950 text-white rounded-2xl p-5 sm:p-7 shadow-xl overflow-hidden border border-red-700/60 ring-1 ring-red-500/30">
        {/* Abstract background decorative shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>STUDENT CARBON & CURRENT INTELLIGENCE</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {studentName}!
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-3xl leading-relaxed">
              Enrolled: <strong className="text-white font-mono">{rollNo}</strong> · Section:{' '}
              <strong className="text-white">{classSection}</strong> · Room:{' '}
              <strong className="text-white">{classEquipmentBills.room}</strong> · Advisor:{' '}
              <strong className="text-white">{classEquipmentBills.advisor}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Individual Class Report of Electric Bills & Wi-Fi Bills */}
      {(activeModule === 'all' || activeModule === 'class_bills' || activeModule === 'electricity_bills') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Building className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Individual Class Report: Electricity & Wi-Fi Bills
                  </h2>
                  <p className="text-xs text-slate-500">
                    Detailed utility cost breakdown distinguishing AC, Light, Fan, System & Wi-Fi bills
                    for <strong className="text-slate-700">{classEquipmentBills.room}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                Tariff: ₹{classEquipmentBills.tariffRatePerKWh.toFixed(2)}/kWh
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                Daily Class Bill: ₹{totalClassDailyBillRs}
              </span>
            </div>
          </div>

          {/* 5 Distinct Bill Cards: AC, Light, Fan, System, Wi-Fi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. AC BILL */}
            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    AC Bill
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-200/70 text-sky-900">
                    Air Conditioner
                  </span>
                </div>
                <div className="mt-2 text-xl font-extrabold text-sky-950 font-mono">
                  ₹{classEquipmentBills.ac.dailyBillRs}
                  <span className="text-xs font-normal text-sky-700"> /day</span>
                </div>
                <div className="text-[11px] text-sky-800 mt-0.5 font-medium">
                  Monthly: <strong>₹{classEquipmentBills.ac.monthlyBillRs}</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-sky-200/60 text-[10px] text-slate-600 space-y-1">
                <div>{classEquipmentBills.ac.units}</div>
                <div className="font-mono">
                  Power: {classEquipmentBills.ac.dailyKWh} kWh/day · {classEquipmentBills.ac.carbonDailyKg} kg CO2e
                </div>
              </div>
            </div>

            {/* 2. LIGHT BILL */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    Light Bill
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900">
                    Luminaires
                  </span>
                </div>
                <div className="mt-2 text-xl font-extrabold text-amber-950 font-mono">
                  ₹{classEquipmentBills.lights.dailyBillRs}
                  <span className="text-xs font-normal text-amber-700"> /day</span>
                </div>
                <div className="text-[11px] text-amber-800 mt-0.5 font-medium">
                  Monthly: <strong>₹{classEquipmentBills.lights.monthlyBillRs}</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-[10px] text-slate-600 space-y-1">
                <div>{classEquipmentBills.lights.units}</div>
                <div className="font-mono">
                  Power: {classEquipmentBills.lights.dailyKWh} kWh/day · {classEquipmentBills.lights.carbonDailyKg} kg CO2e
                </div>
              </div>
            </div>

            {/* 3. FAN BILL */}
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                    <Fan className="w-3.5 h-3.5 text-teal-600" />
                    Fan Bill
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-200/70 text-teal-900">
                    Circulation
                  </span>
                </div>
                <div className="mt-2 text-xl font-extrabold text-teal-950 font-mono">
                  ₹{classEquipmentBills.fans.dailyBillRs}
                  <span className="text-xs font-normal text-teal-700"> /day</span>
                </div>
                <div className="text-[11px] text-teal-800 mt-0.5 font-medium">
                  Monthly: <strong>₹{classEquipmentBills.fans.monthlyBillRs}</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-teal-200/60 text-[10px] text-slate-600 space-y-1">
                <div>{classEquipmentBills.fans.units}</div>
                <div className="font-mono">
                  Power: {classEquipmentBills.fans.dailyKWh} kWh/day · {classEquipmentBills.fans.carbonDailyKg} kg CO2e
                </div>
              </div>
            </div>

            {/* 4. SYSTEM / COMPUTING BILL */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                    System Bill
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-200/70 text-indigo-900">
                    Laptops / Rigs
                  </span>
                </div>
                <div className="mt-2 text-xl font-extrabold text-indigo-950 font-mono">
                  ₹{classEquipmentBills.systems.studentShareDailyRs}
                  <span className="text-xs font-normal text-indigo-700"> /student</span>
                </div>
                <div className="text-[11px] text-indigo-800 mt-0.5 font-medium">
                  Class Total: <strong>₹{classEquipmentBills.systems.dailyBillRs}/day</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-indigo-200/60 text-[10px] text-slate-600 space-y-1">
                <div>{classEquipmentBills.systems.units}</div>
                <div className="font-mono">
                  Your Laptop: {classEquipmentBills.systems.dailyKWhPerStudent} kWh/day
                </div>
              </div>
            </div>

            {/* 5. WI-FI BILL */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-purple-600" />
                    Wi-Fi Bill
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-200/70 text-purple-900">
                    Campus Fiber
                  </span>
                </div>
                <div className="mt-2 text-xl font-extrabold text-purple-950 font-mono">
                  ₹{classEquipmentBills.wifi.dailyBillRs}
                  <span className="text-xs font-normal text-purple-700"> /day</span>
                </div>
                <div className="text-[11px] text-purple-800 mt-0.5 font-medium">
                  Monthly: <strong>₹{classEquipmentBills.wifi.monthlyBillRs}</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-purple-200/60 text-[10px] text-slate-600 space-y-1">
                <div>{classEquipmentBills.wifi.model}</div>
                <div className="font-mono">
                  Speed: {classEquipmentBills.wifi.bandwidthMbps} Mbps · {classEquipmentBills.wifi.carbonDailyKg} kg CO2e
                </div>
              </div>
            </div>
          </div>

          {/* Progress / Share Meter */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Classroom Energy Share Breakdown</span>
              <span className="font-mono text-slate-500">
                Total Daily Load: <strong>{totalClassDailyKWh} kWh</strong> · Monthly Bill: <strong>₹{totalClassMonthlyBillRs}</strong>
              </span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full flex overflow-hidden">
              <div style={{ width: '31%' }} className="bg-sky-500" title="AC: 31%" />
              <div style={{ width: '5%' }} className="bg-amber-500" title="Lights: 5%" />
              <div style={{ width: '6%' }} className="bg-teal-500" title="Fans: 6%" />
              <div style={{ width: '56%' }} className="bg-indigo-600" title="Systems: 56%" />
              <div style={{ width: '2%' }} className="bg-purple-500" title="Wi-Fi: 2%" />
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" /> AC (31%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Lights (5%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-500 inline-block" /> Fans (6%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" /> Systems (56%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" /> Wi-Fi (2%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Lab Electricity Rates with Distinguishing AC, Light, Fan & System Bills + Live Current */}
      {(activeModule === 'all' || activeModule === 'lab_rates' || activeModule === 'electricity_bills') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Department Lab Electricity Rates & Electrical Current Taking
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live current (Amperes), voltage, power factor and itemized utility bills across CSE department labs
                  </p>
                </div>
              </div>
            </div>

            {/* Select which lab with Full Lab Names displayed */}
            <div className="flex flex-wrap items-center gap-1.5">
              {cseLabs.map((l) => {
                const isCurrent = l.id === selectedLabId;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLabId(l.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-indigo-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCurrent ? 'bg-emerald-300 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Taking Meters (Voltage, Amperes, Power Factor, Breaker) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-400" />
                Live Electrical Telemetry · <span className="underline decoration-amber-400/50">{selectedLab.name}</span> ({selectedLab.code})
              </span>
              <span className="font-mono text-emerald-300 text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 w-fit">
                ● 3-Phase Bus Live · {selectedLab.location}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Live Current</div>
                <div className="text-lg font-extrabold text-amber-300 font-mono">
                  {selectedLab.currentTaking.liveAmperes} A
                </div>
                <div className="text-[10px] text-slate-400">Phase Amperage</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Line Voltage</div>
                <div className="text-lg font-extrabold text-white font-mono">
                  {selectedLab.currentTaking.voltageVolts} V
                </div>
                <div className="text-[10px] text-slate-400">3-Phase 50 Hz</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Peak Demand</div>
                <div className="text-lg font-extrabold text-indigo-300 font-mono">
                  {selectedLab.currentTaking.peakDemandKVA} kVA
                </div>
                <div className="text-[10px] text-slate-400">Connected Load</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Power Factor</div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono">
                  {selectedLab.currentTaking.powerFactor}
                </div>
                <div className="text-[10px] text-slate-400">APFC Capacitor Bank</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Breaker Rating</div>
                <div className="text-lg font-extrabold text-purple-300 font-mono">
                  {selectedLab.currentTaking.breakerRatingAmps} A
                </div>
                <div className="text-[10px] text-slate-400">Schneider MCCB</div>
              </div>
            </div>
          </div>

          {/* Distinguishing AC, Light, Fan, System & Wi-Fi Bills in the Lab with Explicit Lab Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Lab AC Bill */}
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-sky-800 font-bold block truncate max-w-[150px]">
                    {selectedLab.name}
                  </span>
                  <span className="text-xs font-bold text-sky-950">AC Electricity Bill</span>
                </div>
                <span className="text-[10px] font-mono text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                  {selectedLab.ac.dailyKWh} kWh/day
                </span>
              </div>
              <div className="text-lg font-extrabold text-sky-950 font-mono">
                ₹{selectedLab.ac.dailyBillRs}
                <span className="text-xs font-normal text-sky-700"> /day</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{selectedLab.ac.specs}</p>
              <div className="text-[10px] font-mono text-sky-800">
                Carbon: <strong>{selectedLab.ac.carbonDailyKg} kg CO2e/day</strong>
              </div>
            </div>

            {/* Lab Lights & Fans Bill */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-teal-800 font-bold block truncate max-w-[150px]">
                    {selectedLab.name}
                  </span>
                  <span className="text-xs font-bold text-teal-950">Lights & Fans Bill</span>
                </div>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                  {+(selectedLab.lights.dailyKWh + selectedLab.fans.dailyKWh).toFixed(1)} kWh/day
                </span>
              </div>
              <div className="text-lg font-extrabold text-teal-950 font-mono">
                ₹{+(selectedLab.lights.dailyBillRs + selectedLab.fans.dailyBillRs).toFixed(2)}
                <span className="text-xs font-normal text-teal-700"> /day</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {selectedLab.lights.specs} + {selectedLab.fans.specs}
              </p>
              <div className="text-[10px] font-mono text-teal-800">
                Carbon:{' '}
                <strong>
                  {+(selectedLab.lights.carbonDailyKg + selectedLab.fans.carbonDailyKg).toFixed(2)} kg CO2e/day
                </strong>
              </div>
            </div>

            {/* Lab Workstation Systems Bill */}
            <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-800 font-bold block truncate max-w-[150px]">
                    {selectedLab.name}
                  </span>
                  <span className="text-xs font-bold text-indigo-950">Workstations Bill</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                  {selectedLab.systems.dailyKWh} kWh/day
                </span>
              </div>
              <div className="text-lg font-extrabold text-indigo-950 font-mono">
                ₹{selectedLab.systems.dailyBillRs}
                <span className="text-xs font-normal text-indigo-700"> /day</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{selectedLab.systems.specs}</p>
              <div className="text-[10px] font-mono text-indigo-800">
                Carbon: <strong>{selectedLab.systems.carbonDailyKg} kg CO2e/day</strong>
              </div>
            </div>

            {/* Lab Wi-Fi Bill */}
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-800 font-bold block truncate max-w-[150px]">
                    {selectedLab.name}
                  </span>
                  <span className="text-xs font-bold text-purple-950">Lab Wi-Fi Bill</span>
                </div>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                  {selectedLab.wifi.dailyKWh} kWh/day
                </span>
              </div>
              <div className="text-lg font-extrabold text-purple-950 font-mono">
                ₹{selectedLab.wifi.dailyBillRs}
                <span className="text-xs font-normal text-purple-700"> /day</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{selectedLab.wifi.specs}</p>
              <div className="text-[10px] font-mono text-purple-800">
                Carbon: <strong>{selectedLab.wifi.carbonDailyKg} kg CO2e/day</strong>
              </div>
            </div>
          </div>

          {/* Complete Department Lab Names & Electricity Bills Comparison Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                <span className="text-xs font-bold text-slate-800">
                  CSE Department Labs Electricity Rates & Power Bills Summary
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                TANGEDCO Educational HT: ₹8.50 / kWh
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 text-[11px] font-mono text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Lab Name & Code</th>
                    <th className="py-2.5 px-3">Location & Incharge</th>
                    <th className="py-2.5 px-3 text-right">3-Phase Current</th>
                    <th className="py-2.5 px-3 text-right">Daily Power</th>
                    <th className="py-2.5 px-3 text-right">AC Bill</th>
                    <th className="py-2.5 px-3 text-right">Workstations Bill</th>
                    <th className="py-2.5 px-3 text-right">Total Daily Bill</th>
                    <th className="py-2.5 px-3 text-right">Monthly Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cseLabs.map((lab) => {
                    const isRowSelected = lab.id === selectedLabId;
                    return (
                      <tr
                        key={lab.id}
                        onClick={() => setSelectedLabId(lab.id)}
                        className={`cursor-pointer transition-colors ${
                          isRowSelected ? 'bg-indigo-50/80 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {isRowSelected && <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />}
                            {lab.name}
                          </div>
                          <div className="text-[10px] font-mono text-indigo-700">{lab.code}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          <div>{lab.location}</div>
                          <div className="text-[10px] text-slate-500">{lab.incharge}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-amber-700 font-bold">
                          {lab.currentTaking.liveAmperes} A
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700">
                          {lab.currentTaking.dailyTotalKWh} kWh
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-sky-700">
                          ₹{lab.ac.dailyBillRs}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-indigo-700">
                          ₹{lab.systems.dailyBillRs}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-900 font-bold">
                          ₹{lab.currentTaking.dailyBillRs}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">
                          ₹{lab.currentTaking.monthlyBillRs.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Dayscholar & Commute Carbon Intelligence (College Bus vs By Own vs Public Transport) */}
      {(activeModule === 'all' || activeModule === 'dayscholar') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Bus className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Dayscholar Commute, Petrol & Greenhouse Gas Telemetry
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track travel emissions, diesel/petrol consumption rates, and bills from home/stop to college and back
                  </p>
                </div>
              </div>
            </div>

            {/* Commute Mode Selector */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setCommuteMode('collegebus')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  commuteMode === 'collegebus'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>1. College Bus</span>
              </button>
              <button
                onClick={() => setCommuteMode('by_own')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  commuteMode === 'by_own'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>2. By Own Vehicle</span>
              </button>
              <button
                onClick={() => setCommuteMode('public')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  commuteMode === 'public'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>3. Public / Hostel</span>
              </button>
            </div>
          </div>

          {/* MODE 1: COLLEGE BUS */}
          {commuteMode === 'collegebus' && (
            <div className="space-y-4">
              {/* Bus Selector Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Assigned College Bus:
                  </label>
                  <select
                    value={selectedBusIndex}
                    onChange={(e) => setSelectedBusIndex(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-amber-500"
                  >
                    {busList.map((bus, idx) => (
                      <option key={bus.id} value={idx}>
                        {bus.busNumber} — {bus.route}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Designated Bus Stop:
                  </label>
                  <select
                    value={selectedStop}
                    onChange={(e) => setSelectedStop(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-amber-500"
                  >
                    {(currentBus.viaStops || []).map((stop) => (
                      <option key={stop} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    One-Way Commute Distance (km):
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="65"
                    value={oneWayKm}
                    onChange={(e) => setOneWayKm(Math.max(2, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 shadow-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Bus Details Summary Banner */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Bus Number & Code:</span>
                  <div className="font-bold text-amber-950 font-mono text-sm">
                    {currentBus.busNumber} ({currentBus.busCode})
                  </div>
                  <div className="text-[10px] text-slate-600">Reg: {currentBus.registrationNo}</div>
                </div>
                <div>
                  <span className="text-slate-500">Route & Driver:</span>
                  <div className="font-semibold text-slate-900 truncate">{currentBus.route}</div>
                  <div className="text-[10px] text-slate-600">Driver: {currentBus.driver.name} ({currentBus.driver.phone})</div>
                </div>
                <div>
                  <span className="text-slate-500">Boarding / Drop Stop:</span>
                  <div className="font-bold text-amber-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{selectedStop}</span>
                  </div>
                  <div className="text-[10px] text-slate-600">Roundtrip: {busDailyKm} km/day</div>
                </div>
                <div>
                  <span className="text-slate-500">Fuel Tariff & Billing:</span>
                  <div className="font-bold text-emerald-800 font-mono">
                    Diesel @ ₹{busDieselRate.toFixed(2)}/L
                  </div>
                  <div className="text-[10px] text-slate-600">Bus Pass: ₹{busStudentMonthlyPassFee}/month</div>
                </div>
              </div>

              {/* Specific Bills & Greenhouse Gas Rate Generated */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700">Specific Student Fuel & Utility Bill</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    ₹{busStudentDailyFuelBill}
                    <span className="text-xs font-normal text-slate-500"> /day</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Monthly Fuel Share: <strong>₹{busStudentMonthlyFuelBill}</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Calculated for {busDailyKm} km roundtrip ({currentBus.travelEmissions?.efficiencyKmPerLitre} km/L diesel efficiency).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700">Commute Carbon Generated</div>
                  <div className="text-2xl font-black text-amber-700 font-mono">
                    {busStudentDailyCarbonKg}
                    <span className="text-xs font-normal text-slate-500"> kg CO2e/day</span>
                  </div>
                  <div className="text-xs text-amber-900 font-medium">
                    Monthly Fleet Carbon: <strong>{busStudentMonthlyCarbonKg} kg CO2e</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Emission factor: 2.68 kg CO2e per Litre of diesel. Shared across 45 passengers.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700">Greenhouse Gases Release Rate</div>
                  <div className="text-2xl font-black text-indigo-700 font-mono">
                    {busGhgRatePerKm}
                    <span className="text-xs font-normal text-slate-500"> g CO2e / km</span>
                  </div>
                  <div className="text-xs text-indigo-900 font-medium space-x-1.5">
                    <span>CO2: 98.2%</span>
                    <span>·</span>
                    <span>N2O: 1.1%</span>
                    <span>·</span>
                    <span>CH4: 0.7%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    High collective occupancy saves ~65% carbon compared to individual two-wheelers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: BY OWN / PRIVATE VEHICLE */}
          {commuteMode === 'by_own' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Mode of Private Vehicle:
                  </label>
                  <select
                    value={ownVehicleType}
                    onChange={(e) => setOwnVehicleType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="two_wheeler">Two-Wheeler (Motorcycle / Scooter - 45 km/L)</option>
                    <option value="car">Private Car (Petrol Hatchback - 15 km/L)</option>
                    <option value="ev_bike">Electric Scooter (EV Bike - Zero Direct Tailpipe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    From Stop / Home:
                  </label>
                  <input
                    type="text"
                    value={selectedStop}
                    onChange={(e) => setSelectedStop(e.target.value)}
                    placeholder="e.g. Gandhigramam / Karur City"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    One-Way Distance to College (km):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={oneWayKm}
                    onChange={(e) => setOneWayKm(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 shadow-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Private Commute Route & Rate Banner */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Mode of Vehicle:</span>
                  <div className="font-bold text-blue-950 font-mono text-sm">{ownVehicleName}</div>
                  <div className="text-[10px] text-slate-600">Private Transportation</div>
                </div>
                <div>
                  <span className="text-slate-500">Commute Route:</span>
                  <div className="font-semibold text-slate-900">
                    {selectedStop} ⇄ MKCE Campus
                  </div>
                  <div className="text-[10px] text-slate-600">
                    To college: {oneWayKm} km · To home: {oneWayKm} km (Roundtrip: {ownDailyKm} km)
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Petrol Rate (Tamil Nadu):</span>
                  <div className="font-bold text-slate-900 font-mono text-sm">
                    ₹{petrolRatePerLitre.toFixed(2)} / Litre
                  </div>
                  <div className="text-[10px] text-slate-600">Mileage: {ownMileage} km/L</div>
                </div>
                <div>
                  <span className="text-slate-500">Daily Fuel Consumed:</span>
                  <div className="font-bold text-blue-900 font-mono text-sm">
                    {ownDailyLitres} Litres/day
                  </div>
                  <div className="text-[10px] text-slate-600">
                    To college: {+(ownDailyLitres / 2).toFixed(2)}L · To home: {+(ownDailyLitres / 2).toFixed(2)}L
                  </div>
                </div>
              </div>

              {/* Petrol Rate & Carbon Release Rate Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700">Daily Petrol Cost / Bill</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    ₹{ownDailyPetrolBill}
                    <span className="text-xs font-normal text-slate-500"> /day</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Monthly Petrol Bill: <strong>₹{ownMonthlyPetrolBill}</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Expense to come from home to college and go from college to home.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700">Carbon Generated</div>
                  <div className="text-2xl font-black text-rose-700 font-mono">
                    {ownDailyCarbonKg}
                    <span className="text-xs font-normal text-slate-500"> kg CO2e/day</span>
                  </div>
                  <div className="text-xs text-rose-900 font-medium">
                    Monthly Release: <strong>{ownMonthlyCarbonKg} kg CO2e</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Petrol emission factor: 2.31 kg CO2e per Litre.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700">Greenhouse Gases Release Rate</div>
                  <div className="text-2xl font-black text-amber-700 font-mono">
                    {ownGhgRatePerKm}
                    <span className="text-xs font-normal text-slate-500"> g CO2e / km</span>
                  </div>
                  <div className="text-xs text-amber-900 font-medium space-x-1.5">
                    <span>CO2: 97.8%</span>
                    <span>·</span>
                    <span>CO/VOC: 1.4%</span>
                    <span>·</span>
                    <span>NOx: 0.8%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Direct vehicle release rate measured per kilometer traversed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: PUBLIC TRANSPORT / HOSTEL */}
          {commuteMode === 'public' && (
            <div className="p-5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-emerald-950">
                <div className="font-bold text-sm">
                  Public Transit / Campus Resident Selected (Zero Individual Private Vehicle Footprint)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  As instructed, when using public transportation (Government State Bus, suburban rail, or residing in on-campus student residences like Veda Block or Mother Teresa Residence), individual vehicle petrol and carbon telemetry is not recorded.
                </p>
                <div className="pt-2 flex items-center gap-3 font-mono text-[11px] text-emerald-800">
                  <span>Carbon Score: A+ (Green Flagged)</span>
                  <span>·</span>
                  <span>Direct Fossil Fuel: 0.0 Litres</span>
                  <span>·</span>
                  <span>Net Savings vs Bike: ~48 kg CO2e/month</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. AI Current & Energy Telemetry Analyst ("AI that represents the current") */}
      {(activeModule === 'all' || activeModule === 'ai_current') && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-indigo-500/30 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-5 h-5 fill-amber-300 text-amber-300" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>AI Electrical Current & Telemetry Intelligence</span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                    Live Analyzer
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Continuous AI synthesis representing current Amperage, classroom bills, Wi-Fi telemetry and lab electricity rates
                </p>
              </div>
            </div>

            <button
              onClick={handleRegenerateAi}
              disabled={isAiGenerating}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span>{isAiGenerating ? 'Analyzing...' : 'Refresh AI Telemetry'}</span>
            </button>
          </div>

          {/* Current Amperage & Power Factor Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-mono text-amber-300 uppercase">Class Live Current</div>
              <div className="text-xl font-black font-mono text-white mt-1">14.8 A</div>
              <div className="text-[10px] text-slate-400">CS Seminar Hall 401 load</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-mono text-amber-300 uppercase">Lab Live Current</div>
              <div className="text-xl font-black font-mono text-white mt-1">52.4 A</div>
              <div className="text-[10px] text-slate-400">CSE LAB 1 (3-Phase AC)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-mono text-emerald-300 uppercase">Total Combined Bill</div>
              <div className="text-xl font-black font-mono text-emerald-300 mt-1">
                ₹{+(totalClassDailyBillRs + selectedLab.currentTaking.dailyBillRs).toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">Class + Lab Daily Utility Rate</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-mono text-sky-300 uppercase">Commute GHG Release</div>
              <div className="text-xl font-black font-mono text-sky-300 mt-1">
                {commuteMode === 'collegebus' ? busStudentDailyCarbonKg : commuteMode === 'by_own' ? ownDailyCarbonKg : '0.00'} kg
              </div>
              <div className="text-[10px] text-slate-400">Daily Transport CO2e</div>
            </div>
          </div>

          {/* AI Synthesis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Classroom Electrical & Wi-Fi Diagnostic</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In <strong>{classEquipmentBills.room}</strong>, your classroom draws an instantaneous current of{' '}
                <strong className="text-white">14.8 Amperes</strong>. The primary electricity cost is driven by student compute rigs (56% = ₹278.46/day) followed by the 2 Inverter ACs (31% = ₹153.00/day). The Aruba Wi-Fi 6 AP operates at 0.54 kWh/day (₹4.59/day) maintaining a clean power factor of 0.96.
              </p>
              <div className="text-[10px] font-mono text-emerald-300 pt-1">
                Recommendation: Switching AC setpoint from 21°C to 24°C saves ₹680/month and reduces 58.4 kg CO2e.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sky-300">
                <Bus className="w-4 h-4 text-sky-400" />
                <span>Commute & Transport Carbon Recommendation</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {commuteMode === 'collegebus' ? (
                  <>
                    By taking <strong>{currentBus.busNumber}</strong> from stop <strong className="text-white">{selectedStop}</strong>, your shared diesel footprint is <strong className="text-emerald-300">1.05 kg CO2e/day</strong>. You reduce carbon emissions by <strong className="text-emerald-300">43%</strong> compared to single-rider two-wheelers.
                  </>
                ) : commuteMode === 'by_own' ? (
                  <>
                    Commuting via <strong>{ownVehicleName}</strong> from stop <strong className="text-white">{selectedStop}</strong> consumes <strong className="text-amber-300">{ownDailyLitres} L</strong> of petrol daily at ₹{petrolRatePerLitre}/L (₹{ownDailyPetrolBill}/day), generating <strong className="text-rose-300">{ownDailyCarbonKg} kg CO2e/day</strong>.
                  </>
                ) : (
                  <>
                    Public transport and hostel residence generate zero private vehicular tailpipe emissions, making you eligible for the MKCE Student Green Badge.
                  </>
                )}
              </p>
              <div className="text-[10px] font-mono text-amber-300 pt-1">
                {commuteMode === 'by_own'
                  ? 'Eco-tip: Carpooling with a peer or shifting to College Bus saves ₹1,155 in petrol and 20.8 kg CO2e monthly.'
                  : 'Transit status: Optimal green transport allocation maintained.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
