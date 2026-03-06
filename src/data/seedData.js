export const players = [
  { id: 'p1', name: 'Alex Morgan' },
  { id: 'p2', name: 'Jamie Clarke' },
  { id: 'p3', name: 'Riley Singh' },
  { id: 'p4', name: 'Casey Brown' },
  { id: 'p5', name: 'Taylor Green' },
  { id: 'p6', name: 'Jordan Patel' }
];

export const tables = [
  { id: 't1', tableNumber: 1 },
  { id: 't2', tableNumber: 2 },
  { id: 't3', tableNumber: 3 }
];

const today = new Date();
const formatDate = (date) => date.toISOString().slice(0, 10);

const addDays = (days) => {
  const next = new Date(today);
  next.setDate(today.getDate() + days);
  return formatDate(next);
};

export const matches = [
  {
    id: 'm1',
    player1: 'p1',
    player2: 'p2',
    tableNumber: 1,
    round: 'Quarter Final',
    date: formatDate(today),
    startTime: '18:00',
    endTime: '19:30',
    status: 'Scheduled'
  },
  {
    id: 'm2',
    player1: 'p3',
    player2: 'p4',
    tableNumber: 2,
    round: 'Quarter Final',
    date: formatDate(today),
    startTime: '19:30',
    endTime: '21:00',
    status: 'Scheduled'
  },
  {
    id: 'm3',
    player1: 'p5',
    player2: 'p6',
    tableNumber: 1,
    round: 'Semi Final',
    date: addDays(1),
    startTime: '18:30',
    endTime: '20:00',
    status: 'Scheduled'
  }
];

export const openingHours = [
  { dayOfWeek: 0, isOpen: false, openTime: '10:00', closeTime: '22:00' },
  { dayOfWeek: 1, isOpen: true, openTime: '16:00', closeTime: '22:30' },
  { dayOfWeek: 2, isOpen: true, openTime: '16:00', closeTime: '22:30' },
  { dayOfWeek: 3, isOpen: true, openTime: '16:00', closeTime: '22:30' },
  { dayOfWeek: 4, isOpen: true, openTime: '16:00', closeTime: '22:30' },
  { dayOfWeek: 5, isOpen: true, openTime: '14:00', closeTime: '23:00' },
  { dayOfWeek: 6, isOpen: true, openTime: '12:00', closeTime: '23:00' }
];
