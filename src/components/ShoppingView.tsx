import React, { useState } from 'react';
import { EventData, ShoppingItem, ShoppingCategory } from '../types/event';
import { ShoppingBag, Check, Plus, Trash2, Edit, AlertCircle, Sparkles, Filter, X } from 'lucide-react';

interface ShoppingViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

const CATEGORIES: ShoppingCategory[] = [
  'Food',
  'Drinks',
  'Décor',
  'Tableware',
  'Serving items',
  'Cleaning supplies',
  'Cake/dessert',
  'Emergency supplies',
  'Stationery',
  'Signage',
  'Party favours',
  'Miscellaneous',
];

export const ShoppingView: React.FC<ShoppingViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const [formData, setFormData] = useState<Partial<ShoppingItem>>({
    item: '',
    category: 'Food',
    quantity: '1',
    estimatedCost: 100,
    purchased: false,
    notes: '',
  });

  const totalItems = event.shoppingList.length;
  const purchasedItems = event.shoppingList.filter((s) => s.purchased).length;
  const totalEstimatedCost = event.shoppingList.reduce((acc, s) => acc + (s.estimatedCost || 0), 0);

  const handleTogglePurchased = (id: string) => {
    const updated = event.shoppingList.map((s) =>
      s.id === id ? { ...s, purchased: !s.purchased } : s
    );
    onUpdateEvent({ ...event, shoppingList: updated, lastUpdated: new Date().toISOString() });
  };

  const handleDelete = (id: string) => {
    const updated = event.shoppingList.filter((s) => s.id !== id);
    onUpdateEvent({ ...event, shoppingList: updated, lastUpdated: new Date().toISOString() });
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      item: '',
      category: 'Food',
      quantity: '1 pack',
      estimatedCost: 150,
      purchased: false,
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item?.trim()) return;

    let updated: ShoppingItem[];
    if (editingItem) {
      updated = event.shoppingList.map((s) =>
        s.id === editingItem.id ? ({ ...s, ...formData } as ShoppingItem) : s
      );
    } else {
      const newItem: ShoppingItem = {
        id: `shop-${Date.now()}`,
        item: formData.item.trim(),
        category: (formData.category || 'Miscellaneous') as ShoppingCategory,
        quantity: formData.quantity || '1',
        estimatedCost: formData.estimatedCost || 0,
        purchased: Boolean(formData.purchased),
        notes: formData.notes || '',
      };
      updated = [...event.shoppingList, newItem];
    }

    onUpdateEvent({ ...event, shoppingList: updated, lastUpdated: new Date().toISOString() });
    setModalOpen(false);
  };

  const filteredItems = event.shoppingList.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header and Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-900 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4 text-purple-700" />
              Event Inventory & Shopping List
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Procurement & Checklist
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">
              Synchronized to your {event.guestCount} guest headcount. Changes to attendees or menu dynamically scale recommended purchasing volumes.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs self-start sm:self-center"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Add Shopping Item</span>
          </button>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Items</span>
            <span className="font-bold text-base text-stone-900 mt-0.5 block">{totalItems} items</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Purchased / Secured</span>
            <span className="font-bold text-base text-emerald-600 mt-0.5 block">
              {purchasedItems} / {totalItems} ({totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0}%)
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Remaining to Buy</span>
            <span className="font-bold text-base text-amber-600 mt-0.5 block">
              {totalItems - purchasedItems} items
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Estimated Cost</span>
            <span className="font-bold text-base text-purple-900 mt-0.5 block font-mono">
              {event.currency} {totalEstimatedCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-purple-900 text-white font-semibold shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Items ({event.shoppingList.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = event.shoppingList.filter((s) => s.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-purple-900 text-white font-semibold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Items Table/Cards */}
        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              No shopping items found in this category. Click &quot;Add Shopping Item&quot; to include supplies.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  item.purchased
                    ? 'bg-stone-50/80 border-stone-200'
                    : 'bg-white border-stone-200 hover:border-purple-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePurchased(item.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer ${
                      item.purchased
                        ? 'bg-purple-900 border-purple-900 text-white'
                        : 'border-stone-300 hover:border-purple-600 bg-white'
                    }`}
                  >
                    {item.purchased && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className={`text-xs font-semibold ${item.purchased ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                      {item.item}
                    </div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-purple-900 font-medium">Qty: {item.quantity}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                      {item.notes && (
                        <>
                          <span>•</span>
                          <span>{item.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-stone-800">
                    {event.currency} {(item.estimatedCost || 0).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-stone-400 hover:text-purple-900 rounded-lg hover:bg-stone-100"
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-purple-100 overflow-hidden">
            <div className="bg-purple-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">
                {editingItem ? 'Edit Supply Item' : 'Add New Supply Item'}
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
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ShoppingCategory })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy-Duty Clear Beverage Cups (300ml)"
                  value={formData.item || ''}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 150 units"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Est. Cost ({event.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedCost || 0}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Notes / Store location</label>
                <input
                  type="text"
                  value={formData.notes || ''}
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
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
