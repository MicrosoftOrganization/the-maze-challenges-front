import { useAuth } from "@/context/auth-context";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function Protected({ children }: Props) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
