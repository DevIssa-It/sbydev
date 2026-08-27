import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db/events";
import { AdminEventForm } from "@/features/admin";

interface AdminEditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditEventPage({
  params,
}: AdminEditEventPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <AdminEventForm
      isEdit={true}
      initialData={{
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        location: event.location,
        date: event.date.toISOString(),
        quota: event.quota,
        imageUrl: event.imageUrl || undefined,
      }}
    />
  );
}
