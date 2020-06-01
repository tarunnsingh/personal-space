import React, { useState, useContext } from "react";
import Message from "../Message/Message";
import { AuthContext } from "../../Context/AuthContext";
import AuthService from "../../Services/AuthService";
import LoginGoogle from "../LoginGoogle/LoginGoogle";

const Login = (props) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const authContext = useContext(AuthContext);

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    AuthService.login(user).then((data) => {
      const { isAuthenticated, user, message } = data;
      console.log(data);
      if (isAuthenticated) {
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);
        props.history.push("/todos");
      } else {
        setMessage(message);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Sign In</h3>
        <label htmlFor="username" className="sr-only">
          Username:{" "}
        </label>
        <input
          name="username"
          type="text"
          onChange={onChange}
          className="form-control"
          placeholder="Enter Username..."
        />
        <label htmlFor="password" className="sr-only">
          Password:{" "}
        </label>
        <input
          name="password"
          type="password"
          onChange={onChange}
          className="form-control"
          placeholder="Enter Password..."
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Login
        </button>
      </form>
      <LoginGoogle props={props} />
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Login;
