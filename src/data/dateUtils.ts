function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntil(isoDate: string, today: Date = new Date()): number {
  const target = startOfDay(new Date(isoDate));
  const base = startOfDay(today);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - base.getTime()) / msPerDay);
}

export function isToday(isoDate: string, today: Date = new Date()): boolean {
  return daysUntil(isoDate, today) === 0;
}

export function isThisWeek(isoDate: string, today: Date = new Date()): boolean {
  const diff = daysUntil(isoDate, today);
  return diff >= 0 && diff <= 6;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
