import React from 'react';
import { EventData, GeneratedEventPlan } from '../types/event';
import { Sparkles, Calendar, MapPin, Users, DollarSign, Palette, Utensils, Cake, Music, Camera, Star, AlertTriangle, CheckSquare, Printer, Check, X } from 'lucide-react';

interface FullPlanModalProps {
  isOpen: boolean;
  plan: GeneratedEventPlan | null;
  event: EventData;
  onClose: () => void;
  onApplyPlanToEvent?: (plan: GeneratedEventPlan) => void;
}

export const FullPlanModal: React.FC<FullPlanModalProps> = ({
  isOpen,
  plan,
  event,
  onClose,
  onApplyPlanToEvent,
}) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-purple-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-purple-950 text-white p-5 flex items-center justify-between border-b border-purple-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold text-xl shadow-md">
              <Sparkles className="w-5 h-5 text-purple-950 fill-purple-950" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">
                Planora Flagship Coordinator Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Complete AI Event Masterplan
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Organized Sections */}
        <div className="p-6 overflow-y-auto space-y-8 print:p-0">
          {/* 1. EVENT OVERVIEW */}
          <section className="bg-stone-50 rounded-xl p-5 border border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              1. Event Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block font-medium">Event Name</span>
                <span className="text-sm font-bold text-stone-900">{plan.overview.eventName}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-medium">Type & Theme</span>
                <span className="text-sm font-semibold text-stone-800">{plan.overview.type} • {plan.overview.theme}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-medium">Date & Location</span>
                <span className="text-sm text-stone-800">{plan.overview.date} • {plan.overview.location}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-medium">Guests & Budget</span>
                <span className="text-sm font-bold text-purple-900">
                  {plan.overview.guestCount} guests • {event.currency} {plan.overview.budget.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-stone-200 text-xs text-stone-600">
              <strong>Main Objective:</strong> {plan.overview.mainObjective}
            </div>
          </section>

          {/* 2. AI EVENT CONCEPT */}
          <section>
            <h3 className="text-base font-serif font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              2. AI Event Concept & Atmosphere
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-xs">
              <div>
                <strong className="text-purple-950 block mb-1">Atmosphere & Mood</strong>
                <p className="text-stone-700 leading-relaxed">{plan.concept.atmosphere}</p>
              </div>
              <div>
                <strong className="text-purple-950 block mb-1">Theme Interpretation</strong>
                <p className="text-stone-700 leading-relaxed">{plan.concept.themeInterpretation}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-purple-100">
                <strong className="text-purple-950 block mb-1.5">Memorable Feature Ideas:</strong>
                <ul className="list-disc pl-4 space-y-1 text-stone-700">
                  {plan.concept.memorableFeatureIdeas.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 3. COLOUR PALETTE */}
          <section>
            <h3 className="text-base font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              3. Cohesive Colour Palette
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {plan.colourPalette.map((col, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="w-full h-8 rounded-lg shadow-inner mb-2 border border-stone-200" style={{ backgroundColor: col.hex }} />
                  <div className="font-semibold text-xs text-stone-900">{col.name}</div>
                  <div className="text-[11px] font-mono text-stone-400">{col.hex}</div>
                  <div className="text-[11px] text-stone-600 mt-1">{col.usage}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. DÉCOR PLAN */}
          <section>
            <h3 className="text-base font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              4. Décor Plan (Budget-Respecting)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Tables & Linens:</strong>
                <p className="text-stone-600 mt-0.5">{plan.decorPlan.tables}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Centrepieces:</strong>
                <p className="text-stone-600 mt-0.5">{plan.decorPlan.centrepieces}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Entrance & Signage:</strong>
                <p className="text-stone-600 mt-0.5">{plan.decorPlan.entrance} • {plan.decorPlan.signage}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Backdrop & Photo Area:</strong>
                <p className="text-stone-600 mt-0.5">{plan.decorPlan.backdrop} • {plan.decorPlan.photoArea}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Lighting & Candles:</strong>
                <p className="text-stone-600 mt-0.5">{plan.decorPlan.lighting} • {plan.decorPlan.candles}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-800 block">Florals & Table Styling:</strong>
                <p className="text-stone-600 mt-0.5">{plan.decorPlan.flowers} • {plan.decorPlan.tableStyling}</p>
              </div>
            </div>
          </section>

          {/* 5. FOOD PLAN & CAKE */}
          <section>
            <h3 className="text-base font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-indigo-600" />
              5. Food, Drinks & Celebratory Cake
            </h3>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
              <div>
                <strong className="text-stone-800 block mb-1">Catering Recommendations ({plan.foodPlan.mealStyle}):</strong>
                <ul className="list-disc pl-4 space-y-1 text-stone-600">
                  {plan.foodPlan.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <strong className="text-stone-800 block mb-1">Beverage Pairings:</strong>
                <div className="text-stone-600">{plan.foodPlan.drinksPairing.join(' • ')}</div>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <strong className="text-stone-800 block mb-1">Cake & Dessert:</strong>
                <p className="text-stone-600">{plan.cakeDessert.cakeConcept}</p>
                <div className="text-stone-500 mt-0.5">Desserts: {plan.cakeDessert.dessertOptions.join(', ')}</div>
              </div>
            </div>
          </section>

          {/* 6. ENTERTAINMENT & PHOTOGRAPHY */}
          <section>
            <h3 className="text-base font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              6. Entertainment & Photography Strategy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">Entertainment & Music:</strong>
                <p className="text-stone-600 mb-2">{plan.entertainment.musicDirection}</p>
                <ul className="list-disc pl-4 space-y-1 text-stone-600">
                  {plan.entertainment.mainActivities.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">Must-Capture Photography Moments:</strong>
                <ul className="list-disc pl-4 space-y-1 text-stone-600">
                  {plan.photography.importantPhotos.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <div className="mt-2 text-stone-500 font-medium">
                  Group shot timing: {plan.photography.groupPhotoTiming}
                </div>
              </div>
            </div>
          </section>

          {/* 7. WOW FACTOR */}
          <section className="bg-gradient-to-r from-amber-50 to-purple-50 p-5 rounded-xl border border-amber-200">
            <h3 className="text-base font-serif font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              7. Wow Factor Touches (3–5 Unique Highlights)
            </h3>
            <div className="space-y-2 text-xs">
              {plan.wowFactor.map((w, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-100">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <p className="text-stone-800 leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 8. RISKS & NEXT ACTIONS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
              <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Anticipated Risks & Safeguards
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-rose-800">
                {plan.risks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-purple-700" />
                Next Actions Checklist
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Urgent</span>
                  <ul className="list-disc pl-4 text-stone-700 mt-1">
                    {plan.nextActions.urgent.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Soon</span>
                  <ul className="list-disc pl-4 text-stone-700 mt-1">
                    {plan.nextActions.soon.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {onApplyPlanToEvent && (
              <button
                onClick={() => {
                  onApplyPlanToEvent(plan);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-900 hover:bg-purple-950 text-white shadow-md flex items-center gap-2 transition"
              >
                <Check className="w-4 h-4 text-purple-200" />
                <span>Save to My Event</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
