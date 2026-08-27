import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Navbar />
      <main style={{ flexGrow: 1 }} className="container-app">
        {children}
      </main>
      <Footer />
    </div>
  );
}
