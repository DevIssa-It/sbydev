import { EventDetailContent } from "@/features/events";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps): Promise<JSX.Element> {
  const { id } = await params;
  return <EventDetailContent eventId={id} />;
}
