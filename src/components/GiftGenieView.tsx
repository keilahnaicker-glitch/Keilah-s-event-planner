import React, { useState } from 'react';
import { EventData, GiftRecipientProfile, GiftRecommendation } from '../types/event';
import { generateGiftIdeas, GiftGenieFilter } from '../services/giftGenieService';
import { Gift, Sparkles, DollarSign, Heart, Wand2, Compass, RefreshCw } from 'lucide-react';

interface GiftGenieViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

export const GiftGenieView: React.FC<GiftGenieViewProps> = ({ event, onUpdateEvent }) => {
  const [profile, setProfile] = useState<GiftRecipientProfile>({
    recipient: event.giftRecipient?.recipient || 'Keisha',
    age: event.giftRecipient?.age || '23',
    relationship: event.giftRecipient?.relationship || 'Honoree / Daughter',
    event: event.eventType || 'Graduations',
    interests: event.giftRecipient?.interests || 'literature, interior design, travel, photography',
    personality: event.giftRecipient?.personality || 'ambitious, creative, thoughtful, organized',
    giftBudget: event.giftRecipient?.giftBudget || 800,
    currency: event.currency || 'ZAR',
    location: event.location || 'South Africa',
  });

  const [filter, setFilter] = useState<GiftGenieFilter>('all');
  const [ideas, setIdeas] = useState<GiftRecommendation[]>(() => generateGiftIdeas(profile, 'all'));

  const handleGenerate = (selectedFilter: GiftGenieFilter = 'all') => {
    setFilter(selectedFilter);
    const results = generateGiftIdeas(profile, selectedFilter);
    setIdeas(results);

    // Sync to event
    onUpdateEvent({
      ...event,
      giftRecipient: profile,
      lastUpdated: new Date().toISOString(),
    });
  };

  const categories = [
    'Safe Choices',
    'Personal Gifts',
    'Creative Gifts',
    'Experience Gifts',
    'Budget-Friendly',
    'Special / Memorable',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-stone-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-purple-800">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Gift className="w-4 h-4" />
          Planora Gift Genie
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          Intelligent Gift Recommendation Engine
        </h2>
        <p className="text-xs text-purple-200 mt-1 max-w-2xl">
          Find the perfect thoughtful, personal, or memorable gift tailored to the recipient's personality and your budget.
        </p>
      </div>

      {/* Recipient Profile Form */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-700" />
          Recipient Profile & Budget Criteria
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold uppercase text-stone-600 mb-1">Recipient Name</label>
            <input
              type="text"
              value={profile.recipient}
              onChange={(e) => setProfile({ ...profile, recipient: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-stone-600 mb-1">Relationship</label>
            <input
              type="text"
              value={profile.relationship}
              onChange={(e) => setProfile({ ...profile, relationship: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-stone-600 mb-1">Age / Demographics</label>
            <input
              type="text"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-stone-600 mb-1">Gift Budget ({profile.currency})</label>
            <input
              type="number"
              min="0"
              value={profile.giftBudget}
              onChange={(e) => setProfile({ ...profile, giftBudget: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-stone-600 mb-1">Interests & Hobbies</label>
            <input
              type="text"
              placeholder="e.g. coffee brewing, acoustic music, architecture, travel"
              value={profile.interests}
              onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-stone-600 mb-1">Personality Traits</label>
            <input
              type="text"
              placeholder="e.g. thoughtful, minimalist, vibrant, career-driven"
              value={profile.personality}
              onChange={(e) => setProfile({ ...profile, personality: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>
        </div>

        {/* Filter / Modifier Action Bar */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerate('cheaper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                filter === 'cheaper'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-stone-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              Cheaper Ideas
            </button>
            <button
              onClick={() => handleGenerate('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                filter === 'personal'
                  ? 'bg-purple-900 text-white border-purple-900'
                  : 'bg-stone-50 text-purple-900 border-purple-200 hover:bg-purple-50'
              }`}
            >
              More Personal
            </button>
            <button
              onClick={() => handleGenerate('unique')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                filter === 'unique'
                  ? 'bg-amber-700 text-white border-amber-700'
                  : 'bg-stone-50 text-amber-800 border-amber-200 hover:bg-amber-50'
              }`}
            >
              More Unique
            </button>
          </div>

          <button
            onClick={() => handleGenerate('more')}
            className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Fresh Ideas</span>
          </button>
        </div>
      </div>

      {/* Categorized Gift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-purple-200 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                  {item.category}
                </span>
                <span className="font-mono text-xs font-bold text-stone-700">
                  {item.priceRange}
                </span>
              </div>

              <h4 className="font-serif font-bold text-base text-stone-900 mt-1 mb-2 leading-snug">
                {item.gift}
              </h4>

              <p className="text-xs text-stone-600 leading-relaxed">
                {item.why}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Tailored for {profile.recipient}</span>
              <span className="text-purple-700 font-semibold flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                Planora Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
