import React, { useState } from 'react';
import { useEmissions } from '../context/EmissionContext';
import { useAuth } from '../context/AuthContext';
import { MitigationPlan } from '../types';
import {
  Target,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const MitigationPlanView: React.FC = () => {
  const { mitigationPlans, updateMitigationPlan } = useEmissions();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const totalTargetReduction = mitigationPlans.reduce((sum, p) => sum + p.targetReductionTonsCO2e, 0);
  const totalActualSaved = mitigationPlans.reduce((sum, p) => sum + p.actualSavedTonsCO2e, 0);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-wider">
                M.Kumarasamy College of Engineering
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Institutional Carbon Abatement Plan</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-600" />
              <span>Campus Carbon Reduction Initiatives</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Targeted engineering interventions to reduce campus emissions across thermal heating, solar PV expansion, electric transport, and organic food waste biogas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-right">
              <div className="text-[11px] text-slate-500 uppercase font-mono">Realized CO₂e Avoided</div>
              <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                {totalActualSaved.toFixed(1)} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Cumulative Target Abatement</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalTargetReduction.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO₂e/yr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Target benchmark across 4 flagship programs
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Delivered Reduction to Date</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {totalActualSaved.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO₂e</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{((totalActualSaved / totalTargetReduction) * 100).toFixed(1)}% of roadmap realized</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Active Initiatives</div>
          <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums">
            {mitigationPlans.length} Projects
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Hostels, Transport, Power Systems, Biotech
          </div>
        </div>
      </div>

      {/* Initiatives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mitigationPlans.map((plan) => {
          const percent = Math.min(100, (plan.actualSavedTonsCO2e / plan.targetReductionTonsCO2e) * 100);
          return (
            <div
              key={plan.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{plan.title}</h3>
                    <div className="text-[11px] font-mono text-blue-700">
                      {plan.department} · {plan.category}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      plan.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : plan.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {plan.description}
                </p>
              </div>

              {/* Progress & Stats */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Avoidance Progress</span>
                    <span className="text-emerald-700 font-bold tabular-nums">
                      {plan.actualSavedTonsCO2e.toFixed(1)} / {plan.targetReductionTonsCO2e.toFixed(1)} tCO₂e ({percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                  <div>Lead: <span className="text-slate-800">{plan.leadPerson}</span></div>
                  <div>Budget: <span className="text-slate-800">{plan.costEstimate}</span></div>
                  <div>Target Date: <span className="text-slate-800">{plan.targetDate}</span></div>
                  <div>Abatement: <span className="text-emerald-700 font-semibold">{plan.targetReductionTonsCO2e} tCO₂e</span></div>
                </div>

                {isAdmin && (
                  <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                    {plan.status !== 'Completed' && (
                      <button
                        onClick={() =>
                          updateMitigationPlan(plan.id, {
                            status: 'Completed',
                            actualSavedTonsCO2e: plan.targetReductionTonsCO2e,
                          })
                        }
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
