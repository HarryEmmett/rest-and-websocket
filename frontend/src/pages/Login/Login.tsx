import "./Login.css";
import { IAuthProvider, ILogin, IUpdateDetails } from "../../types/types";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { config } from "../../config/config";
import AuthForm from "../../components/AuthForm/AuthForm";
import AlertBanner from "../../components/AlertBanner/AlertBanner";
import axios from "axios";
import { useAuth } from "../../hooks/AuthProvider/AuthProvider";

const Login: React.FC = (): JSX.Element => {

    const { user, login } = useAuth() as IAuthProvider;
    const [success, setSuccess] = useState<boolean | string>(false);
    const [error, setError] = useState<boolean | string>(false);
    const [token] = useState<string | null>(localStorage.getItem("token"));

    const handleLogin = (details: ILogin): void => {
        axios.post(`${config.serverUrl}/login`, details)
            .then((res) => {
                setSuccess(res.data.message);
                // just need token here /checkToken will return the other things
                login({
                    username: res.data.jwt.username,
                    profileImage: "",
                    expires: undefined,
                    token: res.data.jwt.token,
                    auth: true
                });
            }).catch((err) => {
                setError(err.response.data.error);
                setTimeout(() => {
                    setError(false);
                }, 2000);
            });
    };

    const handleReset = (details: IUpdateDetails): void => {
        axios.post(`${config.serverUrl}/reset`, details)
            .then((res) => {
                setSuccess(res.data.message);
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            }).catch((err) => {
                setError(err.response.data.error);
                setTimeout(() => {
                    setError(false);
                }, 2000);
            });
    };

    if (user?.auth || token) {        
        return <Navigate to="/" replace />;
    }

    return (
        <div id="login-page" className="login-page">
            <div id="login-container" className="login-container">
                <div id="login-form" className="login-form">
                    <AuthForm
                        heading="LOGIN"
                        handleLogin={(details) => handleLogin(details)}
                        handleReset={(details) => handleReset(details)}
                    />
                </div>
                <div id="login-banner" className="login-banner">
                    <AlertBanner success={success} error={error} />
                </div>
            </div>
        </div>
    );
};

export default Login;