import React, { useState } from 'react';
import { useEmissions } from '../context/EmissionContext';
import { useAuth } from '../context/AuthContext';
import { EmissionRecord, EmissionScope, EmissionSourceCategory, CampusDepartment } from '../types';
import { formatTonsCO2e, EMISSION_FACTORS } from '../utils/calculations';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Download,
  Eye,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { EmissionEntryModal } from './EmissionEntryModal';

export const EmissionRecordsView: React.FC = () => {
  const { records, deleteRecord, clearAllRecords, exportAuditData } = useEmissions();
  const { currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EmissionRecord | null>(null);

  const isOperator = currentUser?.role === 'operator';
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isOperator; // Only authorized operators can change emission records for the whole system

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.facilityLocation.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.reportedBy.userName.toLowerCase().includes(search.toLowerCase());

    const matchesScope = scopeFilter === 'all' || r.scope === scopeFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesDept = departmentFilter === 'all' || r.department === departmentFilter;

    return matchesSearch && matchesScope && matchesCategory && matchesDept;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the emission log "${title}"?`)) {
      deleteRecord(id);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-blue-700 uppercase tracking-wider">
                Audited Carbon Records
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">M.Kumarasamy College Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Greenhouse Gas Emission Logs
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Recorded telemetry for department electricity, hostel utilities, transport fuels, and rooftop solar offsets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <>
                <button
                  onClick={() => exportAuditData('csv')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Export CSV</span>
                </button>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete all emission records? This will leave the registry clean with 0 entries.')) {
                        clearAllRecords();
                      }
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-xs"
                    title="Purge all emission records"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Records</span>
                  </button>
                )}
              </>
            )}

            {isOperator ? (
              <button
                onClick={() => {
                  setEditingRecord(null);
                  setIsEntryModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Environmental Data</span>
              </button>
            ) : isAdmin ? (
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-1.5 font-medium shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Admin Governance Mode (User Mgmt Only · Logs Changed by Operators)</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Viewer: Controlled Read-Only</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility, title, or operator..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="all">All Source Categories</option>
            {Object.entries(EMISSION_FACTORS).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>

          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="all">All GHG Scopes</option>
            <option value="Scope 1">Scope 1 (Direct Fuel & Gas)</option>
            <option value="Scope 2">Scope 2 (Electricity & Solar)</option>
            <option value="Scope 3">Scope 3 (Waste Refuse)</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="all">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="IT">IT</option>
            <option value="AIDS">AIDS</option>
            <option value="AIML">AIML</option>
            <option value="Freshman Engineering (1st Year)">Freshman Engineering (1st Year)</option>
            <option value="Mathematics (Freshman Engineering)">Mathematics (Freshman)</option>
            <option value="Engineering Chemistry (Freshman Engineering)">Chemistry (Freshman)</option>
            <option value="Engineering Physics (Freshman Engineering)">Physics (Freshman)</option>
            <option value="Hostels & Residential Blocks">Hostels & Residential</option>
            <option value="Administration & Management">Administration & Management</option>
            <option value="Transport & Fleet Facilities">Transport Fleet</option>
            <option value="Central Library & Labs">Library & Central Labs</option>
          </select>
        </div>
      </div>

      {/* Records Table or Clean Empty State */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} emission record(s)</span>
          <span className="font-mono text-slate-700 font-semibold">
            Sum: {(filtered.reduce((acc, r) => acc + r.totalEmissionKgCO2e, 0) / 1000).toFixed(2)} tCO₂e
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="font-medium text-slate-700">No emission logs recorded yet.</div>
            <p className="text-slate-400 max-w-sm mx-auto">
              Previous sample logs were deleted. Operators can use the "+ Log Environmental Data" button above to register verified entries.
            </p>
            {canEdit && (
              <div className="pt-1">
                <button
                  onClick={() => {
                    setEditingRecord(null);
                    setIsEntryModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-xs"
                >
                  + Record Entry Now
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Activity Title & Facility</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Scope & Category</th>
                  <th className="py-3 px-4 text-right">Consumption</th>
                  <th className="py-3 px-4 text-right">Emissions (tCO₂e)</th>
                  <th className="py-3 px-4">Logged By</th>
                  {canEdit && <th className="py-3 px-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((record) => {
                  const isSolar = record.category === 'solar_renewable_offset';
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {record.date}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900">{record.title}</div>
                        <div className="text-[11px] text-slate-500">{record.facilityLocation}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700">{record.department}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              record.scope === 'Scope 1'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : record.scope === 'Scope 2'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {record.scope}
                          </span>
                          <span className="text-[11px] text-slate-600">
                            {EMISSION_FACTORS[record.category]?.label || record.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        {record.activityValue.toLocaleString()} {record.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                        <span className={isSolar ? 'text-emerald-700' : 'text-slate-900'}>
                          {record.totalEmissionKgCO2e < 0 ? '-' : ''}
                          {(Math.abs(record.totalEmissionKgCO2e) / 1000).toFixed(3)} t
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        <div>{record.reportedBy.userName}</div>
                        <div className="text-[10px] font-mono capitalize text-slate-400">
                          {record.reportedBy.userRole}
                        </div>
                      </td>
                      {canEdit && (
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingRecord(record);
                                setIsEntryModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-blue-600 rounded transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(record.id, record.title)}
                              className="p-1 text-slate-500 hover:text-rose-600 rounded transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Entry Modal */}
      {isEntryModalOpen && (
        <EmissionEntryModal
          isOpen={isEntryModalOpen}
          onClose={() => {
            setIsEntryModalOpen(false);
            setEditingRecord(null);
          }}
          recordToEdit={editingRecord}
        />
      )}
    </div>
  );
};
