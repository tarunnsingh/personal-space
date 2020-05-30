import React from "react";
import { Card } from "react-bootstrap";

const TodoItem = (props) => {
  return <Card body>{props.todo.name}</Card>;
};

export default TodoItem;
