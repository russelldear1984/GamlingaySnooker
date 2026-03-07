import { toDateTime } from './dateUtils';

export const validateMatch = ({ draft, openingHours, matches, editMatchId }) => {
  const required = ['player1', 'player2', 'tableNumber', 'round', 'date', 'startTime', 'endTime'];
  for (const key of required) {
    if (!draft[key]) return `${label(key)} is required.`;
  }

  if (draft.player1 === draft.player2) {
    return 'Players must be different.';
  }

  const hasP1Score = draft.player1Score !== undefined && draft.player1Score !== null && draft.player1Score !== '';
  const hasP2Score = draft.player2Score !== undefined && draft.player2Score !== null && draft.player2Score !== '';

  if (hasP1Score !== hasP2Score) {
    return 'Enter both scores or leave both empty.';
  }

  if (hasP1Score && (!Number.isInteger(Number(draft.player1Score)) || Number(draft.player1Score) < 0)) {
    return 'Player 1 score must be a whole number 0 or higher.';
  }

  if (hasP2Score && (!Number.isInteger(Number(draft.player2Score)) || Number(draft.player2Score) < 0)) {
    return 'Player 2 score must be a whole number 0 or higher.';
  }

  const start = toDateTime(draft.date, draft.startTime);
  const end = toDateTime(draft.date, draft.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Please provide valid start and end times.';
  }

  if (end <= start) {
    return 'End time must be after start time.';
  }

  const day = openingHours.find((item) => item.dayOfWeek === start.getDay());

  if (!day?.isOpen) {
    return 'The club is closed on the selected day.';
  }

  const open = toDateTime(draft.date, day.openTime);
  const close = toDateTime(draft.date, day.closeTime);

  if (start < open || end > close) {
    return `Match must be within opening hours (${day.openTime} - ${day.closeTime}).`;
  }

  const conflict = matches.some((match) => {
    if (editMatchId && match.id === editMatchId) return false;
    if (match.date !== draft.date) return false;
    if (String(match.tableNumber) !== String(draft.tableNumber)) return false;

    const existingStart = toDateTime(match.date, match.startTime);
    const existingEnd = toDateTime(match.date, match.endTime);

    return start < existingEnd && end > existingStart;
  });

  if (conflict) {
    return 'This table is already booked at that time.';
  }

  return null;
};

const label = (key) => {
  const map = {
    player1: 'Player 1',
    player2: 'Player 2',
    tableNumber: 'Table',
    round: 'Round',
    date: 'Date',
    startTime: 'Start time',
    endTime: 'End time'
  };
  return map[key] || key;
};
