import { Schedule } from '../types';

export const SCHEDULES: Schedule[] = [
  {
    id: 'sch-01-wd',
    corridor_code: '01',
    direction: 'OUTBOUND',
    departure_time: '06:00:00',
    headway_minutes: 15,
    day_type: 'DAILY',
    is_active: true,
  },
  {
    id: 'sch-02-wd',
    corridor_code: '02',
    direction: 'OUTBOUND',
    departure_time: '06:00:00',
    headway_minutes: 15,
    day_type: 'DAILY',
    is_active: true,
  },
  {
    id: 'sch-03m-wd',
    corridor_code: '03M',
    direction: 'OUTBOUND',
    departure_time: '06:00:00',
    headway_minutes: 15,
    day_type: 'DAILY',
    is_active: true,
  },
  {
    id: 'sch-03y-wd',
    corridor_code: '03Y',
    direction: 'OUTBOUND',
    departure_time: '06:00:00',
    headway_minutes: 15,
    day_type: 'DAILY',
    is_active: true,
  },
  {
    id: 'sch-04-wd',
    corridor_code: '04',
    direction: 'OUTBOUND',
    departure_time: '06:00:00',
    headway_minutes: 15,
    day_type: 'DAILY',
    is_active: true,
  },
];
