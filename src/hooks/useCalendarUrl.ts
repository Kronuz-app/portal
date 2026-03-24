import { useMemo } from 'react';
import { buildGoogleCalendarUrl } from '@/lib/utils';
import type { Appointment } from '@/lib/types';

export function useCalendarUrl(
  appointment: Appointment | undefined,
  unitName: string,
  unitAddress?: string | null
): string | null {
  return useMemo(() => {
    if (!appointment) return null;
    const description = `Profissional: ${appointment.professionalName}`;
    return buildGoogleCalendarUrl(
      `${appointment.serviceName} - ${unitName}`,
      appointment.date,
      appointment.time,
      appointment.duration,
      description,
      unitAddress ?? undefined
    );
  }, [appointment, unitName, unitAddress]);
}
