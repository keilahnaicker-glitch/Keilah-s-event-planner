import React, { useState } from 'react';
import { EventData } from '../types/event';
import { Printer, Copy, Download, Check, X, Sparkles, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  event: EventData;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, event, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalPlanned = event.budgetItems.reduce((acc, b) => acc + b.plannedCost, 0);
  const totalActual = event.budgetItems.reduce((acc, b) => acc + (b.actualCost > 0 ? b.actualCost : b.plannedCost), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `PLANORA AI — EVENT MASTER BRIEF
========================================
Event Name: ${event.eventName}
Type: ${event.eventType}
Date: ${event.date} (${event.startTime} - ${event.endTime})
Location: ${event.venue ? `${event.venue}, ${event.location}` : event.location}
Setting: ${event.indoorOutdoor}
Guest Count: ${event.guestCount}
Budget: ${event.currency} ${event.budget.toLocaleString()} (Planned: ${event.currency} ${totalPlanned.toLocaleString()})
Theme & Vibe: ${event.theme || 'Classic'} (${event.vibe})
Meal Style: ${event.mealStyle}

SCHEDULE / RUN-OF-SHOW
----------------------------------------
${event.schedule.map((s) => `${s.time} (${s.durationMinutes}m) - ${s.activity} [Lead: ${s.responsiblePerson || 'Team'}]`).join('\n')}

SEATING OVERVIEW
----------------------------------------
Total Tables: ${event.tables.length}
Total Capacity: ${event.tables.reduce((a, t) => a + t.capacity, 0)} seats
${event.tables.map((t) => {
  const seatedIds = event.seatingPlan.find((p) => p.tableId === t.id)?.guestIds || [];
  const names = seatedIds.map((id) => event.guestList.find((g) => g.id === id)?.name).filter(Boolean).join(', ');
  return `${t.name} (${seatedIds.length}/${t.capacity}): ${names || 'Open'}`;
}).join('\n')}

KEY SHOPPING SUPPLIES
----------------------------------------
${event.shoppingList.slice(0, 15).map((i) => `[${i.purchased ? 'X' : ' '}] ${i.item} (${i.quantity}) - ${event.currency} ${i.estimatedCost}`).join('\n')}

PLAN B CONTINGENCY DIRECTIVES
----------------------------------------
${event.contingencyPlans.map((p) => `Trigger: ${p.trigger}\nPlan B: ${p.planB}\nImmediate: ${p.immediateActions.join('; ')}`).join('\n\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.eventName.replace(/\s+/g, '_')}_planora_brief.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-purple-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-purple-950 text-white p-5 flex items-center justify-between border-b border-purple-900">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Export Executive Event Brief
              </h3>
              <p className="text-xs text-purple-200">
                Ready for vendors, venue managers, client review, and print distribution.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-stone-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Event Summary Preview */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800 print:p-0 print:text-black">
          {/* Executive Header */}
          <div className="border-b border-stone-200 pb-4">
            <span className="text-[10px] uppercase font-bold text-purple-900 tracking-widest block mb-1">
              Planora AI Executive Event Plan
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900">{event.eventName}</h1>
            <p className="text-stone-500 mt-1">
              {event.date} • {event.startTime} - {event.endTime} • {event.venue ? `${event.venue}, ` : ''}{event.location}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div>
              <span className="text-[10px] uppercase text-stone-400 font-bold block">Target Guests</span>
              <span className="font-bold text-sm text-stone-900">{event.guestCount} guests</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 font-bold block">Budget Cap</span>
              <span className="font-mono font-bold text-sm text-stone-900">{event.currency} {event.budget.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 font-bold block">Theme & Vibe</span>
              <span className="font-medium text-stone-900">{event.theme || 'Classic'} ({event.vibe})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 font-bold block">Setting / Meal</span>
              <span className="font-medium text-stone-900">{event.indoorOutdoor} • {event.mealStyle}</span>
            </div>
          </div>

          {/* Run of show */}
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-2 border-b border-stone-200 pb-1">
              Event Timeline / Run-of-Show
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              {event.schedule.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0">
                  <span>
                    <strong className="text-purple-950 mr-2">{s.time}</strong>
                    <span className="font-sans text-stone-800">{s.activity}</span>
                  </span>
                  <span className="text-stone-400 font-sans text-[10px]">
                    {s.responsiblePerson ? `Lead: ${s.responsiblePerson} • ` : ''}{s.durationMinutes} mins
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seating Table Summary */}
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-2 border-b border-stone-200 pb-1">
              Seating Arrangement ({event.tables.length} Tables)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {event.tables.map((t) => {
                const seatedIds = event.seatingPlan.find((p) => p.tableId === t.id)?.guestIds || [];
                const names = seatedIds.map((id) => event.guestList.find((g) => g.id === id)?.name).filter(Boolean);
                return (
                  <div key={t.id} className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                    <div className="font-bold text-stone-900 flex justify-between">
                      <span>{t.name}</span>
                      <span className="font-mono text-stone-500">{seatedIds.length}/{t.capacity}</span>
                    </div>
                    <div className="text-stone-600 mt-1 truncate">
                      {names.length > 0 ? names.join(', ') : 'No guests placed yet'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Plan B protocols */}
          {event.contingencyPlans.length > 0 && (
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900 mb-2 border-b border-stone-200 pb-1">
                Contingency & Plan B Directives
              </h4>
              <div className="space-y-2 text-[11px]">
                {event.contingencyPlans.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50">
                    <strong className="text-rose-900 block font-semibold">{c.trigger}</strong>
                    <p className="text-stone-700 mt-0.5">{c.planB}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold bg-purple-900 hover:bg-purple-950 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-purple-200" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
