/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmissionProvider } from './context/EmissionContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DepartmentView } from './components/DepartmentView';
import { EmissionRecordsView } from './components/EmissionRecordsView';
import { InstitutionalDirectoryView } from './components/InstitutionalDirectoryView';
import { AdminUserManagementView } from './components/AdminUserManagementView';
import { MitigationPlanView } from './components/MitigationPlanView';
import { ProfileView } from './components/ProfileView';
import { StudentDashboardAddon } from './components/StudentDashboardAddon';
import { CarbonReductionChatbot } from './components/CarbonReductionChatbot';
import { ClassAdvisorView } from './components/ClassAdvisorView';
import { OperatorPortalView } from './components/OperatorPortalView';
import { AdminLogApprovalView } from './components/AdminLogApprovalView';
import {
  PrincipalDeptCarbonView,
  ManagerOfficeElectricalView,
  DeanOfficeAdmissionView,
  HodDepartmentRecordsView,
} from './components/ExecutiveRoleViews';
import { AuthModals } from './components/AuthModals';
import { EmailSimulatorDrawer } from './components/EmailSimulatorDrawer';
import { EmissionEntryModal } from './components/EmissionEntryModal';
import {
  Clock,
  AlertTriangle,
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  User as UserIcon,
  Menu,
  Leaf,
  Zap,
  Sparkles,
  Upload,
  FileCheck,
  UserPlus,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<
    'login' | 'register' | 'forgot' | 'status' | null
  >(null);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  // Toggle sidemenu completely using the Man icon
  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsSidebarVisible((prev) => !prev);
    }
  };

  // If user is not logged in, display the dedicated Login & Registration Page as the default
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <LoginPage onOpenEmailDrawer={() => setIsEmailDrawerOpen(true)} />
      </div>
    );
  }

  // After Login: Authenticated Enterprise Layout with Pure White Background and College Seal Symbol
  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans selection:bg-blue-600/10 selection:text-blue-800 relative w-full max-w-full overflow-x-clip">
      {/* 
        M.Kumarasamy College of Engineering Official Seal Symbol
        Applied as background symbol after login page per user instruction:
        "and use this symbol for background after login page:
        https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYmc_6aN9vHVE5pOsU6OQt0ILPaxutCgRp5Vhe7RLjPMoVUWsD2r-kjg&s=10"
      */}
      <div
        className="fixed inset-0 pointer-events-none select-none flex items-center justify-center z-0 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYmc_6aN9vHVE5pOsU6OQt0ILPaxutCgRp5Vhe7RLjPMoVUWsD2r-kjg&s=10"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/mkce_seal.png';
          }}
          alt="MKCE Seal Background Symbol"
          className="w-[320px] h-[320px] sm:w-[520px] sm:h-[520px] lg:w-[680px] lg:h-[680px] object-contain opacity-[0.055] transition-opacity"
        />
      </div>

      {/* Professional Sidebar Menu (Desktop fixed + Mobile slide-in drawer) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAuthModal={(mode) => setAuthModalMode(mode)}
        onOpenEmailDrawer={() => setIsEmailDrawerOpen(true)}
        onOpenEntryModal={() => setIsEntryModalOpen(true)}
        isSidebarVisible={isSidebarVisible}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Floating Sidemenu Toggle Button when sidebar is hidden on desktop */}
      {!isSidebarVisible && (
        <button
          onClick={handleToggleSidebar}
          className="hidden md:flex fixed left-4 top-24 z-40 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3.5 py-2.5 rounded-xl shadow-xl border-2 border-white items-center gap-2 transition-all hover:scale-105 group cursor-pointer animate-fade-in"
          title="Show Sidemenu Completely"
          aria-label="Show Sidemenu Completely"
        >
          <UserIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold pr-1">Show Sidemenu</span>
        </button>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full bg-transparent relative z-10 transition-all duration-300 overflow-x-clip">
        {/* Fixed Top Header with MKCE Logo & Carbon Intelligence Logo */}
        <Navbar
          currentTab={currentTab}
          onOpenMobileMenu={handleToggleSidebar}
          onOpenAuthModal={(mode) => setAuthModalMode(mode)}
          onOpenEmailDrawer={() => setIsEmailDrawerOpen(true)}
          onOpenEntryModal={() => setIsEntryModalOpen(true)}
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Account Status Alert Banner (if user is Pending or Rejected) */}
        {currentUser && currentUser.status !== 'accepted' && (
          <div
            className={`py-2 px-3 sm:px-4 text-xs flex items-center justify-between border-b w-full max-w-full overflow-hidden ${
              currentUser.status === 'pending'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentUser.status === 'pending' ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="truncate">
                  <strong>Status: {currentUser.status.toUpperCase()}</strong> —{' '}
                  {currentUser.status === 'pending'
                    ? 'Awaiting approval by Admin.'
                    : `Declined: "${currentUser.rejectionReason || 'Access criteria not met'}"`}
                </span>
              </div>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setIsEmailDrawerOpen(true)}
                  className="underline text-[11px] font-mono hover:text-slate-900 shrink-0 ml-2"
                >
                  Mail
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Page View (with bottom padding for Android bottom navigation) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-20 md:pb-6 overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={setCurrentTab}
              onOpenEntryModal={() => setIsEntryModalOpen(true)}
            />
          )}

          {currentTab === 'principal_dept_carbon' && (
            <PrincipalDeptCarbonView onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'manager_office_records' && (
            <ManagerOfficeElectricalView onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'dean_office_details' && (
            <DeanOfficeAdmissionView onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'hod_dept_records' && (
            <HodDepartmentRecordsView onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'operator_log_entry' && (
            <OperatorPortalView
              mode="log_entry"
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'operator_log_status' && (
            <OperatorPortalView
              mode="log_status"
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'admin_log_approvals' && <AdminLogApprovalView />}

          {currentTab === 'advisor_cabin' &&
            (currentUser.name.toLowerCase().includes('ananthi') ||
              currentUser.name.toLowerCase().includes('selvanayagi')) && (
              <ClassAdvisorView
                mode="cabin"
                onNavigateTab={setCurrentTab}
              />
            )}

          {currentTab === 'advisor_class' &&
            (currentUser.name.toLowerCase().includes('ananthi') ||
              currentUser.name.toLowerCase().includes('selvanayagi')) && (
              <ClassAdvisorView
                mode="class"
                onNavigateTab={setCurrentTab}
              />
            )}

          {currentTab === 'carbon_intell' && (
            <DashboardView
              onNavigateTab={setCurrentTab}
              hideStudentAddon={true}
              onOpenEntryModal={() => setIsEntryModalOpen(true)}
            />
          )}

          {currentTab === 'electricity_bills' && (
            <StudentDashboardAddon
              initialModule="electricity_bills"
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'chatbot' && (
            <CarbonReductionChatbot onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'profile' && <ProfileView />}

          {/* Additional Institutional & Telemetry Views */}
          {currentTab === 'departments' && (
            <DepartmentView onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'emissions' && <EmissionRecordsView />}

          {currentTab === 'directory' && <InstitutionalDirectoryView />}

          {currentTab === 'mitigation' && <MitigationPlanView />}

          {currentTab === 'admin_approvals' && <AdminUserManagementView />}

          {currentTab === 'student_class_bills' && (
            <StudentDashboardAddon
              initialModule="class_bills"
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'student_lab_rates' && (
            <StudentDashboardAddon
              initialModule="lab_rates"
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'student_transport' && (
            <StudentDashboardAddon
              initialModule="dayscholar"
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'student_ai_current' && (
            <CarbonReductionChatbot onNavigateTab={setCurrentTab} />
          )}
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-xs py-6 mb-12 md:mb-0 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXR4irQbR68XxJFgeYzWAT1fIOl245qewuZaAGi2XmWw&s"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/mkce_logo.png';
                }}
                alt="MKCE"
                className="h-6 w-auto object-contain"
              />
              <span className="text-slate-700 font-medium">
                M.Kumarasamy College of Engineering (Autonomous)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
              <span>Approved by AICTE · NBA & NAAC Accredited</span>
              <span>·</span>
              <span>Admin ID: sriramacess2302@gmail.com</span>
              <span>·</span>
              <span>Officer: PRANITH SRIRAM G</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 
        Android Mobile Quick Bottom Navigation Bar
      */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      >
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
            currentTab === 'dashboard'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </button>

        {currentUser.designation === 'Principal' ||
        currentUser.email.toLowerCase() === 'principle@mkce.ac.in' ||
        currentUser.email.toLowerCase() === 'principal@mkce.ac.in' ? (
          <button
            onClick={() => setCurrentTab('principal_dept_carbon')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
              currentTab === 'principal_dept_carbon'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span>Dept Carbon Wise</span>
          </button>
        ) : currentUser.designation === 'Manager' ||
          currentUser.email.toLowerCase() === 'manager@mkce.ac.in' ? (
          <button
            onClick={() => setCurrentTab('manager_office_records')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
              currentTab === 'manager_office_records'
                ? 'text-amber-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-5 h-5 mb-0.5" />
            <span>Office Electrical</span>
          </button>
        ) : (currentUser.designation === 'Dean' && currentUser.role !== 'admin') ||
          currentUser.email.toLowerCase() === 'dean@mkce.ac.in' ||
          currentUser.email.toLowerCase() === 'logavel@mkce.ac.in' ? (
          <button
            onClick={() => setCurrentTab('dean_office_details')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
              currentTab === 'dean_office_details'
                ? 'text-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span>Dean & Admission</span>
          </button>
        ) : (currentUser.designation === 'HOD' && currentUser.role !== 'operator') ||
          currentUser.email.toLowerCase().startsWith('hod-') ? (
          <button
            onClick={() => setCurrentTab('hod_dept_records')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
              currentTab === 'hod_dept_records'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span>Dept Records</span>
          </button>
        ) : currentUser.name.toLowerCase().includes('ananthi') ||
          currentUser.name.toLowerCase().includes('selvanayagi') ? (
          <>
            <button
              onClick={() => setCurrentTab('advisor_cabin')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'advisor_cabin'
                  ? 'text-amber-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Zap className="w-5 h-5 mb-0.5" />
              <span>Cabin Details</span>
            </button>

            <button
              onClick={() => setCurrentTab('advisor_class')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'advisor_class'
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span>Class Carbon</span>
            </button>
          </>
        ) : currentUser.role === 'operator' ? (
          <>
            <button
              onClick={() => setCurrentTab('operator_log_entry')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'operator_log_entry'
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Upload className="w-5 h-5 mb-0.5" />
              <span>Log Entry</span>
            </button>

            <button
              onClick={() => setCurrentTab('operator_log_status')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'operator_log_status'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-5 h-5 mb-0.5" />
              <span>Log Status</span>
            </button>
          </>
        ) : currentUser.role === 'admin' ? (
          <>
            <button
              onClick={() => setCurrentTab('admin_log_approvals')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'admin_log_approvals'
                  ? 'text-amber-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-5 h-5 mb-0.5" />
              <span>Log Approval</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin_approvals')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'admin_approvals'
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-5 h-5 mb-0.5" />
              <span>Login Approval</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentTab('carbon_intell')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'carbon_intell'
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Leaf className="w-5 h-5 mb-0.5" />
              <span>Carbon Intell</span>
            </button>

            <button
              onClick={() => setCurrentTab('electricity_bills')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'electricity_bills' ||
                currentTab === 'student_class_bills' ||
                currentTab === 'student_lab_rates'
                  ? 'text-amber-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Zap className="w-5 h-5 mb-0.5" />
              <span>Electricity Bills</span>
            </button>

            <button
              onClick={() => setCurrentTab('chatbot')}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
                currentTab === 'chatbot' || currentTab === 'student_ai_current'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <img
                src="/assets/aistudio/image_4a016d12.png"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://t3.ftcdn.net/jpg/19/91/15/48/360_F_1991154824_NA8qVk3WI9MgSJvNlaOwih394Dp7AVD7.jpg';
                }}
                alt="Carbon Chatbot Logo"
                className="w-5 h-5 mb-0.5 rounded object-contain bg-white border border-slate-200"
              />
              <span>Chatbot</span>
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9.5px] font-medium transition-colors ${
            currentTab === 'profile'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span>My Profile</span>
        </button>
      </nav>

      {/* Auth Modal (For in-app switching, status lookup, etc.) */}
      <AuthModals
        mode={authModalMode}
        onClose={() => setAuthModalMode(null)}
        onSwitchMode={(mode) => setAuthModalMode(mode)}
        onOpenEmailDrawer={() => {
          setAuthModalMode(null);
          setIsEmailDrawerOpen(true);
        }}
      />

      {/* Outbound Mail Dispatcher (Strictly for Admin Only) */}
      {currentUser.role === 'admin' && (
        <EmailSimulatorDrawer
          isOpen={isEmailDrawerOpen}
          onClose={() => setIsEmailDrawerOpen(false)}
          onSelectResetToken={(token) => {
            setAuthModalMode('forgot');
          }}
        />
      )}

      {/* Quick Add Emission Record Modal */}
      {isEntryModalOpen && (
        <EmissionEntryModal
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EmissionProvider>
        <AppContent />
      </EmissionProvider>
    </AuthProvider>
  );
}
