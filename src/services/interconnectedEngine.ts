import { EventData, InterconnectedChangeNotice, Table, ShoppingItem, BudgetItem, ScheduleItem } from '../types/event';

export interface ProactiveWarning {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  suggestedAction: string;
  category: 'Venue' | 'Budget' | 'Seating' | 'Dietary' | 'Schedule' | 'Weather' | 'General';
}

/**
 * Calculates the exact delta and required adaptations when guest count or key params change.
 */
export function calculateInterconnectedImpact(
  event: EventData,
  newGuestCount: number
): InterconnectedChangeNotice {
  const previousCount = event.guestCount || 1;
  const ratio = newGuestCount / previousCount;
  const foodScalingPercent = Math.round((ratio - 1) * 100);

  // Table calculations: assume current average table capacity or default 10
  const avgCapacity = event.tables.length > 0
    ? Math.round(event.tables.reduce((acc, t) => acc + t.capacity, 0) / event.tables.length)
    : 10;
  const currentTotalSeats = event.tables.reduce((acc, t) => acc + t.capacity, 0);
  const seatsNeeded = newGuestCount;
  const tablesNeeded = Math.ceil(seatsNeeded / (avgCapacity || 10));
  const tableDifference = tablesNeeded - event.tables.length;

  // Budget scaling on per-guest items (Food, Drinks, Favours)
  const perGuestBudgetItems = event.budgetItems.filter((item) =>
    ['Food', 'Drinks', 'Party favours', 'Cake'].includes(item.category)
  );
  const currentPerGuestCostTotal = perGuestBudgetItems.reduce((acc, item) => acc + item.plannedCost, 0);
  const costPerHead = previousCount > 0 ? currentPerGuestCostTotal / previousCount : 150;
  const budgetDifference = Math.round((newGuestCount - previousCount) * costPerHead);

  // Schedule impact
  let scheduleTimingImpact = 'No major timing change needed.';
  if (newGuestCount > previousCount + 15) {
    scheduleTimingImpact = `Dinner service and buffet queue should receive approximately 15–20 additional minutes to prevent bottlenecking.`;
  } else if (newGuestCount < previousCount - 15) {
    scheduleTimingImpact = `Dinner service can be streamlined by approximately 10–15 minutes.`;
  }

  const affectedAreas: string[] = [];
  if (tableDifference !== 0 || currentTotalSeats < newGuestCount) affectedAreas.push('Table & Seating Capacity');
  if (foodScalingPercent !== 0) {
    affectedAreas.push('Food & Portion Quantities');
    affectedAreas.push('Drinks & Beverage Quantities');
    affectedAreas.push('Shopping List Requirements');
    affectedAreas.push('Estimated Budget Allocation');
  }
  if (event.venueCapacity && newGuestCount > event.venueCapacity) {
    affectedAreas.push('Venue Capacity Limit Warning');
  }
  if (Math.abs(newGuestCount - previousCount) >= 10) {
    affectedAreas.push('Run-of-show Schedule Buffers');
  }

  return {
    previousCount,
    newCount: newGuestCount,
    tableDifference,
    foodScalingPercent,
    budgetDifference,
    scheduleTimingImpact,
    affectedAreas,
  };
}

/**
 * Applies the interconnected adaptations directly to the event state.
 */
