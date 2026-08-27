import { Suspense } from "react";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 480, width: 400, borderRadius: 16 }} />}>
      <RegisterForm />
    </Suspense>
  );
}
