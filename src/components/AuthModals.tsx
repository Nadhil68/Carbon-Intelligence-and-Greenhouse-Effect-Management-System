import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CampusDepartment, DesignationCategory, UserRole } from '../types';
import {
  X,
  Mail,
  Lock,
  User,
  Building,
  Briefcase,
  IdCard,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'register' | 'forgot' | 'status' | null;
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register' | 'forgot' | 'status') => void;
  onOpenEmailDrawer: () => void;
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
  'Mathematics (Freshman Engineering)',
  'Engineering Chemistry (Freshman Engineering)',
  'Engineering Physics (Freshman Engineering)',
  'Freshman Engineering (1st Year)',
  'Hostels & Residential Blocks',
  'Administration & Management',
  'Transport & Fleet Facilities',
  'Central Library & Labs',
];

const DESIGNATIONS: DesignationCategory[] = [
  'Principal',
  'Manager',
  'Dean',
  'HOD',
  'AHOD',
  'Department Staffs',
  'Class Advisors',
  'Students',
  'Controller of Examinations (COE)',
  'Supporting Staff',
];

export const AuthModals: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onSwitchMode,
  onOpenEmailDrawer,
}) => {
  const {
    currentUser,
    login,
    registerUser,
    requestPasswordReset,
    completePasswordReset,
    checkStatusByEmail,
  } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<{ message: string; status?: string } | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('operator');
  const [regDepartment, setRegDepartment] = useState<CampusDepartment>('MECH');
  const [regDesignation, setRegDesignation] = useState<DesignationCategory>('HOD');
  const [regId, setRegId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [statusEmail, setStatusEmail] = useState('');
  const [statusResult, setStatusResult] = useState<ReturnType<typeof checkStatusByEmail> | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);

  if (!mode) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        onClose();
      } else {
        setLoginError({ message: res.message, status: res.status });
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setLoginEmail('sriramacess2302@gmail.com');
    setLoginPassword('Admin@2026');
    setLoginError(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (regPassword.length < 6) {
      setRegError('Password must contain at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (!regId.trim()) {
      setRegError('Please provide your Employee ID or Student Registration Number.');
      return;
    }

    setRegLoading(true);
    try {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        department: regDepartment,
        designation: regDesignation,
        employeeOrStudentId: regId,
        phone: regPhone,
      });

      if (res.success) {
        setRegSuccess(res.message);
      } else {
        setRegError(res.message);
      }
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setForgotLoading(true);

    try {
      if (forgotStep === 1) {
        const res = await requestPasswordReset(forgotEmail);
        if (res.success) {
          setForgotMsg({ text: res.message, error: false });
          if (res.resetToken) {
            setResetToken(res.resetToken);
          }
          setForgotStep(2);
        } else {
          setForgotMsg({ text: res.message, error: true });
        }
      } else {
        if (newPassword.length < 6) {
          setForgotMsg({ text: 'New password must be at least 6 characters.', error: true });
          return;
        }
        if (newPassword !== confirmNewPassword) {
          setForgotMsg({ text: 'Passwords do not match.', error: true });
          return;
        }

        const res = await completePasswordReset(resetToken, newPassword);
        if (res.success) {
          setForgotMsg({ text: res.message, error: false });
          setTimeout(() => {
            onSwitchMode('login');
          }, 2000);
        } else {
          setForgotMsg({ text: res.message, error: true });
        }
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const user = checkStatusByEmail(statusEmail);
    setStatusResult(user);
    setStatusChecked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl p-6 sm:p-7 text-slate-800 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header in modal */}
        <div className="mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
          <img
            src="/mkce_logo.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXR4irQbR68XxJFgeYzWAT1fIOl245qewuZaAGi2XmWw&s';
            }}
            alt="M.Kumarasamy College of Engineering Logo"
            className="h-9 w-auto object-contain"
          />
        </div>

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Sign In to Portal</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Role-based access for Admin, Operator, and Viewer accounts.
              </p>
            </div>

            {loginError && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                  loginError.status === 'pending'
                    ? 'bg-amber-50 border border-amber-200 text-amber-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {loginError.status === 'pending' ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">
                    {loginError.status === 'pending'
                      ? 'Account Pending Approval'
                      : loginError.status === 'rejected'
                      ? 'Registration Request Rejected'
                      : 'Authentication Failed'}
                  </div>
                  <div className="mt-0.5 text-slate-600">{loginError.message}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter the valid mail"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => onSwitchMode('forgot')}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter the password"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-10 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
              >
                {loginLoading ? 'Verifying Credentials...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => onSwitchMode('status')}
                className="hover:text-blue-600 transition-colors underline"
              >
                Check Application Status
              </button>
              <div>
                Don't have an account?{' '}
                <button
                  onClick={() => onSwitchMode('register')}
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors ml-1"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. REGISTER MODE */}
        {mode === 'register' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Create Operator / Viewer Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                New accounts remain in <span className="text-amber-700 font-semibold">Pending</span> state until approved by Administrator PRANITH SRIRAM G.
              </p>
            </div>

            {regSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Registration Submitted Successfully!</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your request is in the Admin queue. When Administrator <strong>PRANITH SRIRAM G</strong> accepts or rejects your application, an automated email notification will be sent to <strong>{regEmail}</strong>.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={onOpenEmailDrawer}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-xs text-slate-800 rounded border border-slate-200 font-mono shadow-xs"
                    >
                      Check Outbound Mailbox
                    </button>
                  )}
                  <button
                    onClick={() => onSwitchMode('login')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs text-white font-semibold rounded shadow-xs"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {regError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Requested System Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('operator')}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${
                        regRole === 'operator'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-900">Operator</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Log & manage environmental emission records
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('viewer')}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${
                        regRole === 'viewer'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-900">Viewer</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        View dashboards, reports & department statistics
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kumar"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email ID</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Enter the valid mail"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value as CampusDepartment)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
                    <select
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value as DesignationCategory)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    >
                      {DESIGNATIONS.map((des) => (
                        <option key={des} value={des}>
                          {des}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Staff ID / Student Roll No.
                    </label>
                    <input
                      type="text"
                      required
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      placeholder="FAC-MECH-102"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Enter the password"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Enter the password"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
                  >
                    {regLoading ? 'Registering...' : 'Submit Registration Application'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              Already registered?{' '}
              <button
                onClick={() => onSwitchMode('login')}
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors ml-1"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Reset Account Password</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                A secure password reset link/token is sent to your registered institutional email.
              </p>
            </div>

            {forgotMsg && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                  forgotMsg.error
                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                {forgotMsg.error ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>{forgotMsg.text}</div>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStep === 1 ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email ID
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter the valid mail"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Verification Reset Token
                    </label>
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="RST-XXXX-XXXX"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      New Secure Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter the password"
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
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Enter the password"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
              >
                {forgotLoading
                  ? 'Processing...'
                  : forgotStep === 1
                  ? 'Send Password Reset Code'
                  : 'Update Password'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              {currentUser?.role === 'admin' ? (
                <button
                  onClick={onOpenEmailDrawer}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Open Outbound Mail Dispatcher
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={() => onSwitchMode('login')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* 4. APPLICATION STATUS LOOKUP MODE */}
        {mode === 'status' && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Check Application Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify whether your registered account is Pending, Accepted, or Rejected.
              </p>
            </div>

            <form onSubmit={handleCheckStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  required
                  value={statusEmail}
                  onChange={(e) => setStatusEmail(e.target.value)}
                  placeholder="Enter the valid mail"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Lookup Application
              </button>
            </form>

            {statusChecked && (
              <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                {statusResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{statusResult.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          statusResult.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : statusResult.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {statusResult.status}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      <div>Role: <span className="font-semibold capitalize">{statusResult.role}</span></div>
                      <div>Department: <span>{statusResult.department}</span></div>
                      <div>Designation: <span>{statusResult.designation}</span></div>
                      <div>Registered Date: <span className="font-mono">{statusResult.registrationDate}</span></div>
                    </div>

                    {statusResult.status === 'pending' && (
                      <p className="text-amber-800 text-[11px] pt-1">
                        Application is under review by Admin PRANITH SRIRAM G.
                      </p>
                    )}
                    {statusResult.status === 'accepted' && (
                      <p className="text-emerald-800 text-[11px] pt-1">
                        Account is approved! You can sign in immediately.
                      </p>
                    )}
                    {statusResult.status === 'rejected' && (
                      <p className="text-rose-800 text-[11px] pt-1">
                        Rejection reason: "{statusResult.rejectionReason || 'Institutional review criteria not fulfilled.'}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-500 text-center py-2">
                    No application found matching this email address.
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => onSwitchMode('login')}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onSwitchMode('register')}
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Register New Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
