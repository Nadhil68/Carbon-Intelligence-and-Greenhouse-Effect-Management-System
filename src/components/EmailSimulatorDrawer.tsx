import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SimulatedEmail } from '../types';
import {
  X,
  Mail,
  CheckCircle,
  XCircle,
  KeyRound,
  Trash2,
  Clock,
  Send,
} from 'lucide-react';

interface EmailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResetToken?: (token: string) => void;
}

export const EmailSimulatorDrawer: React.FC<EmailDrawerProps> = ({
  isOpen,
  onClose,
  onSelectResetToken,
}) => {
  const { currentUser, simulatedEmails, markEmailAsRead, clearEmails } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(
    simulatedEmails[0] || null
  );

  if (!isOpen || currentUser?.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white border-l border-slate-200 text-slate-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Outbound Mail Dispatcher</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    SMTP Simulator
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  M.Kumarasamy College of Engineering · Automated notifications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {simulatedEmails.length > 0 && (
                <button
                  onClick={clearEmails}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Clear Mailbox"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body: Split view of email list & active email preview */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: Email list */}
            <div className="w-2/5 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
              {simulatedEmails.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No outbound notifications dispatched yet.
                </div>
              ) : (
                simulatedEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => {
                        setSelectedEmail(email);
                        markEmailAsRead(email.id);
                      }}
                      className={`w-full text-left p-3.5 transition-colors text-xs flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-white border-l-3 border-blue-600 shadow-xs'
                          : 'hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                          {email.toName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {email.sentAt.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-700 line-clamp-1">
                        {email.subject}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {email.type === 'account_approved' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700">
                            <CheckCircle className="w-3 h-3" />
                            <span>Accepted</span>
                          </span>
                        )}
                        {email.type === 'account_rejected' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-rose-700">
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                        {email.type === 'password_reset' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-700">
                            <KeyRound className="w-3 h-3" />
                            <span>Recovery</span>
                          </span>
                        )}
                        {!email.read && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Column: Full email preview */}
            <div className="w-3/5 overflow-y-auto p-5 bg-white">
              {selectedEmail ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="text-sm font-bold text-slate-900">{selectedEmail.subject}</div>
                    <div className="text-slate-600">
                      <span className="text-slate-400">To:</span> {selectedEmail.toName} &lt;
                      {selectedEmail.toEmail}&gt;
                    </div>
                    <div className="text-slate-500">
                      <span>From:</span> {selectedEmail.from}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{selectedEmail.sentAt}</span>
                    </div>

                    {selectedEmail.actionToken && (
                      <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-[11px] text-blue-800 font-mono">
                          Token: <strong>{selectedEmail.actionToken}</strong>
                        </div>
                        {onSelectResetToken && (
                          <button
                            onClick={() => {
                              onSelectResetToken(selectedEmail.actionToken!);
                              onClose();
                            }}
                            className="px-2 py-0.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-[10px] font-mono"
                          >
                            Apply in Reset Form
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs leading-relaxed shadow-xs">
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                      className="space-y-2 [&>p]:mb-2 [&>blockquote]:text-slate-700"
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    Automated notification generated by M.Kumarasamy College of Engineering Carbon Intelligence Portal.
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Select an email on the left to read full contents
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
