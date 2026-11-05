import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  CampusDepartment,
  DesignationCategory,
  AI_CARBON_LOGO_URL,
  AI_CARBON_LOGO_FALLBACK,
} from '../types';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Eye,
  AlertTriangle,
  Trash2,
  UserX,
  Send,
  X,
  Plus,
  UserPlus,
  KeyRound,
} from 'lucide-react';

export const AdminUserManagementView: React.FC = () => {
  const { users, approveUser, rejectUser, deleteUser, adminCreateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'operators' | 'viewers' | 'rejected'>('pending');
  const [rejectingUser, setRejectingUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Add Login / User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addRole, setAddRole] = useState<'operator' | 'viewer'>('operator');
  const [addInitialStatus, setAddInitialStatus] = useState<'pending' | 'accepted'>('pending');
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addDepartment, setAddDepartment] = useState<CampusDepartment>('CSE');
  const [addDesignation, setAddDesignation] = useState<DesignationCategory>('Supporting Staff');
  const [addEmployeeId, setAddEmployeeId] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addPassword, setAddPassword] = useState('opr@2026');
  const [addError, setAddError] = useState<string | null>(null);

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const operatorUsers = users.filter((u) => u.role === 'operator' && u.status === 'accepted');
  const viewerUsers = users.filter((u) => u.role === 'viewer' && u.status === 'accepted');
  const rejectedUsers = users.filter((u) => u.status === 'rejected');

  const handleOpenAddModal = (
    role: 'operator' | 'viewer',
    initialStatus: 'pending' | 'accepted' = 'accepted'
  ) => {
    setAddRole(role);
    setAddInitialStatus(initialStatus);
    setAddName('');
    setAddEmail('');
    setAddEmployeeId('');
    setAddPhone('');
    setAddPassword(role === 'operator' ? 'opr@2026' : 'stu@2026');
    setAddError(null);
    setIsAddModalOpen(true);
  };

  const handleConfirmAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!addName.trim() || !addEmail.trim() || !addEmployeeId.trim()) {
      setAddError('Name, institutional email, and official ID are required.');
      return;
    }
    const res = await adminCreateUser({
      name: addName.trim(),
      email: addEmail.trim(),
      role: addRole,
      department: addDepartment,
      designation: addDesignation,
      employeeOrStudentId: addEmployeeId.trim(),
      phone: addPhone.trim() || undefined,
      password: addPassword || (addRole === 'operator' ? 'opr@2026' : 'stu@2026'),
      initialStatus: addInitialStatus,
    });

    if (res.success) {
      setActionSuccess(res.message);
      setIsAddModalOpen(false);
      if (addInitialStatus === 'pending') {
        setActiveTab('pending');
      } else if (addRole === 'operator') {
        setActiveTab('operators');
      } else {
        setActiveTab('viewers');
      }
      setTimeout(() => setActionSuccess(null), 4500);
    } else {
      setAddError(res.message);
    }
  };

  const handleApprove = async (user: User) => {
    const success = await approveUser(user.id);
    if (success) {
      setActionSuccess(
        `Login application for ${user.name} (${user.role.toUpperCase()}) was APPROVED! Default Operator Password: opr@2026.`
      );
      setTimeout(() => setActionSuccess(null), 4500);
    }
  };

  const handleOpenReject = (user: User) => {
    setRejectingUser(user);
    setRejectionReason('Registration does not match institutional faculty/operator domain guidelines.');
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingUser) return;

    const success = await rejectUser(rejectingUser.id, rejectionReason);
    if (success) {
      setActionSuccess(
        `Login application for ${rejectingUser.name} was REJECTED with feedback notice dispatched to ${rejectingUser.email}.`
      );
      setRejectingUser(null);
      setTimeout(() => setActionSuccess(null), 4500);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Admin Central Header */}
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
                <span className="text-xs font-mono font-semibold text-blue-700 uppercase tracking-wider">
                  M.Kumarasamy College of Engineering
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">Login Approval & Add User Module</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Login Approval Queue & User Provisioning</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Admin Officer: <strong className="text-slate-900">PRANITH SRIRAM G</strong> (<strong className="text-blue-700 font-mono">sriramacess2302@gmail.com</strong>). New logins wait for approval here, or you can directly add new Operator (<code className="text-emerald-700 font-bold">opr@2026</code>) and Viewer login accounts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenAddModal('operator', 'pending')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New Login (Wait for Approval)</span>
            </button>

            <button
              onClick={() => handleOpenAddModal('operator', 'accepted')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Operator (opr@2026)</span>
            </button>

            <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-right">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Waiting Approval</div>
              <div className="text-lg font-black font-mono text-amber-600 tabular-nums leading-tight">
                {pendingUsers.length}
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center gap-2 pt-4 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>New Logins Waiting for Approval</span>
            {pendingUsers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white font-bold font-mono text-[10px] rounded">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('operators')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'operators'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved Operators ({operatorUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('viewers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'viewers'
                ? 'bg-purple-100 text-purple-900 border border-purple-300 font-semibold'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span>Viewer Records ({viewerUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-100 text-rose-900 border border-rose-300 font-semibold'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected Logins ({rejectedUsers.length})</span>
          </button>
        </div>
      </div>

      {/* 1. PENDING LOGIN APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-800">
                New Login Registrations Waiting for Admin Approval
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Any new user who registers from the Login Page or is added to the waiting queue appears here until approved by Admin.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-700 font-semibold">
                {pendingUsers.length} waiting
              </span>
              <button
                onClick={() => handleOpenAddModal('operator', 'pending')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Login to Queue</span>
              </button>
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-3">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-600/70" />
              <div className="font-semibold text-slate-800">
                All new login applications have been approved!
              </div>
              <button
                onClick={() => handleOpenAddModal('operator', 'pending')}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Login Application</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                        WAITING FOR LOGIN APPROVAL
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                        Role: {user.role}
                      </span>
                      {user.role === 'operator' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Default Pass: opr@2026
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
                      <span>
                        Email: <strong className="text-slate-900">{user.email}</strong>
                      </span>
                      <span>
                        Department: <strong>{user.department}</strong>
                      </span>
                      <span>
                        Designation: <strong>{user.designation}</strong>
                      </span>
                      {user.classSection && (
                        <span>
                          Class/Sec: <strong className="text-blue-700">{user.classSection}</strong>
                        </span>
                      )}
                      <span>
                        Official ID: <strong>{user.employeeOrStudentId}</strong>
                      </span>
                      {user.phone && (
                        <span>
                          Phone: <strong>{user.phone}</strong>
                        </span>
                      )}
                    </div>

                    {user.notes && (
                      <div className="text-[11px] text-slate-500 italic">"{user.notes}"</div>
                    )}

                    <div className="text-[10px] font-mono text-slate-400">
                      Registered on: {user.registrationDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <button
                      onClick={() => handleApprove(user)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Login</span>
                    </button>
                    <button
                      onClick={() => handleOpenReject(user)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. OPERATOR RECORDS */}
      {activeTab === 'operators' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-800">
                Authorized Environmental Operators (Default Password: <code className="text-emerald-700 font-bold">opr@2026</code>)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Operators can submit carbon emission logs with Photo or PDF proof and view the status of each log.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-700 font-semibold">
                {operatorUsers.length} active
              </span>
              <button
                onClick={() => handleOpenAddModal('operator', 'accepted')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Operator</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-3 px-4">Operator Name</th>
                  <th className="py-3 px-4">Institutional Email</th>
                  <th className="py-3 px-4">Department & Designation</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Default Password</th>
                  <th className="py-3 px-4">Status & Approval</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {operatorUsers.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {op.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{op.email}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900">{op.department}</div>
                      <div className="text-[10px] text-slate-500">{op.designation}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {op.employeeOrStudentId}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[11px]">
                        opr@2026
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                        LOGIN APPROVED
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Reviewed by {op.reviewedBy || 'PRANITH SRIRAM G'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteUser(op.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Remove Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. VIEWER RECORDS */}
      {activeTab === 'viewers' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-800">Authorized Dashboard Viewers</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Viewers have controlled read-only access to campus carbon intelligence dashboards & analytical reports.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-purple-700 font-semibold">
                {viewerUsers.length} active
              </span>
              <button
                onClick={() => handleOpenAddModal('viewer', 'accepted')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Viewer</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-3 px-4">Viewer Name</th>
                  <th className="py-3 px-4">Institutional Email</th>
                  <th className="py-3 px-4">Department & Designation</th>
                  <th className="py-3 px-4">Identification No.</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {viewerUsers.map((vw) => (
                  <tr key={vw.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {vw.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{vw.email}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900">{vw.department}</div>
                      <div className="text-[10px] text-slate-500">{vw.designation}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {vw.employeeOrStudentId}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200">
                        ACCEPTED
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Reviewed by {vw.reviewedBy || 'PRANITH SRIRAM G'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteUser(vw.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Remove Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REJECTED APPLICATIONS AUDIT */}
      {activeTab === 'rejected' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rejected Login Applications Audit History</span>
            <span className="font-mono text-rose-700 font-semibold">
              {rejectedUsers.length} records
            </span>
          </div>

          {rejectedUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No rejected login applications on record.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {rejectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-slate-50 transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {user.name} ({user.email})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-100 text-rose-800 border border-rose-200">
                      REJECTED
                    </span>
                  </div>
                  <div className="text-slate-600">
                    Department: {user.department} · Designation: {user.designation} · ID:{' '}
                    {user.employeeOrStudentId}
                  </div>
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                    <strong className="text-rose-900">Rejection Reason Dispatched: </strong>
                    {user.rejectionReason}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Decision recorded by {user.reviewedBy} on {user.reviewedAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-slate-800">
            <button
              onClick={() => setRejectingUser(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Rejection Decision</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Reject Login Application: {rejectingUser.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide an administrative explanation. This will be automatically dispatched to{' '}
                <strong>{rejectingUser.email}</strong>.
              </p>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Invalid employee ID or external organization domain not authorized."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 shadow-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingUser(null)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Rejection & Dispatch Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Login / Operator / Viewer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase mb-2 bg-emerald-50 text-emerald-800 border border-emerald-200">
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Module for Login Approval & User Provisioning</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Register New {addRole === 'operator' ? 'System Operator' : 'Dashboard Viewer'} Login
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure whether this new login should wait in the{' '}
                <strong>Pending Login Approval Queue</strong> or be immediately activated. Default Operator Password is{' '}
                <code className="text-emerald-700 font-bold">opr@2026</code>.
              </p>
            </div>

            {addError && (
              <div className="mb-4 p-3 rounded-lg text-xs bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmAddUser} className="space-y-3.5">
              {/* Approval Mode Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Login Approval Workflow Mode
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAddInitialStatus('pending')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      addInitialStatus === 'pending'
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Wait for Approval</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Places login in Pending Queue
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddInitialStatus('accepted')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      addInitialStatus === 'accepted'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Approve Immediately</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Active login right away
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Category
                  </label>
                  <select
                    value={addRole}
                    onChange={(e) => {
                      const nextRole = e.target.value as 'operator' | 'viewer';
                      setAddRole(nextRole);
                      setAddPassword(nextRole === 'operator' ? 'opr@2026' : 'stu@2026');
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="operator">Operator (Default Pass: opr@2026)</option>
                    <option value="viewer">Viewer (Controlled Read-Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. S. Vignesh (Operator)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email ID
                  </label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="e.g. vignesh.op@mkce.ac.in"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Operator / Staff ID
                  </label>
                  <input
                    type="text"
                    required
                    value={addEmployeeId}
                    onChange={(e) => setAddEmployeeId(e.target.value)}
                    placeholder="e.g. MKCE-OP-08"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={addDepartment}
                    onChange={(e) => setAddDepartment(e.target.value as CampusDepartment)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="ECE">ECE (Electronics & Comm)</option>
                    <option value="EEE">EEE (Electrical & Electronics)</option>
                    <option value="MECH">MECH (Mechanical)</option>
                    <option value="CIVIL">CIVIL (Civil)</option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="AIDS">AIDS (AI & Data Science)</option>
                    <option value="AIML">AIML (AI & Machine Learning)</option>
                    <option value="Administration & Management">Administration & Management</option>
                    <option value="Hostels & Residential Blocks">Hostels & Residential Blocks</option>
                    <option value="Central Library & Labs">Central Library & Labs</option>
                    <option value="Transport & Fleet Facilities">Transport & Fleet Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <select
                    value={addDesignation}
                    onChange={(e) => setAddDesignation(e.target.value as DesignationCategory)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Supporting Staff">Supporting Staff / System Operator</option>
                    <option value="Department Staffs">Department Staffs</option>
                    <option value="Class Advisors">Class Advisors</option>
                    <option value="HOD">HOD (Head of Department)</option>
                    <option value="AHOD">AHOD (Associate HOD)</option>
                    <option value="Manager">Manager</option>
                    <option value="Dean">Dean</option>
                    <option value="Students">Students</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="+91 94440 00000"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Password (Operators: opr@2026)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={addPassword}
                      onChange={(e) => setAddPassword(e.target.value)}
                      placeholder="opr@2026"
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    addInitialStatus === 'pending'
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {addInitialStatus === 'pending'
                      ? 'Add to Login Approval Queue'
                      : `Authorize & Activate ${addRole === 'operator' ? 'Operator' : 'Viewer'}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
