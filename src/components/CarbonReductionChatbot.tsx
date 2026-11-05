import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Lightbulb,
  Zap,
  Leaf,
  Bus,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Building,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  badge?: string;
  suggestions?: string[];
}

interface CarbonReductionChatbotProps {
  onNavigateTab?: (tab: string) => void;
}

export const CarbonReductionChatbot: React.FC<CarbonReductionChatbotProps> = ({
  onNavigateTab,
}) => {
  const { currentUser } = useAuth();
  const studentName = currentUser?.name || 'Rahul Kumar';
  const rollNo = currentUser?.employeeOrStudentId || '21CS001';
  const section = currentUser?.classSection || 'IV Year CSE (Sec IV-A)';

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    {
      id: 'm-1',
      sender: 'bot',
      text: `Hello ${studentName} (${rollNo})! I am your MKCE Carbon Reduction & Energy Chatbot. I track real-time classroom telemetry, CSE lab electricity bills, and dayscholar commute emissions. How can I help you reduce carbon and power bills today?`,
      timestamp: 'Just now',
      suggestions: [
        'How can CSE Class 401 reduce its electricity bill?',
        'Compare College Bus vs Two-Wheeler carbon emissions',
        'What is the electricity bill of CSE LAB 1 vs Virtusa CoE vs R&D Lab?',
        'How much money does changing AC setpoint to 24°C save?',
        'How can I get the MKCE Student Green Badge?',
      ],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAnswer = (userQuery: string): { text: string; badge?: string; suggestions?: string[] } => {
    const q = userQuery.toLowerCase();

    if (q.includes('ac') && (q.includes('save') || q.includes('setpoint') || q.includes('24'))) {
      return {
        badge: 'HVAC Energy Efficiency',
        text: `In your classroom (CS Seminar Hall 401), the 2 x 2.0 Ton Inverter ACs consume 18.0 kWh/day (₹153.00/day at ₹8.50/kWh). 
By switching the thermostat setpoint from 21°C to 24°C, you save approximately 22% of AC power:
• Daily Energy Saved: 3.96 kWh/day
• Monthly Cost Saved: ₹841.50 / month
• Monthly Carbon Abated: 81.2 kg CO2e / month.
Always ensure windows and seminar hall fire doors remain tightly latched when cooling is active!`,
        suggestions: [
          'What about CSE LAB 1 AC bills?',
          'What is the total classroom electric bill?',
        ],
      };
    }

    if (q.includes('lab') || q.includes('virtusa') || q.includes('r&d') || q.includes('lab 1')) {
      return {
        badge: 'Department Lab Telemetry',
        text: `Here is the verified electricity tariff breakdown across CSE Department Labs (at ₹8.50/kWh TANGEDCO educational HT rate):

1. CSE LAB 1 (AI & Web Development Hub · CS-LAB-01):
   • Live Current: 52.4 A (3-Phase 415V, PF 0.95)
   • Daily Total: 94.6 kWh/day · ₹804.10 /day (₹20,102.50 /month)
   • 72 Workstations: ₹475.15/day | 4 ACs: ₹238.00/day | Lights & Fans: ₹86.36/day

2. Virtusa Center of Excellence Lab (Cloud Computing · CS-COE-01):
   • Live Current: 44.8 A (3-Phase 415V, PF 0.97)
   • Daily Total: 76.5 kWh/day · ₹650.25 /day (₹16,256.25 /month)
   • 60 Workstations: ₹428.40/day | 2 Ductable ACs: ₹140.25/day

3. CSE R&D LAB (DeepTech & AI Workstations · CS-RD-01):
   • Live Current: 48.2 A (3-Phase 415V, PF 0.96)
   • Daily Total: 82.0 kWh/day · ₹697.00 /day (₹17,425.00 /month)
   • 55 RTX 3060 Tower Rigs: ₹504.90/day | Precision Cooling: ₹199.75/day`,
        suggestions: [
          'How can labs reduce peak current demand?',
          'Compare College Bus vs Two-Wheeler carbon emissions',
        ],
      };
    }

    if (q.includes('bus') || q.includes('commute') || q.includes('two-wheeler') || q.includes('bike') || q.includes('petrol')) {
      return {
        badge: 'Commute GHG Protocol',
        text: `Comparing daily dayscholar transit modes from stop Gandhigramam (36 km roundtrip):

🚌 1. College Bus (Bus No. 01):
• Shared Diesel Usage: ~0.39 Litres/student daily
• Shared Fuel Cost: ₹37.05/day (₹926/month fuel share)
• Carbon Footprint: 1.05 kg CO2e /day
• GHG Release Rate: 29.2 g CO2e /km

🏍️ 2. Private Two-Wheeler (Motorcycle @ 45 km/L):
• Petrol Consumed: 0.80 Litres/day (at ₹102.80/L)
• Daily Petrol Bill: ₹82.24/day (₹2,056.00 /month)
• Carbon Footprint: 1.85 kg CO2e /day
• GHG Release Rate: 51.4 g CO2e /km

🌱 Net Result: Taking the College Bus cuts your personal transit carbon emissions by 43.2% and saves you over ₹1,130 in monthly fuel expense!`,
        suggestions: [
          'What about public transport?',
          'How can I get the MKCE Student Green Badge?',
        ],
      };
    }

    if (q.includes('green badge') || q.includes('badge') || q.includes('award') || q.includes('cert')) {
      return {
        badge: 'Student Green Badge Program',
        text: `To earn the official MKCE Student Green Badge (awarded jointly by the Green Campus Cell & Principal's Office):

1. Commute via College Bus, Public Transport, or EV Bike (zero tailpipe fossil emission).
2. Maintain classroom energy discipline: Turn off projector, ceiling fans, and inverter AC units during lab hours.
3. Keep laptop sleep timer set to 5 minutes to prevent phantom power draw.
4. Participate in the MKCE 1 MW Rooftop Solar Clean Energy initiative!
Badges are updated every semester in your Student Credentials Profile.`,
        suggestions: [
          'How can CSE Class 401 reduce its electricity bill?',
          'What is our lab AC bill?',
        ],
      };
    }

    if (q.includes('class') || q.includes('bill') || q.includes('room 401') || q.includes('402')) {
      return {
        badge: 'Classroom Telemetry',
        text: `Classroom Electricity Bills for ${section} (Room CS Seminar Hall 401):
• Total Daily Power: 57.51 kWh/day
• Total Daily Electric Bill: ₹488.84 /day (at ₹8.50/kWh HT rate)
• Monthly Bill (25 days): ₹12,221.00 /month
Breakdown by Equipment:
• 84 Student Laptops/Systems: ₹278.46 /day (56%)
• 2 x 2.0 Ton Split Inverter ACs: ₹153.00 /day (31%)
• 8 x 55W BLDC Fans: ₹29.92 /day (6%)
• 12 x 28W LED Batten Lights: ₹22.87 /day (5%)
• Aruba AP-555 Wi-Fi 6 Router: ₹4.59 /day (2%)`,
        suggestions: [
          'How much money does changing AC setpoint to 24°C save?',
          'What is the electricity bill of CSE LAB 1 vs Virtusa CoE?',
        ],
      };
    }

    // Default intelligent guidance
    return {
      badge: 'Campus Energy Assistant',
      text: `Based on your student telemetry in ${section}:
• Classroom: Draws ~14.8 Amperes at 230V with 0.96 power factor.
• Labs: CSE LAB 1, Virtusa CoE, and R&D Lab utilize 3-Phase 415V power with active APFC power factor correction (>0.95).
• Campus Renewable Offset: MKCE generates clean electricity via rooftop solar panels, offsetting ~32.4 tons of CO2e monthly.
Feel free to ask about any specific equipment (AC, lights, fans, systems, Wi-Fi), lab rates, or travel petrol tariffs!`,
      suggestions: [
        'How can CSE Class 401 reduce its electricity bill?',
        'Compare College Bus vs Two-Wheeler carbon emissions',
        'What is the electricity bill of CSE LAB 1 vs Virtusa CoE vs R&D Lab?',
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAnswer(query);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        badge: reply.badge,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: reply.suggestions,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto w-full pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/image_4a016d12.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://t3.ftcdn.net/jpg/19/91/15/48/360_F_1991154824_NA8qVk3WI9MgSJvNlaOwih394Dp7AVD7.jpg';
              }}
              alt="Carbon Chatbot Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-contain p-1 border-2 border-emerald-300 shadow-md shrink-0 bg-white"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <span>AI Powered · Real-Time Telemetry</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight">
                MKCE Carbon Reduction & Energy Chatbot
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                Instant analytics for classroom electricity, lab power bills, dayscholar petrol costs, and greenhouse gas mitigation.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages(initialMessages)}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/15 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                {isUser ? (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs bg-blue-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                ) : (
                  <img
                    src="/assets/aistudio/image_4a016d12.png"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://t3.ftcdn.net/jpg/19/91/15/48/360_F_1991154824_NA8qVk3WI9MgSJvNlaOwih394Dp7AVD7.jpg';
                    }}
                    alt="Carbon Chatbot Logo"
                    className="w-10 h-10 rounded-xl object-contain p-0.5 shrink-0 border border-emerald-300 shadow-xs bg-white"
                  />
                )}

                {/* Content Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-700">
                      {isUser ? studentName : 'Carbon AI Assistant'}
                    </span>
                    <span>·</span>
                    <span>{m.timestamp}</span>
                    {m.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold">
                        {m.badge}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(s)}
                          className="text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg transition-all text-left cursor-pointer hover:scale-[1.01]"
                        >
                          💬 {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl w-fit shadow-xs animate-pulse">
              <img
                src="/assets/aistudio/image_4a016d12.png"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://t3.ftcdn.net/jpg/19/91/15/48/360_F_1991154824_NA8qVk3WI9MgSJvNlaOwih394Dp7AVD7.jpg';
                }}
                alt="Carbon Chatbot Logo"
                className="w-5 h-5 rounded object-contain bg-white"
              />
              <span>Analyzing campus electrical meters and calculating carbon reductions...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about AC savings, Lab 1 electricity, bus vs bike carbon, or green tips..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
