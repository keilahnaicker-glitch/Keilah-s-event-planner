import React from 'react';
import { EventData } from '../types/event';
import { Sparkles, Calendar, DollarSign, Users, Award, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { calculateEventReadinessScore, generateProactiveWarnings } from '../services/interconnectedEngine';

interface EventSnapshotProps {
  event: EventData;
  onOpenStressTest: () => void;
  onOpenReadinessModal: () => void;
  onOpenGuestCountEditor: () => void;
}

export const EventSnapshot: React.FC<EventSnapshotProps> = ({
  event,
  onOpenStressTest,
  onOpenReadinessModal,
  onOpenGuestCountEditor,
}) => {
  // Calculate countdown
  const eventDate = new Date(`${event.date}T${event.startTime || '12:00'}`);
  const today = new Date();
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let countdownText = `${diffDays} days until your celebration 🎉`;
  if (diffDays === 0) countdownText = '✨ Event day is TODAY! ✨';
  else if (diffDays < 0) countdownText = `Event passed (${Math.abs(diffDays)} days ago)`;
  else if (diffDays === 1) countdownText = 'Tomorrow is the big day! 🥂';

  // Budget calculations
  const totalPlanned = event.budgetItems.reduce((acc, b) => acc + b.plannedCost, 0);
  const totalActual = event.budgetItems.reduce((acc, b) => acc + (b.actualCost > 0 ? b.actualCost : b.plannedCost), 0);
  const remainingBudget = event.budget - totalActual;
  const budgetPercentUsed = Math.min(100, Math.round((totalActual / (event.budget || 1)) * 100));

  // Readiness Score
  const { score } = calculateEventReadinessScore(event);

  // Proactive warnings
  const warnings = generateProactiveWarnings(event);
  const criticalWarnings = warnings.filter((w) => w.type === 'critical');
  const otherWarnings = warnings.filter((w) => w.type !== 'critical');

  return (
    <div className="bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 text-white rounded-2xl shadow-xl p-5 md:p-6 mb-6 border border-purple-800/40 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-800/50 pb-4 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {event.eventType}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-400/20 text-purple-200 border border-purple-400/30">
              {event.vibe} Vibe
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-700/50 text-stone-300">
              {event.indoorOutdoor}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-100 mt-1 tracking-tight">
            {event.eventName || 'Untitled Event'}
          </h1>
          <p className="text-sm text-stone-400 flex items-center gap-2 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-purple-300" />
            <span>{event.date} • {event.startTime} - {event.endTime}</span>
            <span>•</span>
            <span>{event.venue ? `${event.venue}, ${event.location}` : event.location || 'Location Pending'}</span>
          </p>
        </div>

        {/* Right side: Countdown & Readiness Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs uppercase tracking-wider text-purple-300 font-semibold">Countdown</div>
            <div className="text-sm md:text-base font-semibold text-amber-200">{countdownText}</div>
          </div>

          <button
            onClick={onOpenReadinessModal}
            className="flex items-center gap-2.5 bg-stone-800/80 hover:bg-stone-800 border border-purple-400/30 rounded-xl p-2.5 px-3.5 transition group"
            title="Click to view detailed Event Readiness Breakdown"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-purple-400'}
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-stone-100">{score}%</span>
            </div>
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Readiness</div>
              <div className="text-xs font-semibold text-stone-200 flex items-center gap-1">
                <span>{score >= 80 ? 'Celebration Ready' : score >= 50 ? 'In Progress' : 'Initial Setup'}</span>
                <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        {/* Guest Count Card */}
        <div className="bg-stone-800/60 rounded-xl p-3 border border-stone-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-purple-400" /> Guests</span>
            <button
              onClick={onOpenGuestCountEditor}
              className="text-[11px] text-purple-300 hover:text-purple-100 underline decoration-purple-500/50"
              title="Test Interconnected Change"
            >
              Adjust
            </button>
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold text-stone-100">{event.guestCount}</div>
            <div className="text-[11px] text-stone-400 truncate">
              {event.guestList.filter((g) => g.rsvp === 'Confirmed').length} confirmed • {event.tables.reduce((a, t) => a + t.capacity, 0)} seats
            </div>
          </div>
        </div>

        {/* Budget Card */}
        <div className="bg-stone-800/60 rounded-xl p-3 border border-stone-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-amber-400" /> Total Budget</span>
            <span className="text-[11px] text-stone-400 font-mono">{event.currency}</span>
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold text-stone-100">
              {event.currency} {event.budget.toLocaleString()}
            </div>
            <div className="text-[11px] text-stone-400">
              Allocated: {event.currency} {totalPlanned.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Remaining Budget Card */}
        <div className="bg-stone-800/60 rounded-xl p-3 border border-stone-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Remaining Budget</span>
            <span className={`text-[11px] font-semibold ${remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {budgetPercentUsed}% used
            </span>
          </div>
          <div className="mt-1">
            <div className={`text-xl font-bold ${remainingBudget < 0 ? 'text-rose-300 font-mono' : 'text-emerald-300 font-mono'}`}>
              {event.currency} {remainingBudget.toLocaleString()}
            </div>
            <div className="w-full bg-stone-700/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${remainingBudget < 0 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(100, budgetPercentUsed)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Theme & Palette Card */}
        <div className="bg-stone-800/60 rounded-xl p-3 border border-stone-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-300" /> Theme & Palette</span>
          </div>
          <div className="mt-1">
            <div className="text-sm font-semibold text-stone-100 truncate">{event.theme || 'Classic Refined'}</div>
            <div className="flex items-center gap-1.5 mt-1">
              {event.colourPalette.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name}: ${c.usage}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Proactive Intelligent Warnings Alert Bar */}
      {warnings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-purple-800/40 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {criticalWarnings.length > 0 ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                {criticalWarnings.length} Critical Issue{criticalWarnings.length > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                {warnings.length} Advisory Notice{warnings.length > 1 ? 's' : ''}
              </span>
            )}
            <p className="text-xs text-stone-300 truncate max-w-xl">
              {warnings[0].title}: {warnings[0].message}
            </p>
          </div>

          <button
            onClick={onOpenStressTest}
            className="text-xs font-semibold text-purple-300 hover:text-purple-100 flex items-center gap-1 whitespace-nowrap bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/50 px-3 py-1.5 rounded-lg transition"
          >
            <span>Review in Stress Test</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
