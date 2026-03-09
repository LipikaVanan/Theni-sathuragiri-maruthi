import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password })
        const data = res.data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data))
        setUser(data)
        return data
    }

    const register = async (name, email, password, phone) => {
        const res = await api.post('/api/auth/register', { name, email, password, phone })
        const data = res.data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data))
        setUser(data)
        return data
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
