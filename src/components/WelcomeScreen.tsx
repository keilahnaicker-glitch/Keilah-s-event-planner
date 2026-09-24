import React from 'react';
import { EventData } from '../types/event';
import { Sparkles, Calendar, PlusCircle, Wand2, FolderHeart, ArrowRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStartNewEvent: () => void;
  onBuildEntireEvent: () => void;
  onOpenMyEvents: () => void;
  onLoadExampleEvent: () => void;
  savedEventsCount: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartNewEvent,
  onBuildEntireEvent,
  onOpenMyEvents,
  onLoadExampleEvent,
  savedEventsCount,
}) => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-100/60 via-pink-50/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Branding */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-900 to-indigo-800 text-amber-300 flex items-center justify-center shadow-md font-serif font-black text-xl">
            P
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-tight text-stone-900">
              Planora AI
            </span>
            <span className="text-[10px] block uppercase tracking-widest text-purple-700 font-semibold">
              Event Operating System
            </span>
          </div>
        </div>

        {savedEventsCount > 0 && (
          <button
            onClick={onOpenMyEvents}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
          >
            <FolderHeart className="w-4 h-4 text-purple-700" />
            <span>My Events ({savedEventsCount})</span>
          </button>
        )}
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16 text-center flex-1 flex flex-col justify-center items-center">
        {/* Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Intelligent All-in-One Coordinator</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-[1.1] mb-4">
          Planora AI
        </h1>

        <p className="text-xl sm:text-2xl font-serif italic text-purple-950 font-medium mb-5">
          Plan less. Celebrate more. ✨
        </p>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed mb-10">
          Your intelligent event coordinator for planning unforgettable events without the chaos.
          From seating charts to dynamic budget rebalancing, all your event data stays interconnected.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-8">
          <button
            onClick={onStartNewEvent}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-semibold text-base shadow-lg shadow-purple-900/20 hover:shadow-xl transition-all group"
          >
            <PlusCircle className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform" />
            <span>Plan a New Event</span>
          </button>

          <button
            onClick={onBuildEntireEvent}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-white font-semibold text-base shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all group"
          >
            <Wand2 className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>Build My Entire Event ✨</span>
          </button>
        </div>

        {/* Secondary / Demo Event Trigger */}
        <div className="flex items-center gap-4 text-sm text-stone-500 flex-wrap justify-center">
          <button
            onClick={onLoadExampleEvent}
            className="text-stone-600 hover:text-purple-900 font-medium underline underline-offset-4 decoration-purple-300 hover:decoration-purple-600 transition flex items-center gap-1.5"
          >
            <span>Load Example Event (Keisha’s Honors Graduation Gala)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {savedEventsCount > 0 && (
            <>
              <span>•</span>
              <button
                onClick={onOpenMyEvents}
                className="text-purple-700 hover:text-purple-900 font-semibold"
              >
                Browse {savedEventsCount} Saved Event{savedEventsCount > 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>

        {/* Pillars / Feature Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-16 max-w-3xl w-full text-left">
          <div className="p-3.5 bg-white/80 backdrop-blur-xs rounded-xl border border-stone-200 shadow-xs">
            <div className="text-purple-900 font-semibold text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Interconnected
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Guest changes auto-recalculate tables, portions, schedule, and budgets.
            </p>
          </div>

          <div className="p-3.5 bg-white/80 backdrop-blur-xs rounded-xl border border-stone-200 shadow-xs">
            <div className="text-purple-900 font-semibold text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              AI Seating
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Social harmony rules respect VIPs, families, and separation constraints.
            </p>
          </div>

          <div className="p-3.5 bg-white/80 backdrop-blur-xs rounded-xl border border-stone-200 shadow-xs">
            <div className="text-purple-900 font-semibold text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              What-If & Stress Test
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Simulate surprises safely before committing changes to real event data.
            </p>
          </div>

          <div className="p-3.5 bg-white/80 backdrop-blur-xs rounded-xl border border-stone-200 shadow-xs">
            <div className="text-purple-900 font-semibold text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Plan B Mode
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Calm, immediate recovery protocols for weather, vendors, and delays.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-stone-400 border-t border-stone-200 max-w-7xl mx-auto w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>Planora AI • The Intelligent Event Operating System</div>
        <div className="flex items-center gap-1 text-stone-500">
          <span>Plan less. Celebrate more.</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        </div>
      </footer>
    </div>
  );
};