export function applyInterconnectedRecalculations(
  event: EventData,
  newGuestCount: number
): EventData {
  const impact = calculateInterconnectedImpact(event, newGuestCount);
  const updated = structuredClone(event);
  const oldGuestCount = event.guestCount || 1;
  const ratio = newGuestCount / oldGuestCount;

  updated.guestCount = newGuestCount;

  // 1. Tables: Add or adjust tables if more seats needed
  const avgCapacity = updated.tables.length > 0
    ? Math.round(updated.tables.reduce((acc, t) => acc + t.capacity, 0) / updated.tables.length)
    : 10;
  const totalSeats = updated.tables.reduce((acc, t) => acc + t.capacity, 0);

  if (totalSeats < newGuestCount) {
    const additionalSeatsNeeded = newGuestCount - totalSeats;
    const additionalTablesNeeded = Math.ceil(additionalSeatsNeeded / (avgCapacity || 10));
    for (let i = 0; i < additionalTablesNeeded; i++) {
      const newTableNum = updated.tables.length + 1;
      const newTableId = `t-${Date.now()}-${i}`;
      updated.tables.push({
        id: newTableId,
        name: `Table ${newTableNum}`,
        shape: 'Round',
        capacity: avgCapacity || 10,
        isLocked: false,
      });
      updated.seatingPlan.push({
        tableId: newTableId,
        guestIds: [],
      });
    }
  }

  // 2. Budget scaling on variable categories
  updated.budgetItems = updated.budgetItems.map((item) => {
    if (['Food', 'Drinks', 'Party favours'].includes(item.category)) {
      const scaledPlanned = Math.round(item.plannedCost * ratio);
      return {
        ...item,
        plannedCost: scaledPlanned,
        notes: item.notes ? `${item.notes} (Auto-scaled for ${newGuestCount} guests)` : `Auto-scaled for ${newGuestCount} guests`,
      };
    }
    return item;
  });

  // 3. Shopping list scaling
  updated.shoppingList = updated.shoppingList.map((item) => {
    // If quantity contains number
    const match = item.quantity.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      const oldQty = parseFloat(match[1]);
      const unit = match[2];
      const newQty = Math.round(oldQty * ratio);
      const newEstCost = Math.round(item.estimatedCost * ratio);
      return {
        ...item,
        quantity: `${newQty} ${unit}`.trim(),
        estimatedCost: newEstCost,
      };
    }
    return item;
  });

  // 4. Schedule adjustment: if guest count increases significantly, increase dinner time
  if (newGuestCount >= oldGuestCount + 15) {
    updated.schedule = updated.schedule.map((item) => {
      if (item.activity.toLowerCase().includes('dinner') || item.activity.toLowerCase().includes('meal') || item.activity.toLowerCase().includes('buffet')) {
        return {
          ...item,
          durationMinutes: Math.min(90, item.durationMinutes + 15),
          notes: (item.notes || '') + ' [Extended +15m for larger guest volume]',
        };
      }
      return item;
    });
  }

  updated.lastUpdated = new Date().toISOString();
  return updated;
}

/**
 * High-level helper for UI to scale an event and get human-readable impact summaries
 */
export function scaleEventForGuestCount(
  event: EventData,
  newGuestCount: number
): { updatedEvent: EventData; changesSummary: string[] } {
  const impact = calculateInterconnectedImpact(event, newGuestCount);
  const updatedEvent = applyInterconnectedRecalculations(event, newGuestCount);
  const changesSummary: string[] = [
    `Guest count updated from ${impact.previousCount} to ${impact.newCount} (${impact.foodScalingPercent >= 0 ? '+' : ''}${impact.foodScalingPercent}% change).`,
    impact.tableDifference > 0
      ? `Added ${impact.tableDifference} additional table(s) to accommodate all guests.`
      : `Table layout preserved for ${newGuestCount} guests.`,
    `Food, beverage, and dessert portion sizes recalculated.`,
    `Shopping list supply quantities scaled to match guest count.`,
    `Projected budget variance: ${event.currency} ${impact.budgetDifference >= 0 ? '+' : ''}${impact.budgetDifference.toLocaleString()}.`,
    `Schedule pacing: ${impact.scheduleTimingImpact}`,
  ];
  return { updatedEvent, changesSummary };
}

/**
 * Intelligent proactive health check warnings across the entire event.
 */
