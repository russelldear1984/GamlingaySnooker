import { dayLabels } from '../utils/dateUtils';
import { useApp } from '../context/AppContext';

export const AdminOpeningHoursPage = () => {
  const { openingHours, updateOpeningHour } = useApp();

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">Club Opening Hours</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Open</th>
                <th className="px-4 py-3">Opening time</th>
                <th className="px-4 py-3">Closing time</th>
              </tr>
            </thead>
            <tbody>
              {openingHours.map((day) => (
                <tr key={day.dayOfWeek} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-slate-200">{dayLabels[day.dayOfWeek]}</td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={day.isOpen}
                      onChange={(e) => updateOpeningHour(day.dayOfWeek, { isOpen: e.target.checked })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="field mt-0"
                      type="time"
                      value={day.openTime}
                      disabled={!day.isOpen}
                      onChange={(e) => updateOpeningHour(day.dayOfWeek, { openTime: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="field mt-0"
                      type="time"
                      value={day.closeTime}
                      disabled={!day.isOpen}
                      onChange={(e) => updateOpeningHour(day.dayOfWeek, { closeTime: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
