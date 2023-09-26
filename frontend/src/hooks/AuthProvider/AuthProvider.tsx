import { createContext, useContext, useState, useMemo } from "react";
import { IAuthProvider, IUser } from "../../types/types";
import { useNavigate } from "react-router-dom";

interface IAuthProviderProps {
  children: JSX.Element
}

const AuthContext = createContext<IAuthProvider | undefined>(undefined);

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(
    {
      username: "",
      profileImage: "",
      expires: undefined,
      token: "",
      auth: false
    }
  );

  // call this function when you want to authenticate the user was marked async??
  const login = (data: IUser): void => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", data.username);
    setUser(data);
  };

  // call this function to sign out logged in user
  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(
      {
        username: "",
        profileImage: "",
        expires: undefined,
        token: "",
        auth: false
      }
    );
    navigate("/login", { replace: true });
  };

  const editUser = (edit: {[key: string]: string}): void => {
    const key = Object.keys(edit).toString();
    if (key) {
      setUser({ ...user, [key]: edit[key] });
    }
  };

  const value =
    useMemo(() => {
      return {
        user,
        login,
        logout,
        editUser
      };
    }, [user]);

  // const value = {
  //   user,
  //   login,
  //   logout
  // };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuthProvider | undefined => {
  return AuthContext ? useContext(AuthContext) : undefined;
};