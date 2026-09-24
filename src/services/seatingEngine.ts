import { EventData, Guest, Table, SeatingAssignment } from '../types/event';

export interface SeatingResult {
  seatingPlan: SeatingAssignment[];
  conflicts: string[];
  notes: string[];
  unassignedGuests: Guest[];
}

/**
 * Intelligent seating optimization algorithm respecting all rules & constraints.
 */
export function autoArrangeSeating(event: EventData): SeatingResult {
  const guests = [...event.guestList];
  const tables = [...event.tables];
  const currentPlan = event.seatingPlan || [];
  const conflicts: string[] = [];
  const notes: string[] = [];

  if (tables.length === 0) {
    return {
      seatingPlan: [],
      conflicts: ['No tables configured. Please add tables before arranging seating.'],
      notes: [],
      unassignedGuests: guests,
    };
  }

  // Preserve locked tables
  const lockedTableIds = new Set(tables.filter((t) => t.isLocked).map((t) => t.id));
  const newPlan: Map<string, string[]> = new Map();
  const assignedGuestIds = new Set<string>();

  for (const table of tables) {
    if (lockedTableIds.has(table.id)) {
      const existing = currentPlan.find((p) => p.tableId === table.id);
      const existingIds = existing ? [...existing.guestIds] : [];
      newPlan.set(table.id, existingIds);
      existingIds.forEach((id) => assignedGuestIds.add(id));
    } else {
      newPlan.set(table.id, []);
    }
  }

  // Filter guests to place (only those not already locked)
  const remainingGuests = guests.filter((g) => !assignedGuestIds.has(g.id));

  // Check overall capacity
  const availableUnlockedSeats = tables
    .filter((t) => !lockedTableIds.has(t.id))
    .reduce((acc, t) => acc + (t.capacity - (newPlan.get(t.id)?.length || 0)), 0);

  if (remainingGuests.length > availableUnlockedSeats) {
    conflicts.push(
      `Table capacity is insufficient (${availableUnlockedSeats} seats available for ${remainingGuests.length} unassigned guests). Add ${Math.ceil(
        (remainingGuests.length - availableUnlockedSeats) / (tables[0]?.capacity || 10)
      )} more table(s) or increase capacity.`
    );
  }

  // Helper: check if placing guest g in tableId violates 'shouldNotSitWith'
  const canPlaceGuest = (g: Guest, tableId: string): { allowed: boolean; reason?: string } => {
    const tableCurrentGuestIds = newPlan.get(tableId) || [];
    const tableGuests = tableCurrentGuestIds.map((id) => guests.find((x) => x.id === id)).filter(Boolean) as Guest[];
    const table = tables.find((t) => t.id === tableId);

    if (table && tableCurrentGuestIds.length >= table.capacity) {
      return { allowed: false, reason: 'Table full' };
    }

    // Check shouldNotSitWith for g
    if (g.shouldNotSitWith && g.shouldNotSitWith.length > 0) {
      for (const forbidden of g.shouldNotSitWith) {
        const forbiddenGuest = tableGuests.find(
          (tg) =>
            tg.id === forbidden ||
            tg.name.toLowerCase().includes(forbidden.toLowerCase()) ||
            (tg.surname && forbidden.toLowerCase().includes(tg.surname.toLowerCase()))
        );
        if (forbiddenGuest) {
          return {
            allowed: false,
            reason: `Guest ${g.name} has a conflict with ${forbiddenGuest.name} who is already at this table.`,
          };
        }
      }
    }

    // Check if any existing guest at the table has shouldNotSitWith that mentions g
    for (const tg of tableGuests) {
      if (tg.shouldNotSitWith && tg.shouldNotSitWith.length > 0) {
        const matchesG = tg.shouldNotSitWith.some(
          (forbidden) =>
            forbidden === g.id ||
            g.name.toLowerCase().includes(forbidden.toLowerCase()) ||
            (g.surname && forbidden.toLowerCase().includes(g.surname.toLowerCase()))
        );
        if (matchesG) {
          return {
            allowed: false,
            reason: `Guest ${tg.name} cannot sit with ${g.name}.`,
          };
        }
      }
    }

    return { allowed: true };
  };

  // Group 1: VIPs and Honorees (prefer Table 1 or Head Table)
  const vips = remainingGuests.filter((g) => g.isVip || g.category === 'VIP');
  // Group 2: Accessibility and Elderly guests (prefer Table 1 / ground level)
  const accessibility = remainingGuests.filter((g) => !vips.includes(g) && ((g.accessibility && g.accessibility.length > 0) || g.ageGroup === 'Elderly'));
  // Group 3: Family
  const family = remainingGuests.filter((g) => !vips.includes(g) && !accessibility.includes(g) && g.category === 'Family');
  // Group 4: Friends
  const friends = remainingGuests.filter((g) => !vips.includes(g) && !accessibility.includes(g) && !family.includes(g) && g.category === 'Friends');
  // Group 5: Others
  const others = remainingGuests.filter((g) => !vips.includes(g) && !accessibility.includes(g) && !family.includes(g) && !friends.includes(g));

  const sortedPlacementQueue = [...vips, ...accessibility, ...family, ...friends, ...others];
  const unassigned: Guest[] = [];

  for (const guest of sortedPlacementQueue) {
    if (assignedGuestIds.has(guest.id)) continue;

    // Check if guest has a 'mustSitWith' friend already seated
    let targetTableId: string | null = null;
    if (guest.mustSitWith && guest.mustSitWith.length > 0) {
      for (const buddyNameOrId of guest.mustSitWith) {
        for (const [tId, seatedIds] of newPlan.entries()) {
          const hasBuddy = seatedIds.some((sId) => {
            const sg = guests.find((x) => x.id === sId);
            return (
              sg &&
              (sg.id === buddyNameOrId ||
                sg.name.toLowerCase().includes(buddyNameOrId.toLowerCase()) ||
                (sg.surname && buddyNameOrId.toLowerCase().includes(sg.surname.toLowerCase())))
            );
          });
          if (hasBuddy) {
            const check = canPlaceGuest(guest, tId);
            if (check.allowed) {
              targetTableId = tId;
              break;
            }
          }
        }
        if (targetTableId) break;
      }
    }

    // If no buddy table found, find best matching table
    if (!targetTableId) {
      // Find unlocked table with space and no conflict
      for (const table of tables) {
        if (lockedTableIds.has(table.id)) continue;
        const check = canPlaceGuest(guest, table.id);
        if (check.allowed) {
          targetTableId = table.id;
          break;
        }
      }
    }

    if (targetTableId) {
      const list = newPlan.get(targetTableId)!;
      list.push(guest.id);
      assignedGuestIds.add(guest.id);
    } else {
      unassigned.push(guest);
      conflicts.push(`Could not automatically place ${guest.name} ${guest.surname} without violating seating rules or capacity limits.`);
    }
  }

  const finalPlan: SeatingAssignment[] = [];
  for (const [tableId, guestIds] of newPlan.entries()) {
    finalPlan.push({ tableId, guestIds });
  }

  notes.push(`Successfully placed ${assignedGuestIds.size} guests across ${tables.length} tables.`);
  if (unassigned.length > 0) {
    notes.push(`${unassigned.length} guest(s) need manual placement.`);
  }

  return {
    seatingPlan: finalPlan,
    conflicts,
    notes,
    unassignedGuests: unassigned,
  };
}

