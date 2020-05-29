import React, {useState, useRef, useEffect } from 'react'
import Message from '../Message/Message'
import AuthService from '../../Services/AuthService'

const Register = (props) => {
    const [user, setUser] = useState({username: "", password:"", role:""})
    const [message, setMessage] = useState(null)

    let timerID = useRef(null)

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID)
        }
    }, [])
    
    const onChange = (e) => {
        setUser({...user, [e.target.name] : e.target.value})
    }
    const onSubmit = (e) => {
        e.preventDefault()
        AuthService.register(user).then(data => {
            const {message} = data
            setMessage(message)
            resetForm()
            if(!message.msgError){
                timerID = setTimeout(() => {
                    props.history.push('/login')
                }, 2000);
            }
        })
    }

    const resetForm =() => {
        setUser({username:"", password: "", role: ""})
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h3>Register</h3>
                <label htmlFor="username" className="sr-only">Username: </label>
                <input name="username" value={user.username}type='text' onChange={onChange} className="form-control" placeholder="Enter Username..." />
                <label htmlFor="password" className="sr-only">Password: </label>
                <input name="password" value={user.password} type='password' onChange={onChange} className="form-control" placeholder="Enter Password..." />
                <label htmlFor="role" className="sr-only">Role: </label>
                <input name="role" value={user.role} type='text' onChange={onChange} className="form-control" placeholder="Enter Role (Admin/User)" />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button> 
            </form>
            {message ? <Message message = {message} /> : null}
        </div>
    )
}

export default Register