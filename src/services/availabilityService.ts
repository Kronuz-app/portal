import type { TimeSlot } from "../lib/types";
import { clientApi } from "../lib/api";

export async function getAvailableSlots(
  professionalId: string | null,
  date: string,
  serviceDuration?: number
): Promise<TimeSlot[]> {
  const params = new URLSearchParams({ date });
  if (professionalId) params.set("professionalId", professionalId);
  if (serviceDuration !== undefined) params.set("serviceDuration", String(serviceDuration));

  const response = await clientApi(`/availability/slots?${params.toString()}`);
  return response.json();
}

export async function getDisabledDates(
  professionalId: string | null,
  startDate?: string,
  endDate?: string
): Promise<string[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (professionalId) params.set("professionalId", professionalId);

  const response = await clientApi(`/availability/disabled-dates?${params.toString()}`);
  return response.json();
}
