import React, { useState } from 'react';
import { EventData, ScheduleItem } from '../types/event';
import { Clock, Plus, Trash2, Edit, AlertTriangle, ArrowUp, ArrowDown, Sparkles, ShieldCheck, Check, X } from 'lucide-react';

interface ScheduleViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ event, onUpdateEvent }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    time: '18:00',
    activity: '',
    durationMinutes: 30,
    responsiblePerson: '',
    notes: '',
  });

  // Check timing sanity
  const warnings: string[] = [];
  event.schedule.forEach((item) => {
    const act = item.activity.toLowerCase();
    if ((act.includes('dinner') || act.includes('meal') || act.includes('buffet')) && item.durationMinutes < 30 && event.guestCount > 30) {
      warnings.push(`Unrealistic timing: "${item.activity}" is allotted only ${item.durationMinutes} minutes for ${event.guestCount} guests. Caterers recommend at least 45–60 minutes.`);
    }
    if (act.includes('speech') && item.durationMinutes > 45) {
      warnings.push(`Pacing advisory: "${item.activity}" exceeds 45 minutes. Long speeches risk losing guest energy.`);
    }
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      time: '19:00',
      activity: '',
      durationMinutes: 30,
      responsiblePerson: 'Host / MC',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = event.schedule.filter((s) => s.id !== id);
    onUpdateEvent({ ...event, schedule: updated, lastUpdated: new Date().toISOString() });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= event.schedule.length) return;

    const list = [...event.schedule];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onUpdateEvent({ ...event, schedule: list, lastUpdated: new Date().toISOString() });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity?.trim()) return;

    let updated: ScheduleItem[];
    if (editingItem) {
      updated = event.schedule.map((s) =>
        s.id === editingItem.id ? ({ ...s, ...formData } as ScheduleItem) : s
      );
    } else {
      const newItem: ScheduleItem = {
        id: `sched-${Date.now()}`,
        time: formData.time || '18:00',
        activity: formData.activity.trim(),
        durationMinutes: formData.durationMinutes || 30,
        responsiblePerson: formData.responsiblePerson || '',
        notes: formData.notes || '',
      };
      updated = [...event.schedule, newItem];
    }

    onUpdateEvent({ ...event, schedule: updated, lastUpdated: new Date().toISOString() });
    setModalOpen(false);
  };

  // Add 10-minute buffer to all items
  const handleAddBuffers = () => {
    const updated = event.schedule.map((s) => ({
      ...s,
      durationMinutes: s.durationMinutes + 5,
    }));
    onUpdateEvent({ ...event, schedule: updated, lastUpdated: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Event Run-of-Show & Timeline
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Synchronize cues, arrival buffers, dining services, speeches, and vendor milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddBuffers}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
          >
            + Add Buffer Time (+5m each)
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4 text-purple-300" />
            <span>Add Timeline Milestone</span>
          </button>
        </div>
      </div>

      {/* Warnings & Sanity Checks */}
      {warnings.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5">
          <div className="font-bold flex items-center gap-2 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Planora Timeline Sanity Check
          </div>
          {warnings.map((w, i) => (
            <div key={i}>• {w}</div>
          ))}
        </div>
      )}

      {/* Timeline Items List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {event.schedule.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No timeline items logged yet. Click "Add Timeline Milestone" to start drafting your run-of-show.
            </div>
          ) : (
            event.schedule.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 hover:bg-purple-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-4">
                  <div className="text-center shrink-0 w-16">
                    <span className="font-mono font-bold text-sm text-purple-950 block">
                      {item.time}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.durationMinutes} mins
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{item.activity}</h4>
                    {item.responsiblePerson && (
                      <span className="text-xs text-purple-800 font-medium block">
                        Lead: {item.responsiblePerson}
                      </span>
                    )}
                    {item.notes && (
                      <p className="text-xs text-stone-500 mt-1">{item.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded-lg hover:bg-stone-100"
                    title="Move earlier"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === event.schedule.length - 1}
                    className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded-lg hover:bg-stone-100"
                    title="Move later"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-stone-500 hover:text-purple-900 rounded-lg hover:bg-stone-100"
                    title="Edit milestone"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
                {editingItem ? 'Edit Milestone' : 'Add Run-of-Show Milestone'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Activity / Cue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Ceremonies Welcome & Honors Speech"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Responsible Person / Lead</label>
                <input
                  type="text"
                  placeholder="e.g. MC, Catering Lead, DJ"
                  value={formData.responsiblePerson}
                  onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">Cues & Operational Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dim main chandelier by 40%, spotlight on podium, sound check completed prior"
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
