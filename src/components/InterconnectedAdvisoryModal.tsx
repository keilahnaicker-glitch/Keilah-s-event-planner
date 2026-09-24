import React, { useState } from 'react';
import { EventData, InterconnectedChangeNotice } from '../types/event';
import { calculateInterconnectedImpact, applyInterconnectedRecalculations } from '../services/interconnectedEngine';
import { Sparkles, Users, Utensils, Table as TableIcon, DollarSign, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface InterconnectedAdvisoryModalProps {
  isOpen: boolean;
  event: EventData;
  onClose: () => void;
  onApplyChanges: (updatedEvent: EventData) => void;
}

export const InterconnectedAdvisoryModal: React.FC<InterconnectedAdvisoryModalProps> = ({
  isOpen,
  event,
  onClose,
  onApplyChanges,
}) => {
  const [targetGuestCount, setTargetGuestCount] = useState<number>(event.guestCount || 50);

  if (!isOpen) return null;

  const currentCount = event.guestCount || 50;
  const impact: InterconnectedChangeNotice = calculateInterconnectedImpact(event, targetGuestCount);
  const isChanged = targetGuestCount !== currentCount;

  const handleApply = () => {
    const updated = applyInterconnectedRecalculations(event, targetGuestCount);
    onApplyChanges(updated);
    onClose();
  };

  const handlePreset = (num: number) => {
    setTargetGuestCount(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-6 relative">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Planora Central Interconnected Engine
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            Guest Volume & System Recalculation
          </h2>
          <p className="text-sm text-purple-200 mt-1">
            Changing guest count automatically ripples updates across seating, food, drinks, budget, shopping, and timeline timing.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Target Guest Input Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <label className="block text-sm font-semibold text-stone-800">
                  Target Expected Guests
                </label>
                <p className="text-xs text-stone-500">
                  Currently configured for {currentCount} guests
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={targetGuestCount}
                  onChange={(e) => setTargetGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 text-center text-xl font-bold font-mono border-2 border-purple-600 rounded-xl py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Quick Test Presets (including the 70 guest test case from prompt) */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-stone-500 font-medium">Test Presets:</span>
              {[
                { label: 'Prompt Test: 70 Guests', val: 70 },
                { label: 'Small: 30', val: 30 },
                { label: 'Medium: 50', val: 50 },
                { label: 'Large: 100', val: 100 },
                { label: 'Gala: 150', val: 150 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handlePreset(p.val)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                    targetGuestCount === p.val
                      ? 'bg-purple-900 text-white border-purple-900 font-semibold'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connection Impact Breakdown */}
          {isChanged ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Calculated Ripple Effects ({currentCount} → {targetGuestCount} Guests)
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {impact.foodScalingPercent > 0 ? `+${impact.foodScalingPercent}%` : `${impact.foodScalingPercent}%`} Volume
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tables & Seating Impact */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm mb-1">
                    <TableIcon className="w-4 h-4 text-purple-600" />
                    Tables & Chairs
                  </div>
                  <div className="text-xs text-stone-600">
                    {impact.tableDifference > 0 ? (
                      <span className="text-amber-700 font-medium">
                        Requires <strong>+{impact.tableDifference} additional table(s)</strong> (will automatically generate Table {event.tables.length + 1} to {event.tables.length + impact.tableDifference}).
                      </span>
                    ) : impact.tableDifference < 0 ? (
                      <span className="text-stone-600">
                        Current tables can comfortably accommodate seating with generous spacing.
                      </span>
                    ) : (
                      <span className="text-emerald-700">Existing tables and chair counts match this volume.</span>
                    )}
                  </div>
                </div>

                {/* Food & Beverage Portions */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm mb-1">
                    <Utensils className="w-4 h-4 text-indigo-600" />
                    Portions & Catering
                  </div>
                  <div className="text-xs text-stone-600">
                    Catering quantities and bar supplies automatically scaled by{' '}
                    <strong>{impact.foodScalingPercent > 0 ? `+${impact.foodScalingPercent}%` : `${impact.foodScalingPercent}%`}</strong>.
                  </div>
                </div>

                {/* Estimated Budget Allocation */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm mb-1">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Variable Budget Impact
                  </div>
                  <div className="text-xs text-stone-600">
                    Estimated variable spend difference:{' '}
                    <strong className={impact.budgetDifference > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                      {impact.budgetDifference > 0 ? '+' : ''}{event.currency} {impact.budgetDifference.toLocaleString()}
                    </strong>.
                  </div>
                </div>

                {/* Schedule Buffer */}
                <div className="p-3.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm mb-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Run-of-Show Timing
                  </div>
                  <div className="text-xs text-stone-600">
                    {impact.scheduleTimingImpact}
                  </div>
                </div>
              </div>

              {/* Venue check if applicable */}
              {event.venueCapacity && targetGuestCount > event.venueCapacity && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Venue Capacity Warning:</strong> Maximum rated venue capacity is {event.venueCapacity} guests. This target exceeds capacity by {targetGuestCount - event.venueCapacity} guests.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-stone-500 text-sm">
              Enter a different number of guests above to preview how Planora automatically recalculates your event system.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-200 rounded-xl transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!isChanged}
            onClick={handleApply}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md transition ${
              isChanged
                ? 'bg-purple-900 hover:bg-purple-950 text-white cursor-pointer'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>Apply Interconnected Recalculation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
