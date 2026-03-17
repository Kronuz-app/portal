import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useAppointments } from "../hooks/useAppointments";
import { useCancelAppointment } from "../hooks/useCancelAppointment";
import { MobileLayout } from "../components/layout/MobileLayout";
import { Button } from "../components/ui/Button";
import { Dialog } from "../components/ui/Dialog";
import { formatDate, formatTime, formatCurrency } from "../lib/utils";
import texts from "../config/texts.json";

const t = texts.agendamentos;
const tGeral = texts.geral;

const STATUS_LABELS = { confirmed: "Confirmado", cancelled: "Cancelado", completed: "Concluído" } as const;

export function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = useAuthStore((s) => s.clientId);
  const { upcoming, past, isLoading } = useAppointments(clientId);
  const { mutate: cancelMutate, isPending, isError } = useCancelAppointment();
  const [dialogOpen, setDialogOpen] = useState(false);

  const appointment = [...upcoming, ...past].find((a) => a.id === id);
  const today = new Date().toISOString().split("T")[0];
  const canCancel = appointment?.status === "confirmed" && appointment.date >= today;

  const handleCancelConfirm = () => {
    if (!appointment) return;
    cancelMutate(appointment.id, { onSuccess: () => { setDialogOpen(false); navigate("/appointments"); } });
  };

  const isConfirmed = appointment?.status === "confirmed";
  const isCancelled = appointment?.status === "cancelled";

  return (
    <MobileLayout>
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate("/appointments")} className="px-0">← Agendamentos</Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">{tGeral.carregando}</div>
      ) : !appointment ? (
        <div className="text-sm text-muted-foreground">{tGeral.erro}</div>
      ) : (
        <div className="rounded-lg border border-border p-5 space-y-4 bg-card">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-lg font-display font-bold text-foreground">{appointment.serviceName}</h1>
            <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 border bg-background ${
              isConfirmed ? "text-primary border-primary" : isCancelled ? "text-destructive border-destructive" : "text-muted-foreground border-muted-foreground"
            }`}>
              {STATUS_LABELS[appointment.status]}
            </span>
          </div>
          <Row label="Profissional" value={appointment.professionalName} />
          <Row label="Data" value={formatDate(appointment.date)} />
          <Row label="Horário" value={formatTime(appointment.time)} />
          <Row label="Duração" value={`${appointment.duration} min`} />
          <Row label="Valor" value={formatCurrency(appointment.price)} />
          {isError && <p className="text-sm text-destructive">{tGeral.erro}</p>}
          {canCancel && (
            <Button variant="secondary" className="w-full mt-2" onClick={() => setDialogOpen(true)} loading={isPending}>{t.cancelar}</Button>
          )}
        </div>
      )}
      <Dialog isOpen={dialogOpen} title={t.cancelar} message={t.confirmarCancelamento} confirmLabel={t.cancelar} cancelLabel="Voltar" onConfirm={handleCancelConfirm} onCancel={() => setDialogOpen(false)} />
    </MobileLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right text-foreground">{value}</span>
    </div>
  );
}