/**
 * Manually moves a guest to a target table and validates any rules.
 */
export function moveGuestToTable(
  event: EventData,
  guestId: string,
  targetTableId: string | null
): { updatedEvent: EventData; conflictWarning?: string } {
  const updated = structuredClone(event);
  const guest = updated.guestList.find((g) => g.id === guestId);

  // Remove guest from any existing table assignment
  updated.seatingPlan = updated.seatingPlan.map((assignment) => ({
    ...assignment,
    guestIds: assignment.guestIds.filter((id) => id !== guestId),
  }));

  let conflictWarning: string | undefined = undefined;

  if (targetTableId && guest) {
    const table = updated.tables.find((t) => t.id === targetTableId);
    let targetAssignment = updated.seatingPlan.find((p) => p.tableId === targetTableId);
    if (!targetAssignment) {
      targetAssignment = { tableId: targetTableId, guestIds: [] };
      updated.seatingPlan.push(targetAssignment);
    }

    // Check capacity
    if (table && targetAssignment.guestIds.length >= table.capacity) {
      conflictWarning = `Notice: ${table.name} capacity (${table.capacity}) is exceeded.`;
    }

    // Check conflict rules
    const existingGuests = targetAssignment.guestIds
      .map((id) => updated.guestList.find((g) => g.id === id))
      .filter(Boolean) as Guest[];

    for (const seated of existingGuests) {
      const gAvoidsSeated = guest.shouldNotSitWith?.some(
        (c) => c === seated.id || seated.name.toLowerCase().includes(c.toLowerCase())
      );
      const seatedAvoidsG = seated.shouldNotSitWith?.some(
        (c) => c === guest.id || guest.name.toLowerCase().includes(c.toLowerCase())
      );
      if (gAvoidsSeated || seatedAvoidsG) {
        conflictWarning = `⚠️ Seating conflict: ${guest.name} and ${seated.name} have a 'Should NOT sit with' rule logged.`;
        break;
      }
    }

    targetAssignment.guestIds.push(guestId);
  }

  updated.lastUpdated = new Date().toISOString();
  return { updatedEvent: updated, conflictWarning };
}
