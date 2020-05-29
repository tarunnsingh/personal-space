import React, { createContext, useEffect, useState} from 'react'
import AuthService from '../Services/AuthService'

export const AuthContext = createContext()

export const AuthProvider =  ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        AuthService.isAuthenticated().then((data) => {
            setUser(data.user)
            setIsAuthenticated(data.isAuthenticated)
            setIsLoading(true)
        })
    }, [])

    return (
        <div>
            {!isLoading ? <h3>Loading...</h3> :
            <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
                {children}    
            </AuthContext.Provider>}
        </div>
    )
}
