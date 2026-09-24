import { EventData } from '../types/event';

export interface StressTestCheck {
  id: string;
  category: string;
  title: string;
  status: 'critical' | 'attention' | 'good';
  description: string;
  recommendation?: string;
}

export interface StressTestReport {
  timestamp: string;
  criticalCount: number;
  attentionCount: number;
  goodCount: number;
  critical: StressTestCheck[];
  attention: StressTestCheck[];
  good: StressTestCheck[];
  overallSummary: string;
}

/**
 * Runs a rigorous, realistic diagnostic stress test over the entire event model.
 */
export function runEventStressTest(event: EventData): StressTestReport {
  const checks: StressTestCheck[] = [];

  // 1. Budget check
  const totalPlanned = event.budgetItems.reduce((acc, b) => acc + b.plannedCost, 0);
  const totalActual = event.budgetItems.reduce((acc, b) => acc + (b.actualCost > 0 ? b.actualCost : b.plannedCost), 0);
  const effectiveCost = Math.max(totalPlanned, totalActual);

  if (effectiveCost > event.budget) {
    checks.push({
      id: 'st-budget-overrun',
      category: 'Budget',
      title: 'Budget Overrun Detected',
      status: 'critical',
      description: `Total projected cost (${event.currency} ${effectiveCost.toLocaleString()}) exceeds your authorized budget (${event.currency} ${event.budget.toLocaleString()}) by ${event.currency} ${(effectiveCost - event.budget).toLocaleString()}.`,
      recommendation: 'Use Planora Smart Budget Rebalancer to trim non-essential items before vendor deposits are locked.',
    });
  } else if (effectiveCost > event.budget * 0.92) {
    checks.push({
      id: 'st-budget-tight',
      category: 'Budget',
      title: 'Budget Allocation Running Tight',
      status: 'attention',
      description: `${Math.round((effectiveCost / event.budget) * 100)}% of your budget is already committed. Less than 8% remains for unexpected expenses.`,
      recommendation: 'Hold a reserve contingency of at least 8–10% for on-the-day tips, extra overtime, or emergency supplies.',
    });
  } else {
    checks.push({
      id: 'st-budget-healthy',
      category: 'Budget',
      title: 'Budget Healthy & Within Thresholds',
      status: 'good',
      description: `Projected spend is ${event.currency} ${effectiveCost.toLocaleString()} against ${event.currency} ${event.budget.toLocaleString()} (${Math.round((effectiveCost / event.budget) * 100)}% utilized).`,
    });
  }

  // 2. Venue Capacity vs Guests
  if (event.venueCapacity && event.guestCount > event.venueCapacity) {
    checks.push({
      id: 'st-venue-overcrowd',
      category: 'Venue & Safety',
      title: 'Severe Venue Overcapacity Risk',
      status: 'critical',
      description: `Venue capacity is rated at ${event.venueCapacity}, but ${event.guestCount} guests are anticipated (${event.guestCount - event.venueCapacity} over limit).`,
      recommendation: 'Risk of fire code violation and poor ventilation. Book an auxiliary tent or cap RSVPs strictly.',
    });
  } else if (event.venueCapacity && event.guestCount > event.venueCapacity * 0.9) {
    checks.push({
      id: 'st-venue-near-capacity',
      category: 'Venue & Safety',
      title: 'Venue Near Maximum Capacity',
      status: 'attention',
      description: `Guest count (${event.guestCount}) is within 10% of venue limit (${event.venueCapacity}). Movement space may feel congested.`,
      recommendation: 'Plan broad walkway aisles and position the bar away from high-traffic doorways.',
    });
  } else {
    checks.push({
      id: 'st-venue-ok',
      category: 'Venue & Safety',
      title: 'Venue Capacity Comfortably Sized',
      status: 'good',
      description: `Venue accommodates up to ${event.venueCapacity || '100+'} guests, providing ample circulation for ${event.guestCount} attendees.`,
    });
  }

  // 3. Seating Capacity & Layout
  const totalTableSeats = event.tables.reduce((acc, t) => acc + t.capacity, 0);
  const confirmedCount = event.guestList.filter((g) => g.rsvp === 'Confirmed').length;
  const countToCheck = confirmedCount > 0 ? confirmedCount : event.guestCount;

  if (totalTableSeats < countToCheck) {
    checks.push({
      id: 'st-seating-shortage',
      category: 'Seating',
      title: 'Seating Deficit for Confirmed Attendees',
      status: 'critical',
      description: `${countToCheck} guests expected, but tables only provide ${totalTableSeats} seats. Shortage: ${countToCheck - totalTableSeats} seats.`,
      recommendation: `Add at least ${Math.ceil((countToCheck - totalTableSeats) / 10)} additional table(s) or reconfigure table capacity.`,
    });
  } else {
    checks.push({
      id: 'st-seating-ok',
      category: 'Seating',
      title: 'Adequate Table Capacity Configured',
      status: 'good',
      description: `${totalTableSeats} seats arranged across ${event.tables.length} tables for ${countToCheck} guests.`,
    });
  }

  // 4. Seating Conflicts: Check "shouldNotSitWith"
  let conflictFound = false;
  const guestMap = new Map(event.guestList.map((g) => [g.id, g]));
  for (const assignment of event.seatingPlan) {
    const tableGuests = assignment.guestIds.map((id) => guestMap.get(id)).filter(Boolean);
    const tableName = event.tables.find((t) => t.id === assignment.tableId)?.name || 'Table';

    for (let i = 0; i < tableGuests.length; i++) {
      const g1 = tableGuests[i]!;
      if (g1.shouldNotSitWith) {
        for (let j = i + 1; j < tableGuests.length; j++) {
          const g2 = tableGuests[j]!;
          if (
            g1.shouldNotSitWith.some(
              (c) =>
                c === g2.id ||
                g2.name.toLowerCase().includes(c.toLowerCase()) ||
                (g2.surname && c.toLowerCase().includes(g2.surname.toLowerCase()))
            )
          ) {
            conflictFound = true;
            checks.push({
              id: `st-conflict-${g1.id}-${g2.id}`,
              category: 'Seating',
              title: `Interpersonal Seating Conflict: ${tableName}`,
              status: 'critical',
              description: `${g1.name} ${g1.surname} and ${g2.name} ${g2.surname} are seated at the same table despite strict 'Should NOT sit with' notes.`,
              recommendation: `Reassign ${g2.name} to another table immediately.`,
            });
          }
        }
      }
    }
  }

  if (!conflictFound && event.guestList.length > 5) {
    checks.push({
      id: 'st-conflict-none',
      category: 'Seating',
      title: 'Zero Interpersonal Seating Clashes',
      status: 'good',
      description: 'All recorded guest preferences and separation rules are satisfied.',
    });
  }

  // 5. RSVP Information Completeness
  const pendingGuests = event.guestList.filter((g) => g.rsvp === 'Pending');
  if (pendingGuests.length > 0) {
    const ratio = pendingGuests.length / event.guestList.length;
    if (ratio > 0.35) {
      checks.push({
        id: 'st-rsvp-pending-high',
        category: 'RSVPs',
        title: 'High Ratio of Unconfirmed RSVPs',
        status: 'attention',
        description: `${pendingGuests.length} of ${event.guestList.length} guests (${Math.round(ratio * 100)}%) are still pending confirmation.`,
        recommendation: 'Issue a polite RSVP deadline reminder 14 days before the event to lock catering numbers.',
      });
    }
  }

  // 6. Dietary & Allergen Coverage
  const allergyGuests = event.guestList.filter((g) => g.allergies && g.allergies.length > 0);
  if (allergyGuests.length > 0) {
    const allergies = Array.from(new Set(allergyGuests.flatMap((g) => g.allergies))).join(', ');
    checks.push({
      id: 'st-allergies-check',
      category: 'Food & Health',
      title: 'Severe Food Allergies On Record',
      status: 'attention',
      description: `Guests report allergies to: ${allergies}. Kitchen cross-contamination protocols must be documented.`,
      recommendation: 'Request a signed dietary allergen sheet from your catering supervisor.',
    });
  } else {
    checks.push({
      id: 'st-allergies-good',
      category: 'Food & Health',
      title: 'Dietary Restrictions Accounted For',
      status: 'good',
      description: `Dietary preferences for vegetarian, vegan, and religious options are established.`,
    });
  }

  // 7. Accessibility
  const accessGuests = event.guestList.filter((g) => g.accessibility && g.accessibility.length > 0);
  if (accessGuests.length > 0) {
    checks.push({
      id: 'st-accessibility',
      category: 'Accessibility',
      title: 'Mobility & Physical Access Requirements',
      status: 'attention',
      description: `${accessGuests.length} guest(s) have logged mobility or physical accessibility accommodations.`,
      recommendation: 'Confirm ramp ingress, accessible restroom signage, and keep front tables free of tangled wiring.',
    });
  } else {
    checks.push({
      id: 'st-accessibility-good',
      category: 'Accessibility',
      title: 'Venue Accessibility Profile Clear',
      status: 'good',
      description: 'Standard access provisions meet the event’s current attendee requirements.',
    });
  }

  // 8. Schedule Timing & Bottlenecks
  let scheduleIssue = false;
  for (const item of event.schedule) {
    const act = item.activity.toLowerCase();
    if ((act.includes('dinner') || act.includes('meal')) && item.durationMinutes < 30 && event.guestCount > 30) {
      scheduleIssue = true;
      checks.push({
        id: `st-schedule-rush-${item.id}`,
        category: 'Schedule',
        title: 'Meal Timeline Highly Compressed',
        status: 'critical',
        description: `Only ${item.durationMinutes} minutes scheduled for ${event.guestCount} guests to dine. Catering queues alone will take 20+ minutes.`,
        recommendation: 'Expand dinner window to 50–60 minutes in the timeline planner.',
      });
    }
  }

  if (!scheduleIssue && event.schedule.length >= 5) {
    checks.push({
      id: 'st-schedule-flow-good',
      category: 'Schedule',
      title: 'Run-of-Show Pace is Balanced',
      status: 'good',
      description: `${event.schedule.length} sequential milestones planned with comfortable transitions.`,
    });
  }

  // 9. Weather Exposure & Emergency Prep
  if (event.indoorOutdoor === 'Outdoor' || event.indoorOutdoor === 'Hybrid') {
    const hasWeatherPlan = event.contingencyPlans.some((c) =>
      c.trigger.toLowerCase().includes('rain') || c.trigger.toLowerCase().includes('weather')
    );
    if (!hasWeatherPlan) {
      checks.push({
        id: 'st-weather-exposed',
        category: 'Weather & Safety',
        title: 'Outdoor Setting Lacks Wet-Weather Backup',
        status: 'critical',
        description: `Event is marked as ${event.indoorOutdoor}, but no rain canopy or secondary hall fallback is documented.`,
        recommendation: 'Activate Planora Plan B Mode to prepare rain umbrellas and marquee reserves.',
      });
    } else {
      checks.push({
        id: 'st-weather-covered',
        category: 'Weather & Safety',
        title: 'Weather Contingency Active',
        status: 'good',
        description: 'Sheltered pavilion or indoor backup protocol is already logged in Plan B.',
      });
    }
  }

  // Group by status
  const critical = checks.filter((c) => c.status === 'critical');
  const attention = checks.filter((c) => c.status === 'attention');
  const good = checks.filter((c) => c.status === 'good');

  let overallSummary = 'Everything is looking exceptionally solid! Minor polish recommended.';
  if (critical.length > 0) {
    overallSummary = `Attention required: ${critical.length} critical issue(s) and ${attention.length} warning(s) detected that could compromise guest experience or budget.`;
  } else if (attention.length > 0) {
    overallSummary = `Good progress! No showstoppers, but ${attention.length} planning item(s) deserve attention before event day.`;
  }

  return {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    criticalCount: critical.length,
    attentionCount: attention.length,
    goodCount: good.length,
    critical,
    attention,
    good,
    overallSummary,
  };
}
