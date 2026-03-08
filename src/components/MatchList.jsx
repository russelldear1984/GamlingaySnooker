import { isToday } from '../utils/dateUtils';

const hasScore = (match) =>
  match.player1Score !== null &&
  match.player1Score !== undefined &&
  match.player1Score !== '' &&
  match.player2Score !== null &&
  match.player2Score !== undefined &&
  match.player2Score !== '';

export const MatchList = ({ matches, playersById }) => {
  if (!matches.length) {
    return (
      <div className="card p-8 text-center text-slate-300">
        <p className="text-lg font-semibold">No matches scheduled yet</p>
        <p className="mt-2 text-sm text-slate-400">Admins can add matches from the booking management panel.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {matches.map((match) => {
        const today = isToday(match.date);
        return (
          <article
            key={match.id}
            className={`card p-4 md:p-5 ${today ? 'border-teal-400/70 ring-1 ring-teal-400/40' : ''}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">{match.round}</p>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                {today ? "Today's Match" : match.status}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-white md:text-xl">
              {playersById[match.player1]?.name} vs {playersById[match.player2]?.name}
            </h3>
            {hasScore(match) && (
              <p className="mt-2 text-sm font-semibold text-emerald-300">
                Score: {match.player1Score} - {match.player2Score}
              </p>
            )}
            <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
              <p>📅 {match.date}</p>
              <p>🕒 {match.startTime} - {match.endTime}</p>
              <p>🎱 Table {match.tableNumber}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
};
