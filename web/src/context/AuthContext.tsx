'use client'

import { useRouter } from "next/router"
import { createContext, useEffect, useState } from "react"
import Cookies from 'js-cookie'
interface User {
    id: string
    name: string
    email: string
    role: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
    // Cek cookie saat aplikasi dimuat
    const storedToken = Cookies.get('token')
    const storedUser = Cookies.get('user')
    if (storedToken && storedUser) {
    setToken(storedToken)
    setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
    }, [])

    const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    Cookies.set('token', newToken, { expires: 7 }) // Simpan 7 hari
    Cookies.set('user', JSON.stringify(newUser), { expires: 7 })
    router.push('/') // Redirect ke home
    }
    
    const logout = () => {
    setToken(null)
    setUser(null)
    Cookies.remove('token')
    Cookies.remove('user')
    router.push('/auth/login')
    }

}
