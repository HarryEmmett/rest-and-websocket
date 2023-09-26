
import "./ProtectedRoute.css";
import { IUser, IAuthProvider} from "../../types/types";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";
import { checkToken } from "../../API/checkToken";
import { Spinner } from "@chakra-ui/react";

interface ProtectedProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedProps> = ({ children }) => {

  const { user, logout, login } = useAuth() as IAuthProvider;
  const [loading, setLoading] = useState<boolean>(true);

  const validToken = async (token: string | null): Promise<Pick<IUser, "username" | "expires" | "token" | "profileImage">> => {
    return await checkToken(token);
  };

  useEffect(() => {
    setLoading(true);
    
    const token = localStorage.getItem("token");
    if (token) {
      // checking token on each protected page visit
      validToken(token).then((res) => {
        login({
          username: res.username,
          profileImage: res.profileImage,
          token: res.token,
          expires: res.expires,
          auth: true
        });

        //ARTIFICIAL LOADING FOR SPINNER
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setTimeout(() => {
          logout();
        }, res.expires);
      }).catch(() => {
        logout();
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!user?.auth && !loading) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div id="route-container" className="route-container">
      <div id="route-box" className="route-box">
        <div id="nav-bar" className="nav-bar">
          <NavBar user={user} logout={logout} />
        </div>
        <div id="child-page" className="child-page">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;