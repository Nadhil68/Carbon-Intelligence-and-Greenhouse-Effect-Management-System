import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Mail,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onOpenMobileMenu: () => void;
  onOpenAuthModal: (mode: 'login' | 'register' | 'forgot' | 'status') => void;
  onOpenEmailDrawer: () => void;
  onOpenEntryModal?: () => void;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenAuthModal,
  onOpenEmailDrawer,
  isSidebarVisible = true,
  onToggleSidebar,
}) => {
  const { currentUser, unreadEmailCount } = useAuth();

  const formatUserRole = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'admin') {
      return currentUser.designation
        ? `${currentUser.designation} (Super Admin)`
        : 'Super Administrator';
    }
    const roleCapitalized =
      currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    if (currentUser.designation && currentUser.department) {
      return `${currentUser.designation} · ${currentUser.department} (${roleCapitalized})`;
    }
    if (currentUser.designation) {
      return `${currentUser.designation} (${roleCapitalized})`;
    }
    return roleCapitalized;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs w-full max-w-full">
      <div className="px-2 sm:px-5 lg:px-7 max-w-full">
        <div className="flex items-center justify-between min-h-[60px] sm:min-h-[88px] md:min-h-[104px] py-1.5 sm:py-2.5 gap-1.5 sm:gap-4 max-w-full">
          
          {/* Left Zone: Man Icon (Hide/Show Sidemenu) + MKCE College Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* MAN ICON: Click to hide or show sidemenu completely (Windows & Android) */}
            <button
              onClick={onToggleSidebar || onOpenMobileMenu}
              title={isSidebarVisible ? 'Hide Sidemenu Completely' : 'Show Sidemenu Completely'}
              className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100/90 text-blue-700 hover:text-blue-900 transition-all flex items-center gap-1 shadow-2xs group cursor-pointer"
              aria-label={isSidebarVisible ? 'Hide Sidemenu Completely' : 'Show Sidemenu Completely'}
            >
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-700 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline text-xs font-bold text-blue-900 tracking-tight">
                {isSidebarVisible ? 'Hide Menu' : 'Show Menu'}
              </span>
            </button>

            {/* Official MKCE Logo: Bigger on phone, adjusted within frame */}
            <div className="flex items-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXR4irQbR68XxJFgeYzWAT1fIOl245qewuZaAGi2XmWw&s"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/mkce_logo.png';
                }}
                alt="M.Kumarasamy College of Engineering Logo"
                className="h-10 sm:h-14 md:h-18 lg:h-22 w-auto max-w-[95px] sm:max-w-[180px] md:max-w-[280px] lg:max-w-[340px] object-contain drop-shadow-2xs"
              />
            </div>
          </div>

          {/* Middle Zone: Carbon Intelligence Logo in the Middle */}
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-1 sm:px-3 min-w-0">
            <img
              src="https://ukgbc.org/wp-content/uploads/2021/04/Carbon-Intelligence.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/carbon_intelligence.png';
              }}
              alt="Carbon Intelligence Logo"
              className="h-8 sm:h-11 md:h-16 lg:h-20 w-auto max-w-[110px] sm:max-w-[180px] md:max-w-[290px] lg:max-w-[380px] object-contain drop-shadow-xs"
            />
          </div>

          {/* Right Zone: Mailbox + User (Username hidden on phone, visible on tablet & desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Outbound Mail Dispatcher button - strictly shown to Admin only */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenEmailDrawer}
                title="Open Outbound Mail Dispatcher"
                className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg sm:rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-slate-600" />
                {unreadEmailCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-emerald-600 text-[8px] sm:text-[9px] font-mono font-bold text-white shadow-xs">
                    {unreadEmailCount}
                  </span>
                )}
              </button>
            )}

            {/* Display User: Initial Avatar circle on phone; Full Name and Role text hidden on phone, visible on desktop */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1 sm:pl-3 border-l border-slate-200">
                <div
                  title={`${currentUser.name} (${formatUserRole()})`}
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs ring-1 sm:ring-2 ring-blue-100 shrink-0"
                >
                  {currentUser.name.charAt(0)}
                </div>
                {/* Username and designation hidden on phone version */}
                <div className="hidden sm:block text-left sm:max-w-[170px] md:max-w-[240px] min-w-0">
                  <div className="text-xs md:text-sm font-bold text-slate-900 truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-blue-700 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                    <span className="truncate">
                      {formatUserRole()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
