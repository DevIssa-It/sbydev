import type { TicketWithRelations } from "./types";

export interface TicketsApiResponse {
  success: boolean;
  data: TicketWithRelations[];
  error?: string;
}

export interface TicketDetailApiResponse {
  success: boolean;
  data: TicketWithRelations;
  error?: string;
}

export interface CheckinApiResponse {
  success: boolean;
  data: TicketWithRelations;
  error?: string;
}

/** Ambil semua tiket milik user */
export async function fetchUserTicketsApi(): Promise<TicketsApiResponse> {
  const res = await fetch("/api/tickets", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}

/** Ambil detail tiket by code */
export async function fetchTicketByCodeApi(code: string): Promise<TicketDetailApiResponse> {
  const res = await fetch(`/api/tickets/${code}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

/** Check-in tiket (Admin/Panitia only) */
export async function checkinTicketApi(code: string): Promise<CheckinApiResponse> {
  const res = await fetch(`/api/tickets/${code}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
