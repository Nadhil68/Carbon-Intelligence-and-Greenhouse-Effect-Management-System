import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CampusDepartment, DesignationCategory, UserRole, User as CampusUser } from '../types';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  IdCard,
  Briefcase,
  GraduationCap,
  KeyRound,
  ArrowRight,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Phone,
  Layers,
  Search,
} from 'lucide-react';

interface LoginPageProps {
  onOpenEmailDrawer: () => void;
}

type LoginTab = 'login' | 'register' | 'forgot' | 'status';

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenEmailDrawer }) => {
  const {
    login,
    registerUser,
    requestPasswordReset,
    completePasswordReset,
    checkStatusByEmail,
    quickSwitchUser,
  } = useAuth();

  const [showLoginPortal, setShowLoginPortal] = useState(false);

  const openLoginPage = () => {
    setShowLoginPortal(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Exactly 2 primary page tabs: 'login' and 'register'
  const [activeTab, setActiveTab] = useState<LoginTab>('login');

  // Login credentials state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<{ message: string; status?: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError({ message: res.message, status: res.status });
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Registration Form State
  const [regCategoryType, setRegCategoryType] = useState<'admin_rank' | 'other_dept'>('other_dept');
  const [regName, setRegName] = useState('');
  const [regOfficialId, setRegOfficialId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regExecutiveRank, setRegExecutiveRank] = useState<'Principal' | 'Manager' | 'Dean'>('Principal');
  const [regDepartment, setRegDepartment] = useState<CampusDepartment>('CSE');
  const [regRoleDesignation, setRegRoleDesignation] = useState<DesignationCategory>('Department Staffs');
  const [regClassSection, setRegClassSection] = useState('');
  const [regSystemRole, setRegSystemRole] = useState<UserRole>('operator');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Status Check State
  const [statusEmail, setStatusEmail] = useState('');
  const [statusResult, setStatusResult] = useState<CampusUser | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);

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
    if (!regOfficialId.trim()) {
      setRegError('Please provide your Official Faculty ID, Staff ID, or Student Roll Number.');
      return;
    }

    let resolvedDept = regDepartment;
    let resolvedDesignation = regRoleDesignation;

    if (regCategoryType === 'admin_rank') {
      resolvedDept = 'Administration & Management';
      resolvedDesignation = regExecutiveRank;
    }

    setRegLoading(true);
    try {
      const res = await registerUser({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        role: regSystemRole,
        department: resolvedDept,
        designation: resolvedDesignation,
        employeeOrStudentId: regOfficialId.trim(),
        classSection:
          resolvedDesignation === 'Class Advisors' || resolvedDesignation === 'Students'
            ? regClassSection.trim()
            : undefined,
        phone: regPhone.trim(),
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
          if (res.resetToken) setResetToken(res.resetToken);
          setForgotStep(2);
        } else {
          setForgotMsg({ text: res.message, error: true });
        }
      } else {
        if (newPassword.length < 6) {
          setForgotMsg({ text: 'Password must be at least 6 characters.', error: true });
          return;
        }
        if (newPassword !== confirmNewPassword) {
          setForgotMsg({ text: 'Passwords do not match.', error: true });
          return;
        }
        const res = await completePasswordReset(resetToken, newPassword);
        if (res.success) {
          setForgotMsg({ text: res.message, error: false });
          setTimeout(() => setActiveTab('login'), 2000);
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

  // PAGE 1 (PRE-LOGIN COVER): Full-Screen MKCE Campus Image BEFORE Login Page
  // Clicking "Access to Login Page" navigates to the separate header-less Login Page
  if (!showLoginPortal) {
    return (
      <div className="w-full h-screen overflow-hidden relative select-none bg-slate-950 font-sans">
        {/* Full-Screen Image */}
        <img
          src="/assets/aistudio/image_79926f55.png"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1rQEGeuuPH1ZyKHSLhTBMSeLg6Z4UhOB8Bq3OCa_Ob_PHu1g7gPW-FwaY&s=10';
          }}
          alt="MKCE Campus Fullscreen Panorama"
          className="w-full h-full object-cover object-center"
        />

        {/* Subtle Top Vignette & Bottom Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

        {/* Bottom of the Image: M K C E and Access to Login Page */}
        <div className="absolute bottom-0 inset-x-0 z-20 pb-8 sm:pb-12 pt-16 px-4 flex flex-col items-center justify-end text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[0.35em] text-amber-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            M K C E
          </h1>
          <p className="mt-2 text-xs sm:text-base md:text-lg text-white/95 font-semibold tracking-wider drop-shadow-md">
            M.Kumarasamy College of Engineering (Autonomous), Karur
          </p>

          <button
            type="button"
            onClick={openLoginPage}
            className="mt-5 sm:mt-6 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2.5 shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:scale-105 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Access to Login Page</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    );
  }

  // PAGE 2: DEDICATED HEADER-LESS LOGIN PAGE (Opened only after clicking "Access to Login Page")
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-x-hidden font-sans w-full max-w-full">
      {/* 
        College Emblem Watermark in Background
      */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-[0.05] select-none max-w-full overflow-hidden">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYmc_6aN9vHVE5pOsU6OQt0ILPaxutCgRp5Vhe7RLjPMoVUWsD2r-kjg&s=10"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/mkce_seal.png';
          }}
          alt="MKCE Seal Watermark"
          className="w-[320px] h-[320px] sm:w-[650px] sm:h-[650px] object-contain"
        />
      </div>

      {/* Central Interactive Login & Registration Card (Header-less Page) */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 py-8 sm:py-12 relative z-10 min-h-screen">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-8">
          {/* Institutional Seal & AI Carbon Logo */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 ring-4 ring-emerald-50/80 inline-block">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYmc_6aN9vHVE5pOsU6OQt0ILPaxutCgRp5Vhe7RLjPMoVUWsD2r-kjg&s=10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/mkce_seal.png';
                  }}
                  alt="MKCE Seal"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
              Carbon Intelligence & GHG Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              M.Kumarasamy College of Engineering (Autonomous), Karur
            </p>
          </div>

          {/* The 2 Primary Pages: 1. Login & 2. New Account */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl mb-6 text-xs sm:text-sm font-bold gap-1.5 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`py-2.5 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'login' || activeTab === 'forgot' || activeTab === 'status'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60 hover:bg-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>1. Login (All Users)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegError(null);
              }}
              className={`py-2.5 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60 hover:bg-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>2. New Account</span>
            </button>
          </div>

          {/* ========================================================
              PAGE 1: UNIFIED LOGIN (Principal, Admin, Operator, Staff, Student)
              ======================================================== */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {/* Error Alert */}
              {loginError && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
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
                        ? 'Account Pending Admin Login Approval'
                        : loginError.status === 'rejected'
                        ? 'Registration Rejected'
                        : 'Sign In Failed'}
                    </div>
                    <div className="text-[11px] mt-0.5">{loginError.message}</div>
                  </div>
                </div>
              )}

              {/* Login Form: Registered Mail, Password, Sign In */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter the valid mail"
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter the password"
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Checking Application Status on left, Create New Account on right */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className="text-slate-500 hover:text-blue-600 underline cursor-pointer"
                >
                  Check Application Status
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegError(null);
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>Create a New Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: CREATE NEW ACCOUNT (PER SPECIFICATION)
              ======================================================== */}
          {activeTab === 'register' && (
            <div>
              {regSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Application Submitted Successfully!</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your registration application is now in the <strong>PENDING</strong> review queue.
                    Administrator <strong>PRANITH SRIRAM G</strong> will review your official ID, designation, and department.
                    An automated notification email has been dispatched.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveTab('login')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs text-white font-semibold rounded shadow-xs cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleRegisterSubmit}
                  className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1"
                >
                  {regError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {/* 1. Affiliation Category: Rank vs Other Dept */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Account Classification
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setRegCategoryType('admin_rank')}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          regCategoryType === 'admin_rank'
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>Executive Rank</div>
                        <div className="text-[10px] text-slate-500 font-normal">Principal, Manager, Dean</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegCategoryType('other_dept')}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          regCategoryType === 'other_dept'
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>Department & Faculty / Students</div>
                        <div className="text-[10px] text-slate-500 font-normal">CSE, ECE, EEE, AIDS, Freshman...</div>
                      </button>
                    </div>
                  </div>

                  {/* 2. Personal & Official Identification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Dr. K. Karthikeyan"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official ID (Faculty ID / Roll Number)
                      </label>
                      <input
                        type="text"
                        required
                        value={regOfficialId}
                        onChange={(e) => setRegOfficialId(e.target.value)}
                        placeholder="e.g. FAC-CSE-091 or 22CS104"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email ID
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Enter the valid mail"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 94440 00000"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* 3. Role / Rank / Department Selection */}
                  {regCategoryType === 'admin_rank' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Executive Rank (Principal, Manager, Dean)
                      </label>
                      <select
                        value={regExecutiveRank}
                        onChange={(e) => setRegExecutiveRank(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
                      >
                        <option value="Principal">Principal (Executive Head)</option>
                        <option value="Manager">Manager (Administration & Estate)</option>
                        <option value="Dean">Dean (Academic / Administrative)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Select Department
                        </label>
                        <select
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value as CampusDepartment)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
                        >
                          <optgroup label="Engineering Departments">
                            <option value="CSE">CSE (Computer Science & Engineering)</option>
                            <option value="ECE">ECE (Electronics & Communication)</option>
                            <option value="EEE">EEE (Electrical & Electronics)</option>
                            <option value="IT">IT (Information Technology)</option>
                            <option value="AIDS">AIDS (Artificial Intelligence & Data Science)</option>
                            <option value="AIML">AIML (AI & Machine Learning)</option>
                            <option value="MECH">MECH (Mechanical Engineering)</option>
                            <option value="CIVIL">CIVIL (Civil Engineering)</option>
                          </optgroup>

                          <optgroup label="Freshman Engineering (for 1st yr)">
                            <option value="Freshman Engineering (1st Year)">Freshman Engineering (1st Year Common)</option>
                            <option value="Mathematics (Freshman Engineering)">(Mat) Teachers filling for Freshman Engineering</option>
                            <option value="Engineering Chemistry (Freshman Engineering)">(EChemistry) Teachers filling for Freshman Engineering</option>
                            <option value="Engineering Physics (Freshman Engineering)">(Ephysics) Teachers filling for Freshman Engineering</option>
                          </optgroup>

                          <optgroup label="Campus Facilities">
                            <option value="Hostels & Residential Blocks">Hostels & Residential Blocks</option>
                            <option value="Transport & Fleet Facilities">Transport & Fleet Facilities</option>
                            <option value="Central Library & Labs">Central Library & Labs</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Role / Designation
                        </label>
                        <select
                          value={regRoleDesignation}
                          onChange={(e) => setRegRoleDesignation(e.target.value as DesignationCategory)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
                        >
                          <option value="HOD">HOD (Head of Department)</option>
                          <option value="AHOD">AHOD (Assistant Head of Department)</option>
                          <option value="Department Staffs">Department Staffs / Faculty</option>
                          <option value="Class Advisors">Class Advisors (With Class)</option>
                          <option value="Students">Students (With Class)</option>
                          <option value="Supporting Staff">Supporting Staff</option>
                        </select>
                      </div>

                      {/* Class input if Class Advisors or Students */}
                      {(regRoleDesignation === 'Class Advisors' || regRoleDesignation === 'Students') && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Class & Section (e.g., III Year CSE-B, II Year AIDS-A, I Year Sec-C)
                          </label>
                          <input
                            type="text"
                            required
                            value={regClassSection}
                            onChange={(e) => setRegClassSection(e.target.value)}
                            placeholder="e.g. III Year CSE-B"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Requested System Role (Operator vs Viewer) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      System Permissions Requested
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setRegSystemRole('operator')}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          regSystemRole === 'operator'
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold">Operator</div>
                        <div className="text-[10px] text-slate-500">Record & manage environmental data</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegSystemRole('viewer')}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          regSystemRole === 'viewer'
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold">Viewer</div>
                        <div className="text-[10px] text-slate-500">Read-only dashboards & reports</div>
                      </button>
                    </div>
                  </div>

                  {/* 5. Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-700">Password</label>
                      </div>
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
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
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
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
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 font-semibold hover:text-blue-800 ml-1 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: PASSWORD RECOVERY
              ======================================================== */}
          {activeTab === 'forgot' && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Account Password Recovery</h3>
                <p className="text-xs text-slate-500">
                  Enter your registered institutional email to receive a password reset token.
                </p>
              </div>

              {forgotMsg && (
                <div
                  className={`mb-4 p-3 rounded-lg text-xs flex items-start gap-2 ${
                    forgotMsg.error
                      ? 'bg-rose-50 border border-rose-200 text-rose-700'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {forgotMsg.error ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  )}
                  <span>{forgotMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                {forgotStep === 1 ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email ID
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter the valid mail"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Reset Verification Token
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {forgotLoading
                    ? 'Processing...'
                    : forgotStep === 1
                    ? 'Send Password Reset Token'
                    : 'Update Password & Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
                <button
                  onClick={() => {
                    setForgotStep(1);
                    setActiveTab('login');
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-800 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: STATUS CHECK
              ======================================================== */}
          {activeTab === 'status' && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Registration Application Status</h3>
                <p className="text-xs text-slate-500">
                  Lookup the current approval decision for your institutional registration.
                </p>
              </div>

              <form onSubmit={handleCheckStatus} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={statusEmail}
                      onChange={(e) => setStatusEmail(e.target.value)}
                      placeholder="Enter the valid mail"
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>Query Application Status</span>
                </button>
              </form>

              {statusChecked && (
                <div className="mt-4 p-4 rounded-xl border text-xs space-y-2">
                  {statusResult ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900">{statusResult.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            statusResult.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : statusResult.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {statusResult.status}
                        </span>
                      </div>
                      <div className="text-slate-600 space-y-0.5 text-[11px]">
                        <div>Role: <strong className="uppercase">{statusResult.role}</strong></div>
                        <div>Department: {statusResult.department}</div>
                        <div>Designation: {statusResult.designation}</div>
                        {statusResult.classSection && (
                          <div>Class: {statusResult.classSection}</div>
                        )}
                        <div>Official ID: <code className="font-mono">{statusResult.employeeOrStudentId}</code></div>
                      </div>
                      {statusResult.status === 'accepted' && (
                        <div className="mt-3 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => {
                              setActiveTab('login');
                              setLoginEmail(statusResult.email);
                            }}
                            className="text-blue-600 font-semibold hover:underline cursor-pointer"
                          >
                            Account Approved! Click to Sign In →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-center py-2">
                      No registration record found for <strong className="text-slate-700">{statusEmail}</strong>.
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 font-semibold hover:text-blue-800 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Institutional Bottom Banner */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>M.Kumarasamy College of Engineering (Autonomous)</span>
          <span>·</span>
          <span>Accredited with A Grade by NAAC</span>
          <span>·</span>
          <span>Autonomous Institution affiliated to Anna University</span>
          <span>·</span>
          <span>Administrator ID: sriramacess2302@gmail.com</span>
        </div>
      </footer>
    </div>
  );
};
