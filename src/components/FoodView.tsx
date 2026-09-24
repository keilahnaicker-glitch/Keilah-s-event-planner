import React, { useState } from 'react';
import { EventData } from '../types/event';
import { Utensils, GlassWater, Wine, Apple, Cake, ShieldCheck, AlertTriangle, Sparkles, Scale, RefreshCw } from 'lucide-react';

interface FoodViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

export const FoodView: React.FC<FoodViewProps> = ({ event, onUpdateEvent }) => {
  const [childrenCount, setChildrenCount] = useState<number>(
    event.guestList.filter((g) => g.ageGroup === 'Child').length || 0
  );
  const [durationHours, setDurationHours] = useState<number>(4);

  const adultsCount = Math.max(1, event.guestCount - childrenCount);
  const totalGuests = event.guestCount;

  // Scientific Catering Multipliers
  // Adults eat ~350g protein/sides, children ~180g
  const totalPortionWeight = adultsCount * 1.0 + childrenCount * 0.55;

  // Food calculations
  const meatKg = (totalPortionWeight * 0.22).toFixed(1);
  const chickenKg = (totalPortionWeight * 0.18).toFixed(1);
  const starchKg = (totalPortionWeight * 0.2).toFixed(1); // rice/potatoes
  const saladKg = (totalPortionWeight * 0.12).toFixed(1);
  const breadRolls = Math.round(totalGuests * 1.5);
  const fingerFoods = Math.round(totalGuests * (durationHours > 3 ? 5 : 3));
  const dessertPortions = Math.round(totalGuests * 1.2);

  // Beverage calculations
  // Rule of thumb: 1 drink per hour per guest
  const totalDrinks = Math.round(totalGuests * durationHours * 0.9);
  const waterLitres = Math.round(totalGuests * 0.6);
  const softDrinksLitres = Math.round(totalGuests * 0.5);
  const juiceLitres = Math.round(totalGuests * 0.35);
  const wineBottles = Math.round((adultsCount * (durationHours * 0.4)) / 5); // 5 glasses per 750ml bottle
  const champagneBottles = Math.round(adultsCount / 6); // 1 glass toast per person
  const iceKg = Math.round(totalGuests * 0.75); // 0.75kg ice per guest

  // Dietary counts from guest registry
  const vegCount = event.guestList.filter((g) => g.dietary?.some((d) => d.toLowerCase().includes('veg'))).length;
  const veganCount = event.guestList.filter((g) => g.dietary?.some((d) => d.toLowerCase().includes('vegan'))).length;
  const halalCount = event.guestList.filter((g) => g.dietary?.some((d) => d.toLowerCase().includes('halal'))).length;
  const kosherCount = event.guestList.filter((g) => g.dietary?.some((d) => d.toLowerCase().includes('kosher'))).length;
  const glutenFreeCount = event.guestList.filter((g) => g.dietary?.some((d) => d.toLowerCase().includes('gluten'))).length;
  const allergyGuests = event.guestList.filter((g) => g.allergies && g.allergies.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-purple-800">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          Planora Food Quantity Engine
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          Catering Estimator & Dietary Safeguards
        </h2>
        <p className="text-xs text-purple-200 mt-1 max-w-2xl">
          Scientific volume multipliers calibrated for your <strong>{event.mealStyle}</strong> dining format, duration, and guest demographics.
        </p>

        {/* Inputs */}
        <div className="mt-5 pt-4 border-t border-purple-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-purple-300 block mb-1">Total Guests:</span>
            <span className="font-mono text-base font-bold text-white">{event.guestCount} guests</span>
          </div>

          <div>
            <label className="text-purple-300 block mb-1">Children Attending:</label>
            <input
              type="number"
              min="0"
              max={event.guestCount}
              value={childrenCount}
              onChange={(e) => setChildrenCount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 px-2 py-1 rounded-lg bg-purple-950 border border-purple-700 text-white font-mono text-xs text-center"
            />
          </div>

          <div>
            <label className="text-purple-300 block mb-1">Event Duration:</label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(parseInt(e.target.value) || 4)}
              className="px-2 py-1 rounded-lg bg-purple-950 border border-purple-700 text-white text-xs"
            >
              <option value="2">2 Hours (Quick Reception)</option>
              <option value="3">3 Hours (Standard Dinner)</option>
              <option value="4">4 Hours (Gala & Speeches)</option>
              <option value="5">5 Hours (Full Evening)</option>
              <option value="6">6+ Hours (Long Celebration)</option>
            </select>
          </div>

          <div>
            <span className="text-purple-300 block mb-1">Meal Style:</span>
            <span className="font-semibold text-amber-300">{event.mealStyle}</span>
          </div>
        </div>
      </div>

      {/* Food Portions Grid */}
      <div>
        <h3 className="text-base font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-purple-700" />
          Recommended Food Quantities
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Beef / Red Meat / Fish</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">{meatKg} kg</div>
            <span className="text-[10px] text-stone-500">raw weight equivalent</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Poultry / Chicken</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">{chickenKg} kg</div>
            <span className="text-[10px] text-stone-500">pre-trimmed cuts</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Starch / Rice / Potatoes</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">{starchKg} kg</div>
            <span className="text-[10px] text-stone-500">cooked yield</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Salads & Greens</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">{saladKg} kg</div>
            <span className="text-[10px] text-stone-500">dressed salads</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Bread Rolls & Buns</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">{breadRolls} units</div>
            <span className="text-[10px] text-stone-500">1.5 per guest ratio</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Finger Foods / Canapés</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">{fingerFoods} pieces</div>
            <span className="text-[10px] text-stone-500">cocktail hour bites</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Dessert Portions</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">{dessertPortions} servings</div>
            <span className="text-[10px] text-stone-500">shooters or mini tarts</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Celebration Cake</span>
            <div className="text-sm font-bold text-stone-900 mt-1">
              {event.cakeRequirements || `${Math.ceil(totalGuests / 25)}-tier cake`}
            </div>
            <span className="text-[10px] text-stone-500">{totalGuests} slices</span>
          </div>
        </div>
      </div>

      {/* Beverage Calculations */}
      <div>
        <h3 className="text-base font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Wine className="w-4 h-4 text-purple-700" />
          Beverage & Bar Estimates
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Sparkling Water</span>
            <div className="text-lg font-bold font-mono text-stone-900 mt-1">{waterLitres} L</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Soft Drinks</span>
            <div className="text-lg font-bold font-mono text-stone-900 mt-1">{softDrinksLitres} L</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Artisan Juices</span>
            <div className="text-lg font-bold font-mono text-stone-900 mt-1">{juiceLitres} L</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Wine Bottles</span>
            <div className="text-lg font-bold font-mono text-purple-900 mt-1">{wineBottles} btls</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Champagne Toast</span>
            <div className="text-lg font-bold font-mono text-amber-700 mt-1">{champagneBottles} btls</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Cooling Ice</span>
            <div className="text-lg font-bold font-mono text-blue-700 mt-1">{iceKg} kg</div>
          </div>
        </div>
      </div>

      {/* Dietary Safeguards Registry */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Active Dietary & Allergy Safeguards
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-400 block text-[10px] font-bold uppercase">Vegetarian</span>
            <span className="text-sm font-bold text-stone-800">{vegCount} guests</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-400 block text-[10px] font-bold uppercase">Vegan</span>
            <span className="text-sm font-bold text-stone-800">{veganCount} guests</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-400 block text-[10px] font-bold uppercase">Halal</span>
            <span className="text-sm font-bold text-stone-800">{halalCount} guests</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-400 block text-[10px] font-bold uppercase">Kosher</span>
            <span className="text-sm font-bold text-stone-800">{kosherCount} guests</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-400 block text-[10px] font-bold uppercase">Gluten-Free</span>
            <span className="text-sm font-bold text-stone-800">{glutenFreeCount} guests</span>
          </div>
        </div>

        {allergyGuests.length > 0 && (
          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
            <strong className="block mb-1 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Kitchen Allergy Alert Flag:
            </strong>
            <div className="space-y-1">
              {allergyGuests.map((g) => (
                <div key={g.id}>
                  • <strong>{g.name} {g.surname}:</strong> {g.allergies?.join(', ')}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
