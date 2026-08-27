import { TicketDetailView } from "@/features/tickets";

interface TicketDetailPageProps {
  params: Promise<{ code: string }>;
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps): Promise<JSX.Element> {
  const { code } = await params;
  return <TicketDetailView ticketCode={code} />;
}
