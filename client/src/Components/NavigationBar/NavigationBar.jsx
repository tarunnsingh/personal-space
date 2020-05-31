import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import AuthService from "../../Services/AuthService";
import styles from "./NavigationBar.module.css";
import cx from "classnames";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nav, Navbar, Form, Button } from "react-bootstrap";
// import { FormControl } from 'react-bootstrap'

const NavigationBar = (props) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(
    AuthContext
  );

  const onClickLogoutHandler = () => {
    AuthService.logout().then((data) => {
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  };

  const unAuthenticNavBar = () => {
    return (
      <>
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/register">Register</Nav.Link>
      </>
    );
  };

  const authenticNavBar = () => {
    return (
      <>
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/todos">Notes</Nav.Link>
        {user.role === "admin" ? (
          <Nav.Link href="/admin">Admin</Nav.Link>
        ) : null}
        <Button
          type="button"
          className={cx(styles.logoutbtn, "btn btn-link nav-item nav-link")}
          onClick={onClickLogoutHandler}
        >
          Logout
        </Button>
      </>
    );
  };

  return (
    <Navbar className={styles.navbar} expand="lg">
      <Navbar.Brand href="/">Photos-Daily</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {!isAuthenticated ? unAuthenticNavBar() : authenticNavBar()}
        </Nav>
        {user.username !== "" ? (
          <Nav className="justify-content-end">
            <Nav.Item>
              <Nav.Link href="/userpage">
                <FontAwesomeIcon icon={faUser} /> {user.username}{" "}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        ) : null}
        <Form inline>
          {/* <FormControl
            type="text"
            placeholder="To be added..."
            className="mr-sm-2"
          /> */}
          <Button variant="outline-success" disabled>
            Search
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
