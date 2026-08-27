import React from "react";
import { Badge } from "@/components/ui/Badge";
import type { TicketStatus } from "../types";
import { TICKET_STATUS_LABEL } from "../types";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const statusVariantMap: Record<TicketStatus, "primary" | "success" | "danger"> = {
  PENDING: "primary",
  CHECKED_IN: "success",
  CANCELLED: "danger",
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps): React.JSX.Element {
  const variant = statusVariantMap[status] || "secondary";
  const label = TICKET_STATUS_LABEL[status] || status;

  return <Badge variant={variant}>{label}</Badge>;
}
