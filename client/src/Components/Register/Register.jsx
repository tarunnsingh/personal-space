import React, { useState, useRef, useEffect } from "react";
import Message from "../Message/Message";
import AuthService from "../../Services/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import styles from "./Register.module.css";
import { Button } from "react-bootstrap";
import GoogleAuthService from "../../Services/GoogleAuthService";
import LoginGoogle from "../LoginGoogle/LoginGoogle";

const Register = (props) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "",
    originalName: "",
    userIntro: "Not Added",
    coverPhotoUrl: "#",
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let timerID = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    AuthService.register(user).then((data) => {
      const { message } = data;
      setMessage(message);
      resetForm();
      if (!message.msgError) {
        timerID = setTimeout(() => {
          setIsLoading(false);
          props.history.push("/login");
        }, 2000);
      } else setIsLoading(false);
    });
  };

  const handleGoogleLogin = () => {
    GoogleAuthService.login().then(() =>
      console.log("DONE FROM GOOGLE AUTH HANDLER")
    );
  };

  const resetForm = () => {
    setUser({ username: "", password: "", role: "", originalName: "" });
  };

  return (
    <div className="conatiner center">
      {isLoading ? (
        <div className={styles.loadingPage}>
          <p>
            <FontAwesomeIcon icon={faCircleNotch} spin /> Creating Your Account
            and Redirecting...
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <h3>Register</h3>
          <label htmlFor="username" className="sr-only">
            Username:{" "}
          </label>
          <input
            name="username"
            value={user.username}
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
            value={user.password}
            type="password"
            onChange={onChange}
            className="form-control"
            placeholder="Enter Password..."
          />
          <label htmlFor="originalName" className="sr-only">
            Original Name:{" "}
          </label>
          <input
            name="originalName"
            value={user.originalName}
            type="text"
            onChange={onChange}
            className="form-control"
            placeholder="Enter Your Name..."
          />
          <label htmlFor="role" className="sr-only">
            Role:{" "}
          </label>
          <input
            name="role"
            value={user.role}
            type="text"
            onChange={onChange}
            className="form-control"
            placeholder="Enter Role (Admin/User)"
          />
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Register
          </button>
        </form>
      )}
      <span>
        OR <LoginGoogle />
      </span>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Register;
