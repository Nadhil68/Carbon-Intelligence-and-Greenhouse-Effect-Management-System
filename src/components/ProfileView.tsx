import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmissions } from '../context/EmissionContext';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  KeyRound,
  Building,
  Briefcase,
  IdCard,
  Phone,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, changePassword, quickSwitchUser } = useAuth();
  const { resetAllCampusData } = useEmissions();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs">
        Please sign in to view your account profile.
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPass.length < 6) {
      setPassMsg({ text: 'New password must contain at least 6 characters.', error: true });
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassMsg({ text: 'New passwords do not match.', error: true });
      return;
    }

    setPassLoading(true);
    try {
      const res = await changePassword(currentPass, newPass);
      if (res.success) {
        setPassMsg({ text: res.message, error: false });
        setCurrentPass('');
        setNewPass('');
        setConfirmNewPass('');
      } else {
        setPassMsg({ text: res.message, error: true });
      }
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold text-blue-700 uppercase tracking-wider">
            M.Kumarasamy College of Engineering
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Institutional Identity & Credentials</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          My Account & Security Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your departmental role credentials, verify approval status, and update security passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Account Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
                  <div className="text-xs text-slate-500 font-mono">{currentUser.email}</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                    currentUser.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : currentUser.status === 'pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  Status: {currentUser.status}
                </span>
                <span className="text-[11px] font-mono text-blue-700 uppercase font-semibold">
                  Role: {currentUser.role}
                </span>
              </div>
            </div>

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Department</span>
                </div>
                <div className="text-slate-900 font-semibold">{currentUser.department}</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Designation / Role</span>
                </div>
                <div className="text-slate-900 font-semibold">
                  {currentUser.designation}
                  {currentUser.classSection && (
                    <span className="text-blue-700 ml-1.5 font-normal">({currentUser.classSection})</span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500 mb-1 flex items-center gap-1.5">
                  <IdCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Employee / Student ID</span>
                </div>
                <div className="text-slate-900 font-mono font-semibold">{currentUser.employeeOrStudentId}</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Phone</span>
                </div>
                <div className="text-slate-900 font-mono">{currentUser.phone || 'Not specified'}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 flex flex-wrap gap-x-6 gap-y-1">
              <div>Registration Date: {currentUser.registrationDate}</div>
              {currentUser.reviewedBy && (
                <div>Reviewed by: {currentUser.reviewedBy} on {currentUser.reviewedAt}</div>
              )}
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Update Account Password</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Passwords are securely encrypted with PBKDF2 SHA-256 and salt.
              </p>
            </div>

            {passMsg && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  passMsg.error
                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                {passMsg.error ? (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{passLoading ? 'Hashing...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (1 Col): Role Switcher & System Reset */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Quick Role Switcher</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch user personas to test views and permissions
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => quickSwitchUser('usr-admin-01')}
                className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between text-xs ${
                  currentUser.role === 'admin'
                    ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold">PRANITH SRIRAM G</div>
                  <div className="text-[10px] text-slate-500">Admin · sriramacess2302@gmail.com</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Admin
                </span>
              </button>

              <button
                onClick={() => quickSwitchUser('usr-op-02')}
                className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between text-xs ${
                  currentUser.id === 'usr-op-02'
                    ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold">Prof. K. Senthil</div>
                  <div className="text-[10px] text-slate-500">Operator · Class Advisor (CSE)</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Operator
                </span>
              </button>

              <button
                onClick={() => quickSwitchUser('usr-vw-02')}
                className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between text-xs ${
                  currentUser.id === 'usr-vw-02'
                    ? 'bg-purple-50 border-purple-200 text-purple-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold">Er. K. Ramasamy</div>
                  <div className="text-[10px] text-slate-500">Viewer · Campus Manager</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">
                  Viewer
                </span>
              </button>

              <button
                onClick={() => quickSwitchUser('usr-op-04')}
                className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between text-xs ${
                  currentUser.id === 'usr-op-04'
                    ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold">Priya Chandran</div>
                  <div className="text-[10px] text-slate-500">Applicant (Pending Operator)</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                  Pending
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold text-slate-700 uppercase font-mono">
              System Reset
            </h2>
            <p className="text-xs text-slate-500">
              Restore initial accounts and clear temporary browser cache.
            </p>
            <button
              onClick={() => {
                if (confirm('Reset system storage to defaults?')) {
                  resetAllCampusData();
                }
              }}
              className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Application Cache</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
