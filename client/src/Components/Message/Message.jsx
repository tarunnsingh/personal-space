import React from "react";
import { Alert } from "react-bootstrap";
import styles from "./Message.module.css";

const getStyle = (props) => {
  let variant = "success";
  if (props.message.msgError) variant = "danger";
  return variant;
};

function Message(props) {
  // const [isShown, setIsShown] = useState(true);
  // const shownRef = useRef(true);
  // shownRef.current = true;

  // const getTimeOut = () => {
  //   setTimeout(() => {
  //     setIsShown(!shownRef.current);
  //   }, 2000);
  //   console.log("isShown: ", isShown);
  // };

  return (
    <Alert variant={getStyle(props)} className={styles.messageBox} show={true}>
      <p>{props.message.msgBody}</p>
    </Alert>
  );
}

export default Message;
