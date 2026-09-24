import { EventData } from '../types/event';
import { applyInterconnectedRecalculations } from './interconnectedEngine';

export interface WhatIfPreset {
  id: string;
  name: string;
  category: 'Guests' | 'Budget' | 'Weather' | 'Vendors' | 'Timing' | 'Venue';
  description: string;
  applyDelta: (event: EventData) => EventData;
}

export interface WhatIfMetricComparison {
  metric: string;
  currentValue: string;
  simulatedValue: string;
  deltaText: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface WhatIfSimulationResult {
  scenarioTitle: string;
  scenarioDescription: string;
  comparisons: WhatIfMetricComparison[];
  risksAndAdvisories: string[];
  recommendedActions: string[];
  simulatedEvent: EventData;
}

export const WHAT_IF_PRESETS: WhatIfPreset[] = [
  {
    id: 'guests-plus-20',
    name: '20 Extra Guests Arrive / RSVP',
    category: 'Guests',
    description: 'Simulate guest count increasing by 20 people.',
    applyDelta: (event) => {
      const targetCount = event.guestCount + 20;
      return applyInterconnectedRecalculations(event, targetCount);
    },
  },
  {
    id: 'guests-minus-10',
    name: '10 Fewer Guests (Attrition / Declines)',
    category: 'Guests',
    description: 'Simulate guest count decreasing by 10 people.',
    applyDelta: (event) => {
      const targetCount = Math.max(5, event.guestCount - 10);
      return applyInterconnectedRecalculations(event, targetCount);
    },
  },
  {
    id: 'rain-moves-indoors',
    name: 'Rain / Move Outdoor Event Indoors',
    category: 'Weather',
    description: 'Sudden rainstorm forces garden/patio event entirely into the indoor venue hall.',
    applyDelta: (event) => {
      const simulated = structuredClone(event);
      simulated.indoorOutdoor = 'Indoor';
      // Add emergency indoor lighting & marquee contingency to budget
      simulated.budgetItems.push({
        id: `sim-b-rain-${Date.now()}`,
        category: 'Equipment',
        name: 'Emergency Indoor Room Dividers & Extra Uplighting',
        plannedCost: 1500,
        actualCost: 1500,
        notes: 'Weather contingency deployment',
      });
      return simulated;
    },
  },
  {
    id: 'budget-decrease-20',
    name: 'Budget Cut by 20%',
    category: 'Budget',
    description: 'Simulate tighter budget constraints requiring prompt cost reductions.',
    applyDelta: (event) => {
      const simulated = structuredClone(event);
      simulated.budget = Math.round(simulated.budget * 0.8);
      return simulated;
    },
  },
  {
    id: 'budget-increase-25',
    name: 'Budget Increase by 25%',
    category: 'Budget',
    description: 'Extra sponsor or personal funds unlocked for upgraded touches and entertainment.',
    applyDelta: (event) => {
      const simulated = structuredClone(event);
      simulated.budget = Math.round(simulated.budget * 1.25);
      return simulated;
    },
  },
  {
    id: 'caterer-cancellation',
    name: 'Primary Caterer Cancels 7 Days Before',
    category: 'Vendors',
    description: 'Simulate rapid shift to emergency drop-off gourmet catering or live food stations.',
    applyDelta: (event) => {
      const simulated = structuredClone(event);
      simulated.mealStyle = 'Finger foods';
      simulated.notes += ' [EMERGENCY CATERER CONTINGENCY ENGAGED]';
      return simulated;
    },
  },
  {
    id: 'event-starts-late-45m',
    name: 'Event Runs 45 Minutes Late',
    category: 'Timing',
    description: 'VIP or traffic delayed, pushing initial arrival & speech start times.',
    applyDelta: (event) => {
      const simulated = structuredClone(event);
      simulated.schedule = simulated.schedule.map((item, index) => {
        if (index >= 2) {
          return {
            ...item,
            notes: (item.notes || '') + ' [Delayed +45m; compressed transition]',
          };
        }
        return item;
      });
      return simulated;
    },
  },
  {
    id: 'food-cost-rises-25',
    name: 'Food & Beverage Inflation (+25%)',
    category: 'Budget',
    description: 'Supplier prices rise by 25% due to seasonal shortage.',
    applyDelta: (event) => {
      const simulated = structuredClone(event);
      simulated.budgetItems = simulated.budgetItems.map((b) => {
        if (['Food', 'Drinks'].includes(b.category)) {
          return {
            ...b,
            actualCost: Math.round(b.plannedCost * 1.25),
          };
        }
        return b;
      });
      return simulated;
    },
  },
];

/**
 * Runs a simulation comparison between current event and simulated mutated event.
 */
export function runWhatIfSimulation(
  currentEvent: EventData,
  simulatedEvent: EventData,
  title: string,
  description: string
): WhatIfSimulationResult {
  const comparisons: WhatIfMetricComparison[] = [];
  const risksAndAdvisories: string[] = [];
  const recommendedActions: string[] = [];

  // 1. Guest count
  if (simulatedEvent.guestCount !== currentEvent.guestCount) {
    const diff = simulatedEvent.guestCount - currentEvent.guestCount;
    comparisons.push({
      metric: 'Guest Count',
      currentValue: `${currentEvent.guestCount} guests`,
      simulatedValue: `${simulatedEvent.guestCount} guests`,
      deltaText: `${diff > 0 ? '+' : ''}${diff} guests`,
      impactLevel: Math.abs(diff) > 15 ? 'high' : 'medium',
    });
  }

  // 2. Tables & Seating
  const curSeats = currentEvent.tables.reduce((a, t) => a + t.capacity, 0);
  const simSeats = simulatedEvent.tables.reduce((a, t) => a + t.capacity, 0);
  comparisons.push({
    metric: 'Tables & Seating',
    currentValue: `${currentEvent.tables.length} tables (${curSeats} seats)`,
    simulatedValue: `${simulatedEvent.tables.length} tables (${simSeats} seats)`,
    deltaText: `${simulatedEvent.tables.length - currentEvent.tables.length > 0 ? '+' : ''}${simulatedEvent.tables.length - currentEvent.tables.length} tables`,
    impactLevel: simSeats < simulatedEvent.guestCount ? 'critical' : 'low',
  });

  if (simSeats < simulatedEvent.guestCount) {
    risksAndAdvisories.push(`Seating shortage: ${simulatedEvent.guestCount - simSeats} guests will lack designated seats.`);
    recommendedActions.push(`Add ${Math.ceil((simulatedEvent.guestCount - simSeats) / 10)} additional table(s).`);
  }

  // 3. Budget & Projected Spend
  const curPlanned = currentEvent.budgetItems.reduce((a, b) => a + b.plannedCost, 0);
  const simPlanned = simulatedEvent.budgetItems.reduce((a, b) => a + (b.actualCost > 0 ? b.actualCost : b.plannedCost), 0);
  const budgetDiff = simPlanned - curPlanned;

  comparisons.push({
    metric: 'Estimated Spending',
    currentValue: `${currentEvent.currency} ${curPlanned.toLocaleString()}`,
    simulatedValue: `${simulatedEvent.currency} ${simPlanned.toLocaleString()}`,
    deltaText: `${budgetDiff >= 0 ? '+' : ''}${currentEvent.currency} ${budgetDiff.toLocaleString()}`,
    impactLevel: simPlanned > simulatedEvent.budget ? 'critical' : budgetDiff !== 0 ? 'medium' : 'low',
  });

  if (simPlanned > simulatedEvent.budget) {
    risksAndAdvisories.push(`Budget overrun by ${simulatedEvent.currency} ${(simPlanned - simulatedEvent.budget).toLocaleString()}.`);
    recommendedActions.push('Engage Planora Smart Budget Rebalancing or trim décor and entertainment allocations.');
  }

  // 4. Venue Capacity
  if (simulatedEvent.venueCapacity && simulatedEvent.guestCount > simulatedEvent.venueCapacity) {
    comparisons.push({
      metric: 'Venue Capacity',
      currentValue: `Max ${currentEvent.venueCapacity} (${currentEvent.guestCount} guests)`,
      simulatedValue: `Max ${simulatedEvent.venueCapacity} (${simulatedEvent.guestCount} guests)`,
      deltaText: `Exceeded by ${simulatedEvent.guestCount - simulatedEvent.venueCapacity}`,
      impactLevel: 'critical',
    });
    risksAndAdvisories.push(`Venue capacity violation: The space cannot safely hold ${simulatedEvent.guestCount} guests.`);
    recommendedActions.push('Contact venue manager regarding adjoining patio space or consider a split-reception format.');
  }

  // 5. Food & Portions
  if (simulatedEvent.guestCount !== currentEvent.guestCount) {
    const ratio = simulatedEvent.guestCount / (currentEvent.guestCount || 1);
    const pct = Math.round((ratio - 1) * 100);
    comparisons.push({
      metric: 'Catering & Drink Portions',
      currentValue: `${currentEvent.guestCount} servings`,
      simulatedValue: `${simulatedEvent.guestCount} servings`,
      deltaText: `${pct > 0 ? '+' : ''}${pct}% volume adjustment`,
      impactLevel: Math.abs(pct) > 20 ? 'high' : 'medium',
    });
    recommendedActions.push(`Update caterer head count to ${simulatedEvent.guestCount} at least 72 hours in advance.`);
  }

  // Default suggestions if list is sparse
  if (recommendedActions.length === 0) {
    recommendedActions.push('Review timeline run-of-show buffers.', 'Verify vendor contracts for guest adjustment deadlines.');
  }

  return {
    scenarioTitle: title,
    scenarioDescription: description,
    comparisons,
    risksAndAdvisories,
    recommendedActions,
    simulatedEvent,
  };
}
