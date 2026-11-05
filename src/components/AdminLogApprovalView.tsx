import React, { useState } from 'react';
import { useEmissions } from '../context/EmissionContext';
import { useAuth } from '../context/AuthContext';
import {
  EmissionRecord,
  AI_CARBON_LOGO_URL,
  AI_CARBON_LOGO_FALLBACK,
} from '../types';
import { EMISSION_FACTORS } from '../utils/calculations';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon,
  Search,
  Building2,
  Hash,
  Calendar,
  UserCheck,
  AlertTriangle,
  X,
  FileCheck,
} from 'lucide-react';

export const AdminLogApprovalView: React.FC = () => {
  const { records, approveRecord, rejectRecord } = useEmissions();
  const { currentUser } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingRecord, setInspectingRecord] = useState<EmissionRecord | null>(null);
  const [adminRemarkInput, setAdminRemarkInput] = useState('');
  const [actionBanner, setActionBanner] = useState<{ text: string; type: 'approve' | 'reject' } | null>(null);

  const pendingLogs = records.filter((r) => (r.approvalStatus || 'pending') === 'pending');
  const approvedLogs = records.filter((r) => r.approvalStatus === 'approved');
  const rejectedLogs = records.filter((r) => r.approvalStatus === 'rejected');

  const filteredLogs = records.filter((r) => {
    const status = r.approvalStatus || 'pending';
    const matchesTab = activeFilter === 'all' || status === activeFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportedBy.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.proofFileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.meterReadingNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenInspector = (rec: EmissionRecord) => {
    setInspectingRecord(rec);
    setAdminRemarkInput(
      rec.adminRemarks ||
        `Verified ${rec.proofType?.toUpperCase() || 'PHOTO'} proof (${rec.proofFileName || 'Meter_Proof.jpg'}) against meter #${rec.meterReadingNumber || 'MTR-2026'}.`
    );
  };

  const handleApproveLog = (rec: EmissionRecord, customRemarks?: string) => {
    approveRecord(rec.id, customRemarks || adminRemarkInput);
    setActionBanner({
      text: `Approved log "${rec.title}" submitted by ${rec.reportedBy.userName} after verifying ${rec.proofType?.toUpperCase() || 'PHOTO'} proof!`,
      type: 'approve',
    });
    setInspectingRecord(null);
    setTimeout(() => setActionBanner(null), 4500);
  };

  const handleRejectLog = (rec: EmissionRecord, customRemarks?: string) => {
    const reason =
      customRemarks?.trim() ||
      adminRemarkInput.trim() ||
      'Uploaded Photo/PDF proof does not match meter serial number or requires clearer resolution.';
    rejectRecord(rec.id, reason);
    setActionBanner({
      text: `Rejected log "${rec.title}" (${rec.reportedBy.userName}) with proof verification remarks.`,
      type: 'reject',
    });
    setInspectingRecord(null);
    setTimeout(() => setActionBanner(null), 4500);
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Admin Log Approval & Proof Verification Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <img
              src={AI_CARBON_LOGO_URL}
              onError={(e) => {
                (e.target as HTMLImageElement).src = AI_CARBON_LOGO_FALLBACK;
              }}
              alt="Carbon AI Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-cyan-200 shadow-2xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  Admin Log Approval & Proof Inspector
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-mono">
                  Officer: {currentUser?.name || 'PRANITH SRIRAM G'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                <span>Operator Log Approval & Proof Verification</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
                Inspect attached <strong className="text-blue-700">Meter Photos (JPG/PNG)</strong> and{' '}
                <strong className="text-rose-700">Utility Tax Invoices (PDF)</strong> submitted by Operators before approving or rejecting carbon logs.
              </p>
            </div>
          </div>

          {/* Summary KPI Pills */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <div className="text-[10px] font-mono uppercase text-amber-700 font-bold">Pending Proof</div>
              <div className="text-xl font-black font-mono text-amber-700">{pendingLogs.length}</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">Approved</div>
              <div className="text-xl font-black font-mono text-emerald-700">{approvedLogs.length}</div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <div className="text-[10px] font-mono uppercase text-rose-700 font-bold">Rejected</div>
              <div className="text-xl font-black font-mono text-rose-700">{rejectedLogs.length}</div>
            </div>
          </div>
        </div>

        {/* Action Notification Banner */}
        {actionBanner && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 animate-fade-in ${
              actionBanner.type === 'approve'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            {actionBanner.type === 'approve' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionBanner.text}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Proof Review ({pendingLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved Logs ({approvedLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeFilter === 'rejected'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejected Logs ({rejectedLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Submitted Logs ({records.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operator, meter #, title..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Log Approval List with Proof Cards */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="text-sm font-bold text-slate-800">
              No operator logs in this queue
            </div>
            <p className="text-xs text-slate-500">
              Switch tabs above to inspect approved or rejected operator logs and their attached Photo/PDF proofs.
            </p>
          </div>
        ) : (
          filteredLogs.map((rec) => {
            const status = rec.approvalStatus || 'pending';
            const pType = rec.proofType || 'photo';

            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left: Log Metadata & Operator Details (7 cols) */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>WAITING FOR PROOF CHECK</span>
                        </span>
                      )}
                      {status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>PROOF VERIFIED & APPROVED</span>
                        </span>
                      )}
                      {status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>REJECTED</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                        {rec.scope} · {EMISSION_FACTORS[rec.category]?.label || rec.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        Operator: <strong className="text-slate-900">{rec.reportedBy.userName}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{rec.department}</strong> ({rec.facilityLocation})
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        Ref: <strong>{rec.meterReadingNumber || 'MTR-2026'}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {rec.date}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
                        Activity: <strong>{rec.activityValue.toLocaleString()} {rec.unit}</strong>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900">
                        Carbon: <strong>{rec.totalEmissionKgCO2e.toLocaleString()} kg CO₂e</strong> (
                        {(rec.totalEmissionKgCO2e / 1000).toFixed(3)} tCO₂e)
                      </div>
                    </div>

                    {rec.notes && (
                      <p className="text-xs text-slate-500 italic">
                        Operator Note: "{rec.notes}"
                      </p>
                    )}

                    {rec.adminRemarks && (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <strong>Admin Remark ({rec.reviewedBy || 'PRANITH SRIRAM G'}):</strong>{' '}
                        {rec.adminRemarks}
                      </div>
                    )}
                  </div>

                  {/* Right: Proof Thumbnail & Admin Decision Actions (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {pType === 'pdf' ? (
                          <div className="w-8 h-9 rounded bg-rose-600 text-white font-mono font-black text-[10px] flex items-center justify-center shrink-0">
                            PDF
                          </div>
                        ) : (
                          <div className="w-8 h-9 rounded bg-blue-600 text-white font-mono font-black text-[10px] flex items-center justify-center shrink-0">
                            IMG
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {rec.proofFileName || 'Meter_Reading_Proof.jpg'}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {pType.toUpperCase()} Proof · {rec.proofFileSize || '1.2 MB'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenInspector(rec)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Check Proof</span>
                      </button>
                    </div>

                    {/* Visual Thumbnail if Photo */}
                    {pType === 'photo' && (
                      <div
                        onClick={() => handleOpenInspector(rec)}
                        className="relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer group"
                      >
                        <img
                          src={
                            rec.proofUrl ||
                            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
                          }
                          alt={rec.proofFileName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          Click to Enlarge & Verify Photo Proof
                        </div>
                      </div>
                    )}

                    {/* Direct Approve / Reject Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() =>
                          handleApproveLog(
                            rec,
                            `Checked ${pType.toUpperCase()} proof (${rec.proofFileName || 'proof'}) & verified reading.`
                          )
                        }
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Log</span>
                      </button>

                      <button
                        onClick={() => handleOpenInspector(rec)}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject / Remark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Proof Verification Inspector Modal */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-800 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setInspectingRecord(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Proof Verification Inspector</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{inspectingRecord.title}</h3>
              <p className="text-xs text-slate-500">
                Submitted by Operator <strong>{inspectingRecord.reportedBy.userName}</strong> · Department:{' '}
                <strong>{inspectingRecord.department}</strong> · Meter/Invoice:{' '}
                <strong className="font-mono">{inspectingRecord.meterReadingNumber || 'MTR-2026'}</strong>
              </p>
            </div>

            {/* Proof Display */}
            {inspectingRecord.proofType === 'pdf' ? (
              <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-3 mb-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 rounded bg-rose-600 text-white font-mono font-black text-xs flex items-center justify-center">
                      PDF
                    </div>
                    <div>
                      <div className="text-sm font-bold">{inspectingRecord.proofFileName}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        Size: {inspectingRecord.proofFileSize || '648 KB'} · Official Tax Invoice / Utility Statement
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold">
                    PDF PROOF DOCUMENT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-800 p-3.5 rounded-lg border border-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">FACILITY</span>
                    <span className="text-white font-bold">{inspectingRecord.facilityLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">METER / INVOICE NO.</span>
                    <span className="text-cyan-300 font-bold">{inspectingRecord.meterReadingNumber || 'INV-2026'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">RECORDED CONSUMPTION</span>
                    <span className="text-emerald-300 font-bold">
                      {inspectingRecord.activityValue.toLocaleString()} {inspectingRecord.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CALCULATED EMISSION</span>
                    <span className="text-amber-300 font-bold">
                      {inspectingRecord.totalEmissionKgCO2e.toLocaleString()} kg CO₂e
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 space-y-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 max-h-[340px] flex items-center justify-center">
                  <img
                    src={
                      inspectingRecord.proofUrl ||
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
                    }
                    alt={inspectingRecord.proofFileName}
                    className="w-full h-auto max-h-[340px] object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                  <span>Attached Photo: {inspectingRecord.proofFileName}</span>
                  <span>Consumption: {inspectingRecord.activityValue.toLocaleString()} {inspectingRecord.unit}</span>
                </div>
              </div>
            )}

            {/* Admin Verification Remarks Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Proof Verification Remarks (Visible on Operator Status Page)
                </label>
                <textarea
                  rows={2}
                  value={adminRemarkInput}
                  onChange={(e) => setAdminRemarkInput(e.target.value)}
                  placeholder="Enter proof verification notes or reason for rejection..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInspectingRecord(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectLog(inspectingRecord)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Log</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveLog(inspectingRecord)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Proof & Approve Log</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
