import React, { useState } from 'react';
import { EventData, TaskItem } from '../types/event';
import { calculateEventReadinessScore, generateProactiveWarnings } from '../services/interconnectedEngine';
import { Sparkles, Calendar, CheckSquare, Users, Table as TableIcon, DollarSign, Clock, AlertTriangle, ArrowRight, Plus, Check, ShieldCheck, HeartHandshake, Compass, HelpCircle } from 'lucide-react';

interface DashboardViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  onNavigateTab: (tab: string) => void;
  onOpenStressTest: () => void;
  onOpenWhatIf: () => void;
  onOpenPlanB: () => void;
  onOpenGuestRecalculator: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  event,
  onUpdateEvent,
  onNavigateTab,
  onOpenStressTest,
  onOpenWhatIf,
  onOpenPlanB,
  onOpenGuestRecalculator,
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'urgent' | 'soon' | 'done'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Countdown & Phase Guidance
  const eventDate = new Date(`${event.date}T${event.startTime || '12:00'}`);
  const today = new Date();
  const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let phaseGuidance = 'Focus on venue, guest list and major vendor contracts.';
  let phaseBadge = 'Initial Setup Phase (30+ Days)';
  if (diffDays <= 7 && diffDays >= 0) {
    phaseGuidance = 'Confirm vendors, final shopping runs, final guest counts, and review Plan B emergency protocols.';
    phaseBadge = 'Final Countdown Week (Under 7 Days)';
  } else if (diffDays <= 30 && diffDays > 7) {
    phaseGuidance = 'Finalise RSVPs, meal dietary choices, table seating assignments, and run-of-show timing.';
    phaseBadge = 'Coordination Phase (7–30 Days)';
  } else if (diffDays < 0) {
    phaseGuidance = 'Event concluded. Review post-event photo sharing and thank you acknowledgements.';
    phaseBadge = 'Post-Event Phase';
  }

  const { score, breakdown } = calculateEventReadinessScore(event);
  const warnings = generateProactiveWarnings(event);

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = event.tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: (t.status === 'Done' ? 'Not Started' : 'Done') as TaskItem['status'] }
        : t
    );
    onUpdateEvent({ ...event, tasks: updatedTasks, lastUpdated: new Date().toISOString() });
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      task: newTaskTitle.trim(),
      category: 'General',
      deadline: event.date,
      priority: 'Medium',
      status: 'Not Started',
    };
    onUpdateEvent({
      ...event,
      tasks: [newTask, ...event.tasks],
      lastUpdated: new Date().toISOString(),
    });
    setNewTaskTitle('');
  };

  const filteredTasks = event.tasks.filter((t) => {
    if (taskFilter === 'urgent') return t.priority === 'High' && t.status !== 'Done';
    if (taskFilter === 'soon') return t.priority === 'Medium' && t.status !== 'Done';
    if (taskFilter === 'done') return t.status === 'Done';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Proactive Phase Guidance Card */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-amber-50 rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-900 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                {phaseBadge}
              </span>
              <span className="text-xs text-stone-500">{diffDays >= 0 ? `${diffDays} days remaining` : 'Concluded'}</span>
            </div>
            <p className="text-sm font-semibold text-stone-800 mt-1">
              Planora Priority: {phaseGuidance}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={onOpenGuestRecalculator}
            className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-stone-700 shadow-xs transition flex items-center justify-center gap-1.5"
            title="Simulate or change guest count"
          >
            <Users className="w-3.5 h-3.5 text-purple-700" />
            <span>Recalculate ({event.guestCount} Guests)</span>
          </button>
          <button
            onClick={onOpenStressTest}
            className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold bg-purple-900 hover:bg-purple-950 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Stress Test</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Feature Shortcuts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenWhatIf}
          className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-purple-300 hover:shadow-md transition text-left group"
        >
          <div className="flex items-center justify-between text-purple-900 font-semibold text-xs mb-1">
            <span className="flex items-center gap-1.5">🔮 What-If Simulator</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-stone-500">
            Simulate rain, guest surges, or budget cuts safely.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('seating')}
          className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-purple-300 hover:shadow-md transition text-left group"
        >
          <div className="flex items-center justify-between text-purple-900 font-semibold text-xs mb-1">
            <span className="flex items-center gap-1.5"><TableIcon className="w-3.5 h-3.5" /> AI Seating Planner</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-stone-500">
            Auto-arrange tables respecting VIPs & conflicts.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('budget')}
          className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-purple-300 hover:shadow-md transition text-left group"
        >
          <div className="flex items-center justify-between text-purple-900 font-semibold text-xs mb-1">
            <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Smart Rebalancing</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-stone-500">
            Absorb cost spikes by trimming flexible categories.
          </p>
        </button>

        <button
          onClick={onOpenPlanB}
          className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-rose-300 hover:shadow-md transition text-left group"
        >
          <div className="flex items-center justify-between text-rose-900 font-semibold text-xs mb-1">
            <span className="flex items-center gap-1.5">🚨 Plan B Protocols</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-stone-500">
            Emergency responses for power, weather & caterers.
          </p>
        </button>
      </div>

      {/* 3. Main Dashboard Grid: Checklist + Run-of-Show + Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Interactive Checklist & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Checklist Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-700" />
                  Prioritised Coordinator Checklist
                </h3>
                <p className="text-xs text-stone-500">
                  {event.tasks.filter((t) => t.status === 'Done').length} of {event.tasks.length} actions completed
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                {(['all', 'urgent', 'soon', 'done'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTaskFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize transition ${
                      taskFilter === tab
                        ? 'bg-white text-purple-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add Task Input */}
            <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Add custom task (e.g. Confirm acoustic jazz playlist with DJ)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-stone-400">
                  No tasks matching the selected filter.
                </div>
              ) : (
                filteredTasks.map((task: TaskItem) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      task.status === 'Done'
                        ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                        : 'bg-white border-stone-200 hover:border-purple-300 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          task.status === 'Done'
                            ? 'bg-purple-900 border-purple-900 text-white'
                            : 'border-stone-300 hover:border-purple-600'
                        }`}
                      >
                        {task.status === 'Done' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium">{task.task}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : task.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Run-of-Show Timeline Preview */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-700" />
                  Run-of-Show Milestones
                </h3>
                <p className="text-xs text-stone-500">
                  {event.schedule.length} sequential activities planned
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>Edit Full Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {event.schedule.slice(0, 5).map((item, idx) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-purple-900 border-2 border-white shadow-xs" />
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-purple-950 mr-2">{item.time}</span>
                      <span className="font-semibold text-stone-800">{item.activity}</span>
                      {item.responsiblePerson && (
                        <span className="text-stone-400 ml-1.5">({item.responsiblePerson})</span>
                      )}
                    </div>
                    <span className="text-stone-400 font-mono text-[11px]">{item.durationMinutes}m</span>
                  </div>
                  {item.notes && <p className="text-[11px] text-stone-500 mt-0.5 pl-14">{item.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Readiness Breakdown & Quick Status */}
        <div className="space-y-6">
          {/* Readiness Score Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="text-base font-serif font-bold text-stone-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Event Readiness Status
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Diagnostic assessment of event components.
            </p>

            <div className="space-y-3">
              {breakdown.map((item, i) => (
                <div key={i} className="text-xs flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.complete
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span className="font-medium text-stone-700">{item.area}</span>
                  </div>
                  <span className="text-stone-500 font-mono">{item.complete ? 'Ready' : 'Pending'}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-purple-50 text-xs text-purple-950 border border-purple-100">
              <strong>Coordinator Recommendation:</strong> All sections are linked. Remember that changing guest counts directly shifts your required tables and portions!
            </div>
          </div>

          {/* Quick Dietary & Accessibility Counter */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="text-base font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700" />
              Guest Care Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Confirmed RSVPs</span>
                <span className="text-base font-bold text-emerald-700">
                  {event.guestList.filter((g) => g.rsvp === 'Confirmed').length}
                </span>
                <span className="text-[10px] text-stone-400 block">of {event.guestCount} target</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Special Dietary</span>
                <span className="text-base font-bold text-amber-700">
                  {event.guestList.filter((g) => g.dietary && g.dietary.length > 0).length}
                </span>
                <span className="text-[10px] text-stone-400 block">guests with requirements</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Table Seats</span>
                <span className="text-base font-bold text-purple-900">
                  {event.tables.reduce((a, t) => a + t.capacity, 0)}
                </span>
                <span className="text-[10px] text-stone-400 block">across {event.tables.length} tables</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">VIP Guests</span>
                <span className="text-base font-bold text-indigo-700">
                  {event.guestList.filter((g) => g.isVip || g.category === 'VIP').length}
                </span>
                <span className="text-[10px] text-stone-400 block">priority seated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
