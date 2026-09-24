import { ContingencyPlan, EventData } from '../types/event';

export interface EmergencyScenarioPreset {
  id: string;
  name: string;
  icon: string;
  category: 'Weather' | 'Vendors' | 'Equipment' | 'Food' | 'Timing' | 'Venue';
  summary: string;
  details: {
    immediateActions: string[];
    planB: string;
    whoToContact: string;
    eventImpact: string;
    updatedTimeline: string;
  };
}

export const EMERGENCY_PRESETS: EmergencyScenarioPreset[] = [
  {
    id: 'rain-storm',
    name: 'Sudden Heavy Rain / Storm',
    icon: 'CloudRain',
    category: 'Weather',
    summary: 'Outdoor setup threatened by torrential downpour or unexpected gale wind.',
    details: {
      immediateActions: [
        'Halt outdoor sound check immediately and unplug sensitive electrical equipment.',
        'Direct venue crew to roll out waterproof runner mats at the indoor foyer.',
        'Guide early arriving guests under the covered arcade/conservatory with warm welcome refreshments.',
      ],
      planB: 'Relocate the entire welcome reception and photography station to the indoor foyer and main ballroom.',
      whoToContact: 'Venue Floor Manager, Lead Decorator, and AV Sound Engineer.',
      eventImpact: 'Outdoor lawn photo session cancelled; backdrops repositioned in front of indoor marble fireplace.',
      updatedTimeline: 'No delay: speeches and welcome proceed on schedule indoors with ambient uplighting.',
    },
  },
  {
    id: 'venue-issue',
    name: 'Venue Aircon / AC / Plumbing Failure',
    icon: 'Building2',
    category: 'Venue',
    summary: 'HVAC system trips or localized water pipe failure in primary reception wing.',
    details: {
      immediateActions: [
        'Open perimeter french doors and courtyard transoms to establish cross-ventilation immediately.',
        'Request emergency industrial silent pedestal fans from venue maintenance.',
        'Relocate beverage bars closer to shaded breezy zones and double up ice supplies.',
      ],
      planB: 'Transition evening dining into the open-air covered terrace while maintenance seals the affected wing.',
      whoToContact: 'Facilities Chief, General Manager on duty, and Bar Lead.',
      eventImpact: 'Room layout shifted by 90 degrees; lighting dimmed slightly to minimize ambient heat emission.',
      updatedTimeline: 'Speeches delivered from terrace stairs; dancing relocated under fairy-lit pergola.',
    },
  },
  {
    id: 'power-outage',
    name: 'Power Outage / Generator Trip',
    icon: 'ZapOff',
    category: 'Equipment',
    summary: 'Main power grid cuts out right before speeches or dinner.',
    details: {
      immediateActions: [
        'Light all table candles and decorative hurricane lamps immediately to reassure guests.',
        'Direct AV technician to switch microphones and speaker amplifiers to the battery UPS / portable inverter.',
        'Inform the Master of Ceremonies to make a warm, humorous announcement celebrating intimate candlelight.',
      ],
      planB: 'Engage venue backup diesel generator (2–3 minute warm-up). If unavailable, continue in acoustic candlelight gala mode.',
      whoToContact: 'AV Technician, Venue Generator Operator, and MC.',
      eventImpact: 'High-wattage stage lighting temporarily offline; acoustic and vocal ambiance emphasized.',
      updatedTimeline: 'Speeches continue unamplified or via battery megaspeaker; dinner service proceeds uninterrupted.',
    },
  },
  {
    id: 'caterer-cancels',
    name: 'Primary Caterer Fails to Arrive',
    icon: 'UtensilsCrossed',
    category: 'Food',
    summary: 'Caterer suffers vehicle accident or fails to show up with food.',
    details: {
      immediateActions: [
        'Order heavy artisanal charcuterie, gourmet flatbreads, and warm appetizers from 2 top-tier local restaurants within a 5km radius.',
        'Deploy generous bread baskets, olives, cheeses, and champagne toast immediately to satiate guests.',
        'Instruct MC to schedule an engaging interactive program segment (photo montage / trivia / tributes).',
      ],
      planB: 'Convert traditional plated service to interactive family-style platters and gourmet roaming carving stations.',
      whoToContact: 'Emergency Catering Partner, Local Restaurant Head Chefs, and Lead Event Host.',
      eventImpact: 'Menu altered from pre-set courses to high-end artisanal sharing platters; overall vibe becomes convivial.',
      updatedTimeline: 'Main dinner served 40 minutes later; entertainment and speeches moved forward to entertain guests.',
    },
  },
  {
    id: 'photographer-cancels',
    name: 'Photographer / Videographer Cancels',
    icon: 'CameraOff',
    category: 'Vendors',
    summary: 'Key visual vendor falls ill or is stranded en route.',
    details: {
      immediateActions: [
        'Call verified freelance photographer emergency registry / local photography studio.',
        'Designate two trusted tech-savvy bridal/event party members with top-tier iPhones/DSLRs to cover core candid shots.',
        'Set up a live shared QR code photo album on table cards so every guest can upload high-res photos directly.',
      ],
      planB: 'Backup photographer arrives for the second half; crowdsourced live photo stream captures all intimate angles.',
      whoToContact: 'Local Professional Photographers Guild and Lead Host.',
      eventImpact: 'No missed memories; live guest gallery often produces more authentic and candid memories.',
      updatedTimeline: 'Formal portraits captured during the midpoint break rather than pre-ceremony.',
    },
  },
  {
    id: 'dj-cancels',
    name: 'DJ or Musician Cancels Last-Minute',
    icon: 'Music2',
    category: 'Vendors',
    summary: 'Sound engineer or DJ equipment fails or artist is unavailable.',
    details: {
      immediateActions: [
        'Connect an iPad or phone directly to the venue house PA auxiliary jack.',
        'Launch Planora’s curated offline high-fidelity event playlist (Lounge & Celebration).',
        'Appoint an enthusiastic guest or MC assistant to manage music transitions.',
      ],
      planB: 'Run high-energy pre-programmed music sets; use MC to lead party games, dances, and singalongs.',
      whoToContact: 'Venue Sound Technician & MC.',
      eventImpact: 'No live mixing, but music flow remains cohesive and crowd energy stays buoyant.',
      updatedTimeline: 'Timeline stays 100% on schedule.',
    },
  },
  {
    id: 'cake-damaged',
    name: 'Celebratory Cake Collapses / Damaged',
    icon: 'Cake',
    category: 'Food',
    summary: 'Multi-tier cake suffers structural failure or icing damage in transit.',
    details: {
      immediateActions: [
        'Inspect damage: salvage undamaged tiers or individual layers immediately.',
        'Dispatch an assistant to a nearby luxury patisserie for 24–36 artisan cupcakes and fresh macarons.',
        'Decorate the salvaged cake or tiers with fresh floral sprigs, gold dust, and berries from catering.',
      ],
      planB: 'Create an elegant dessert tier pedestal with the rescued top tier flanked by gourmet mini-cakes and sparklers.',
      whoToContact: 'Pastry Chef, Florist, and Catering Lead.',
      eventImpact: 'Cake presentation looks deliberately modern and artistic; guests get more flavor variety.',
      updatedTimeline: 'Cake cutting takes place at the planned time with sparkler fanfare.',
    },
  },
  {
    id: 'food-shortage',
    name: 'Unexpected Food Shortage / Extra Guests',
    icon: 'AlertCircle',
    category: 'Food',
    summary: '15+ unannounced plus-ones arrive or portions deplete faster than expected.',
    details: {
      immediateActions: [
        'Alert head chef quietly without alarming guests.',
        'Instruct servers to portion sides and proteins generously supplemented with gourmet carb sides (truffle mash, artisan breads, risottos).',
        'Order 8–10 high-end woodfired gourmet pizzas or sliders as a late-night street food surprise.',
      ],
      planB: 'Offer late-night midnight snack bar surprise that guests will celebrate as a planned highlight.',
      whoToContact: 'Head Chef, Catering Lead, and Lead Coordinator.',
      eventImpact: 'Guests feel pampered by an unexpected second wave of hot comfort food.',
      updatedTimeline: 'Dinner service finishes smoothly; late-night station deployed at 21:30.',
    },
  },
  {
    id: 'event-running-late',
    name: 'Event Running 45+ Minutes Behind Schedule',
    icon: 'Clock',
    category: 'Timing',
    summary: 'Speeches ran long or guest arrival was heavily delayed by city traffic.',
    details: {
      immediateActions: [
        'Meet discreetly with MC, DJ, and kitchen to agree on a compressed buffer strategy.',
        'Serve dinner courses concurrently with short tribute speeches rather than having empty silent gaps.',
        'Shorten speech introductions and request speakers cap comments to 3 minutes.',
      ],
      planB: 'Overlap dining with low-volume speeches; eliminate redundant formal transitions.',
      whoToContact: 'Master of Ceremonies, Catering Supervisor, and Lead Photographer.',
      eventImpact: 'Speeches and dinner happen together; dancing set remains intact without overtime penalties.',
      updatedTimeline: 'Timeline reconciled by 20:30; party continues smoothly until curfew.',
    },
  },
];

