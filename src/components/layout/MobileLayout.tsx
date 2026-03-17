import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "./Header";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 py-6 text-foreground">
        {children}
      </main>
      <nav className="sticky bottom-0 flex border-t border-border bg-card">
        <NavLink to="/booking" active={pathname.startsWith("/booking")}>Agendar</NavLink>
        <NavLink to="/appointments" active={pathname.startsWith("/appointments")}>Agendamentos</NavLink>
      </nav>
    </div>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={`flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
