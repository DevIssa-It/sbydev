import React, { Suspense } from "react";
import { AdminScanner } from "@/features/admin";

export default function AdminScannerPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20 text-sm font-semibold text-[var(--color-muted)]">
          Memuat Meja Scanner...
        </div>
      }
    >
      <AdminScanner />
    </Suspense>
  );
}
