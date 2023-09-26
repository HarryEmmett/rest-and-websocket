import "./AlertBanner.css";
import { Alert, AlertIcon } from "@chakra-ui/react";

interface AlertBannerProps {
    success: boolean | string;
    error: boolean | string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ success, error }): JSX.Element => {
    return (
        <div id="alert-container" className="alert-container">
            {success &&
                <div id="success-container" className="success-container">
                    <Alert status="success">
                        <AlertIcon />
                        {success}
                    </Alert>
                </div>
            }
            {error &&
                <div id="error-container" className="error-container">
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                </div>
            }
        </div>
    );
};

export default AlertBanner;