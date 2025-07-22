
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authtab.jsx";

export default function PrivateRoute({ children }) {
  const { authUser } = useAuth();
  return authUser ? children : <Navigate to="/login" />;
}
