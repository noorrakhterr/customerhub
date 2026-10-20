function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateOnlyIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntil(isoDate: string, today: Date = new Date()): number {
  const target = parseLocalDate(isoDate);
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

export function isOverdue(isoDate: string, today: Date = new Date()): boolean {
  return daysUntil(isoDate, today) < 0;
}

export function formatDate(isoDate: string): string {
  return parseLocalDate(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDueDate(isoDate: string, today: Date = new Date()): string {
  const diff = daysUntil(isoDate, today);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return formatDate(isoDate);
}
