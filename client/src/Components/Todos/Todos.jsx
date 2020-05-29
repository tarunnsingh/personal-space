import React , { useState, useContext, useEffect } from 'react'
import TodoItem from './TodoItem/TodoItem'
import TodoService from '../../Services/TodoService'
import { AuthContext } from '../../Context/AuthContext'
import Message from '../Message/Message'

const Todos = props => {
    const [todo, setTodo] = useState({name: ""})
    const [todos, setTodos] = useState([])
    const [message, setMessage] = useState(null)
    const authContext = useContext(AuthContext)


    useEffect(()=>{
        TodoService.getTodos().then(data=>{
            setTodos(data.todos)
        })
    }, [])



    const onSubmit = (e)=>{
        e.preventDefault()
        TodoService.postTodo(todo).then(data=>{
            const { message } = data
            resetForm()
            if(!message.msgError){
                TodoService.getTodos().then((data)=>{
                    setTodos(data.todos)
                    setMessage(message)
                })
            } else if (message.msgBody === 'Unauthorized'){ //IF JWT EXPIRES
                setMessage(message)
                authContext.setUser({username: "", role: ""})
                authContext.setIsAuthenticated(false)
            } else {
                setMessage(message)
            }
        })
    }


    const onChange = (e) => {
        setTodo({name: e.target.value})
    }

    const resetForm =() =>{
        setTodo({name: ""})
    }

    return (
        <div>
            <ul className="list-group">
                {
                    todos.map((todo)=>{
                        return <TodoItem key={todo._id} todo={todo}/>
                    })
                }
            </ul>
            <br/>
            <form onSubmit={onSubmit}>
                <label htmlFor="todo">Todo</label>
                <input type="text"
                        name="todo"
                        placeholder="Enter Todo..."
                        onChange={onChange}
                        value={todo.name}
                        className="form-control"
                        />
                <button type="submit" className="btn btn-primary bt-block btn-sm">Add Todo</button>
            </form>
            {message ? <Message message={message} /> : null}
        </div>
    )
}

export default Todos