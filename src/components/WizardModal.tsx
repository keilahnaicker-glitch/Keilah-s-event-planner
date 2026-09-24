import React, { useState } from 'react';
import { EventData, EventType, IndoorOutdoor, CurrencyCode } from '../types/event';
import { createEmptyEvent } from '../services/eventDefaults';
import { Sparkles, Calendar, Clock, MapPin, Building, Users, DollarSign, Wand2, ArrowRight, ArrowLeft, Check, Heart, ShieldAlert } from 'lucide-react';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (event: EventData, triggerBuildMyEntireEvent: boolean) => void;
  initialEvent?: EventData;
}

const EVENT_TYPES: EventType[] = [
  'Birthdays',
  'Graduations',
  'Weddings',
  'Engagements',
  'Anniversaries',
  'Baby showers',
  'Bridal showers',
  'Church events',
  'Youth events',
  'Corporate events',
  'Conferences',
  'Dinners',
  'Family gatherings',
  'Memorials',
  'Reunions',
  'Farewell parties',
  'Fundraisers',
  'Award ceremonies',
  'Christmas parties',
  'Cultural celebrations',
  'Other / Custom Event',
];

const VIBES = [
  'Elegant',
  'Luxury',
  'Romantic',
  'Minimalist',
  'Modern',
  'Fun',
  'Colourful',
  'Rustic',
  'Glamorous',
  'Traditional',
  'Corporate',
  'Relaxed',
  'Family-friendly',
  'Youthful',
  'Custom',
];

const MEAL_STYLES = [
  'Buffet',
  'Plated meal',
  'Finger foods',
  'Cocktail',
  'Braai',
  'Picnic',
  'Tea',
  'Dessert event',
  'Custom',
];

const CURRENCIES: CurrencyCode[] = ['ZAR', 'USD', 'GBP', 'EUR', 'AUD', 'CAD', 'INR', 'Other'];

