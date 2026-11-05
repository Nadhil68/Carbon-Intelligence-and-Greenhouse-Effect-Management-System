import React from 'react';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Award,
  Zap,
  Leaf,
  Wifi,
  MapPin,
  Phone,
  UserCheck,
  ChevronRight,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

export interface DetailedStudentData {
  id: string;
  rollNo: string;
  name: string;
  departmentCode: string;
  departmentName: string;
  year: string; // '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
  semester?: string;
  section: string;
  classAdvisor: string;
  advisorContact: string;
  classRoom: string;
  cgpa: string;
  laptopDailyKWh: number;
  carbonKgCO2e: number;
  email?: string;
  username?: string;
  monthlyElectricityKWh?: number;
  curriculumOrSubjects?: string;
  batchYears?: string;
  peers?: {
    rollNo: string;
    name: string;
    cgpa: string;
    laptopDailyKWh: number;
    carbonKgCO2e: number;
  }[];
}

interface IndividualStudentViewProps {
  student: DetailedStudentData;
  onBack: () => void;
  onSelectPeer?: (rollNo: string) => void;
}

export const IndividualStudentView: React.FC<IndividualStudentViewProps> = ({
  student,
  onBack,
  onSelectPeer,
}) => {
  const laptopKWh = student.laptopDailyKWh || 0.42;
  const laptopCarbon = student.carbonKgCO2e || +(laptopKWh * 0.82).toFixed(2);
  const classPowerKWh = 0.55; // per student share for classroom lighting, fan & smartboard
  const classCarbon = +(classPowerKWh * 0.82).toFixed(2);
  const labShareKWh = 0.65; // per student lab share
  const labCarbon = +(labShareKWh * 0.82).toFixed(2);
  const totalDailyStudentCarbon = +(laptopCarbon + classCarbon + labCarbon).toFixed(2);
  const totalMonthlyStudentCarbon = +(totalDailyStudentCarbon * 26).toFixed(1);

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
            <span>Back to {student.departmentCode} Students</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium">{student.departmentName}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium">{student.year}</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-blue-700 font-mono">
            {student.name} ({student.rollNo})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Enrolled Student Record
          </span>
        </div>
      </div>

      {/* 2. Hero Student Identity Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-start gap-5 sm:gap-6 relative z-10">
          {/* Avatar Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md ring-4 ring-emerald-100 shrink-0">
            {student.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>

          {/* Core Information */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                {student.rollNo}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {student.year} · {student.section}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {student.batchYears || '2023 - 2027 Academic Batch'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {student.name}
            </h1>
            <p className="text-sm font-semibold text-emerald-800 mt-0.5">
              Department of {student.departmentName}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-1.5">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Lecture Hall: <strong>{student.classRoom}</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Mail ID:</span>
                <code className="text-purple-700 font-mono font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  {student.email || `${student.rollNo.toUpperCase()}@mkce.ac.in`}
                </code>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Username:</span>
                <code className="text-slate-800 font-mono font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  {student.username || student.rollNo}
                </code>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Password:</span>
                <code className="text-emerald-800 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  stu@2026
                </code>
              </p>
            </div>

            {/* Quick Performance & Guidance Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  Current CGPA: <strong className="text-slate-900 font-mono text-sm">{student.cgpa}</strong>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-bold">
                  {+student.cgpa >= 9.0 ? 'First Class with Distinction' : 'First Class'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <UserCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Advisor: <strong>{student.classAdvisor}</strong></span>
                <span className="font-mono text-blue-600">({student.advisorContact})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detail Grid: Academic Record & Carbon Intelligence Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Academic Guidance & Personal Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Guidance & Classroom Record */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Academic Curriculum & Class Mentorship Record</span>
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Designated Class Advisor</div>
                  <div className="text-sm font-bold text-slate-900">{student.classAdvisor}</div>
                  <div className="text-xs text-blue-700 font-mono flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{student.advisorContact}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Campus Lecture Room</div>
                  <div className="text-sm font-bold text-slate-900">{student.classRoom}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Section: <strong>{student.section}</strong> · Semester: <strong>{student.semester || 'Active Semester'}</strong>
                  </div>
                </div>
              </div>

              {student.curriculumOrSubjects && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700">
                  <span className="font-bold text-emerald-900">Curriculum & Course Focus:</span>{' '}
                  {student.curriculumOrSubjects}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student Attendance: <strong>94.8% (Eligible for Examinations)</strong></span>
                </span>
                <span>Enrolment Status: <strong>Regular Scholar</strong></span>
              </div>
            </div>
          </div>

          {/* Student Computing & Digital Carbon Audit */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>Personal Computing Energy Draw & Digital Carbon Telemetry</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Laptop Energy */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-blue-600" />
                  <span>Personal Laptop</span>
                </div>
                <div className="text-[11px] text-slate-500">Academic & Coding Load</div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-800">{laptopKWh} kWh/day</div>
                  <div className="text-[11px] font-mono font-bold text-rose-600">
                    {laptopCarbon} kg CO2e/day
                  </div>
                </div>
              </div>

              {/* Classroom Power Share */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Lecture Hall Share</span>
                </div>
                <div className="text-[11px] text-slate-500">Lighting, Fans, Smartboard</div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-800">{classPowerKWh} kWh/day</div>
                  <div className="text-[11px] font-mono font-bold text-rose-600">
                    {classCarbon} kg CO2e/day
                  </div>
                </div>
              </div>

              {/* Lab System Share */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Practical Lab Share</span>
                </div>
                <div className="text-[11px] text-slate-500">Department Computer Labs</div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-800">{labShareKWh} kWh/day</div>
                  <div className="text-[11px] font-mono font-bold text-rose-600">
                    {labCarbon} kg CO2e/day
                  </div>
                </div>
              </div>
            </div>

            {/* Student Wi-Fi */}
            <div className="mt-4 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-sky-900">
                <Wifi className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  High-Speed Student Wi-Fi (SSID: <strong>MKCE_STUDENT_SECURE</strong>)
                </span>
              </div>
              <div className="text-sky-800 font-mono font-semibold">
                Monthly Usage: ~28.4 GB Data
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sustainability Metric & Batch Peer Roster */}
        <div className="space-y-6">
          {/* Carbon Intelligence Metric Card */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Student Ecological Footprint</span>
            </div>
            <div className="text-3xl font-black font-mono tracking-tight text-white mt-1">
              {totalDailyStudentCarbon}{' '}
              <span className="text-sm font-sans font-medium text-emerald-200">kg CO2e / day</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Monthly Cumulative: <strong>{totalMonthlyStudentCarbon} kg CO2e/month</strong>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Personal Computing:</span>
                <strong className="text-white">{laptopCarbon} kg CO2e</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Classroom Power Allocation:</span>
                <strong className="text-white">{classCarbon} kg CO2e</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Department Lab Allocation:</span>
                <strong className="text-white">{labCarbon} kg CO2e</strong>
              </div>
              <div className="pt-2 flex justify-between font-semibold text-emerald-400">
                <span>Sustainability Index:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900 border border-emerald-700">
                  Grade A+ Eco-Student
                </span>
              </div>
            </div>
          </div>

          {/* Batch Peers Quick Navigation */}
          {student.peers && student.peers.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>{student.section} Peers</span>
                <span className="text-[11px] text-slate-400">Quick Jump</span>
              </h3>

              <div className="space-y-2">
                {student.peers
                  .filter((p) => p.rollNo !== student.rollNo)
                  .slice(0, 5)
                  .map((peer) => (
                    <button
                      key={peer.rollNo}
                      onClick={() => onSelectPeer && onSelectPeer(peer.rollNo)}
                      className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-left flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                          {peer.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Roll: {peer.rollNo} · CGPA {peer.cgpa}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
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
