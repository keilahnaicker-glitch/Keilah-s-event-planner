import React, { useState } from 'react';
import { EventData } from '../types/event';
import { WHAT_IF_PRESETS, runWhatIfSimulation, WhatIfSimulationResult, WhatIfPreset } from '../services/whatIfEngine';
import { Sparkles, AlertTriangle, ArrowRight, Check, X, ShieldAlert, Compass, Play } from 'lucide-react';

interface WhatIfViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(WHAT_IF_PRESETS[0].id);
  const [activeSimulation, setActiveSimulation] = useState<WhatIfSimulationResult | null>(null);
  const [customText, setCustomText] = useState('');

  const handleRunPreset = (preset: WhatIfPreset) => {
    setSelectedPresetId(preset.id);
    const mutated = preset.applyDelta(event);
    const result = runWhatIfSimulation(event, mutated, preset.name, preset.description);
    setActiveSimulation(result);
  };

  const handleRunCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const mutated = structuredClone(event);
    mutated.notes = (mutated.notes || '') + `\n[Simulated Scenario: ${customText}]`;
    const result = runWhatIfSimulation(event, mutated, 'Custom Scenario', customText);
    setActiveSimulation(result);
  };

  const handleApplyChanges = () => {
    if (!activeSimulation) return;
    onUpdateEvent(activeSimulation.simulatedEvent);
    setActiveSimulation(null);
  };

  const handleDiscard = () => {
    setActiveSimulation(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-stone-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-purple-800">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          Predictive Risk Simulator
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          What If? 🔮 Simulation Sandbox
        </h2>
        <p className="text-xs text-purple-200 mt-1 max-w-2xl">
          Simulate weather disruptions, sudden guest spikes, supplier cancellations, or budget changes <strong>without modifying your real event data</strong> until you explicitly click Apply.
        </p>
      </div>

      {/* Preset Selector Grid */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-purple-700" />
          Choose a Simulation Scenario:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {WHAT_IF_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleRunPreset(p)}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                selectedPresetId === p.id && activeSimulation?.scenarioTitle === p.name
                  ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                  : 'bg-stone-50 border-stone-200 hover:border-purple-300 text-stone-800 hover:bg-white'
              }`}
            >
              <div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    selectedPresetId === p.id && activeSimulation?.scenarioTitle === p.name
                      ? 'bg-purple-800 text-purple-200'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {p.category}
                </span>
                <div className="font-semibold text-xs mt-1.5 leading-snug">{p.name}</div>
              </div>
              <p
                className={`text-[11px] mt-2 ${
                  selectedPresetId === p.id && activeSimulation?.scenarioTitle === p.name
                    ? 'text-purple-200'
                    : 'text-stone-500'
                }`}
              >
                {p.description}
              </p>
            </button>
          ))}
        </div>

        {/* Custom Scenario Input */}
        <form onSubmit={handleRunCustom} className="pt-3 border-t border-stone-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Or describe a custom scenario (e.g. Flight delay moves arrival by 2 hours)..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulate Custom</span>
          </button>
        </form>
      </div>

      {/* Simulation Results Display */}
      {activeSimulation && (
        <div className="bg-white rounded-2xl border-2 border-purple-600 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Simulation Header Banner */}
          <div className="bg-gradient-to-r from-purple-950 to-stone-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Active Simulation Preview
              </div>
              <h3 className="font-serif font-bold text-xl text-white mt-0.5">
                {activeSimulation.scenarioTitle}
              </h3>
              <p className="text-xs text-purple-200">{activeSimulation.scenarioDescription}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleDiscard}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              >
                Discard Simulation
              </button>
              <button
                onClick={handleApplyChanges}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" />
                <span>Apply These Changes to Event</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Side-by-Side Comparison Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Side-by-Side Parameter Impact
              </h4>
              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Event Dimension</th>
                      <th className="py-2.5 px-4">Current Real Value</th>
                      <th className="py-2.5 px-4">Simulated Value</th>
                      <th className="py-2.5 px-4">Delta / Variance</th>
                      <th className="py-2.5 px-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activeSimulation.comparisons.map((c, i) => (
                      <tr key={i} className="hover:bg-purple-50/20">
                        <td className="py-3 px-4 font-semibold text-stone-900">{c.metric}</td>
                        <td className="py-3 px-4 text-stone-600">{c.currentValue}</td>
                        <td className="py-3 px-4 font-bold text-purple-950">{c.simulatedValue}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-amber-700">{c.deltaText}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              c.impactLevel === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : c.impactLevel === 'high'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {c.impactLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risks & Recommended Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {activeSimulation.risksAndAdvisories.length > 0 && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                  <strong className="block mb-2 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Identified Vulnerabilities & Risks
                  </strong>
                  <ul className="list-disc pl-4 space-y-1">
                    {activeSimulation.risksAndAdvisories.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-purple-950">
                <strong className="block mb-2 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  Recommended Coordinator Actions
                </strong>
                <ul className="list-disc pl-4 space-y-1">
                  {activeSimulation.recommendedActions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Caution Banner */}
            <div className="p-3 bg-stone-100 rounded-xl text-stone-600 text-xs flex items-center justify-between">
              <span>
                <strong>Note:</strong> Your real event data remains unchanged until you select "Apply These Changes".
              </span>
              <button
                onClick={handleDiscard}
                className="text-stone-500 hover:text-stone-800 font-semibold underline text-xs"
              >
                Dismiss simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
