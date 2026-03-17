import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useAppointments } from "../hooks/useAppointments";
import { MobileLayout } from "../components/layout/MobileLayout";
import { AppointmentSkeleton } from "../components/ui/AppointmentSkeleton";
import { Skeleton } from "../components/ui/Skeleton";
import { formatDate, formatTime } from "../lib/utils";
import type { Appointment } from "../lib/types";
import texts from "../config/texts.json";

const t = texts.agendamentos;

const STATUS_LABELS: Record<Appointment["status"], string> = {
  confirmed: "Confirmado", cancelled: "Cancelado", completed: "Concluído",
};

function AppointmentItem({ appointment, clickable }: { appointment: Appointment; clickable: boolean }) {
  const navigate = useNavigate();
  const handleClick = () => clickable && navigate(`/appointments/${appointment.id}`);
  const isConfirmed = appointment.status === "confirmed";
  const isCancelled = appointment.status === "cancelled";

  return (
    <div
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => e.key === "Enter" && handleClick() : undefined}
      className={`rounded-lg p-4 mb-3 border border-border bg-card transition-colors ${clickable ? "cursor-pointer hover:border-primary/50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate text-foreground">{appointment.serviceName}</p>
          <p className="text-sm mt-0.5 text-muted-foreground">{appointment.professionalName}</p>
          <p className="text-sm mt-1 text-muted-foreground">{formatDate(appointment.date)} · {formatTime(appointment.time)}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 border ${
          isConfirmed ? "text-primary border-primary" : isCancelled ? "text-destructive border-destructive" : "text-muted-foreground border-muted-foreground"
        } bg-background`}>
          {STATUS_LABELS[appointment.status]}
        </span>
      </div>
    </div>
  );
}

function Section({ title, appointments, clickable }: { title: string; appointments: Appointment[]; clickable: boolean }) {
  return (
    <section className="mb-6">
      <h2 className="text-base font-display font-semibold mb-3 text-foreground">{title}</h2>
      {appointments.length === 0
        ? <p className="text-sm text-muted-foreground">{t.vazio}</p>
        : appointments.map((a) => <AppointmentItem key={a.id} appointment={a} clickable={clickable} />)}
    </section>
  );
}

export function AppointmentsPage() {
  const clientId = useAuthStore((s) => s.clientId);
  const { upcoming, past, isLoading } = useAppointments(clientId);

  return (
    <MobileLayout>
      <h1 className="text-xl font-display font-bold mb-6 text-foreground">{t.titulo}</h1>
      {isLoading ? (
        <>
          <Skeleton className="h-5 w-32 mb-3" />
          <AppointmentSkeleton count={2} />
          <Skeleton className="h-5 w-28 mb-3 mt-6" />
          <AppointmentSkeleton count={2} />
        </>
      ) : (
        <>
          <Section title={t.proximos} appointments={upcoming} clickable />
          <Section title={t.anteriores} appointments={past} clickable={false} />
        </>
      )}
    </MobileLayout>
  );
}
