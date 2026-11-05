import React from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Cpu,
  Zap,
  Leaf,
  Wifi,
  Calendar,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Download,
  Share2,
  Building2,
  UserCheck,
} from 'lucide-react';

export interface DetailedFacultyData {
  id: string;
  name: string;
  designation: string;
  roleTag?: string;
  qualification: string;
  departmentCode: string;
  departmentName: string;
  cabin: string;
  email: string;
  phone: string;
  joinedYear?: number;
  employeeId?: string;
  subjects?: string[];
  systemModel?: string;
  systemPowerWatts?: number;
  systemDailyKWh?: number;
  systemCarbonKgCO2e?: number;
  electricityDailyKWh?: number;
  electricityCarbonKgCO2e?: number;
  wifiAp?: string;
  wifiSpeed?: string;
  colleagues?: {
    id: string;
    name: string;
    designation: string;
    cabin: string;
  }[];
}

interface IndividualFacultyViewProps {
  faculty: DetailedFacultyData;
  onBack: () => void;
  onSelectColleague?: (id: string) => void;
}

export const IndividualFacultyView: React.FC<IndividualFacultyViewProps> = ({
  faculty,
  onBack,
  onSelectColleague,
}) => {
  const employeeId = faculty.employeeId || `MKCE-${faculty.departmentCode}-${faculty.id.slice(-3).toUpperCase()}`;
  const joinedYear = faculty.joinedYear || 2017;
  const experienceYears = new Date().getFullYear() - joinedYear;
  
  const cleanStaffName = faculty.name
    .toLowerCase()
    .replace('dr. ', '')
    .replace('prof. ', '')
    .replace('mr. ', '')
    .replace('ms. ', '')
    .replace(/[^a-z0-9]/g, '');
  const staffEmail = faculty.email.includes('@mkce.ac.in')
    ? faculty.email
    : `${cleanStaffName}@mkce.ac.in`;

  const systemKWh = faculty.systemDailyKWh || 1.25;
  const systemCarbon = faculty.systemCarbonKgCO2e || +(systemKWh * 0.82).toFixed(2);
  const electricityKWh = faculty.electricityDailyKWh || 2.8;
  const electricityCarbon = faculty.electricityCarbonKgCO2e || +(electricityKWh * 0.82).toFixed(2);
  const totalDailyCarbon = +(systemCarbon + electricityCarbon).toFixed(2);
  const totalMonthlyCarbon = +(totalDailyCarbon * 26).toFixed(1);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden animate-fade-in">
      {/* 1. Breadcrumbs & Back Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Back to {faculty.departmentCode}</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium">{faculty.departmentName}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium">Faculty Profile</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-blue-700 font-mono">{faculty.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified Faculty Record
          </span>
        </div>
      </div>

      {/* 2. Hero Faculty Identity Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 via-indigo-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-start gap-5 sm:gap-6 relative z-10">
          {/* Avatar Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md ring-4 ring-blue-100 shrink-0">
            {faculty.name
              .replace('Dr. ', '')
              .replace('Prof. ', '')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>

          {/* Core Information */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                {faculty.designation}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                ID: {employeeId}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Joined {joinedYear} · {experienceYears}+ Yrs at MKCE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {faculty.name}
            </h1>
            <p className="text-sm font-semibold text-blue-700 mt-0.5">
              {faculty.roleTag || `${faculty.designation} - ${faculty.departmentName}`}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{faculty.qualification}</span>
            </p>

            {/* Quick Contact & Credentials Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{faculty.cabin}</span>
              </div>
              <a
                href={`mailto:${staffEmail}`}
                className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium hover:underline"
              >
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-mono font-bold">{staffEmail}</span>
              </a>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Portal Password:</span>
                <code className="text-emerald-800 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  staff@2026
                </code>
              </div>
              <a
                href={`tel:${faculty.phone}`}
                className="flex items-center gap-1.5 text-slate-700 font-mono hover:text-blue-700"
              >
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{faculty.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detail Grid: Academic Portfolio & Environmental Carbon Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Academic Profile & Cabin Infrastructure */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subjects & Academic Specialization */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Subjects Handled & Academic Specialization</span>
            </h2>

            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Current academic year curriculum and active course assignments in{' '}
                <strong>{faculty.departmentName}</strong>:
              </div>

              <div className="flex flex-wrap gap-2">
                {(faculty.subjects && faculty.subjects.length > 0
                  ? faculty.subjects
                  : ['Core Department Subject I', 'Advanced Department Elective II', 'Laboratory Practical']
                ).map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>{sub}</span>
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-800">Academic Responsibilities</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Internal Assessment Evaluation, Student Project Mentorship, Lab Curriculum In-charge
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-800">Cabin Consultation Hours</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    10:30 AM – 11:30 AM & 03:00 PM – 04:30 PM (Working Days)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cabin & Workstation Telemetry Detailed Audit */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Workstation Electrical Draw & Cabin Power Systems</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Workstation Computer */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span>Workstation Computer</span>
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="text-slate-700 font-medium">
                  {faculty.systemModel || 'Dell Precision Workstation (Intel Core i7)'}
                </div>
                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Power Supply Rating:</span>
                    <strong className="text-slate-800">{faculty.systemPowerWatts || 160} Watts</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Computing Draw:</span>
                    <strong className="text-slate-800">{systemKWh} kWh/day</strong>
                  </div>
                  <div className="flex justify-between font-mono font-bold text-rose-600">
                    <span>System Carbon Emission:</span>
                    <span>{systemCarbon} kg CO2e/day</span>
                  </div>
                </div>
              </div>

              {/* Cabin Electricity */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Cabin Electricity Units</span>
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                    METERED
                  </span>
                </div>
                <div className="text-slate-700 font-medium">
                  LED Office Lighting, Cabin Ceiling Fan & Shared AC Units
                </div>
                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Operating Voltage:</span>
                    <strong className="text-slate-800">230V AC Single Phase</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Electricity Draw:</span>
                    <strong className="text-slate-800">{electricityKWh} kWh/day</strong>
                  </div>
                  <div className="flex justify-between font-mono font-bold text-rose-600">
                    <span>Electricity Carbon Emission:</span>
                    <span>{electricityCarbon} kg CO2e/day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cabin Wi-Fi AP */}
            <div className="mt-4 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-sky-900">
                <Wifi className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  Cabin Wi-Fi Link: <strong>{faculty.wifiAp || `AP-${faculty.departmentCode}-FL2`}</strong>
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">Wi-Fi 6 Enterprise (5 GHz)</span>
              </div>
              <div className="text-sky-800 font-mono font-semibold">
                Speed: {faculty.wifiSpeed || '100 Mbps Dedicated'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Carbon Footprint Summary & Colleagues */}
        <div className="space-y-6">
          {/* Carbon Intelligence Metric Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Campus Carbon Audit Score</span>
            </div>
            <div className="text-3xl font-black font-mono tracking-tight text-white mt-1">
              {totalDailyCarbon}{' '}
              <span className="text-sm font-sans font-medium text-slate-300">kg CO2e / day</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Projected Monthly: <strong>{totalMonthlyCarbon} kg CO2e/month</strong>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>System Compute Share:</span>
                <strong className="text-white">{systemCarbon} kg CO2e</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cabin Lighting & HVAC Share:</span>
                <strong className="text-white">{electricityCarbon} kg CO2e</strong>
              </div>
              <div className="pt-2 flex justify-between font-semibold text-emerald-400">
                <span>Eco Efficiency Rating:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  Tier-1 Energy Star
                </span>
              </div>
            </div>
          </div>

          {/* Department Colleagues Quick Navigation */}
          {faculty.colleagues && faculty.colleagues.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>{faculty.departmentCode} Faculty Colleagues</span>
                <span className="text-[11px] text-slate-400">Quick Jump</span>
              </h3>

              <div className="space-y-2">
                {faculty.colleagues.slice(0, 5).map((col) => (
                  <button
                    key={col.id}
                    onClick={() => onSelectColleague && onSelectColleague(col.id)}
                    className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left flex items-center justify-between gap-2 group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                        {col.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {col.designation} · {col.cabin}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
