import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmissions } from '../context/EmissionContext';
import {
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  PlusCircle,
  Users,
  ShieldCheck,
  Target,
  User as UserIcon,
  LogOut,
  LogIn,
  X,
  Leaf,
  Sparkles,
  Zap,
  Upload,
  FileCheck,
  UserPlus,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAuthModal: (mode: 'login' | 'register' | 'forgot' | 'status') => void;
  onOpenEmailDrawer: () => void;
  onOpenEntryModal?: () => void;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpenMobile,
  onCloseMobile,
  onOpenAuthModal,
  onOpenEntryModal,
  isSidebarVisible = true,
  onToggleSidebar,
}) => {
  const { currentUser, logout, users } = useAuth();
  const { records, pendingLogCount } = useEmissions();

  const pendingLoginCount = users.filter((u) => u.status === 'pending').length;

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    onCloseMobile();
  };

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

  const navSections = isPrincipal
    ? [
        {
          group: 'PRINCIPAL MODULES · BALAMURUGAN',
          items: [
            {
              id: 'dashboard',
              label: '1. Normal Dashboard (Principal)',
              icon: LayoutDashboard,
            },
            {
              id: 'principal_dept_carbon',
              label: '2. Dept Carbon Wise (Whole College)',
              icon: Building2,
            },
          ],
        },
        {
          group: 'PRINCIPAL ACCOUNT',
          items: [{ id: 'profile', label: 'My Profile & Credentials', icon: UserIcon }],
        },
      ]
    : isManager
    ? [
        {
          group: 'MANAGER MODULES · VIKRAM',
          items: [
            {
              id: 'dashboard',
              label: '1. Normal Dashboard (Manager)',
              icon: LayoutDashboard,
            },
            {
              id: 'manager_office_records',
              label: '2. All College Office Electrical Records',
              icon: Zap,
            },
          ],
        },
        {
          group: 'MANAGER ACCOUNT',
          items: [{ id: 'profile', label: 'My Profile & Credentials', icon: UserIcon }],
        },
      ]
    : isDean
    ? [
        {
          group: 'DEAN MODULES · DR. LOGAVEL',
          items: [
            {
              id: 'dashboard',
              label: '1. Normal Dashboard (Dr. Logavel)',
              icon: LayoutDashboard,
            },
            {
              id: 'dean_office_details',
              label: '2. Dean Office & Admission Office',
              icon: Building2,
            },
          ],
        },
        {
          group: 'DEAN ACCOUNT',
          items: [{ id: 'profile', label: 'My Profile & Credentials', icon: UserIcon }],
        },
      ]
    : isHod
    ? [
        {
          group: `HOD MODULES · ${currentUser?.department || 'DEPARTMENT'}`,
          items: [
            {
              id: 'hod_dept_records',
              label: '1. Dept Records (1.Staff · 2.Class · 3.Labs)',
              icon: Building2,
            },
            {
              id: 'dashboard',
              label: '2. Normal Campus Dashboard',
              icon: LayoutDashboard,
            },
          ],
        },
        {
          group: 'HOD ACCOUNT',
          items: [{ id: 'profile', label: 'My Profile & Credentials', icon: UserIcon }],
        },
      ]
    : isOperator
    ? [
        {
          group: 'SYSTEM OPERATOR MODULES (PASS: OPR@2026)',
          items: [
            {
              id: 'dashboard',
              label: `Dashboard (${currentUser?.name || 'Operator'})`,
              icon: LayoutDashboard,
            },
            {
              id: 'operator_log_entry',
              label: 'Log Entry (Photos or PDF)',
              icon: Upload,
            },
            {
              id: 'operator_log_status',
              label: 'Log Approval Status (Each Log)',
              icon: FileCheck,
              badge: records.length,
              badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
            },
          ],
        },
        {
          group: 'OPERATOR ACCOUNT',
          items: [{ id: 'profile', label: 'My Profile & Credentials', icon: UserIcon }],
        },
      ]
    : isClassAdvisor
    ? [
        {
          group: 'CSE CLASS ADVISOR MODULES',
          items: [
            {
              id: 'dashboard',
              label: `Dashboard (${currentUser?.name || 'Class Advisor'})`,
              icon: LayoutDashboard,
            },
            {
              id: 'advisor_cabin',
              label: 'Cabin Electricity & Carbon Details',
              icon: Zap,
            },
            {
              id: 'advisor_class',
              label: 'Class Carbon Emission Details',
              icon: Users,
            },
          ],
        },
        {
          group: 'ADVISOR ACCOUNT',
          items: [{ id: 'profile', label: 'My Profile', icon: UserIcon }],
        },
      ]
    : isStudent
    ? [
        {
          group: 'STUDENT INTELLIGENCE',
          items: [
            {
              id: 'dashboard',
              label: `Dashboard (Welcome to ${currentUser?.name || 'Student'})`,
              icon: LayoutDashboard,
            },
            {
              id: 'carbon_intell',
              label: 'Carbon Intell',
              icon: Leaf,
            },
            {
              id: 'electricity_bills',
              label: 'Electricity Bills',
              icon: Zap,
            },
            {
              id: 'chatbot',
              label: 'Carbon Reduction Chatbot',
              icon: Sparkles,
            },
          ],
        },
        {
          group: 'STUDENT ACCOUNT',
          items: [{ id: 'profile', label: 'My Profile', icon: UserIcon }],
        },
      ]
    : [
        {
          group: 'MONITORING & INTELLIGENCE',
          items: [
            { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
            { id: 'departments', label: 'Department Dashboards', icon: Building2 },
          ],
        },
        ...(currentUser?.role === 'admin'
          ? [
              {
                group: 'ADMIN APPROVAL & PROOF CHECK',
                items: [
                  {
                    id: 'admin_log_approvals',
                    label: 'Log Approval (Check Proof)',
                    icon: FileCheck,
                    badge: pendingLogCount,
                    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
                  },
                  {
                    id: 'admin_approvals',
                    label: 'Login Approval & Add User',
                    icon: UserPlus,
                    badge: pendingLoginCount,
                    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  },
                ],
              },
            ]
          : []),
        {
          group: 'CARBON AUDIT & RECORDS',
          items: [
            {
              id: 'operator_log_status',
              label: 'Status Page of Each Log',
              icon: FileSpreadsheet,
              badge: records.length,
              badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
            },
            { id: 'emissions', label: 'All Emission Records', icon: ShieldCheck },
            { id: 'mitigation', label: 'Carbon Reduction Plan', icon: Target },
          ],
        },
        {
          group: 'INSTITUTION & ROLES',
          items: [
            { id: 'directory', label: 'Campus Directory', icon: Users },
            { id: 'profile', label: 'My Profile & Security', icon: UserIcon },
          ],
        },
      ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none">
      {/* 1. Institutional Logo Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 max-w-[220px] sm:max-w-none">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXR4irQbR68XxJFgeYzWAT1fIOl245qewuZaAGi2XmWw&s"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/mkce_logo.png';
              }}
              alt="M.Kumarasamy College of Engineering Logo"
              className="h-12 sm:h-14 w-auto max-w-full object-contain rounded drop-shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSidebar || onCloseMobile}
              title="Hide Sidemenu Completely"
              aria-label="Hide Sidemenu"
              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 group cursor-pointer"
            >
              <UserIcon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-[10px] font-bold text-slate-500 group-hover:text-blue-700">
                Hide
              </span>
            </button>

            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <img
              src="https://ukgbc.org/wp-content/uploads/2021/04/Carbon-Intelligence.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/carbon_intelligence.png';
              }}
              alt="Carbon Intelligence Logo"
              className="h-6 w-auto max-w-full object-contain"
            />
            <div className="text-[10px] text-slate-500 font-medium truncate">
              Greenhouse Effect Management · MKCE
            </div>
          </div>
        </div>
      </div>

      {/* Quick Entry Action strictly for Operators only */}
      {isOperator && (
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              handleSelectTab('operator_log_entry');
            }}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Log Entry (Photo / PDF Proof)</span>
          </button>
        </div>
      )}

      {/* 2. Navigation Module Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navSections.map((sec) => (
          <div key={sec.group}>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
              {sec.group}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.id === 'chatbot' ? (
                        <img
                          src="/assets/aistudio/image_4a016d12.png"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://t3.ftcdn.net/jpg/19/91/15/48/360_F_1991154824_NA8qVk3WI9MgSJvNlaOwih394Dp7AVD7.jpg';
                          }}
                          alt="Carbon Chatbot Logo"
                          className="w-5 h-5 rounded object-contain bg-white border border-slate-200 shrink-0"
                        />
                      ) : (
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        />
                      )}
                      <span>{item.label}</span>
                    </div>

                    {'badge' in item && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded border ${
                          item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer / Role & Operator Switcher */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        {currentUser ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-mono text-blue-700 uppercase leading-none">
                    {currentUser.role} · {currentUser.designation}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuthModal('register')}
              className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs rounded-lg transition-colors text-center"
            >
              Register Account
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isSidebarVisible !== false && (
        <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 border-r border-slate-200 bg-white z-30 shadow-xs animate-fade-in transition-all">
          {sidebarContent}
        </aside>
      )}

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-4/5 max-w-xs h-full bg-white z-10 shadow-2xl flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
