import React, { useState, useContext, useEffect } from "react";
import TodoItem from "./TodoItem/TodoItem";
import TodoService from "../../Services/TodoService";
import { AuthContext } from "../../Context/AuthContext";
import Message from "../Message/Message";
import { Spinner, Button } from "react-bootstrap";
import styles from "./Todos.module.css";

const Todos = (props) => {
  const [todo, setTodo] = useState({ name: "" });
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState(null);
  const [todoLoading, setTodoLoading] = useState(false);
  const authContext = useContext(AuthContext);
  //   const loadingRef = useRef(false);
  useEffect(() => {
    TodoService.getTodos().then((data) => {
      setTodos(data.todos);
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

  const onChange = (e) => {
    setTodo({ name: e.target.value });
  };

  const resetForm = () => {
    setTodo({ name: "" });
    setTodoLoading(false);
  };

  return (
    <div>
      <h5>Add more Todos below:</h5>
      <ul className="list-group">
        {todos.map((todo) => {
          return <TodoItem key={todo._id} todo={todo} />;
        })}
      </ul>
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
