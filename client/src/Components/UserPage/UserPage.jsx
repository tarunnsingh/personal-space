import React, { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import UserUpdateService from "../../Services/UserUpdateService";
import { Card, Form, FormControl, Button, FormLabel } from "react-bootstrap";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Message from "../Message/Message";
import moment from "moment";
import cx from "classnames";
import styles from "./UserPage.module.css";

const UserPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [intro, setIntro] = useState(user.userIntro);

  const onChange = (e) => {
    setIntro(e.target.value);
  };

  const handleIntroSubmit = (e) => {
    console.log(intro);
    e.preventDefault();
    const dataToSend = { introText: intro };
    UserUpdateService.updateIntro(dataToSend).then((data) => {
      const { message } = data;
      if (!message.msgError) {
        data.user.lastUpdated = Date.now();
        setUser(data.user);
        console.log("DATA", data);
        setMessage(message);
        setShowEditor(false);
      }
    });
  };

  const handleClick = () => {
    setShowEditor(true);
  };
  console.log(user);
  const inlineEditor = () => {
    return (
      <Form onSubmit={handleIntroSubmit} inline>
        <FormLabel htmlFor="updIntro" />
        <FormControl
          name="updIntro"
          type="text"
          placeholder="Type your Intro here..."
          className="mr-lg-2"
          value={intro}
          onChange={onChange}
        />
        <Button type="submit" variant="outline-warning" size="sm">
          Update
        </Button>
      </Form>
    );
  };

  return (
    <div className={cx(styles.topspace, "container")}>
      <h5>Your Profile</h5>
      <Card>
        <Card.Img variant="top" />
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
          <p>
            <i>{user.originalName}</i>
          </p>
          <Card.Text>
            {user.userIntro !== "" ? user.userIntro : null}{" "}
            <Button onClick={handleClick} variant="outline-warning" size="sm">
              {" "}
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            {showEditor ? inlineEditor() : null}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">
            Last updated {moment(user.lastUpdated).fromNow()}
          </small>
        </Card.Footer>
      </Card>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default UserPage;
