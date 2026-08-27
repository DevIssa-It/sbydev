import { Suspense } from "react";
import { AdminScanner } from "@/features/admin";

export default function AdminScannerPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="container-app py-12 flex justify-center items-center min-h-[50vh]">
          <div className="skeleton w-full max-w-2xl h-96 rounded-2xl" />
        </div>
      }
    >
      <AdminScanner />
    </Suspense>
  );
}
