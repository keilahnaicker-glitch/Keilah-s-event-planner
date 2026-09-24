import React, { useState } from 'react';
import { EventData, BudgetItem, BudgetCategory } from '../types/event';
import { calculateBudgetRebalancing, applyBudgetRebalance } from '../services/budgetRebalancer';
import { DollarSign, Plus, Trash2, Edit, AlertTriangle, Sparkles, Check, X, ShieldAlert, ArrowDown, ArrowUp } from 'lucide-react';

interface BudgetViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

const CATEGORIES: BudgetCategory[] = [
  'Venue',
  'Food',
  'Drinks',
  'Cake',
  'Décor',
  'Entertainment',
  'Photography',
  'Videography',
  'Invitations',
  'Transport',
  'Gifts',
  'Party favours',
  'Clothing',
  'Equipment',
  'Staff',
  'Emergency fund',
  'Other',
];

export const BudgetView: React.FC<BudgetViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);

  const [formData, setFormData] = useState<Partial<BudgetItem>>({
    category: 'Venue',
    name: '',
    plannedCost: 0,
    actualCost: 0,
    notes: '',
  });

  // Calculate totals
  const totalBudget = event.budget;
  const totalPlanned = event.budgetItems.reduce((acc, b) => acc + b.plannedCost, 0);
  const totalActual = event.budgetItems.reduce((acc, b) => acc + (b.actualCost > 0 ? b.actualCost : b.plannedCost), 0);
  const remainingBudget = totalBudget - totalActual;
  const percentUsed = Math.round((totalActual / (totalBudget || 1)) * 100);

  // Rebalance Plan calculation
  const rebalancePlan = calculateBudgetRebalancing(event);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      category: 'Décor',
      name: '',
      plannedCost: 500,
      actualCost: 0,
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: BudgetItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = event.budgetItems.filter((b) => b.id !== id);
    onUpdateEvent({ ...event, budgetItems: updated, lastUpdated: new Date().toISOString() });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    let updated: BudgetItem[];
    if (editingItem) {
      updated = event.budgetItems.map((b) =>
        b.id === editingItem.id ? ({ ...b, ...formData } as BudgetItem) : b
      );
    } else {
      const newItem: BudgetItem = {
        id: `b-${Date.now()}`,
        category: (formData.category || 'Other') as BudgetCategory,
        name: formData.name.trim(),
        plannedCost: formData.plannedCost || 0,
        actualCost: formData.actualCost || 0,
        notes: formData.notes || '',
      };
      updated = [...event.budgetItems, newItem];
    }

    onUpdateEvent({ ...event, budgetItems: updated, lastUpdated: new Date().toISOString() });
    setModalOpen(false);
  };

  const handleApplyRebalance = () => {
    const updated = applyBudgetRebalance(event, rebalancePlan.suggestions);
    onUpdateEvent(updated);
    setShowRebalanceModal(false);
  };

  const filteredItems = event.budgetItems.filter(
    (b) => selectedCategory === 'all' || b.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header & Financial Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Budget Planner & Financial Control
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Track authorized spending limits, actual invoices, and trigger smart rebalancing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {rebalancePlan.isOverBudget || rebalancePlan.suggestions.length > 0 ? (
            <button
              onClick={() => setShowRebalanceModal(true)}
              className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Rebalance Suggested</span>
            </button>
          ) : (
            <button
              onClick={() => setShowRebalanceModal(true)}
              className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Rebalance Simulator</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4 text-purple-300" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Budget Cap</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {event.currency} {totalBudget.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Planned Allocations</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {event.currency} {totalPlanned.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Actual / Committed</span>
          <div className="text-xl font-bold font-mono text-purple-950 mt-1">
            {event.currency} {totalActual.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Remaining Balance</span>
          <div
            className={`text-xl font-bold font-mono mt-1 ${
              remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {event.currency} {remainingBudget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Overrun Warning Notice */}
      {rebalancePlan.isOverBudget && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold text-rose-950">
                Warning: Total spending exceeds authorized budget by {event.currency} {rebalancePlan.overrunAmount.toLocaleString()}
              </strong>
              <span>
                Planora never pretends there is enough money when there is not. Engage Smart Budget Rebalancing to safely absorb the deficit across flexible categories.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowRebalanceModal(true)}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shrink-0"
          >
            Review Cuts
          </button>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          All Items ({event.budgetItems.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-purple-900 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Budget Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Category & Item</th>
                <th className="py-3 px-4">Planned Cost</th>
                <th className="py-3 px-4">Actual Cost</th>
                <th className="py-3 px-4">Variance</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    No budget items in this category. Click "Add Expense" to record one.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const effective = item.actualCost > 0 ? item.actualCost : item.plannedCost;
                  const diff = item.actualCost > 0 ? item.actualCost - item.plannedCost : 0;

                  return (
                    <tr key={item.id} className="hover:bg-purple-50/20 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{item.name}</div>
                        <span className="text-[10px] text-stone-400">{item.category}</span>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium">
                        {event.currency} {item.plannedCost.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold">
                        {item.actualCost > 0 ? (
                          <span className={item.actualCost > item.plannedCost ? 'text-rose-600' : 'text-stone-900'}>
                            {event.currency} {item.actualCost.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-stone-400">Pending</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        {diff > 0 ? (
                          <span className="text-rose-600 font-semibold">+{event.currency} {diff.toLocaleString()}</span>
                        ) : diff < 0 ? (
                          <span className="text-emerald-600 font-semibold">-{event.currency} {Math.abs(diff).toLocaleString()}</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                        {item.notes || '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-stone-500 hover:text-purple-900 rounded-lg hover:bg-stone-100"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Budget Rebalancing Modal */}
      {showRebalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-950 to-stone-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                  Intelligent Cost Absorption
                </span>
                <h3 className="font-serif font-bold text-xl">
                  Planora Smart Budget Rebalancer
                </h3>
              </div>
              <button onClick={() => setShowRebalanceModal(false)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Budget</span>
                    <span className="font-mono text-base font-bold text-stone-900">
                      {event.currency} {rebalancePlan.totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Current Projected</span>
                    <span className="font-mono text-base font-bold text-purple-950">
                      {event.currency} {Math.max(rebalancePlan.totalPlanned, rebalancePlan.totalActual).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Discrepancy</span>
                    <span
                      className={`font-mono text-base font-bold ${
                        rebalancePlan.overrunAmount > 0 ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {rebalancePlan.overrunAmount > 0 ? `+${event.currency} ${rebalancePlan.overrunAmount.toLocaleString()}` : 'Balanced'}
                    </span>
                  </div>
                </div>
              </div>

              {rebalancePlan.suggestions.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Recommended Category Adjustments
                  </h4>
                  <div className="space-y-2">
                    {rebalancePlan.suggestions.map((s, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                        <div>
                          <div className="font-semibold text-stone-900">{s.itemName}</div>
                          <div className="text-[11px] text-stone-500">{s.reason}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-rose-600">
                            {s.delta} {event.currency}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {event.currency} {s.originalPlanned} → {s.suggestedPlanned}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-stone-500">
                  Your budget is currently within limits! No urgent cuts are necessary.
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowRebalanceModal(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-xl"
              >
                Cancel
              </button>

              {rebalancePlan.suggestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyRebalance}
                  className="px-5 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Check className="w-4 h-4 text-purple-200" />
                  <span>Apply Rebalance</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-purple-100 overflow-hidden">
            <div className="bg-purple-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">
                {editingItem ? 'Edit Expense Item' : 'Add New Expense Item'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as BudgetCategory })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Expense Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Centerpiece Florals & Votive Candles"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Planned Cost ({event.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.plannedCost}
                    onChange={(e) => setFormData({ ...formData, plannedCost: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Actual Invoiced ({event.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.actualCost}
                    onChange={(e) => setFormData({ ...formData, actualCost: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Notes / Vendor details</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
