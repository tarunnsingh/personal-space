import React from "react";
import GoogleLogin from "react-google-login";
import GoogleAuthService from "../../Services/GoogleAuthService";
import keys from "../../config/keys";
import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";
import Message from "../Message/Message";
import { useState } from "react";
import { Redirect } from "react-router-dom";

const LoginGoogle = (props) => {
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState(null);

  const responseGoogle = (response) => {
    GoogleAuthService.login(response).then((data) => {
      const { isAuthenticated, user, message } = data;
      if (isAuthenticated) {
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);
        return <Redirect to="/" />;
      } else {
        setMessage(message);
      }
    });
  };

  const failiureGoogle = () => {
    console.log("failiureGoogle Triggered");
  };

  return (
    <div>
      <GoogleLogin
        clientId={keys.GOOGLE_CLIENT_ID}
        buttonText="Google Login"
        onSuccess={responseGoogle}
        onFailure={failiureGoogle}
        cookiePolicy={"single_host_origin"}
      />
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default LoginGoogle;
