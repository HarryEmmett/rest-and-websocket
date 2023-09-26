import "./Register.css";
import { IAuthProvider, ILogin } from "../../types/types";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { config } from "../../config/config";
import AuthForm from "../../components/AuthForm/AuthForm";
import AlertBanner from "../../components/AlertBanner/AlertBanner";
import axios from "axios";
import { useAuth } from "../../hooks/AuthProvider/AuthProvider";

const Register: React.FC = (): JSX.Element => {

    const { user, login } = useAuth() as IAuthProvider;
    const [success, setSuccess] = useState<boolean | string>(false);
    const [error, setError] = useState<boolean | string>(false);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [token] = useState<string | null>(localStorage.getItem("token"));

    const handleRegister = (details: ILogin): void => {
        axios.post(`${config.serverUrl}/register`, details)
            .then((res) => {
                setSuccess(res.data.message);
                setTimeout(() => {
                    login({
                        username: res.data.jwt.username,
                        profileImage: "",
                        expires: undefined,
                        token: res.data.jwt.token,
                        auth: true
                    });
                }, 1000);   
                setUsername(res.data.jwt.username);
            }).catch((err) => {
                setError(err.response.data.error);
                setTimeout(() => {
                    setError(false);
                }, 2000);
            });
    };

    if(token) {
        return <Navigate to={"/"} replace />;
    }

    if(success && user?.auth) {
        return <Navigate to={`/${username}/profile`} replace />;
    }

    return (
        <div id="register-page" className="register-page">
            <div id="register-container" className="register-container">
                <div id="register-form" className="register-form">
                    <AuthForm heading="REGISTER" handleLogin={(details): void => handleRegister(details)} />
                </div>
                <div id="register-banner" className="register-banner">
                    <AlertBanner success={success === "false" ? false : success} error={error} />
                </div>
            </div>
        </div>
    );
};

export default Register;