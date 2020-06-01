import React from "react";
import { Alert } from "react-bootstrap";
import styles from "./Message.module.css";

const getStyle = (props) => {
  let variant = "success";
  if (props.message.msgError) variant = "danger";
  return variant;
};

function Message(props) {
  return (
    <Alert variant={getStyle(props)} className={styles.messageBox} show={true}>
      <p>{props.message.msgBody}</p>
    </Alert>
  );
}

export default Message;
