import { AdminAttendeesTable } from "@/features/admin";

interface AdminAttendeesPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAttendeesPage({
  params,
}: AdminAttendeesPageProps): Promise<JSX.Element> {
  const { id } = await params;
  return <AdminAttendeesTable eventId={id} />;
}
