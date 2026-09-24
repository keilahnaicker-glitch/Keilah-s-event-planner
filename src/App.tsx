import React, { useState, useEffect } from 'react';
import { EventData, GeneratedEventPlan } from './types/event';
import { DEFAULT_EVENTS, createSampleCelebration } from './services/eventDefaults';
import { buildMyEntireEvent } from './services/aiGenerator';
import { WelcomeScreen } from './components/WelcomeScreen';
import { WizardModal } from './components/WizardModal';
import { EventSnapshot } from './components/EventSnapshot';
import { InterconnectedAdvisoryModal } from './components/InterconnectedAdvisoryModal';
import { FullPlanModal } from './components/FullPlanModal';
import { DashboardView } from './components/DashboardView';
import { AIPlannerView } from './components/AIPlannerView';
import { GuestsView } from './components/GuestsView';
import { SeatingView } from './components/SeatingView';
import { ScheduleView } from './components/ScheduleView';
import { BudgetView } from './components/BudgetView';
import { FoodView } from './components/FoodView';
import { ShoppingView } from './components/ShoppingView';
import { GiftGenieView } from './components/GiftGenieView';
import { WhatIfView } from './components/WhatIfView';
import { StressTestView } from './components/StressTestView';
import { PlanBView } from './components/PlanBView';
import { AskPlanoraView } from './components/AskPlanoraView';
import { ExportModal } from './components/ExportModal';