export function generateProactiveWarnings(event: EventData): ProactiveWarning[] {
  const warnings: ProactiveWarning[] = [];

  // 1. Venue capacity
  if (event.venueCapacity && event.guestCount > event.venueCapacity) {
    warnings.push({
      id: 'warn-venue-capacity',
      type: 'critical',
      title: 'Venue Capacity Exceeded',
      message: `Your guest count (${event.guestCount}) exceeds the reported venue capacity (${event.venueCapacity}) by ${event.guestCount - event.venueCapacity} guests.`,
      suggestedAction: 'Explore an overflow marquee or re-evaluate the venue / guest list.',
      category: 'Venue',
    });
  }

  // 2. Seating capacity
  const confirmedGuestsCount = event.guestList.filter((g) => g.rsvp === 'Confirmed').length;
  const targetGuestCount = confirmedGuestsCount > 0 ? confirmedGuestsCount : event.guestCount;
  const totalTableCapacity = event.tables.reduce((acc, t) => acc + t.capacity, 0);

  if (totalTableCapacity < targetGuestCount) {
    warnings.push({
      id: 'warn-seating-shortage',
      type: 'critical',
      title: 'Seating Shortage Detected',
      message: `${targetGuestCount} guests expected/confirmed, but current tables only seat ${totalTableCapacity} people (shortage of ${targetGuestCount - totalTableCapacity} seats).`,
      suggestedAction: `Add ${Math.ceil((targetGuestCount - totalTableCapacity) / 10)} more table(s) or increase seats per table.`,
      category: 'Seating',
    });
  }

  // 3. Seating conflict: Should NOT sit with
  const guestMap = new Map(event.guestList.map((g) => [g.id, g]));
  for (const assignment of event.seatingPlan) {
    const tableGuests = assignment.guestIds.map((id) => guestMap.get(id)).filter(Boolean);
    const tableName = event.tables.find((t) => t.id === assignment.tableId)?.name || 'Table';

    for (let i = 0; i < tableGuests.length; i++) {
      const g1 = tableGuests[i]!;
      if (g1.shouldNotSitWith && g1.shouldNotSitWith.length > 0) {
        for (let j = i + 1; j < tableGuests.length; j++) {
          const g2 = tableGuests[j]!;
          const conflictByName = g1.shouldNotSitWith.some(
            (c) =>
              c.toLowerCase().includes(g2.name.toLowerCase()) ||
              (g2.surname && c.toLowerCase().includes(g2.surname.toLowerCase()))
          );
          const conflictById = g1.shouldNotSitWith.includes(g2.id);

          if (conflictByName || conflictById) {
            warnings.push({
              id: `warn-conflict-${g1.id}-${g2.id}`,
              type: 'critical',
              title: `Seating Conflict at ${tableName}`,
              message: `${g1.name} ${g1.surname} and ${g2.name} ${g2.surname} are seated together at ${tableName}, despite a 'Should NOT sit with' rule.`,
              suggestedAction: `Move ${g2.name} to another table to preserve guest comfort.`,
              category: 'Seating',
            });
          }
        }
      }
    }
  }

  // 4. Budget overspending
  const totalPlanned = event.budgetItems.reduce((acc, b) => acc + b.plannedCost, 0);
  const totalActual = event.budgetItems.reduce((acc, b) => acc + (b.actualCost || b.plannedCost), 0);
  const budget = event.budget;

  if (totalActual > budget) {
    const overrun = totalActual - budget;
    warnings.push({
      id: 'warn-budget-overrun',
      type: 'critical',
      title: 'Budget Limit Exceeded',
      message: `Your current spending of ${event.currency} ${totalActual.toLocaleString()} exceeds your total budget of ${event.currency} ${budget.toLocaleString()} by ${event.currency} ${overrun.toLocaleString()}.`,
      suggestedAction: 'Use Planora Smart Budget Rebalancing to find category savings.',
      category: 'Budget',
    });
  } else if (totalPlanned > budget * 0.95 && !event.budgetItems.some((b) => b.category === 'Emergency fund' && b.plannedCost > 0)) {
    warnings.push({
      id: 'warn-no-contingency-fund',
      type: 'warning',
      title: 'No Emergency Contingency Reserve',
      message: `95%+ of your budget is allocated without an emergency contingency buffer.`,
      suggestedAction: 'Reserve 8–10% for last-minute vendor or guest variations.',
      category: 'Budget',
    });
  }

  // 5. Dietary & Allergy conflicts
  const allergicGuests = event.guestList.filter((g) => g.allergies && g.allergies.length > 0);
  if (allergicGuests.length > 0) {
    const allergenList = Array.from(new Set(allergicGuests.flatMap((g) => g.allergies))).join(', ');
    const hasDietaryTasks = event.tasks.some(
      (t) => t.category === 'Food' && (t.status === 'Done' || t.status === 'In Progress')
    );
    if (!hasDietaryTasks) {
      warnings.push({
        id: 'warn-allergens-unconfirmed',
        type: 'warning',
        title: 'Guest Allergens Require Catering Confirmation',
        message: `Guests have reported severe allergies (${allergenList}). Caterer confirmation is pending.`,
        suggestedAction: 'Submit the formal allergen brief to the chef to prevent cross-contamination.',
        category: 'Dietary',
      });
    }
  }

  // 6. Accessibility
  const accessibilityGuests = event.guestList.filter((g) => g.accessibility && g.accessibility.length > 0);
  if (accessibilityGuests.length > 0) {
    const accessNotes = accessibilityGuests.map((g) => `${g.name}: ${g.accessibility.join(', ')}`).join('; ');
    warnings.push({
      id: 'warn-accessibility',
      type: 'info',
      title: 'Accessibility Accommodations Recorded',
      message: `Guests have special mobility/seating needs (${accessNotes}). Ensure clear pathway and low-step access.`,
      suggestedAction: 'Verify ramp access and reserve front/ground-level table placement.',
      category: 'Seating',
    });
  }

  // 7. Outdoor event with no weather backup
  if (event.indoorOutdoor === 'Outdoor' && event.contingencyPlans.length === 0) {
    warnings.push({
      id: 'warn-outdoor-no-backup',
      type: 'warning',
      title: 'Outdoor Event Missing Weather Contingency',
      message: 'This event is scheduled outdoors, but no rain or heat backup plan has been established.',
      suggestedAction: 'Add a Plan B weather contingency with a marquee or sheltered pavilion.',
      category: 'Weather',
    });
  }

  // 8. Schedule checks: unrealistic dinner timing
  for (const item of event.schedule) {
    const act = item.activity.toLowerCase();
    if ((act.includes('dinner') || act.includes('main meal') || act.includes('buffet')) && item.durationMinutes < 25 && event.guestCount > 35) {
      warnings.push({
        id: `warn-schedule-dinner-${item.id}`,
        type: 'warning',
        title: 'Unrealistic Dinner Duration',
        message: `You have allocated only ${item.durationMinutes} minutes for dinner for ${event.guestCount} guests. This will cause rush and buffet delays.`,
        suggestedAction: `Increase dinner duration to at least 45–60 minutes.`,
        category: 'Schedule',
      });
    }
  }

  return warnings;
}

