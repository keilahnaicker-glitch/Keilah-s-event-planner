import React, { useState } from 'react';
import { EventData, ContingencyPlan } from '../types/event';
import { EMERGENCY_PRESETS, generatePlanBResponse, EmergencyScenarioPreset } from '../services/planBService';
import { AlertTriangle, ShieldAlert, PhoneCall, Clock, CheckCircle2, ArrowRight, Play, Plus, Check } from 'lucide-react';

interface PlanBViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

export const PlanBView: React.FC<PlanBViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedPreset, setSelectedPreset] = useState<EmergencyScenarioPreset>(EMERGENCY_PRESETS[0]);
  const [activePlan, setActivePlan] = useState<ContingencyPlan>(() => generatePlanBResponse(EMERGENCY_PRESETS[0].id, event));
  const [customEmergencyText, setCustomEmergencyText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectPreset = (preset: EmergencyScenarioPreset) => {
    setSelectedPreset(preset);
    setActivePlan(generatePlanBResponse(preset.id, event));
    setSavedSuccess(false);
  };

  const handleRunCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmergencyText.trim()) return;
    const plan = generatePlanBResponse('custom', event, customEmergencyText.trim());
    setActivePlan(plan);
    setSavedSuccess(false);
  };

  const handleSaveToProtocols = () => {
    const updated = structuredClone(event);
    if (!updated.contingencyPlans.some((p) => p.trigger === activePlan.trigger)) {
      updated.contingencyPlans.push(activePlan);
      onUpdateEvent(updated);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 text-white rounded-2xl p-6 shadow-md border border-rose-900">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Emergency Contingency Protocols
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          Plan B Mode 🚨
        </h2>
        <p className="text-xs text-rose-200 mt-1 max-w-2xl">
          Calm, prioritised emergency recovery procedures for unexpected surprises: rainstorms, vendor cancellations, equipment failures, and timeline delays.
        </p>
      </div>

      {/* Preset Emergency Scenario Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Select Emergency Incident:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {EMERGENCY_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                selectedPreset.id === p.id
                  ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                  : 'bg-stone-50 border-stone-200 hover:border-rose-300 text-stone-800'
              }`}
            >
              <div>
                <span className="text-[9px] uppercase font-bold text-stone-400 block mb-1">
                  {p.category}
                </span>
                <span className="font-semibold leading-tight block">{p.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Emergency Input */}
        <form onSubmit={handleRunCustom} className="pt-3 border-t border-stone-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Or describe a custom crisis (e.g. Master of Ceremonies lost voice)..."
            value={customEmergencyText}
            onChange={(e) => setCustomEmergencyText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Plan B</span>
          </button>
        </form>
      </div>

      {/* Structured Plan B Protocol Card */}
      <div className="bg-white rounded-2xl border-2 border-rose-600 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-900 to-stone-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider block">
              Active Contingency Directive
            </span>
            <h3 className="font-serif font-bold text-xl text-white mt-0.5">
              {activePlan.trigger}
            </h3>
          </div>

          <button
            onClick={handleSaveToProtocols}
            className="px-4 py-2 bg-white hover:bg-stone-100 text-rose-950 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Saved to Event Protocols!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Add to My Event Protocols</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* 1. Immediate Actions */}
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
            <h4 className="font-serif font-bold text-sm text-rose-950 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              1. Immediate Actions (What To Do Now — Calm & Prioritised)
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-rose-900 leading-relaxed font-medium">
              {activePlan.immediateActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ol>
          </div>

          {/* 2. Plan B */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h4 className="font-serif font-bold text-sm text-purple-950 mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-700" />
              2. Plan B Strategy (The Best Alternative)
            </h4>
            <p className="text-purple-900 leading-relaxed font-medium mt-1">
              {activePlan.planB}
            </p>
          </div>

          {/* 3. Who to contact & Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-stone-700" />
                Who to Contact
              </h4>
              <p className="text-stone-700 mt-1 leading-relaxed">
                {activePlan.whoToContact}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Event Scope Impact
              </h4>
              <p className="text-stone-700 mt-1 leading-relaxed">
                {activePlan.eventImpact}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                Updated Run-of-Show Timing
              </h4>
              <p className="text-stone-700 mt-1 leading-relaxed">
                {activePlan.updatedTimeline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