export const WizardModal: React.FC<WizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialEvent,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<EventData>(initialEvent ? structuredClone(initialEvent) : createEmptyEvent());
  const [customType, setCustomType] = useState<string>('');
  const [freeTextDescription, setFreeTextDescription] = useState<string>('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = (autoBuild: boolean) => {
    const finalEvent = structuredClone(formData);
    if (finalEvent.eventType === 'Other / Custom Event' && customType.trim()) {
      finalEvent.customEventType = customType.trim();
      finalEvent.eventName = finalEvent.eventName || `${customType.trim()} Celebration`;
    }
    if (freeTextDescription.trim()) {
      finalEvent.notes = freeTextDescription.trim() + (finalEvent.notes ? `\n${finalEvent.notes}` : '');
    }
    onComplete(finalEvent, autoBuild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-purple-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Wizard Header with Progress */}
        <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-purple-950 text-white p-5 border-b border-purple-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-purple-950 flex items-center justify-center font-bold text-xs">
                {step}
              </span>
              <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                Step {step} of 5 — {step === 1 ? 'Event Core' : step === 2 ? 'Aesthetic & Style' : step === 3 ? 'Food & Drink' : step === 4 ? 'Special Requirements' : 'Event Snapshot'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-stone-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-purple-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: EVENT CORE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Step 1 — The Event Essentials</h3>
                <p className="text-xs text-stone-500">Provide the foundational timing, location, and guest expectations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keisha’s Honors Graduation Gala"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Event Type *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {formData.eventType === 'Other / Custom Event' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-purple-800 mb-1">Custom Event Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Literary Salon & Book Launch"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-purple-500 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Location / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Cape Town, Western Cape"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Venue Name (if known)</label>
                  <input
                    type="text"
                    placeholder="e.g. The Grand Conservatory"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Setting</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Indoor', 'Outdoor', 'Hybrid'] as IndoorOutdoor[]).map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setFormData({ ...formData, indoorOutdoor: env })}
                        className={`py-2 text-xs font-semibold rounded-xl border transition ${
                          formData.indoorOutdoor === env
                            ? 'bg-purple-900 text-white border-purple-900'
                            : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Expected Guest Count *</label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Total Event Budget *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-stone-400 font-semibold text-sm">
                      {formData.currency}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full pl-14 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STYLE & AESTHETICS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Step 2 — Style & Desired Atmosphere</h3>
                <p className="text-xs text-stone-500">Define the theme, emotion, and visual direction of your celebration.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Theme Title</label>
                <input
                  type="text"
                  placeholder="e.g. Black Tie Academic Excellence / Bohemian Sunset Garden"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1.5">Desired Vibe</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {VIBES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFormData({ ...formData, vibe: v })}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                        formData.vibe === v
                          ? 'bg-purple-900 text-white border-purple-900 font-semibold'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Formality</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Relaxed', 'Casual', 'Semi-Formal', 'Black Tie'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormData({ ...formData, formality: f })}
                      className={`p-2 rounded-xl text-xs font-semibold border transition ${
                        formData.formality === f
                          ? 'bg-purple-900 text-white border-purple-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                  Free-Text Description & Specific Desires
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Elegant black, gold and cream graduation dinner with candles and jazz acoustics."
                  value={freeTextDescription}
                  onChange={(e) => setFreeTextDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: FOOD & DRINKS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Step 3 — Food, Catering & Drinks</h3>
                <p className="text-xs text-stone-500">Specify meal style and dietary safeguards.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1.5">Meal Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {MEAL_STYLES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, mealStyle: m })}
                      className={`p-2 rounded-xl text-xs font-semibold border transition ${
                        formData.mealStyle === m
                          ? 'bg-purple-900 text-white border-purple-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Celebratory Cake Details</label>
                <input
                  type="text"
                  placeholder="e.g. Two-tier vanilla & salted caramel celebratory cake"
                  value={formData.cakeRequirements}
                  onChange={(e) => setFormData({ ...formData, cakeRequirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Drinks & Bar Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Champagne toast, boutique wine, mocktail spritz, craft beer"
                  value={formData.drinksRequirements}
                  onChange={(e) => setFormData({ ...formData, drinksRequirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-2">Dietary & Cultural Requirements</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Nut Allergies', 'Shellfish Allergy', 'Diabetic-Friendly'].map((diet) => {
                    const isSelected = formData.dietaryRequirements.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? formData.dietaryRequirements.filter((d) => d !== diet)
                            : [...formData.dietaryRequirements, diet];
                          setFormData({ ...formData, dietaryRequirements: updated });
                        }}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-50 text-purple-900 border-purple-400 font-semibold'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        <span>{diet}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SPECIAL REQUIREMENTS */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Step 4 — Special Requirements & Logistics</h3>
                <p className="text-xs text-stone-500">Ensure all accessibility and entertainment elements are coordinated.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'speeches', label: 'Speeches & Tributes Planned' },
                  { key: 'entertainment', label: 'Live DJ or Music Entertainment' },
                  { key: 'photography', label: 'Professional Photography' },
                  { key: 'videography', label: 'Videography Coverage' },
                  { key: 'elderlyGuests', label: 'Elderly Guests Attending' },
                  { key: 'childrenAttending', label: 'Children Attending' },
                  { key: 'vipGuests', label: 'VIP Guests / Honorees' },
                  { key: 'specialSurprises', label: 'Special Surprises / Reveal Moment' },
                ].map(({ key, label }) => {
                  const val = (formData.specialRequirements as any)[key];
                  return (
                    <label
                      key={key}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        val ? 'bg-purple-50 border-purple-400 text-purple-950 font-medium' : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      <span className="text-xs">{label}</span>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialRequirements: {
                              ...formData.specialRequirements,
                              [key]: e.target.checked,
                            },
                          })
                        }
                        className="rounded-md text-purple-600 focus:ring-purple-500"
                      />
                    </label>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                  Accessibility & Mobility Requirements
                </label>
                <input
                  type="text"
                  placeholder="e.g. Step-free wheelchair access, reserved front-row seating"
                  value={formData.accessibilityRequirements.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accessibilityRequirements: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                  Religious or Cultural Traditions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opening prayer, ceremonial blessing, traditional dance tribute"
                  value={formData.specialRequirements.religiousOrCultural}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialRequirements: {
                        ...formData.specialRequirements,
                        religiousOrCultural: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-purple-600 focus:outline-hidden text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 5: EVENT SNAPSHOT & CONFIRMATION */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Step 5 — Event Snapshot</h3>
                <p className="text-xs text-stone-500">Review your parameters before generating your complete event plan.</p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 divide-y divide-stone-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-semibold block">Event Name</span>
                    <span className="text-sm font-bold text-stone-800">{formData.eventName || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-semibold block">Type & Setting</span>
                    <span className="text-sm font-medium text-stone-800">{formData.eventType} ({formData.indoorOutdoor})</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-semibold block">Date & Time</span>
                    <span className="text-sm font-medium text-stone-800">{formData.date} • {formData.startTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-semibold block">Guests & Budget</span>
                    <span className="text-sm font-bold text-purple-900">{formData.guestCount} guests • {formData.currency} {formData.budget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-semibold block">Theme & Vibe</span>
                    <span className="text-xs text-stone-700">{formData.theme || 'Refined'} ({formData.vibe})</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-semibold block">Meal & Bar</span>
                    <span className="text-xs text-stone-700">{formData.mealStyle} • {formData.drinksRequirements || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-semibold block">Dietary & Access</span>
                    <span className="text-xs text-stone-700">
                      {formData.dietaryRequirements.length > 0 ? formData.dietaryRequirements.join(', ') : 'No restrictions'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Ready to coordinate:</strong> Planora will configure an interconnected event system—generating your décor plan, preliminary budget allocations, run-of-show schedule, shopping requirements, and seating layout.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200 rounded-xl transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.eventName.trim() && step === 1}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-900 hover:bg-purple-950 text-white flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={() => handleFinish(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-stone-800 hover:bg-stone-900 text-white transition"
                >
                  Open Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => handleFinish(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md flex items-center gap-1.5 transition group"
                >
                  <Wand2 className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>Build My Event ✨</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
