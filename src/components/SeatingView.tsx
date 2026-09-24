import React, { useState } from 'react';
import { EventData, Table, TableShape, Guest } from '../types/event';
import { autoArrangeSeating, moveGuestToTable } from '../services/seatingEngine';
import { Table as TableIcon, Users, Lock, Unlock, Sparkles, AlertTriangle, Plus, RefreshCw, UserCheck, ShieldAlert, X } from 'lucide-react';

interface SeatingViewProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
}

export const SeatingView: React.FC<SeatingViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedTableShape, setSelectedTableShape] = useState<TableShape>('Round');
  const [seatsPerTable, setSeatsPerTable] = useState<number>(10);
  const [conflictAlerts, setConflictAlerts] = useState<string[]>([]);
  const [infoNotes, setInfoNotes] = useState<string[]>([]);
  const [selectedGuestToMove, setSelectedGuestToMove] = useState<Guest | null>(null);

  const totalSeats = event.tables.reduce((acc, t) => acc + t.capacity, 0);
  const totalGuests = event.guestList.length;
  const seatedGuestIds = new Set(event.seatingPlan.flatMap((p) => p.guestIds));
  const unseatedGuests = event.guestList.filter((g) => !seatedGuestIds.has(g.id));

  // Run AI Auto-Arrange
  const handleAutoArrange = () => {
    const result = autoArrangeSeating(event);
    setConflictAlerts(result.conflicts);
    setInfoNotes(result.notes);

    onUpdateEvent({
      ...event,
      seatingPlan: result.seatingPlan,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Toggle Table Lock
  const handleToggleLock = (tableId: string) => {
    const updatedTables = event.tables.map((t) =>
      t.id === tableId ? { ...t, isLocked: !t.isLocked } : t
    );
    onUpdateEvent({
      ...event,
      tables: updatedTables,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Add Table
  const handleAddTable = () => {
    const newNumber = event.tables.length + 1;
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: `Table ${newNumber}`,
      capacity: seatsPerTable,
      shape: selectedTableShape,
      isLocked: false,
    };
    onUpdateEvent({
      ...event,
      tables: [...event.tables, newTable],
      seatingPlan: [...event.seatingPlan, { tableId: newTable.id, guestIds: [] }],
      lastUpdated: new Date().toISOString(),
    });
  };

  // Move Guest
  const handleMoveGuest = (targetTableId: string | null) => {
    if (!selectedGuestToMove) return;
    const { updatedEvent, conflictWarning } = moveGuestToTable(event, selectedGuestToMove.id, targetTableId);
    if (conflictWarning) {
      setConflictAlerts([conflictWarning]);
    } else {
      setConflictAlerts([]);
    }
    onUpdateEvent(updatedEvent);
    setSelectedGuestToMove(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-purple-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Harmonious Social Seating Algorithm
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              AI Seating Planner & Floor Chart
            </h2>
            <p className="text-xs text-purple-200 mt-1">
              Automatically places couples, friends, and VIPs together while strictly respecting separation rules.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAutoArrange}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto Arrange Guests</span>
            </button>
            <button
              onClick={handleAddTable}
              className="px-3.5 py-2.5 bg-purple-800 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl border border-purple-600 flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Table</span>
            </button>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-5 pt-4 border-t border-purple-800/60 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span>
              <strong>{event.tables.length}</strong> Tables
            </span>
            <span>•</span>
            <span className={totalSeats < totalGuests ? 'text-rose-300 font-bold' : 'text-emerald-300'}>
              <strong>{totalSeats}</strong> Total Seats ({totalGuests} Guests Expected)
            </span>
            <span>•</span>
            <span>
              <strong>{unseatedGuests.length}</strong> Unassigned
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[11px] text-purple-200">Default Shape:</label>
            <select
              value={selectedTableShape}
              onChange={(e) => setSelectedTableShape(e.target.value as TableShape)}
              className="py-1 px-2 rounded-lg bg-purple-950 text-white border border-purple-700 text-xs"
            >
              {(['Round', 'Rectangle', 'Square', 'Long banquet', 'Custom'] as TableShape[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conflict / Notes Notifications */}
      {conflictAlerts.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1 text-rose-800">
          <div className="font-bold flex items-center gap-1.5 text-rose-900 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Seating Constraint Notice
          </div>
          {conflictAlerts.map((c, i) => (
            <div key={i}>• {c}</div>
          ))}
        </div>
      )}

      {infoNotes.length > 0 && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{infoNotes.join(' ')}</span>
        </div>
      )}

      {/* Unassigned Guests Shelf (if any) */}
      {unseatedGuests.length > 0 && (
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              Unassigned Guests ({unseatedGuests.length})
            </h3>
            <span className="text-[11px] text-stone-500">Click a guest to assign to a table</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {unseatedGuests.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGuestToMove(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border shrink-0 transition flex items-center gap-1.5 ${
                  selectedGuestToMove?.id === g.id
                    ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                    : 'bg-white text-stone-800 border-stone-300 hover:border-purple-400'
                }`}
              >
                <span>{g.name} {g.surname}</span>
                {g.isVip && <span className="text-[10px] text-amber-500 font-bold">★</span>}
                {g.dietary && g.dietary.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Visual Floor Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {event.tables.map((table) => {
          const assignment = event.seatingPlan.find((p) => p.tableId === table.id);
          const seatedIds = assignment ? assignment.guestIds : [];
          const seatedGuests = seatedIds
            .map((id) => event.guestList.find((g) => g.id === id))
            .filter(Boolean) as Guest[];

          const isOverCapacity = seatedGuests.length > table.capacity;

          return (
            <div
              key={table.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition flex flex-col justify-between ${
                isOverCapacity
                  ? 'border-rose-400 bg-rose-50/20'
                  : table.isLocked
                  ? 'border-purple-300'
                  : 'border-stone-200 hover:border-purple-200 hover:shadow-md'
              }`}
            >
              {/* Table Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-stone-900 text-base">
                      {table.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      {table.shape}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleLock(table.id)}
                    className={`p-1.5 rounded-lg text-xs transition ${
                      table.isLocked
                        ? 'bg-purple-100 text-purple-900 font-semibold'
                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                    }`}
                    title={table.isLocked ? 'Table is locked (safe from auto-arrange)' : 'Lock table'}
                  >
                    {table.isLocked ? <Lock className="w-3.5 h-3.5 text-purple-800" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Capacity Counter */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-3 pb-2 border-b border-stone-100">
                  <span>Occupancy:</span>
                  <span
                    className={`font-mono font-semibold ${
                      isOverCapacity
                        ? 'text-rose-600'
                        : seatedGuests.length === table.capacity
                        ? 'text-emerald-700'
                        : 'text-stone-700'
                    }`}
                  >
                    {seatedGuests.length} / {table.capacity} seats
                  </span>
                </div>

                {/* Seated Guests List */}
                <div className="space-y-1.5 min-h-[140px]">
                  {seatedGuests.length === 0 ? (
                    <div className="text-center py-8 text-xs text-stone-400">
                      Empty table. Auto-arrange or assign guests here.
                    </div>
                  ) : (
                    seatedGuests.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => setSelectedGuestToMove(g)}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                          selectedGuestToMove?.id === g.id
                            ? 'bg-purple-900 text-white border-purple-900'
                            : 'bg-stone-50 border-stone-200 hover:border-purple-300 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-medium truncate">{g.name} {g.surname}</span>
                          {g.isVip && (
                            <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              VIP
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {g.dietary && g.dietary.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title={`Dietary: ${g.dietary.join(', ')}`} />
                          )}
                          {g.allergies && g.allergies.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-rose-500" title={`Allergies: ${g.allergies.join(', ')}`} />
                          )}
                          {g.shouldNotSitWith && g.shouldNotSitWith.length > 0 && (
                            <span className="text-[10px] text-rose-600 font-bold" title="Avoid rule">🚫</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Table Quick Placement Target */}
              {selectedGuestToMove && (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => handleMoveGuest(table.id)}
                    className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-xs rounded-xl border border-purple-200 transition"
                  >
                    Place {selectedGuestToMove.name} here
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Guest Move Modal Float */}
      {selectedGuestToMove && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-4 z-40 animate-in slide-in-from-bottom-5">
          <div className="text-xs">
            Moving: <strong className="text-amber-300">{selectedGuestToMove.name} {selectedGuestToMove.surname}</strong>
          </div>
          <button
            onClick={() => handleMoveGuest(null)}
            className="px-2.5 py-1 text-xs rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            Unseat Guest
          </button>
          <button
            onClick={() => setSelectedGuestToMove(null)}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
