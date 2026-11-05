import React, { useState } from 'react';
import { useEmissions } from '../context/EmissionContext';
import { useAuth } from '../context/AuthContext';
import { formatTonsCO2e, formatKgCO2e, EMISSION_FACTORS } from '../utils/calculations';
import {
  Flame,
  Zap,
  Sun,
  Truck,
  Building,
  TrendingDown,
  Download,
  Filter,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Sparkles,
  Users,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { CampusSlideshow } from './CampusSlideshow';
import { StudentDashboardAddon } from './StudentDashboardAddon';
import { ClassAdvisorView } from './ClassAdvisorView';
import { OperatorPortalView } from './OperatorPortalView';
import { HodDepartmentRecordsView } from './ExecutiveRoleViews';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenEntryModal?: () => void;
  hideStudentAddon?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenEntryModal,
  hideStudentAddon = false,
}) => {
  const {
    aggregateMetrics,
    records,
    filteredRecords,
    selectedMonth,
    setSelectedMonth,
    exportAuditData,
    pendingLogCount,
  } = useEmissions();
  const { currentUser, users } = useAuth();

  const [chartView, setChartView] = useState<'scopes' | 'departments' | 'sources'>('scopes');

  const months = ['All Months', ...Array.from(new Set(records.map((r) => r.month))).sort().reverse()];

  const hasRecords = records.length > 0;
  const monthlyBaselineTons = 125.0;
  const currentNetTons = aggregateMetrics.totalNetTons;
  const reductionPercentage =
    hasRecords && monthlyBaselineTons > 0
      ? Math.max(0, Math.min(100, ((monthlyBaselineTons - currentNetTons) / monthlyBaselineTons) * 100))
      : 0;

  const isClassAdvisor =
    Boolean(currentUser?.name?.toLowerCase().includes('ananthi')) ||
    Boolean(currentUser?.name?.toLowerCase().includes('selvanayagi'));

  const normEmail = currentUser?.email?.toLowerCase() || '';
  const isPrincipal =
    currentUser?.designation === 'Principal' ||
    normEmail === 'principle@mkce.ac.in' ||
    normEmail === 'principal@mkce.ac.in';
  const isManager =
    currentUser?.designation === 'Manager' || normEmail === 'manager@mkce.ac.in';
  const isDean =
    (currentUser?.designation === 'Dean' && currentUser?.role !== 'admin') ||
    normEmail === 'dean@mkce.ac.in' ||
    normEmail === 'logavel@mkce.ac.in';
  const isHod =
    !isClassAdvisor &&
    currentUser?.role !== 'operator' &&
    (currentUser?.designation === 'HOD' || normEmail.startsWith('hod-'));

  const isStudent = !isClassAdvisor && currentUser?.designation === 'Students';
  const isOperator = !isClassAdvisor && !isStudent && currentUser?.role === 'operator';
  const isAdmin = currentUser?.role === 'admin';
  const pendingUsersCount = users.filter((u) => u.status === 'pending').length;

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Principal Welcome & Module 2 Shortcut (Dept Carbon Wise for Whole College) */}
      {isPrincipal && !hideStudentAddon && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                College Principal Portal · principle@mkce.ac.in (Pass: principal@2026)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              Welcome, Principal {currentUser?.name || 'Balamurugan'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
              Module 1: Normal Institutional Carbon Dashboard (below) · Module 2: Complete Department-Wise Carbon & Electricity Audit for the Whole College.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('principal_dept_carbon')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>Open Module 2: Dept Carbon Wise (Whole College) →</span>
            </button>
          </div>
        </div>
      )}

      {/* Manager Welcome & Module 2 Shortcut (All College Office Electrical Records) */}
      {isManager && !hideStudentAddon && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                College Manager Portal · manager@mkce.ac.in (Pass: man@2026)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              Welcome, Manager {currentUser?.name || 'Vikram'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
              View all college administrative office electrical sub-meter records, connected loads, AC/server equipment, monthly EB bills, and carbon emissions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('manager_office_records')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>View All College Office Electrical Records →</span>
            </button>
          </div>
        </div>
      )}

      {/* Dean Welcome & Module 2 Shortcut (Dean Office & Admission Office Details) */}
      {isDean && !hideStudentAddon && (
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-teal-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                Dean Governance Portal · dean@mkce.ac.in (Pass: dean@2026)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              Welcome, {currentUser?.name || 'Dr. Logavel'} (Dean)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
              Inspect dedicated room-by-room electricity consumption, HVAC systems, sub-meter serials, and carbon footprint for the <strong>Dean Office</strong> and <strong>Admission Office</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('dean_office_details')}
              className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>View Dean Office & Admission Office Details →</span>
            </button>
          </div>
        </div>
      )}

      {/* HOD Department Records First: 1. Staff -> 2. Classes -> 3. Labs */}
      {isHod && !hideStudentAddon && (
        <HodDepartmentRecordsView onNavigateTab={onNavigateTab} />
      )}

      {/* Personalized Operator Welcome Banner & Log Entry / Status Shortcuts */}
      {isOperator && !hideStudentAddon && (
        <OperatorPortalView
          mode="welcome_banner"
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* Admin Quick Governance Banner for Log Proof Approvals & Login Approvals */}
      {isAdmin && !hideStudentAddon && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-indigo-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 mb-1">
              Administrator Governance Console · PRANITH SRIRAM G
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              Operator Log Proof Verification & New Login Approvals
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Inspect Photo/PDF proofs attached to operator carbon logs and approve new user logins waiting in queue.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('admin_log_approvals')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Log Approval & Proof Check ({pendingLogCount} Pending)</span>
            </button>
            <button
              onClick={() => onNavigateTab('admin_approvals')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Login Approval & Add User ({pendingUsersCount} Waiting)</span>
            </button>
          </div>
        </div>
      )}

      {/* Personalized Class Advisor Welcome & Quick Cabin/Class Summary */}
      {isClassAdvisor && !hideStudentAddon && (
        <ClassAdvisorView
          mode="welcome_banner"
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* Personalized Student Modules & Welcome */}
      {isStudent && !hideStudentAddon && (
        <StudentDashboardAddon
          initialModule="welcome_only"
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* Top Banner / Welcome Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-wider">
                M.Kumarasamy College of Engineering
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">ISO 14064-1 & GHG Protocol Audit</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Campus Carbon & Greenhouse Gas Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Centralized platform to monitor department electricity, hostel utilities, fleet transportation, and solar renewable offsets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Month */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All Months' ? 'All Audit Months' : `Month: ${m}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Report */}
            {hasRecords && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => exportAuditData('csv')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Download CSV Audit"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportAuditData('json')}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-xs"
                  title="Download JSON Report"
                >
                  <span>JSON</span>
                </button>
              </div>
            )}

            {/* Operator Quick Log Action (Navigates directly to Log Entry Module with Photos/PDF) */}
            {isOperator && (
              <button
                onClick={() => onNavigateTab('operator_log_entry')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Log Emission Entry</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8-Picture Campus Environmental & Infrastructure Slideshow */}
      <CampusSlideshow />

      {/* Primary KPI Metric Cards (Grid of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Footprint */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Gross GHG Emissions</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
            {formatTonsCO2e(aggregateMetrics.totalGrossKg)}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">tCO₂e</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-slate-700 font-mono font-medium">
              {formatKgCO2e(aggregateMetrics.totalGrossKg)} kg
            </span>
            <span>total emission</span>
          </div>
        </div>

        {/* Renewable Solar Offset */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Rooftop Solar Offset</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Sun className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-700 tabular-nums">
            -{formatTonsCO2e(aggregateMetrics.totalOffsetKg)}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">tCO₂e</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Avoided thermal grid power</span>
          </div>
        </div>

        {/* Net Institutional Footprint */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Net Campus Footprint</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
            {formatTonsCO2e(aggregateMetrics.totalNetKg)}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">tCO₂e</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Net = Gross − Renewable Credits</span>
          </div>
        </div>

        {/* Per Capita Emission */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Per Capita Net Emission</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
            {aggregateMetrics.perCapitaNetKg.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">kg/person</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Based on 4,850 students & staff</span>
          </div>
        </div>
      </div>

      {/* Scope, Analytics & Targets Section */}
      {hasRecords && (
        <>
          {/* Scope 1, 2, 3 Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scope 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-slate-900">Scope 1: Direct Fuel & Gas</span>
                </div>
                <span className="text-[11px] font-mono text-amber-700 font-bold">
                  {aggregateMetrics.scope1Tons.toFixed(2)} tCO₂e
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Transit diesel buses, security shuttles, laboratory reaction gas & refrigerant leakage.
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      aggregateMetrics.totalGrossTons > 0
                        ? (aggregateMetrics.scope1Tons / aggregateMetrics.totalGrossTons) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Scope 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-semibold text-slate-900">Scope 2: Purchased Electricity</span>
                </div>
                <span className="text-[11px] font-mono text-blue-700 font-bold">
                  {aggregateMetrics.scope2Tons.toFixed(2)} tCO₂e
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Department classrooms, labs, server chillers, and residential hostel grid consumption.
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      aggregateMetrics.totalGrossTons > 0
                        ? (aggregateMetrics.scope2Tons / aggregateMetrics.totalGrossTons) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Scope 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span className="text-xs font-semibold text-slate-900">Scope 3: Waste & Indirect</span>
                </div>
                <span className="text-[11px] font-mono text-purple-700 font-bold">
                  {aggregateMetrics.scope3Tons.toFixed(2)} tCO₂e
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Hostel canteen food waste, campus horticulture sweepings, and solid landfill disposal.
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      aggregateMetrics.totalGrossTons > 0
                        ? (aggregateMetrics.scope3Tons / aggregateMetrics.totalGrossTons) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Category Breakdown */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Environmental Emission Analysis</h2>
                  <p className="text-xs text-slate-500">Comparative assessment across categories and departments</p>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setChartView('scopes')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      chartView === 'scopes'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Category
                  </button>
                  <button
                    onClick={() => setChartView('departments')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      chartView === 'departments'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Department Rankings
                  </button>
                </div>
              </div>

              {chartView === 'scopes' && (
                <div className="space-y-4">
                  <div className="space-y-3.5">
                    {aggregateMetrics.categoryBreakdown.map((item) => (
                      <div key={item.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
                            <span className="text-slate-900 font-semibold">{item.grossTons.toFixed(2)} tCO₂e</span>
                            <span className="text-slate-400">({item.percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor:
                                item.category === 'hostel_electricity'
                                  ? '#0284c7'
                                  : item.category === 'department_electricity'
                                  ? '#2563eb'
                                  : item.category === 'transportation'
                                  ? '#d97706'
                                  : item.category === 'laboratory_chemicals'
                                  ? '#db2777'
                                  : '#9333ea',
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {aggregateMetrics.totalOffsetTons > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-emerald-700 flex items-center gap-1.5">
                            <Sun className="w-3.5 h-3.5" />
                            <span>Rooftop Solar Displacement (Clean Offset)</span>
                          </span>
                          <div className="font-mono text-[11px] text-emerald-700 font-semibold tabular-nums">
                            -{aggregateMetrics.totalOffsetTons.toFixed(2)} tCO₂e
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                aggregateMetrics.totalGrossTons > 0
                                  ? (aggregateMetrics.totalOffsetTons / aggregateMetrics.totalGrossTons) * 100
                                  : 0
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {chartView === 'departments' && (
                <div className="space-y-3">
                  {aggregateMetrics.departmentRankings.map((dept, index) => (
                    <div
                      key={dept.department}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-900">{dept.department}</span>
                        </div>
                        <div className="font-mono text-xs tabular-nums text-slate-900 font-bold">
                          {dept.netTons.toFixed(2)} tCO₂e{' '}
                          <span className="text-[10px] font-normal text-slate-500">
                            ({dept.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${dept.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Goal Roadmap */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Green Campus Targets</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target: 25% reduction in campus emission intensity by 2027
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
                    Current Milestone
                  </div>
                  <div className="text-3xl font-bold font-mono text-emerald-700">
                    {reductionPercentage.toFixed(1)}%
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Calculated against institutional baseline
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${reductionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigateTab('departments')}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Department Dashboards</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
