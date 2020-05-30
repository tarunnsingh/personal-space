import React, { createContext, useEffect, useState } from "react";
import AuthService from "../Services/AuthService";
import styles from "./AuthContext.module.css";
import { Spinner } from "react-bootstrap";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AuthService.isAuthenticated().then((data) => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsLoading(true);
    });
  }, []);

  return (
    <div>
      {!isLoading ? (
        // <FontAwesomeIcon className={styles.loader} icon={faCircleNotch} spin />
        <Spinner animation="border" role="status" className={styles.loader}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <AuthContext.Provider
          value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </div>
  );
};
