import React, { useState } from 'react';
import { EventData } from '../types/event';
import { Sparkles, Wand2, DollarSign, Gem, Lightbulb, Plus, Check, RefreshCw } from 'lucide-react';

interface AIPlannerViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

interface IdeaCard {
  id: string;
  title: string;
  description: string;
  estimatedCost: string;
  impact: string;
  added?: boolean;
}

const CATEGORIES = [
  'Themes',
  'Décor',
  'Colour palettes',
  'Food',
  'Cakes',
  'Desserts',
  'Entertainment',
  'Photography',
  'Invitations',
  'Party favours',
  'Table décor',
  'Entrance ideas',
  'Backdrops',
  'Special moments',
  'Activities',
  'Music ideas',
  'Memorable touches',
];

export const AIPlannerView: React.FC<AIPlannerViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Décor');
  const [modifier, setModifier] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<IdeaCard[]>([
    {
      id: 'idea-1',
      title: 'Floating Golden Votive Runners with Ambient Moss',
      description: 'Low-lying table runners woven with real velvet moss, micro-fairy lights, and warm glass votives that keep across-table sightlines clear while creating an intimate golden glow.',
      estimatedCost: `${event.currency} 850 total`,
      impact: 'Transforms ambient lighting without expensive towering floral pedestals.',
    },
    {
      id: 'idea-2',
      title: 'Architectural Geometric Arch with Asymmetric Florals',
      description: 'A matte black or brass minimalist arch placed behind the honoree table or stage, accented by asymmetric cascades of eucalyptus, white hydrangeas, and trailing velvet ribbon.',
      estimatedCost: `${event.currency} 1,200`,
      impact: 'Serves double duty as speech backdrop and red-carpet guest photo station.',
    },
    {
      id: 'idea-3',
      title: 'Calligraphed Mirror Welcome Easel with Pillar Lanterns',
      description: 'A vintage gilded or contemporary framed mirror at the venue foyer displaying custom gold-leaf lettering welcoming each guest, surrounded by grouped hurricane lanterns.',
      estimatedCost: `${event.currency} 450`,
      impact: 'Sets an immediate tone of bespoke hospitality as guests arrive.',
    },
    {
      id: 'idea-4',
      title: 'Scent-Scaped Arrival Corridor & Warm Linen Wash',
      description: 'Subtle diffusers with bergamot, cedar, and vanilla notes placed at entrance vestibules, creating a sensory memory trigger tied specifically to this celebration.',
      estimatedCost: `${event.currency} 250`,
      impact: 'High sensory recall that guests will subconsciously remember for years.',
    },
  ]);

  const fetchIdeas = async (cat: string, mod: string = '') => {
    setLoading(true);
    setModifier(mod);
    try {
      const res = await fetch('/api/planora/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: cat, modifier: mod, event }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ideas && Array.isArray(data.ideas)) {
          setIdeas(
            data.ideas.map((item: any, idx: number) => ({
              id: `gen-idea-${Date.now()}-${idx}`,
              title: item.title,
              description: item.description,
              estimatedCost: item.estimatedCost || `${event.currency} 500`,
              impact: item.impact || 'Delights guests',
              added: false,
            }))
          );
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend ideas fallback:', e);
    }

    // Local deterministic fallback ideas based on category & modifier
    setTimeout(() => {
      const isCheap = mod.includes('Cheaper');
      const isUnique = mod.includes('Unique');
      const isElegant = mod.includes('Elegant');

      const fallbackList: IdeaCard[] = [
        {
          id: `gen-${Date.now()}-1`,
          title: isCheap
            ? `DIY Textured Paper Menus with Hand-Torn Gold Foil Edges`
            : isUnique
            ? `Interactive Audio Guestbook Phone & Vintage Record Table`
            : `Champagne Tower with Cascading Dry-Ice Fog & Spun Sugar Flutes`,
          description: `Custom-tailored for your ${event.vibe.toLowerCase()} ${event.eventType} for ${event.guestCount} guests, harmonized in your colour palette.`,
          estimatedCost: isCheap ? `${event.currency} 150` : `${event.currency} 950`,
          impact: 'Memorable focal feature celebrating your specific event vibe.',
        },
        {
          id: `gen-${Date.now()}-2`,
          title: isCheap
            ? `Floating Tealight Fishbowls with Sliced Citrus & Rosemary`
            : isUnique
            ? `Live Monogrammed Calligraphy & Wax-Sealed Take-Home Cards`
            : `Velvet Draped Stage Alcove with Warm Tungsten Festoon Chandelier`,
          description: `Strategic styling choice that enhances room acoustics and creates striking photography angles.`,
          estimatedCost: isCheap ? `${event.currency} 180` : `${event.currency} 1,100`,
          impact: 'Elevates visual polish without complicating setup logistics.',
        },
        {
          id: `gen-${Date.now()}-3`,
          title: `Synchronized Toast Sparkler Reveal at Sunset`,
          description: `Passed smokeless indoor-safe gold sparklers lit right as the main honoree toast is delivered.`,
          estimatedCost: `${event.currency} 300`,
          impact: 'Electric group moment where every guest participates in the celebration.',
        },
      ];
      setIdeas(fallbackList);
      setLoading(false);
    }, 400);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    fetchIdeas(cat, '');
  };

  const handleAddIdeaToPlan = (idea: IdeaCard) => {
    const updated = structuredClone(event);
    updated.notes = (updated.notes || '') + `\n• [AI Idea - ${selectedCategory}]: ${idea.title} - ${idea.description}`;
    onUpdateEvent(updated);

    setIdeas(
      ideas.map((i) => (i.id === idea.id ? { ...i, added: true } : i))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md border border-purple-800">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          Creative AI Planner & Stylist
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          Intelligent Event Ideation
        </h2>
        <p className="text-sm text-purple-200 mt-1 max-w-2xl">
          Generate bespoke concepts tailored to your <strong>{event.eventType}</strong>, <strong>{event.theme || event.vibe}</strong> vibe, and <strong>{event.currency} {event.budget.toLocaleString()}</strong> budget.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-purple-900 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modifier Controls Bar */}
      <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">Style Filters:</span>
          <button
            onClick={() => fetchIdeas(selectedCategory, 'Make It Cheaper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              modifier === 'Make It Cheaper'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Make It Cheaper</span>
          </button>

          <button
            onClick={() => fetchIdeas(selectedCategory, 'Make It More Elegant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              modifier === 'Make It More Elegant'
                ? 'bg-purple-900 text-white'
                : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            <span>Make It More Elegant</span>
          </button>

          <button
            onClick={() => fetchIdeas(selectedCategory, 'Make It More Unique')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              modifier === 'Make It More Unique'
                ? 'bg-amber-700 text-white'
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Make It More Unique</span>
          </button>
        </div>

        <button
          onClick={() => fetchIdeas(selectedCategory, modifier)}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-700 ${loading ? 'animate-spin' : ''}`} />
          <span>Give Me More Ideas</span>
        </button>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-purple-200 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">
                  {idea.title}
                </h4>
                <span className="text-xs font-semibold font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 shrink-0">
                  {idea.estimatedCost}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {idea.description}
              </p>
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-900 mb-4">
                <strong>Why it works:</strong> {idea.impact}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-stone-100">
              {idea.added ? (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Event Plan</span>
                </span>
              ) : (
                <button
                  onClick={() => handleAddIdeaToPlan(idea)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Event Plan</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
