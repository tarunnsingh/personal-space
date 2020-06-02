import React, { useState, useContext, useEffect } from "react";
import TodoItem from "./TodoItem/TodoItem";
import TodoService from "../../Services/TodoService";
import { AuthContext } from "../../Context/AuthContext";
import Message from "../Message/Message";
import { Spinner, Button } from "react-bootstrap";
import styles from "./Todos.module.css";
import { faFrownOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Todos = (props) => {
  const [todo, setTodo] = useState({ name: "" });
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState(null);
  const [todoLoading, setTodoLoading] = useState(false);
  const [todoListLoading, setTodoListLoading] = useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    setTodoListLoading(true);
    TodoService.getTodos().then((data) => {
      setTodos(data.todos);
      setTodoListLoading(false);
    });
  }, []);

  const onSubmit = (e) => {
    setTodoLoading(true);
    e.preventDefault();

    TodoService.postTodo(todo).then((data) => {
      const { message } = data;

      if (!message.msgError) {
        TodoService.getTodos().then((data) => {
          setTodos(data.todos);
          setMessage(message);
        });
      } else if (message.msgBody === "Unauthorized") {
        //IF JWT EXPIRES
        setMessage(message);
        authContext.setUser({ username: "", role: "" });
        authContext.setIsAuthenticated(false);
      } else {
        setMessage(message);
      }
      resetForm();
    });
  };

  const handleDelete = (props) => {
    setTodoListLoading(true);
    TodoService.deleteTodo(props.todo._id).then((data) => {
      const { message } = data;

      if (!message.msgError) {
        TodoService.getTodos().then((data) => {
          setTodos(data.todos);
          setMessage(message);
          setTodoListLoading(false);
        });
      } else if (message.msgBody === "Unauthorized") {
        //IF JWT EXPIRES
        setMessage(message);
        authContext.setUser({ username: "", role: "" });
        authContext.setIsAuthenticated(false);
      } else {
        setMessage(message);
      }
    });
  };

  const onChange = (e) => {
    setTodo({ name: e.target.value });
  };

  const resetForm = () => {
    setTodo({ name: "" });
    setTodoLoading(false);
    setMessage(null);
  };

  return (
    <div>
      <h6>Add more Notes below:</h6>
      {todos.length ? (
        <h6>{`You have ${todos.length} note(s).`}</h6>
      ) : (
        <div>
          <FontAwesomeIcon icon={faFrownOpen} />
        </div>
      )}
      {!todoListLoading ? (
        <ul className="list-group">
          {todos.map((todo) => {
            return (
              <TodoItem
                key={todo._id}
                todo={todo}
                handleDelete={handleDelete}
              />
            );
          })}
        </ul>
      ) : (
        <div>
          <Spinner
            animation="border"
            size="sm"
            role="status"
            aria-hidden="false"
          />{" "}
          <span> Getting Todos...</span>
        </div>
      )}
      <br />
      <form onSubmit={onSubmit}>
        <label htmlFor="todo">Todo</label>
        <input
          type="text"
          name="todo"
          placeholder="Enter Todo..."
          onChange={onChange}
          value={todo.name}
          className="form-control"
        />

        <Button
          type="submit"
          variant="primary"
          className={styles.button}
          disabled={todoLoading}
        >
          <span> Add Todo </span>{" "}
          {!todoLoading ? null : (
            <Spinner
              animation="border"
              size="sm"
              role="status"
              aria-hidden="false"
            />
          )}
        </Button>
      </form>

      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Todos;
