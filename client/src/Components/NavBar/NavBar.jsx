import React, { useContext} from 'react'
import {Link} from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import AuthService from '../../Services/AuthService'

const NavBar = props => {
    const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext)

    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if(data.success){
                setUser(data.user)
                setIsAuthenticated(false)
            }
        })
    }

    const unAuthenticNavBar = () => {
        return (<>
            <Link to="/">
                <li className="nav-item nav-link">HOME</li>
            </Link>
            <Link to="/login">
                <li className="nav-item nav-link">Login</li>
            </Link>
            <Link to="/register">
                <li className="nav-item nav-link">Register</li>
            </Link>
        </>)
    }

    const authenticNavBar = () => {
        return (<>
            <Link to="/">
                <li className="nav-item nav-link">HOME</li>
            </Link>
            <Link to="/todos">
                <li className="nav-item nav-link">Todos</li>
            </Link>
            { user.role === 'admin' ? 
                <Link to="/admin">
                    <li className="nav-item nav-link">Admin</li>
                </Link> 
                : null
            }
            <button type="button" className="btn btn-link nav-item nav-link" onClick={onClickLogoutHandler}>Logout</button>
            
        </>)
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/">
                <div  className="navbar-brand" >MernAuth</div>
            </Link>
        <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
                {!isAuthenticated ? unAuthenticNavBar() : authenticNavBar() }
            </ul>
            <span className="navbar-text">
            Settings
            </span>
        </div>
        </nav>
    )
}

export default NavBar