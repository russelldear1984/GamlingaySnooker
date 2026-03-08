-- Optional one-time seed for sample data.
-- Run after schema.sql if you want starter records.

insert into public.players (id, name) values
('p1', 'Alex Morgan'),
('p2', 'Jamie Clarke'),
('p3', 'Riley Singh'),
('p4', 'Casey Brown'),
('p5', 'Taylor Green'),
('p6', 'Jordan Patel')
on conflict (id) do nothing;

insert into public.tables (id, table_number) values
('t1', 1),
('t2', 2),
('t3', 3)
on conflict (id) do nothing;

insert into public.opening_hours (day_of_week, is_open, open_time, close_time) values
(0, false, '10:00', '22:00'),
(1, true,  '16:00', '22:30'),
(2, true,  '16:00', '22:30'),
(3, true,  '16:00', '22:30'),
(4, true,  '16:00', '22:30'),
(5, true,  '14:00', '23:00'),
(6, true,  '12:00', '23:00')
on conflict (day_of_week) do nothing;

insert into public.matches (id, player1, player2, table_number, round, date, start_time, end_time, status) values
('m1', 'p1', 'p2', 1, 'Quarter Final', current_date, '18:00', '19:30', 'Scheduled'),
('m2', 'p3', 'p4', 2, 'Quarter Final', current_date, '19:30', '21:00', 'Scheduled'),
('m3', 'p5', 'p6', 1, 'Semi Final', current_date + 1, '18:30', '20:00', 'Scheduled')
on conflict (id) do nothing;
