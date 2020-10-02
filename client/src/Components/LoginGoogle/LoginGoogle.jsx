import React from "react";
import GoogleLogin from "react-google-login";
import GoogleAuthService from "../../Services/GoogleAuthService";
import keys from "../../config/keys";
import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";
import Message from "../Message/Message";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import styles from "./LoginGoogle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const LoginGoogle = (props) => {
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const responseGoogle = (response) => {
    setIsLoading(true);
    GoogleAuthService.login(response).then((data) => {
      const { isAuthenticated, user, message } = data;
      if (isAuthenticated) {
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);
        setMessage(message);
        setIsLoading(false);
        return <Redirect to="/" />;
      } else {
        setMessage(message);
        setIsLoading(false);
      }
    });
  };

  const failiureGoogle = () => {
    console.log("failureGoogle Triggered");
  };

  return (
    <div>
      {isLoading ? (
        <div className={styles.loadingPage}>
          <p>
            <FontAwesomeIcon icon={faCircleNotch} spin /> Logging you in with
            Google...
          </p>
        </div>
      ) : (
        <GoogleLogin
          clientId={keys.GOOGLE_CLIENT_ID}
          buttonText="Continue with Google"
          onSuccess={responseGoogle}
          onFailure={failiureGoogle}
          cookiePolicy={"single_host_origin"}
        />
      )}
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default LoginGoogle;
