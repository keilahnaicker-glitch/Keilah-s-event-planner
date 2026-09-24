import { BudgetItem, EventData } from '../types/event';

export interface RebalanceSuggestion {
  category: string;
  itemId: string;
  itemName: string;
  originalPlanned: number;
  suggestedPlanned: number;
  delta: number;
  reason: string;
}

export interface BudgetRebalancePlan {
  totalBudget: number;
  totalPlanned: number;
  totalActual: number;
  overrunAmount: number;
  isOverBudget: boolean;
  warnings: string[];
  suggestions: RebalanceSuggestion[];
  newBalancedPlanned: number;
}

/**
 * Calculates intelligent budget rebalancing suggestions.
 */
export function calculateBudgetRebalancing(event: EventData): BudgetRebalancePlan {
  const totalBudget = event.budget;
  const items = event.budgetItems;

  const totalPlanned = items.reduce((acc, item) => acc + item.plannedCost, 0);
  const totalActual = items.reduce((acc, item) => acc + (item.actualCost > 0 ? item.actualCost : item.plannedCost), 0);

  // Check if actuals or planned exceed the budget
  const effectiveCost = Math.max(totalPlanned, totalActual);
  const overrunAmount = Math.max(0, effectiveCost - totalBudget);
  const isOverBudget = overrunAmount > 0;

  const warnings: string[] = [];
  if (isOverBudget) {
    warnings.push(`Your current plan exceeds your total budget by ${event.currency} ${overrunAmount.toLocaleString()}.`);
  }

  // Identify categories with actual > planned
  const escalatedItems = items.filter((i) => i.actualCost > i.plannedCost);
  const escalatedTotal = escalatedItems.reduce((acc, i) => acc + (i.actualCost - i.plannedCost), 0);

  // We need to absorb the shortfall (either overrunAmount or escalatedTotal)
  const deficitToAbsorb = Math.max(overrunAmount, escalatedTotal);

  const suggestions: RebalanceSuggestion[] = [];

  if (deficitToAbsorb > 0) {
    // Flexible categories that can be safely reduced without ruining the core event
    // Priority for reduction: Party favours, Décor, Miscellaneous, Photography/Videography, Entertainment, Emergency reserve
    const flexibleCategories = [
      'Party favours',
      'Décor',
      'Other',
      'Entertainment',
      'Photography',
      'Videography',
      'Emergency fund',
    ];

    const eligibleItems = items.filter(
      (item) => flexibleCategories.includes(item.category) && item.plannedCost > 100
    );

    const eligibleTotal = eligibleItems.reduce((acc, item) => acc + item.plannedCost, 0);

    if (eligibleTotal === 0) {
      warnings.push('Not enough flexible budget categories remain to absorb the cost increase without cutting venue or food.');
    } else {
      let remainingDeficit = deficitToAbsorb;

      // Distribute proportionally across eligible items, capped at 40% reduction per item
      for (const item of eligibleItems) {
        if (remainingDeficit <= 0) break;

        const maxCut = Math.round(item.plannedCost * 0.45);
        const itemCut = Math.min(maxCut, Math.round((item.plannedCost / eligibleTotal) * deficitToAbsorb));

        if (itemCut > 0) {
          const cut = Math.min(itemCut, remainingDeficit);
          remainingDeficit -= cut;

          let reason = 'Trimmed luxury accents to absorb overspend';
          if (item.category === 'Party favours') reason = 'Simplified guest packaging / favours';
          else if (item.category === 'Décor') reason = 'Optimized floral density & reused stage floral for tables';
          else if (item.category === 'Entertainment') reason = 'Shortened live DJ set by 30 mins or streamlined playlist';
          else if (item.category === 'Photography') reason = 'Standardized package hours while retaining key moments';
          else if (item.category === 'Emergency fund') reason = 'Drawn from contingency cushion';

          suggestions.push({
            category: item.category,
            itemId: item.id,
            itemName: item.name,
            originalPlanned: item.plannedCost,
            suggestedPlanned: item.plannedCost - cut,
            delta: -cut,
            reason,
          });
        }
      }

      if (remainingDeficit > 50) {
        warnings.push(
          `Even after trimming flexible categories, an unabsorbed deficit of ${event.currency} ${Math.round(
            remainingDeficit
          ).toLocaleString()} remains. Consider increasing the total budget or downsizing guest count.`
        );
      }
    }
  }

  const totalDeltas = suggestions.reduce((acc, s) => acc + s.delta, 0);
  const newBalancedPlanned = totalPlanned + totalDeltas;

  return {
    totalBudget,
    totalPlanned,
    totalActual,
    overrunAmount,
    isOverBudget,
    warnings,
    suggestions,
    newBalancedPlanned,
  };
}

/**
 * Applies rebalance suggestions to the event state.
 */
export function applyBudgetRebalance(
  event: EventData,
  suggestions: RebalanceSuggestion[]
): EventData {
  const updated = structuredClone(event);
  const suggestionMap = new Map(suggestions.map((s) => [s.itemId, s]));

  updated.budgetItems = updated.budgetItems.map((item) => {
    const s = suggestionMap.get(item.id);
    if (s) {
      return {
        ...item,
        plannedCost: s.suggestedPlanned,
        notes: item.notes
          ? `${item.notes} [Planora Rebalance: ${s.delta >= 0 ? '+' : ''}${s.delta}]`
          : `[Planora Rebalance: ${s.delta >= 0 ? '+' : ''}${s.delta} - ${s.reason}]`,
      };
    }
    return item;
  });

  updated.lastUpdated = new Date().toISOString();
  return updated;
}
