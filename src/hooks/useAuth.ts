import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAuthContext = () => useContext(AuthContext);
