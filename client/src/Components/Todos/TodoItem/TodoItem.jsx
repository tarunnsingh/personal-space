import React from "react";
import { Button, Row, ListGroup, Col } from "react-bootstrap";
// import styles from "./TodoItem.module.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TodoItem = (props) => {
  return (
    <Row>
      <Col sm={10}>
        <ListGroup.Item
          style={{
            marginBottom: "1rem",
          }}
        >
          {props.todo.name}
        </ListGroup.Item>
      </Col>
      <Button
        style={{
          marginBottom: "1rem",
        }}
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
  );
};

export default TodoItem;