import {
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  Users,
  Table as TableIcon,
  Clock,
  DollarSign,
  Utensils,
  ShoppingBag,
  Gift,
  ShieldAlert,
  Brain,
  MessageSquare,
  FileDown,
  ChevronDown,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'planora_ai_events_v1';
const ACTIVE_EVENT_KEY = 'planora_ai_active_id_v1';

export default function App() {
  const [events, setEvents] = useState<EventData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Storage read err:', e);
    }
    return DEFAULT_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    try {
      const storedId = localStorage.getItem(ACTIVE_EVENT_KEY);
      if (storedId) return storedId;
    } catch (e) {}
    return DEFAULT_EVENTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [showFullPlan, setShowFullPlan] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedEventPlan | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showAdvisoryModal, setShowAdvisoryModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Active event object
  const currentEvent = events.find((e) => e.id === activeEventId) || events[0] || DEFAULT_EVENTS[0];

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      localStorage.setItem(ACTIVE_EVENT_KEY, activeEventId);
    } catch (e) {
      console.warn('Storage write err:', e);
    }
  }, [events, activeEventId]);

  // Update Event Handler
  const handleUpdateEvent = (updated: EventData) => {
    setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
  };

  // Switch Event
  const handleSelectEvent = (id: string) => {
    setActiveEventId(id);
    setShowWelcome(false);
  };

  // Complete Event Wizard
  const handleCompleteWizard = async (newEvent: EventData, triggerBuildMyEntireEvent: boolean) => {
    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventId(newEvent.id);
    setShowWizard(false);
    setShowWelcome(false);
    setActiveTab('dashboard');

    if (triggerBuildMyEntireEvent) {
      const plan = await buildMyEntireEvent(newEvent);
      setGeneratedPlan(plan);
      setShowFullPlan(true);
    }
  };

  // Build Entire Event with AI
  const handleBuildEntireEvent = async () => {
    const plan = await buildMyEntireEvent(currentEvent);
    setGeneratedPlan(plan);
    setShowFullPlan(true);
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'AI Ideation', icon: Lightbulb },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'seating', label: 'Seating', icon: TableIcon },
    { id: 'schedule', label: 'Timeline', icon: Clock },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'food', label: 'Food & Bar', icon: Utensils },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'gifts', label: 'Gift Genie', icon: Gift },
    { id: 'whatif', label: 'What-If? 🔮', icon: Sparkles },
    { id: 'stress', label: 'Stress Test 🧠', icon: Brain },
    { id: 'planb', label: 'Plan B 🚨', icon: ShieldAlert },
    { id: 'ask', label: 'Ask Planora', icon: MessageSquare },
  ];

  if (showWelcome) {
    return (
      <WelcomeScreen
        savedEventsCount={events.length}
        onStartNewEvent={() => {
          setShowWelcome(false);
          setShowWizard(true);
        }}
        onBuildEntireEvent={() => {
          setShowWelcome(false);
          handleBuildEntireEvent();
        }}
        onOpenMyEvents={() => {
          setShowWelcome(false);
        }}
        onLoadExampleEvent={() => {
          const sample = createSampleCelebration();
          setEvents((prev) => [sample, ...prev.filter((e) => e.id !== sample.id)]);
          setActiveEventId(sample.id);
          setShowWelcome(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWelcome(true)}
              className="flex items-center gap-2 text-left group cursor-pointer"
              title="Return to Welcome Screen"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-900 text-amber-300 flex items-center justify-center font-serif font-black shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 fill-amber-300" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-stone-950 tracking-tight block leading-none">
                  Planora AI
                </span>
                <span className="text-[10px] text-stone-400 font-sans tracking-wide">
                  Plan less. Celebrate more. ✨
                </span>
              </div>
            </button>
          </div>

          {/* Center: Event Selector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={currentEvent.id}
                onChange={(e) => handleSelectEvent(e.target.value)}
                className="pl-3 pr-8 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 hover:bg-stone-100 text-stone-800 transition cursor-pointer appearance-none max-w-[200px] sm:max-w-xs truncate"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventName} ({ev.guestCount} guests)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowWizard(true)}
              className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition cursor-pointer"
              title="Create New Event"
            >
              <PlusCircle className="w-4 h-4 text-purple-700" />
            </button>
          </div>

          {/* Right Header Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleBuildEntireEvent}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
              <span>Build Entire Event ✨</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-purple-900" />
              <span>Export Brief</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="p-1.5 text-stone-600"
              title="Export Brief"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Horizontal Tab Navigation Bar (Desktop) */}
        <div className="hidden md:flex border-t border-stone-200/80 bg-stone-50/60 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 w-full">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white p-4 space-y-2 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBuildEntireEvent();
                }}
                className="p-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-bold text-center"
              >
                ✨ Build Entire Event
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowExportModal(true);
                }}
                className="p-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold text-center"
              >
                📄 Export Brief
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium flex items-center gap-2.5 text-left ${
                      isActive ? 'bg-purple-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Permanent Executive Snapshot Header */}
        <EventSnapshot
          event={currentEvent}
          onOpenStressTest={() => setActiveTab('stress')}
          onOpenReadinessModal={() => setActiveTab('dashboard')}
          onOpenGuestCountEditor={() => setShowAdvisoryModal(true)}
        />

        {/* Tab View Routing */}
        {activeTab === 'dashboard' && (
          <DashboardView
            event={currentEvent}
            onUpdateEvent={handleUpdateEvent}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenStressTest={() => setActiveTab('stress')}
            onOpenWhatIf={() => setActiveTab('whatif')}
            onOpenPlanB={() => setActiveTab('planb')}
            onOpenGuestRecalculator={() => setShowAdvisoryModal(true)}
          />
        )}

        {activeTab === 'planner' && (
          <AIPlannerView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'guests' && (
          <GuestsView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'seating' && (
          <SeatingView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'budget' && (
          <BudgetView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'food' && (
          <FoodView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'shopping' && (
          <ShoppingView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'gifts' && (
          <GiftGenieView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'whatif' && (
          <WhatIfView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'stress' && (
          <StressTestView event={currentEvent} onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'planb' && (
          <PlanBView event={currentEvent} onUpdateEvent={handleUpdateEvent} />
        )}

        {activeTab === 'ask' && (
          <AskPlanoraView event={currentEvent} />
        )}
      </main>

      {/* 3. Global Modals & Dialogs */}
      {/* Wizard Modal */}
      <WizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleCompleteWizard}
      />

      {/* Interconnected Advisory Modal */}
      <InterconnectedAdvisoryModal
        isOpen={showAdvisoryModal}
        event={currentEvent}
        onClose={() => setShowAdvisoryModal(false)}
        onApplyChanges={(updatedEvent) => {
          handleUpdateEvent(updatedEvent);
          setShowAdvisoryModal(false);
        }}
      />

      {/* Full AI Plan Modal */}
      <FullPlanModal
        isOpen={showFullPlan}
        plan={generatedPlan}
        event={currentEvent}
        onClose={() => setShowFullPlan(false)}
        onApplyPlanToEvent={(plan) => {
          handleUpdateEvent({
            ...currentEvent,
            aiPlan: plan,
            lastUpdated: new Date().toISOString(),
          });
        }}
      />

      {/* Export Brief Modal */}
      <ExportModal
        isOpen={showExportModal}
        event={currentEvent}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
