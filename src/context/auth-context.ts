import { useContext } from "react";
import { AuthContext, IAuthContext } from "./AuthProvider";

export const useAuth = () => useContext(AuthContext) as IAuthContext;
