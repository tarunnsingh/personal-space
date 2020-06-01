import React, { useState, useRef, useEffect } from "react";
import Message from "../Message/Message";
import AuthService from "../../Services/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import styles from "./Register.module.css";
import LoginGoogle from "../LoginGoogle/LoginGoogle";
import cx from "classnames";

const Register = (props) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "user",
    originalName: "",
    userIntro: "Not Added",
    email: "",
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

  const resetForm = () => {
    setUser({
      username: "",
      password: "",
      role: "",
      originalName: "",
      email: "",
    });
  };

  return (
    <div className={cx("container", styles.container)}>
      {isLoading ? (
        <div className={styles.loadingPage}>
          <p>
            <FontAwesomeIcon icon={faCircleNotch} spin /> Creating Your Account
            and Redirecting...
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className={styles.form}>
          <h3>Register</h3>
          <label htmlFor="username" className="sr-only">
            Username:{" "}
          </label>
          <input
            required
            name="username"
            value={user.username}
            type="text"
            onChange={onChange}
            className="form-control"
            placeholder="Enter Username..."
          />
          <label htmlFor="email" className="sr-only">
            Email:{" "}
          </label>
          <input
            required
            name="email"
            value={user.email}
            type="text"
            onChange={onChange}
            className="form-control"
            placeholder="Enter Email..."
          />
          <label htmlFor="password" className="sr-only">
            Password:{" "}
          </label>
          <input
            required
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
            disabled
            name="role"
            value={user.role}
            type="text"
            onChange={onChange}
            className="form-control"
            placeholder="Enter Role (Admin/User)"
          />
          <button
            className={cx(styles.loginbtn, "btn btn-lg btn-primary btn-block")}
            type="submit"
          >
            Register
          </button>
        </form>
      )}
      <span className={styles.googlebutton}>
        OR <LoginGoogle />
      </span>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Register;
