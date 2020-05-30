import React from "react";
import { Card, Button, Container, Row } from "react-bootstrap";
import styles from "./TodoItem.module.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TodoItem = (props) => {
  return (
    <Container className={styles.card}>
      <Row>
        <Card.Body>{props.todo.name}</Card.Body>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => {
            props.handleDelete(props);
          }}
        >
          {" "}
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </Row>
    </Container>
  );
};

export default TodoItem;
