import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmissions } from '../context/EmissionContext';
import {
  CampusDepartment,
  EmissionSourceCategory,
  ProofAttachmentType,
  EmissionRecord,
  AI_CARBON_LOGO_URL,
  AI_CARBON_LOGO_FALLBACK,
} from '../types';
import { EMISSION_FACTORS, formatKgCO2e, formatTonsCO2e } from '../utils/calculations';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  PlusCircle,
  Eye,
  Send,
  ShieldCheck,
  Sparkles,
  Building2,
  Calendar,
  Hash,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Search,
  Filter,
  X,
} from 'lucide-react';

interface OperatorPortalViewProps {
  mode: 'welcome_banner' | 'log_entry' | 'log_status';
  onNavigateTab: (tab: string) => void;
}

const DEPARTMENTS: CampusDepartment[] = [
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
  'Freshman Engineering (1st Year)',
  'Hostels & Residential Blocks',
  'Administration & Management',
  'Transport & Fleet Facilities',
  'Central Library & Labs',
];

const SAMPLE_PROOFS: {
  label: string;
  type: ProofAttachmentType;
  fileName: string;
  fileSize: string;
  url: string;
  meterId: string;
}[] = [
  {
    label: 'Substation Digital Meter Photo (JPG)',
    type: 'photo',
    fileName: 'CSE_Substation_Meter_Reading_Mar2026.jpg',
    fileSize: '1.42 MB',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    meterId: 'MTR-EB-2026-8841',
  },
  {
    label: 'TANGEDCO HT Electricity Bill (PDF)',
    type: 'pdf',
    fileName: 'TANGEDCO_HT_Bill_Receipt_MKCE_2026.pdf',
    fileSize: '640 KB',
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
    meterId: 'HT-BILL-2026-0319',
  },
  {
    label: 'Campus Fleet Diesel Logbook Photo (JPG)',
    type: 'photo',
    fileName: 'Bus_Fleet_Diesel_Voucher_Scan.jpg',
    fileSize: '1.85 MB',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    meterId: 'DSL-VCH-2026-412',
  },
  {
    label: 'Rooftop Solar Inverter Telemetry Audit (PDF)',
    type: 'pdf',
    fileName: 'Solar_Grid_Generation_Audit_Report.pdf',
    fileSize: '920 KB',
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    meterId: 'SLR-INV-2026-109',
  },
];