/**
 * Calculates live event readiness percentage (0-100%) based on genuine planning completeness.
 */
export function calculateEventReadinessScore(event: EventData): { score: number; breakdown: { area: string; complete: boolean; weight: number; note: string }[] } {
  const breakdown = [
    {
      area: 'Core Details & Date',
      weight: 10,
      complete: Boolean(event.eventName && event.date && event.startTime && event.endTime),
      note: event.eventName ? 'Event title and timing confirmed' : 'Missing event name or time',
    },
    {
      area: 'Venue & Location',
      weight: 15,
      complete: Boolean(event.venue && event.location),
      note: event.venue ? `Venue set: ${event.venue}` : 'Venue not yet chosen',
    },
    {
      area: 'Guest List & RSVPs',
      weight: 15,
      complete: event.guestList.length > 0 && event.guestList.some((g) => g.rsvp === 'Confirmed'),
      note: event.guestList.length > 0 ? `${event.guestList.length} guests tracked` : 'Guest list is empty',
    },
    {
      area: 'Budget & Costing',
      weight: 15,
      complete: event.budgetItems.length > 0 && event.budgetItems.reduce((acc, b) => acc + b.plannedCost, 0) > 0,
      note: event.budgetItems.length > 0 ? `${event.budgetItems.length} budget items planned` : 'No budget items defined',
    },
    {
      area: 'Seating Arrangement',
      weight: 15,
      complete: event.tables.length > 0 && event.seatingPlan.some((p) => p.guestIds.length > 0),
      note: event.tables.length > 0 ? `${event.tables.length} tables arranged` : 'No seating tables configured',
    },
    {
      area: 'Run-of-Show Schedule',
      weight: 10,
      complete: event.schedule.length >= 4,
      note: event.schedule.length >= 4 ? `${event.schedule.length} timeline milestones` : 'Schedule needs more timeline items',
    },
    {
      area: 'Food & Menu',
      weight: 10,
      complete: Boolean(event.mealStyle && event.drinksRequirements),
      note: `${event.mealStyle} meal style configured`,
    },
    {
      area: 'Plan B & Emergency Contingency',
      weight: 10,
      complete: event.contingencyPlans.length > 0,
      note: event.contingencyPlans.length > 0 ? `${event.contingencyPlans.length} Plan B protocols ready` : 'No emergency protocols logged',
    },
  ];

  const totalPossible = breakdown.reduce((acc, item) => acc + item.weight, 0);
  const earned = breakdown.reduce((acc, item) => acc + (item.complete ? item.weight : 0), 0);
  const score = Math.round((earned / totalPossible) * 100);

  return { score, breakdown };
}
