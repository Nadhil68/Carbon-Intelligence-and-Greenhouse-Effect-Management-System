import React, { useState } from 'react';
import { useEmissions } from '../context/EmissionContext';
import { CampusDepartment } from '../types';
import { formatTonsCO2e, formatKgCO2e } from '../utils/calculations';
import {
  Building2,
  Zap,
  Flame,
  Users,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const ALL_DEPARTMENTS: CampusDepartment[] = [
  'CSE',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'IT',
  'AIDS',
  'AIML',
  'Cyber Security',
  'Technology Innovation Hub (TIH)',
  'Mathematics (Freshman Engineering)',
  'Engineering Chemistry (Freshman Engineering)',
  'Engineering Physics (Freshman Engineering)',
  'Freshman Engineering (1st Year)',
  'Hostels & Residential Blocks',
  'Administration & Management',
  'Transport & Fleet Facilities',
  'Central Library & Labs',
];

interface DepartmentMeta {
  head: string;
  headTitle: string;
  studentStaffCount: number;
  areaSqMeters: number;
  primaryLoad: string;
  energyTips: string[];
}

const DEPARTMENT_METADATA: Record<CampusDepartment, DepartmentMeta> = {
  'CSE': {
    head: 'Dr. Pradeep D (HOD) & Dr. Padmini Devi (AHOD)',
    headTitle: 'Head of Department (HOD) & Assistant HOD',
    studentStaffCount: 850,
    areaSqMeters: 4500,
    primaryLoad: 'Computing Data Center, High-Performance GPU AI Labs, CSE Labs 1-6 & Central AC',
    energyTips: [
      'Enable automated sleep states on idle lab workstations after 20 minutes',
      'Optimize AI training runs to off-peak hours powered by solar peak hours (10 AM - 2 PM)',
      'Retrofit server room CRAC with variable frequency drive (VFD) blowers',
    ],
  },
  'ECE': {
    head: 'Dr. P. Murugesan',
    headTitle: 'Head of Department (HOD)',
    studentStaffCount: 720,
    areaSqMeters: 4200,
    primaryLoad: 'VLSI Design Lab, DSP workstations, RF measurement instruments & Embedded labs',
    energyTips: [
      'Power down signal generators and oscilloscope test rigs when not in use',
      'Deploy smart power strips for student development benches',
      'Use high-efficiency LED task lights for PCB soldering stations',
    ],
  },
  'EEE': {
    head: 'Dr. Anand Verma',
    headTitle: 'Assistant Head of Department (AHOD)',
    studentStaffCount: 540,
    areaSqMeters: 4100,
    primaryLoad: 'High voltage testing lab, power electronics drive systems & campus solar monitoring',
    energyTips: [
      'Maintain power factor compensation capacitor banks at 0.99 pf',
      'Supervise routine rooftop solar panel cleaning every 15 days to maximize yield',
      'Install smart power sub-meters on high-draw research rigs',
    ],
  },
  'MECH': {
    head: 'Dr. V. Karthikeyan',
    headTitle: 'Head of Department (HOD)',
    studentStaffCount: 620,
    areaSqMeters: 6200,
    primaryLoad: 'Thermal labs, foundry induction furnace, compressed air systems, CNC lathes',
    energyTips: [
      'Schedule high-draw metal casting furnaces during solar peak generation window',
      'Fix compressed air line micro-leaks (projected to save ~12% compressor power)',
      'Utilize waste heat recovery heat exchanger for preheating lab boilers',
    ],
  },
  'CIVIL': {
    head: 'Prof. Geetha Raman',
    headTitle: 'Senior Advisor & HOD',
    studentStaffCount: 410,
    areaSqMeters: 3800,
    primaryLoad: 'Hydraulics flumes, geotechnical compaction ovens & environmental testing incubators',
    energyTips: [
      'Implement campus rainwater harvesting overflow telemetry',
      'Conduct monthly life-cycle carbon footprint audits with student volunteers',
      'Optimize curing tank heating elements with solar thermal collectors',
    ],
  },
  'IT': {
    head: 'Dr. R. Vignesh',
    headTitle: 'Head of Department (HOD)',
    studentStaffCount: 580,
    areaSqMeters: 3500,
    primaryLoad: 'Cloud computing laboratory, web technologies testing rigs & network switches',
    energyTips: [
      'Virtualize servers to reduce physical hardware idle energy draw',
      'Establish lab temperature setpoint at 24°C',
      'Implement paperless project evaluation',
    ],
  },
  'AIDS': {
    head: 'Dr. C. Balakrishnan',
    headTitle: 'Head of Department (HOD)',
    studentStaffCount: 460,
    areaSqMeters: 3200,
    primaryLoad: 'Big Data clusters, neural network workstations, dual-monitor student rigs',
    energyTips: [
      'Utilize batch job queueing scheduled with rooftop solar availability',
      'Enforce monitor energy-saving modes after 10 minutes of inactivity',
      'Schedule routine maintenance for lab HVAC air filters',
    ],
  },
  'AIML': {
    head: 'Prof. Jaganathan (AHOD), Prof. Deepa & Prof. Priya',
    headTitle: 'Assistant Head of Department & Faculty Leads',
    studentStaffCount: 420,
    areaSqMeters: 3000,
    primaryLoad: 'Deep learning server rigs, edge AI devices, tensor processing clusters',
    energyTips: [
      'Direct compute-heavy workloads to off-peak periods',
      'Consolidate model inference onto shared low-power nodes',
      'Promote energy-efficient coding practices among student researchers',
    ],
  },
  'Cyber Security': {
    head: 'Dr. Rajesh Ram V',
    headTitle: 'Head of Cyber Security & Threat Intelligence',
    studentStaffCount: 280,
    areaSqMeters: 2400,
    primaryLoad: 'Cyber Range servers, defensive penetration sandbox workstations & isolated threat nodes',
    energyTips: [
      'Schedule sandboxed virtual machine tear-downs during idle hours',
      'Utilize cloud security simulation clusters with dynamic load shedding',
      'Consolidate network packet inspection appliances on energy-rated blades',
    ],
  },
  'Technology Innovation Hub (TIH)': {
    head: 'Er. Jagadeeshwaran',
    headTitle: 'Head Consultant of IEEE & Technology Innovation Hub',
    studentStaffCount: 220,
    areaSqMeters: 2200,
    primaryLoad: 'IoT prototyping hardware, IEEE research stations, 3D printing & rapid design rigs',
    energyTips: [
      'Employ smart sensor plugs for rapid prototyping bench equipment',
      'Power off 3D additive manufacturing heaters upon print job completion',
      'Direct solar PV circuits to dedicated research battery benches',
    ],
  },
  'Mathematics (Freshman Engineering)': {
    head: 'Dr. Chitrakala',
    headTitle: 'HOD Freshman Engineering and Head of Mathematics',
    studentStaffCount: 680,
    areaSqMeters: 1800,
    primaryLoad: 'Computational mathematics lab, lecture hall audio-visual systems & smart boards',
    energyTips: [
      'Power off interactive smart podiums and digital projectors immediately after lectures',
      'Maximize daylight in perimeter lecture halls',
      'Utilize digital assignments to minimize paper consumption',
    ],
  },
  'Engineering Chemistry (Freshman Engineering)': {
    head: 'Dr. Manikandan V',
    headTitle: 'Head of Chemistry (Freshman Engineering)',
    studentStaffCount: 680,
    areaSqMeters: 2200,
    primaryLoad: 'Water distillation plants, fume hoods, hot plates, chemical storage refrigeration',
    energyTips: [
      'Consolidate water distillation batches to optimize heating element runtimes',
      'Close fume hood sashes tightly when unattended to prevent air loss',
      'Maintain chemical refrigerator door seals to reduce cooling loss',
    ],
  },
  'Engineering Physics (Freshman Engineering)': {
    head: 'Dr. Vidhya P',
    headTitle: 'Head of Physics (Freshman Engineering)',
    studentStaffCount: 680,
    areaSqMeters: 2100,
    primaryLoad: 'Laser optics labs, ultrasonic interferometers, darkroom lighting & spectrometers',
    energyTips: [
      'Turn off high-intensity laser sources between student laboratory batches',
      'Implement motion-sensor LED fixtures in darkroom setups',
      'Use centralized power strips to isolate experimental rigs overnight',
    ],
  },
  'Freshman Engineering (1st Year)': {
    head: 'Dr. Chitrakala (HOD) & Dr. Veeramalai (AHOD)',
    headTitle: 'HOD Freshman Engineering & AHOD Freshman Engineering',
    studentStaffCount: 1450,
    areaSqMeters: 7500,
    primaryLoad: '1st Year Lecture Complex, Drawing Halls, Common Computer Centers',
    energyTips: [
      'Assign student energy monitors across sections A through L',
      'Organize freshman green campus orientation and carbon footprint tracking',
      'Turn off drawing hall ventilation fans and lights when classes conclude',
    ],
  },
  'Hostels & Residential Blocks': {
    head: 'Eng. Meera Nair',
    headTitle: 'Hostel Facilities In-Charge',
    studentStaffCount: 2150,
    areaSqMeters: 18500,
    primaryLoad: 'Student dorm plug loads, corridor lighting, solar geysers & central mess dining',
    energyTips: [
      'Transition water heating in Hostels A & B to centralized heat pump units',
      'Automate corridor and bathroom lighting with PIR motion sensors',
      'Divert 100% of organic food refuse into the campus bio-methanation digestor',
    ],
  },
  'Administration & Management': {
    head: 'Er. K. Ramasamy',
    headTitle: 'Manager & Estate In-Charge',
    studentStaffCount: 120,
    areaSqMeters: 2800,
    primaryLoad: 'Chamber cooling, secure print shop, examination evaluation computer centers',
    energyTips: [
      'Accelerate paperless student transcripts & digital QR question-paper delivery',
      'Power off centralized servers over vacation weekends',
      'Replace legacy fluorescent fixtures with 9W LED batten tubes',
    ],
  },
  'Transport & Fleet Facilities': {
    head: 'PRANITH SRIRAM G',
    headTitle: 'Campus Administrator & Fleet Lead',
    studentStaffCount: 95,
    areaSqMeters: 3200,
    primaryLoad: '14 college bus transit lines, utility vans, diesel generator backup',
    energyTips: [
      'Consolidate adjacent bus pick-up routes using GPS route optimization',
      'Phase out diesel campus patrol jeeps in favor of solar-charged EV shuttles',
      'Mandate strict tire pressure inspections to maximize km-per-litre fuel efficiency',
    ],
  },
  'Central Library & Labs': {
    head: 'Dr. M. Sangeetha',
    headTitle: 'Academic Head & Central Facility Director',
    studentStaffCount: 1600,
    areaSqMeters: 5500,
    primaryLoad: '3-story reading halls, central HVAC chiller, digital repository terminals',
    energyTips: [
      'Implement daylight harvesting dimmers in perimeter glass-wall study areas',
      'Set thermostat deadbands to 24°C in accordance with national green building norms',
      'Schedule automated shutdown for digital catalog computer kiosks after 8 PM',
    ],
  },
};

interface DepartmentViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const DepartmentView: React.FC<DepartmentViewProps> = ({ onNavigateTab }) => {
  const { records, institutionalPeople } = useEmissions();
  const [activeDept, setActiveDept] = useState<CampusDepartment>('CSE');

  const deptRecords = records.filter((r) => r.department === activeDept);

  let grossKg = 0;
  let offsetKg = 0;
  let electricityKwh = 0;

  deptRecords.forEach((r) => {
    if (r.category === 'solar_renewable_offset') {
      offsetKg += Math.abs(r.totalEmissionKgCO2e);
    } else {
      grossKg += r.totalEmissionKgCO2e;
      if (r.category === 'department_electricity' || r.category === 'hostel_electricity') {
        electricityKwh += r.activityValue;
      }
    }
  });

  const netKg = Math.max(0, grossKg - offsetKg);
  const netTons = netKg / 1000;

  const meta = DEPARTMENT_METADATA[activeDept];
  const perCapitaKg = meta.studentStaffCount > 0 ? (netKg / meta.studentStaffCount).toFixed(1) : '0';
  const emissionIntensity = meta.areaSqMeters > 0 ? (netKg / meta.areaSqMeters).toFixed(1) : '0';

  const deptStaff = institutionalPeople.filter((p) => p.department === activeDept);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-blue-700 uppercase tracking-wider">
                Departmental Profiles
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">M.Kumarasamy College of Engineering</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Department-Wise Environmental Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Monitor individual department energy footprints, campus personnel, and tailored reduction actions.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <select
              value={activeDept}
              onChange={(e) => setActiveDept(e.target.value as CampusDepartment)}
              className="w-full md:w-64 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
            >
              {ALL_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('directory')}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                title="Go to Campus Directory for full individual department, faculty, and student pages"
              >
                <span>Individual Directory Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Department Selector Pills */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ALL_DEPARTMENTS.map((dept) => {
            const isSelected = activeDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{dept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Department Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Total Net Footprint</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {netTons.toFixed(2)} <span className="text-xs font-normal text-slate-500 font-sans">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            Gross: {(grossKg / 1000).toFixed(2)} t · Offset: {(offsetKg / 1000).toFixed(2)} t
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Electricity Metered</div>
          <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums">
            {electricityKwh.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Factor: 0.82 kg CO₂e / kWh
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Per-Capita Impact</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {perCapitaKg} <span className="text-xs font-normal text-slate-500 font-sans">kg/person</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Base: {meta.studentStaffCount} students & faculty
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Floor Area Intensity</div>
          <div className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {emissionIntensity} <span className="text-xs font-normal text-slate-500 font-sans">kg/m²</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Area: {meta.areaSqMeters.toLocaleString()} m²
          </div>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Department Energy Profile</span>
              <span className="text-xs font-mono text-slate-500">Lead: {meta.head} ({meta.headTitle})</span>
            </h2>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="text-slate-700">
                <span className="text-slate-500 font-medium">Primary Monitored Facilities: </span>
                {meta.primaryLoad}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Targeted Sustainability Actions</span>
              </div>
              <div className="space-y-2">
                {meta.energyTips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Department Emission Records</h2>
              <span className="text-xs font-mono text-slate-500">
                {deptRecords.length} record(s) on file
              </span>
            </div>

            {deptRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                No emission records logged for {activeDept} yet. Authorized Operators can log electricity or activity data.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Facility Location</th>
                      <th className="py-2.5 px-3">Activity Value</th>
                      <th className="py-2.5 px-3 text-right">Computed CO₂e</th>
                      <th className="py-2.5 px-3">Reported By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {deptRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{r.date}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{r.facilityLocation}</td>
                        <td className="py-2.5 px-3 font-mono">
                          {r.activityValue.toLocaleString()} {r.unit}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right font-bold text-slate-900">
                          {r.totalEmissionKgCO2e < 0 ? '-' : ''}
                          {(Math.abs(r.totalEmissionKgCO2e) / 1000).toFixed(2)} t
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{r.reportedBy.userName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Department Personnel</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Associated leaders, advisors & student reps
            </p>
          </div>

          <div className="space-y-3">
            {deptStaff.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No personnel mapped to this department in directory.
              </div>
            ) : (
              deptStaff.map((person) => (
                <div
                  key={person.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{person.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {person.category}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">{person.responsibility}</div>
                  <div className="text-slate-500 font-mono text-[10px] pt-1">
                    {person.email} · {person.officeLocation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