export const OperatorPortalView: React.FC<OperatorPortalViewProps> = ({
  mode,
  onNavigateTab,
}) => {
  const { currentUser } = useAuth();
  const { records, addRecord, updateRecord } = useEmissions();

  // Form state for Log Entry with Photos or PDF (pre-filled with ready defaults so Log Entry works immediately)
  const [title, setTitle] = useState(
    `${currentUser?.department || 'CSE'} Block Substation Electricity Reading — ${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}`
  );
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<EmissionSourceCategory>('department_electricity');
  const [department, setDepartment] = useState<CampusDepartment>(
    currentUser?.department || 'CSE'
  );
  const [facilityLocation, setFacilityLocation] = useState(
    `${currentUser?.department || 'CSE'} Main Block · Sub-Meter Panel #04`
  );
  const [activityValue, setActivityValue] = useState('1420');
  const [meterReadingNumber, setMeterReadingNumber] = useState('MTR-EB-2026-8841');
  const [proofType, setProofType] = useState<ProofAttachmentType>('photo');
  const [proofFileName, setProofFileName] = useState(
    'CSE_Substation_Meter_Reading_Mar2026.jpg'
  );
  const [proofFileSize, setProofFileSize] = useState('1.42 MB');
  const [proofUrl, setProofUrl] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
  );
  const [notes, setNotes] = useState('');
  const [submitAlert, setSubmitAlert] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Filter & modal state for Log Status page
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedRecord, setInspectedRecord] = useState<EmissionRecord | null>(null);

  const selectedFactorMeta = EMISSION_FACTORS[category];
  const numericValue = parseFloat(activityValue);
  const previewEmissionKg =
    !isNaN(numericValue) && numericValue > 0
      ? Number((numericValue * selectedFactorMeta.factor).toFixed(2))
      : 0;

  // Summary metrics for Operator logs
  const statusStats = useMemo(() => {
    const total = records.length;
    const approved = records.filter((r) => (r.approvalStatus || 'pending') === 'approved').length;
    const pending = records.filter((r) => (r.approvalStatus || 'pending') === 'pending').length;
    const rejected = records.filter((r) => (r.approvalStatus || 'pending') === 'rejected').length;
    return { total, approved, pending, rejected };
  }, [records]);

  const filteredLogs = useMemo(() => {
    return records.filter((r) => {
      const st = r.approvalStatus || (r.verifiedByAdmin ? 'approved' : 'pending');
      const matchStatus = statusFilter === 'all' || st === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.facilityLocation.toLowerCase().includes(q) ||
        (r.meterReadingNumber || '').toLowerCase().includes(q) ||
        (r.proofFileName || '').toLowerCase().includes(q) ||
        r.reportedBy.userName.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [records, statusFilter, searchQuery]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setProofType(isPdf ? 'pdf' : 'photo');
    setProofFileName(file.name);
    const sizeKB = Math.max(12, Math.round(file.size / 1024));
    setProofFileSize(
      sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB} KB`
    );

    if (isPdf) {
      setProofUrl(
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 640;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.65);
              setProofUrl(compressed);
              return;
            }
          } catch {
            // Fall back to original dataUrl
          }
          setProofUrl(dataUrl);
        };
        img.onerror = () => setProofUrl(dataUrl);
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAlert(null);

    if (!title.trim() || !facilityLocation.trim() || isNaN(numericValue) || numericValue <= 0) {
      setSubmitAlert({
        type: 'error',
        text: 'Please complete the Log Title, Facility Location, and a valid positive Activity Value.',
      });
      return;
    }

    if (!proofFileName.trim() || !proofUrl.trim()) {
      setSubmitAlert({
        type: 'error',
        text: 'Please attach a valid Meter Photo (JPG/PNG) or Official Bill (PDF) proof before submitting.',
      });
      return;
    }

    const res = addRecord({
      title,
      date,
      category,
      department,
      facilityLocation,
      activityValue: numericValue,
      notes:
        notes.trim() ||
        `Submitted by Operator ${currentUser?.name || 'Operator'} with ${proofType.toUpperCase()} proof (${proofFileName}) for Admin verification.`,
      proofType,
      proofUrl,
      proofFileName,
      proofFileSize,
      meterReadingNumber,
    });

    if (res.success) {
      setSubmitAlert({
        type: 'success',
        text: res.message,
      });
      setTitle('');
      setFacilityLocation('');
      setActivityValue('');
      setNotes('');
    } else {
      setSubmitAlert({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleResubmitForReview = (rec: EmissionRecord) => {
    updateRecord(rec.id, {
      approvalStatus: 'pending',
      verifiedByAdmin: false,
      adminRemarks: 'Re-submitted by Operator with updated Photo/PDF proof for Admin review.',
      reviewedAt: undefined,
    });
  };

  // ============================================================================
  // MODE 1: WELCOME BANNER ON DASHBOARD FOR OPERATORS
  // ============================================================================
  if (mode === 'welcome_banner') {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <img
              src={AI_CARBON_LOGO_URL}
              onError={(e) => {
                (e.target as HTMLImageElement).src = AI_CARBON_LOGO_FALLBACK;
              }}
              alt="Carbon Intelligence AI Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shrink-0 bg-white"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Authorized Data Operator Portal · Default Pass: opr@2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Dept: {currentUser?.department || 'CSE'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Welcome back, {currentUser?.name || 'Campus Operator'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Submit campus electricity, diesel fleet, solar generation, and waste telemetry logs with{' '}
                <strong className="text-cyan-300">Photo (JPG/PNG) or PDF proof</strong> and track live{' '}
                <strong className="text-emerald-300">Admin Log Approval Status</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('operator_log_entry')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Log Entry (Photo / PDF)</span>
            </button>
            <button
              onClick={() => onNavigateTab('operator_log_status')}
              className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Log Approval & Status ({statusStats.pending} Pending)</span>
            </button>
          </div>
        </div>

        {/* 4 Status Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase text-slate-300">Total Operator Logs</div>
            <div className="text-xl font-extrabold font-mono text-white mt-0.5">
              {statusStats.total}
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase text-amber-300">
              Awaiting Admin Approval
            </div>
            <div className="text-xl font-extrabold font-mono text-amber-300 mt-0.5">
              {statusStats.pending}
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase text-emerald-300">
              Approved by Admin
            </div>
            <div className="text-xl font-extrabold font-mono text-emerald-300 mt-0.5">
              {statusStats.approved}
            </div>
          </div>
          <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase text-rose-300">
              Returned / Rejected
            </div>
            <div className="text-xl font-extrabold font-mono text-rose-300 mt-0.5">
              {statusStats.rejected}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MODE 2: OPERATOR LOG ENTRY WITH PHOTOS OR PDF
  // ============================================================================
  if (mode === 'log_entry') {
    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={AI_CARBON_LOGO_URL}
              onError={(e) => {
                (e.target as HTMLImageElement).src = AI_CARBON_LOGO_FALLBACK;
              }}
              alt="Carbon C AI Logo"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 bg-white shrink-0"
            />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Operator Module · Default Password: opr@2026
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold">
                Carbon Emission Log Entry with Photo or PDF Proof
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Every operator log entry requires a supporting Meter Reading Photo (JPG/PNG) or Bill/Audit Document (PDF) for Admin approval.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('operator_log_status')}
              className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>View Status Page of Each Log ({statusStats.total})</span>
            </button>
          </div>
        </div>

        {submitAlert && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              submitAlert.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              {submitAlert.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{submitAlert.text}</span>
            </div>
            {submitAlert.type === 'success' && (
              <button
                onClick={() => onNavigateTab('operator_log_status')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
              >
                Check Approval Status →
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Columns: Log Entry Form */}
          <form
            onSubmit={handleSubmitLog}
            className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  <span>New Campus Telemetry Log Entry</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged by: <strong>{currentUser?.name}</strong> ({currentUser?.email})
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Routes to Admin Approval Queue
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Log Entry Title / Description *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., CSE Main Block Substation EB Reading — March 2026"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Emission Source Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EmissionSourceCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  {Object.entries(EMISSION_FACTORS).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label} ({info.scope})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Campus Department / Block *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as CampusDepartment)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Reading Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Facility / Room Location *
                </label>
                <input
                  type="text"
                  required
                  value={facilityLocation}
                  onChange={(e) => setFacilityLocation(e.target.value)}
                  placeholder="e.g., Block-A Panel #04"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Meter / Voucher Serial # *
                </label>
                <input
                  type="text"
                  required
                  value={meterReadingNumber}
                  onChange={(e) => setMeterReadingNumber(e.target.value)}
                  placeholder="e.g., MTR-EB-2026-8841"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Activity Value ({selectedFactorMeta.unit}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={activityValue}
                  onChange={(e) => setActivityValue(e.target.value)}
                  placeholder={`Enter ${selectedFactorMeta.unit}...`}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Factor: {selectedFactorMeta.factor} kg CO2e / {selectedFactorMeta.unit}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Calculated Carbon Footprint
                </div>
                <div
                  className={`text-xl font-extrabold font-mono mt-0.5 ${
                    previewEmissionKg < 0 ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {formatKgCO2e(previewEmissionKg)}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Equivalent: {formatTonsCO2e(previewEmissionKg / 1000)}
                </div>
              </div>
            </div>

            {/* Proof Upload Section (Photo or PDF) */}
            <div className="border-2 border-dashed border-blue-300 bg-blue-50/40 rounded-2xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Attach Verification Proof (Photo JPG/PNG or Bill PDF) *</span>
                  </label>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Admin PRANITH SRIRAM G will inspect this proof before approving the log entry.
                  </p>
                </div>

                {/* Proof Type Toggle */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setProofType('photo')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      proofType === 'photo'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo Proof</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProofType('pdf')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      proofType === 'pdf'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF Document</span>
                  </button>
                </div>
              </div>

              {/* File Input + Quick Sample Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col items-center justify-center p-3.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl cursor-pointer transition-colors text-center">
                  <Upload className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">
                    Upload Local Photo or PDF File
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Supports .jpg, .png, .webp, .pdf (Max 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="bg-white border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-500 mb-1.5">
                    Or Pick Verified Campus Proof Template:
                  </div>
                  <div className="space-y-1">
                    {SAMPLE_PROOFS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setProofType(sample.type);
                          setProofFileName(sample.fileName);
                          setProofFileSize(sample.fileSize);
                          setProofUrl(sample.url);
                          setMeterReadingNumber(sample.meterId);
                        }}
                        className="w-full text-left text-[11px] px-2 py-1 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium truncate flex items-center gap-1.5 cursor-pointer"
                      >
                        {sample.type === 'pdf' ? (
                          <FileText className="w-3 h-3 text-rose-600 shrink-0" />
                        ) : (
                          <ImageIcon className="w-3 h-3 text-blue-600 shrink-0" />
                        )}
                        <span className="truncate">{sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Operator Verification Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add remarks about shift reading, seal condition, or tariff slab..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Log with Proof for Admin Approval</span>
              </button>
            </div>
          </form>

          {/* Right 5 Columns: Live Proof Attachment Preview & Approval Workflow Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Live Attached Proof Preview</span>
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    proofType === 'pdf'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {proofType === 'pdf' ? 'PDF Document Proof' : 'Photo Image Proof'}
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative h-56 flex items-center justify-center">
                <img
                  src={proofUrl}
                  alt={proofFileName}
                  className="w-full h-full object-cover opacity-90"
                />
                {proofType === 'pdf' && (
                  <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center p-4 text-center text-white">
                    <FileText className="w-12 h-12 text-rose-400 mb-2" />
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                      Official PDF Proof Attached
                    </div>
                    <div className="text-sm font-mono font-bold mt-1 break-all px-4">
                      {proofFileName}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      File Size: {proofFileSize} · Meter/Ref: {meterReadingNumber}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Attached File:</span>
                  <span className="font-mono font-bold text-slate-900 truncate max-w-[220px]">
                    {proofFileName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">File Size / Type:</span>
                  <span className="font-mono text-slate-800">
                    {proofFileSize} ({proofType.toUpperCase()})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Meter / Bill Ref #:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {meterReadingNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Workflow explanation card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 border border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Admin Proof Verification Protocol
              </div>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    Operator logs activity reading with <strong className="text-white">Photo or PDF proof</strong> using default password <code className="text-cyan-300">opr@2026</code>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    Log enters <strong className="text-amber-300">Pending Approval</strong> status on the Status Page of Each Log.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    Administrator <strong className="text-white">PRANITH SRIRAM G</strong> checks the attached proof and marks the log <strong className="text-emerald-300">Approved</strong> or <strong className="text-rose-300">Rejected</strong> with remarks.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MODE 3: LOG APPROVAL FROM ADMIN & STATUS PAGE OF EACH LOG
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={AI_CARBON_LOGO_URL}
            onError={(e) => {
              (e.target as HTMLImageElement).src = AI_CARBON_LOGO_FALLBACK;
            }}
            alt="Carbon C AI Logo"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 bg-white shrink-0"
          />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
              Operator Telemetry Governance · Status Page of Each Log
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Log Approval from Admin & Status Page of Each Log
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Track real-time verification status, attached Photo/PDF proof, and Admin remarks for every submitted carbon log.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('operator_log_entry')}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Submit New Log with Proof</span>
        </button>
      </div>

      {/* KPI Status Filter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-mono uppercase opacity-75">All Submitted Logs</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{statusStats.total}</div>
          <div className="text-[11px] mt-1 opacity-75">With Photo or PDF Proof</div>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
              : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:border-amber-300'
          }`}
        >
          <div className="text-[11px] font-mono uppercase font-bold">Pending Admin Approval</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{statusStats.pending}</div>
          <div className="text-[11px] mt-1">Awaiting Proof Inspection</div>
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-emerald-50/70 text-emerald-950 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-mono uppercase font-bold">Approved by Admin</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{statusStats.approved}</div>
          <div className="text-[11px] mt-1">Proof Checked & Verified</div>
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
              : 'bg-rose-50/70 text-rose-950 border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="text-[11px] font-mono uppercase font-bold">Rejected / Needs Fix</div>
          <div className="text-2xl font-extrabold font-mono mt-1">{statusStats.rejected}</div>
          <div className="text-[11px] mt-1">Action Required by Operator</div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search log by title, department, meter serial #, proof file name, or operator..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Showing {filteredLogs.length} of {records.length} logs</span>
        </div>
      </div>

      {/* Status Cards List of Each Log */}
      <div className="space-y-4">
        {filteredLogs.map((rec) => {
          const status = rec.approvalStatus || (rec.verifiedByAdmin ? 'approved' : 'pending');
          const pType = rec.proofType || 'photo';

          return (
            <div
              key={rec.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                      {rec.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {rec.department} · {rec.scope}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
                        pType === 'pdf'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {pType === 'pdf' ? (
                        <FileText className="w-3 h-3" />
                      ) : (
                        <ImageIcon className="w-3 h-3" />
                      )}
                      <span>{pType.toUpperCase()} Proof: {rec.proofFileName || 'Meter_Proof.jpg'}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{rec.title}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>
                      Location: <strong className="text-slate-700">{rec.facilityLocation}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Date: <strong className="text-slate-700">{rec.date}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Meter Ref:{' '}
                      <strong className="font-mono text-slate-800">
                        {rec.meterReadingNumber || 'MTR-2026-001'}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Logged By:{' '}
                      <strong className="text-slate-700">{rec.reportedBy.userName}</strong>
                    </span>
                  </div>
                </div>

                {/* Right Metrics + Status Badge */}
                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      Activity / Emission
                    </div>
                    <div className="text-sm font-extrabold font-mono text-slate-900">
                      {rec.activityValue.toLocaleString()} {rec.unit} →{' '}
                      <span className="text-blue-700">
                        {formatKgCO2e(rec.totalEmissionKgCO2e)}
                      </span>
                    </div>
                  </div>

                  {status === 'approved' && (
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>APPROVED BY ADMIN</span>
                    </span>
                  )}
                  {status === 'pending' && (
                    <span className="px-3.5 py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>PENDING ADMIN APPROVAL</span>
                    </span>
                  )}
                  {status === 'rejected' && (
                    <span className="px-3.5 py-2 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 font-extrabold text-xs flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>REJECTED BY ADMIN</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 3-Step Visual Approval Pipeline & Proof Action Row */}
              <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Step 1 */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-emerald-950">1. Log & Proof Uploaded</div>
                      <div className="text-[10px] text-emerald-700 truncate">
                        {rec.proofFileName || 'Attached'} ({rec.proofFileSize || '1.2 MB'})
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                      status === 'pending'
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <ShieldCheck
                      className={`w-4 h-4 shrink-0 ${
                        status === 'pending' ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    />
                    <div>
                      <div className="font-bold">2. Admin Proof Inspection</div>
                      <div className="text-[10px] opacity-80">
                        {status === 'pending'
                          ? 'In Queue (PRANITH SRIRAM G)'
                          : `Checked by ${rec.reviewedBy || 'PRANITH SRIRAM G'}`}
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                      status === 'approved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : status === 'rejected'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {status === 'approved' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : status === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold">
                        3.{' '}
                        {status === 'approved'
                          ? 'Final Status: Approved'
                          : status === 'rejected'
                          ? 'Final Status: Rejected'
                          : 'Awaiting Decision'}
                      </div>
                      <div className="text-[10px] opacity-80">
                        {rec.reviewedAt || 'Pending timestamp'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-4 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => setInspectedRecord(rec)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inspect Attached {pType.toUpperCase()} Proof</span>
                  </button>

                  {status === 'rejected' && (
                    <button
                      onClick={() => handleResubmitForReview(rec)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Submit for Approval</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Remarks Banner */}
              {rec.adminRemarks && (
                <div
                  className={`mt-3 p-3 rounded-xl text-xs border flex items-start gap-2 ${
                    status === 'rejected'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-bold">Admin Review Remarks: </span>
                    <span>{rec.adminRemarks}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Proof Modal Inspector */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-cyan-400">
                  Attached Operator Proof · {inspectedRecord.id}
                </div>
                <h3 className="text-base font-bold">{inspectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setInspectedRecord(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 h-72 relative flex items-center justify-center">
                <img
                  src={
                    inspectedRecord.proofUrl ||
                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt={inspectedRecord.proofFileName || 'Proof'}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-slate-400 font-mono text-[10px] uppercase">File Name</div>
                  <div className="font-bold text-slate-900 truncate">
                    {inspectedRecord.proofFileName || 'Meter_Reading_Proof.jpg'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono text-[10px] uppercase">Meter Serial #</div>
                  <div className="font-mono font-bold text-blue-700">
                    {inspectedRecord.meterReadingNumber || 'MTR-EB-2026'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono text-[10px] uppercase">Approval Status</div>
                  <div className="font-bold uppercase text-slate-900">
                    {inspectedRecord.approvalStatus || 'pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
