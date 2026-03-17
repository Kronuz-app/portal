import type { Appointment } from "../lib/types";

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function pastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export const mockAppointments: Appointment[] = [
  // Hoje
  {
    id: "apt-0",
    clientId: "client-mock-001",
    serviceId: "svc-1",
    serviceName: "Corte de Cabelo",
    professionalId: "pro-2",
    professionalName: "Rafael Souza",
    date: todayDate(),
    time: "15:00",
    duration: 30,
    price: 45,
    status: "confirmed",
  },
  // Próximos
  {
    id: "apt-1",
    clientId: "client-mock-001",
    serviceId: "svc-3",
    serviceName: "Corte + Barba",
    professionalId: "pro-1",
    professionalName: "Carlos Mendes",
    date: futureDate(3),
    time: "10:00",
    duration: 50,
    price: 70,
    status: "confirmed",
  },
  {
    id: "apt-2",
    clientId: "client-mock-001",
    serviceId: "svc-5",
    serviceName: "Selagem Capilar",
    professionalId: "pro-3",
    professionalName: "Diego Lima",
    date: futureDate(8),
    time: "14:30",
    duration: 60,
    price: 120,
    status: "confirmed",
  },
  // Concluídos
  {
    id: "apt-3",
    clientId: "client-mock-001",
    serviceId: "svc-2",
    serviceName: "Barba",
    professionalId: "pro-3",
    professionalName: "Diego Lima",
    date: pastDate(5),
    time: "11:00",
    duration: 20,
    price: 30,
    status: "completed",
  },
  {
    id: "apt-4",
    clientId: "client-mock-001",
    serviceId: "svc-4",
    serviceName: "Pigmentação",
    professionalId: "pro-1",
    professionalName: "Carlos Mendes",
    date: pastDate(15),
    time: "09:30",
    duration: 40,
    price: 55,
    status: "completed",
  },
  {
    id: "apt-5",
    clientId: "client-mock-001",
    serviceId: "svc-1",
    serviceName: "Corte de Cabelo",
    professionalId: "pro-2",
    professionalName: "Rafael Souza",
    date: pastDate(30),
    time: "16:00",
    duration: 30,
    price: 45,
    status: "completed",
  },
  // Cancelado
  {
    id: "apt-6",
    clientId: "client-mock-001",
    serviceId: "svc-3",
    serviceName: "Corte + Barba",
    professionalId: "pro-1",
    professionalName: "Carlos Mendes",
    date: pastDate(10),
    time: "10:00",
    duration: 50,
    price: 70,
    status: "cancelled",
    cancelReason: "Imprevisto pessoal, não consegui comparecer.",
  },
  // Cancelado futuro (cancelou antes)
  {
    id: "apt-7",
    clientId: "client-mock-001",
    serviceId: "svc-2",
    serviceName: "Barba",
    professionalId: "pro-3",
    professionalName: "Diego Lima",
    date: futureDate(1),
    time: "09:00",
    duration: 20,
    price: 30,
    status: "cancelled",
    cancelReason: "Mudança de horário no trabalho.",
  },
];
