import { Suspense } from "react";
import { LoginForm } from "@/features/auth";

export default function LoginPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: 400, width: 400, borderRadius: 16 }} />}>
      <LoginForm />
    </Suspense>
  );
}
