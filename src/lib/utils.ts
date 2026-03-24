/**
 * Merges class names, filtering out falsy values.
 * Simple implementation without clsx/tailwind-merge.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a number as currency.
 * @param value - The numeric value to format
 * @param locale - BCP 47 locale string (default: "pt-BR")
 * @param currency - ISO 4217 currency code (default: "BRL")
 */
export function formatCurrency(
  value: number,
  locale: string = "pt-BR",
  currency: string = "BRL"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formats a date string (YYYY-MM-DD) to a localized display format.
 * @param date - Date string in YYYY-MM-DD format
 * @param locale - BCP 47 locale string (default: "pt-BR")
 */
export function formatDate(date: string, locale: string = "pt-BR"): string {
  // Parse as local date to avoid timezone offset issues
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formats a time string (HH:MM) for display.
 * @param time - Time string in HH:MM format
 */
export function formatTime(time: string): string {
  return time;
}


export function buildGoogleCalendarUrl(
  title: string,
  date: string,
  time: string,
  durationMinutes: number,
  description?: string,
  location?: string
): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  const fmt = (d: Date) =>
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    "T" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    "00";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });

  if (description) params.set("details", description);
  if (location) params.set("location", location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
