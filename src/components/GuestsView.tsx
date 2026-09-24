import React, { useState } from 'react';
import { EventData, Guest, GuestCategory, RSVPStatus, AgeGroup } from '../types/event';
import { Users, UserPlus, Search, Filter, ShieldCheck, Heart, AlertCircle, Edit, Trash2, CheckCircle2, XCircle, Clock, Plus, X } from 'lucide-react';

interface GuestsViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

const CATEGORIES: GuestCategory[] = [
  'Family',
  'Friends',
  'Work',
  'Church',
  'School/University',
  'VIP',
  'Children',
  'Other',
];

export const GuestsView: React.FC<GuestsViewProps> = ({ event, onUpdateEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRsvp, setFilterRsvp] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Guest>>({
    name: '',
    surname: '',
    category: 'Friends',
    rsvp: 'Invited',
    ageGroup: 'Adult',
    isVip: false,
    dietary: [],
    allergies: [],
    accessibility: [],
    mustSitWith: [],
    shouldNotSitWith: [],
    notes: '',
  });

  const openAddModal = () => {
    setEditingGuest(null);
    setFormData({
      name: '',
      surname: '',
      category: 'Friends',
      rsvp: 'Invited',
      ageGroup: 'Adult',
      isVip: false,
      dietary: [],
      allergies: [],
      accessibility: [],
      mustSitWith: [],
      shouldNotSitWith: [],
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({ ...guest });
    setModalOpen(true);
  };

  const handleDeleteGuest = (id: string) => {
    const updatedList = event.guestList.filter((g) => g.id !== id);
    // Also remove from seating plan
    const updatedPlan = event.seatingPlan.map((p) => ({
      ...p,
      guestIds: p.guestIds.filter((gid) => gid !== id),
    }));
    onUpdateEvent({
      ...event,
      guestList: updatedList,
      seatingPlan: updatedPlan,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    let updatedList: Guest[];
    if (editingGuest) {
      updatedList = event.guestList.map((g) =>
        g.id === editingGuest.id
          ? ({ ...g, ...formData } as Guest)
          : g
      );
    } else {
      const newGuest: Guest = {
        id: `guest-${Date.now()}`,
        name: formData.name.trim(),
        surname: formData.surname?.trim() || '',
        category: formData.category || 'Friends',
        rsvp: formData.rsvp || 'Invited',
        plusOne: Boolean(formData.plusOne),
        ageGroup: formData.ageGroup || 'Adult',
        isVip: Boolean(formData.isVip),
        dietary: formData.dietary || [],
        allergies: formData.allergies || [],
        accessibility: formData.accessibility || [],
        mustSitWith: formData.mustSitWith || [],
        shouldNotSitWith: formData.shouldNotSitWith || [],
        notes: formData.notes || '',
      };
      updatedList = [...event.guestList, newGuest];
    }

    onUpdateEvent({
      ...event,
      guestList: updatedList,
      lastUpdated: new Date().toISOString(),
    });
    setModalOpen(false);
  };

  // Metrics
  const totalInvited = event.guestList.length;
  const confirmed = event.guestList.filter((g) => g.rsvp === 'Confirmed').length;
  const declined = event.guestList.filter((g) => g.rsvp === 'Declined').length;
  const pending = event.guestList.filter((g) => g.rsvp === 'Pending' || g.rsvp === 'Invited').length;
  const adults = event.guestList.filter((g) => g.ageGroup === 'Adult' || g.ageGroup === 'Elderly').length;
  const children = event.guestList.filter((g) => g.ageGroup === 'Child').length;
  const dietaryCount = event.guestList.filter((g) => (g.dietary && g.dietary.length > 0) || (g.allergies && g.allergies.length > 0)).length;
  const accessCount = event.guestList.filter((g) => g.accessibility && g.accessibility.length > 0).length;

  // Filtered List
  const filteredGuests = event.guestList.filter((g) => {
    const fullName = `${g.name} ${g.surname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesRsvp = filterRsvp === 'all' || g.rsvp === filterRsvp;
    const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
    return matchesSearch && matchesRsvp && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Guest List & Care Registry
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage invitations, RSVPs, dietary needs, accessibility, and seating rules.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
        >
          <UserPlus className="w-4 h-4 text-purple-300" />
          <span>Add New Guest</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-stone-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">Total Listed</div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">{totalInvited}</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-emerald-600">Confirmed</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">{confirmed}</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-amber-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-amber-600">Pending</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">{pending}</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-rose-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-rose-500">Declined</div>
          <div className="text-lg font-bold text-rose-600 mt-0.5">{declined}</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-stone-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">Adults</div>
          <div className="text-lg font-bold text-stone-700 mt-0.5">{adults}</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-stone-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">Children</div>
          <div className="text-lg font-bold text-stone-700 mt-0.5">{children}</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-stone-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-purple-700">Dietary Needs</div>
          <div className="text-lg font-bold text-purple-900 mt-0.5">{dietaryCount}</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-stone-200 text-center shadow-xs">
          <div className="text-[10px] uppercase font-bold text-blue-700">Accessibility</div>
          <div className="text-lg font-bold text-blue-900 mt-0.5">{accessCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by guest name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400">RSVP:</span>
            <select
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-stone-200 text-xs bg-stone-50 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Invited">Invited</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-stone-200 text-xs bg-stone-50 font-medium"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">Age / VIP</th>
                <th className="py-3 px-4">Dietary & Allergies</th>
                <th className="py-3 px-4">Seating Rules</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No guests found. Click "Add New Guest" to begin populating your registry.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const tableAssignment = event.seatingPlan.find((p) => p.guestIds.includes(guest.id));
                  const tableName = tableAssignment
                    ? event.tables.find((t) => t.id === tableAssignment.tableId)?.name
                    : 'Unassigned';

                  return (
                    <tr key={guest.id} className="hover:bg-purple-50/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{guest.name} {guest.surname}</div>
                        <div className="text-[11px] text-stone-400">{tableName}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                          {guest.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            guest.rsvp === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : guest.rsvp === 'Declined'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {guest.rsvp}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-stone-600">{guest.ageGroup}</span>
                          {guest.isVip && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              VIP
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="max-w-xs space-y-0.5">
                          {guest.dietary && guest.dietary.length > 0 && (
                            <div className="text-purple-900 font-medium truncate">
                              {guest.dietary.join(', ')}
                            </div>
                          )}
                          {guest.allergies && guest.allergies.length > 0 && (
                            <div className="text-rose-700 font-semibold truncate">
                              ⚠️ Allergies: {guest.allergies.join(', ')}
                            </div>
                          )}
                          {(!guest.dietary || guest.dietary.length === 0) && (!guest.allergies || guest.allergies.length === 0) && (
                            <span className="text-stone-400">Standard</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="max-w-xs text-[11px] space-y-0.5">
                          {guest.mustSitWith && guest.mustSitWith.length > 0 && (
                            <div className="text-emerald-700 truncate">
                              💚 Must sit with: {guest.mustSitWith.join(', ')}
                            </div>
                          )}
                          {guest.shouldNotSitWith && guest.shouldNotSitWith.length > 0 && (
                            <div className="text-rose-700 font-bold truncate">
                              🚫 Avoid: {guest.shouldNotSitWith.join(', ')}
                            </div>
                          )}
                          {(!guest.mustSitWith || guest.mustSitWith.length === 0) && (!guest.shouldNotSitWith || guest.shouldNotSitWith.length === 0) && (
                            <span className="text-stone-400">Flexible</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(guest)}
                            className="p-1.5 text-stone-500 hover:text-purple-900 hover:bg-stone-100 rounded-lg transition"
                            title="Edit Guest"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Guest"
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

      {/* Add / Edit Guest Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-950 to-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingGuest ? 'Edit Guest Profile' : 'Add New Guest'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Surname</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as GuestCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">RSVP Status</label>
                  <select
                    value={formData.rsvp}
                    onChange={(e) => setFormData({ ...formData, rsvp: e.target.value as RSVPStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Invited">Invited</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Age Group</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                    <option value="Teen">Teen</option>
                    <option value="Elderly">Elderly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVip"
                  checked={formData.isVip}
                  onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                  className="rounded-md text-purple-600"
                />
                <label htmlFor="isVip" className="font-semibold text-stone-800">
                  Mark as VIP Guest (Priority placement at Head / Main tables)
                </label>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Dietary Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Halal, Gluten-free (comma separated)"
                  value={formData.dietary?.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietary: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-rose-700 mb-1">Severe Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Shellfish, Latex (comma separated)"
                  value={formData.allergies?.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 focus:ring-rose-500"
                />
              </div>

              {/* Seating Harmony Rules */}
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2">
                <div className="font-bold text-purple-950 uppercase tracking-wider text-[10px]">
                  AI Seating Harmony Rules
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Must Sit With (Partner / Family)</label>
                  <input
                    type="text"
                    placeholder="Guest name or ID"
                    value={formData.mustSitWith?.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mustSitWith: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-rose-800 mb-1">
                    Should NOT Sit With (Strict Separation)
                  </label>
                  <input
                    type="text"
                    placeholder="Guest name or ID (Will NEVER be seated at same table)"
                    value={formData.shouldNotSitWith?.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shouldNotSitWith: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-rose-300 bg-white text-rose-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
