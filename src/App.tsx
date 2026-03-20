import { useEffect } from "react";
import { Routes, Route, Navigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { decodeShopId } from "./lib/api";
import { LoginPage } from "./pages/LoginPage";
import { BookingPage } from "./pages/BookingPage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AppointmentDetailPage } from "./pages/AppointmentDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const [searchParams] = useSearchParams();
  const loginFromUrl = useAuthStore((s) => s.loginFromUrl);

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    if (clientId) {
      loginFromUrl(clientId);
    }
  }, [searchParams, loginFromUrl]);

  const shopId = decodeShopId();

  if (!shopId) {
    return <NotFoundPage />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/success"
        element={
          <ProtectedRoute>
            <BookingSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/:id"
        element={
          <ProtectedRoute>
            <AppointmentDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}

export default function App() {
  return <AppRoutes />;
}