/**
 * Creates a contingency plan record from an emergency preset or custom description.
 */
export function generatePlanBResponse(
  presetId: string,
  event: EventData,
  customScenario?: string
): ContingencyPlan {
  const preset = EMERGENCY_PRESETS.find((p) => p.id === presetId);

  if (preset) {
    return {
      id: `planb-${preset.id}-${Date.now()}`,
      trigger: preset.name,
      immediateActions: preset.details.immediateActions,
      planB: preset.details.planB,
      whoToContact: preset.details.whoToContact,
      eventImpact: preset.details.eventImpact,
      updatedTimeline: preset.details.updatedTimeline,
    };
  }

  // Custom Emergency Handler
  return {
    id: `planb-custom-${Date.now()}`,
    trigger: customScenario || 'Custom Emergency Scenario',
    immediateActions: [
      'Maintain calm: assess the exact scope of the disruption with lead venue staff.',
      'Communicate discreetly with core vendors (MC, catering, audio) before addressing guests.',
      'Protect guest comfort: ensure food, drinks, seating, and music remain active.',
    ],
    planB: `Activate Planora resilient workflow: re-route affected elements to secondary spaces or alternative suppliers while keeping guests engaged.`,
    whoToContact: `Venue Operations Manager & Primary Event Lead`,
    eventImpact: `Minor sequence adjustment; main emotional highlights preserved.`,
    updatedTimeline: `Introduce a 15-minute buffer and streamline non-essential formalities.`,
  };
}
