import { useMemo, useState } from 'react';

const defaultDraft = {
  player1: '',
  player2: '',
  tableNumber: '',
  round: '',
  date: '',
  startTime: '',
  endTime: '',
  status: 'Scheduled'
};

export const MatchForm = ({ players, tables, onSubmit, initialValue, submitText = 'Save match' }) => {
  const [draft, setDraft] = useState(initialValue || defaultDraft);
  const [error, setError] = useState('');

  const playerOptions = useMemo(() => players.map((p) => ({ value: p.id, label: p.name })), [players]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const result = await onSubmit(draft);
    setIsSaving(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onSubmit(draft);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError('');
    if (!initialValue) setDraft(defaultDraft);
  };

  const setValue = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form className="card space-y-4 p-4 md:p-6" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold text-white">Match details</h3>
      {error && <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm">Player 1</label>
          <select className="field" value={draft.player1} onChange={(e) => setValue('player1', e.target.value)}>
            <option value="">Select player</option>
            {playerOptions.map((player) => <option key={player.value} value={player.value}>{player.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm">Player 2</label>
          <select className="field" value={draft.player2} onChange={(e) => setValue('player2', e.target.value)}>
            <option value="">Select player</option>
            {playerOptions.map((player) => <option key={player.value} value={player.value}>{player.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm">Table</label>
          <select className="field" value={draft.tableNumber} onChange={(e) => setValue('tableNumber', e.target.value)}>
            <option value="">Select table</option>
            {tables.map((table) => <option key={table.id} value={table.tableNumber}>Table {table.tableNumber}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm">Round</label>
          <input className="field" value={draft.round} onChange={(e) => setValue('round', e.target.value)} placeholder="e.g. Semi Final" />
        </div>
        <div>
          <label className="text-sm">Date</label>
          <input type="date" className="field" value={draft.date} onChange={(e) => setValue('date', e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Status</label>
          <select className="field" value={draft.status} onChange={(e) => setValue('status', e.target.value)}>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Start time</label>
          <input type="time" className="field" value={draft.startTime} onChange={(e) => setValue('startTime', e.target.value)} />
        </div>
        <div>
          <label className="text-sm">End time</label>
          <input type="time" className="field" value={draft.endTime} onChange={(e) => setValue('endTime', e.target.value)} />
        </div>
      </div>
      <button className="btn-primary w-full sm:w-auto" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : submitText}</button>
      <button className="btn-primary w-full sm:w-auto" type="submit">{submitText}</button>
    </form>
  );
};
