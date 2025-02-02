import { LoadingPageImages } from "@/components/LoadingPageImages";
import { Axios } from "@/helpers/axios";
import React, { useEffect } from "react";

interface IAuthState {
  isAuthenticated?: boolean;
}
export type IAuthContext = IAuthState & {
  login: (access_token: string) => void;
  logout: () => void;
};

export const AuthContext = React.createContext<IAuthContext | null>(null);

const setSession = (access_token: string) => {
  if (access_token) {
    localStorage.setItem("access_token", access_token);
  } else {
    localStorage.removeItem("access_token");
  }
};

type Props = {
  children: React.ReactNode;
};

function AuthProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  function login(access_token: string) {
    setSession(access_token);
    setIsAuthenticated(true);
  }

  function logout() {
    setSession("");
    setIsAuthenticated(false);
  }

  useEffect(() => {
    // TODO: checking if user was logged in and redirect him to the dashboard
    const intialize = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
          await Axios.get("/auth");
          setIsAuthenticated(true);
        } else {
          throw new Error();
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    intialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: login,
        logout: logout,
      }}
    >
      {loading ? <LoadingPageImages /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
