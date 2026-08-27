import type { EventType, EventListResponse } from "./validations";

export interface FetchEventsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface EventsApiResponse {
  success: boolean;
  data: EventListResponse & { categories: string[] };
  error?: string;
}

export interface EventDetailApiResponse {
  success: boolean;
  data: EventType & { _count?: { tickets: number } };
  error?: string;
}

export interface RegisterApiResponse {
  success: boolean;
  data: {
    id: string;
    code: string;
    userId: string;
    eventId: string;
    status: string;
  };
  error?: string;
}

/** Client-side fetch helper untuk list event */
export async function fetchEventsApi(params: FetchEventsParams = {}): Promise<EventsApiResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "Semua") query.set("category", params.category);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await fetch(`/api/events?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return res.json();
}

/** Client-side fetch helper untuk detail event */
export async function fetchEventByIdApi(id: string): Promise<EventDetailApiResponse> {
  const res = await fetch(`/api/events/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

/** Client-side helper untuk registrasi event */
export async function registerEventApi(eventId: string): Promise<RegisterApiResponse> {
  const res = await fetch(`/api/events/${eventId}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
