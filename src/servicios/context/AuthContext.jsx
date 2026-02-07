import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // <-- Nuevo estado para el rol
  const [loading, setLoading] = useState(true)

  // Función para obtener el rol desde la base de datos
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error
      setRole(data?.role || 'user')
    } catch (err) {
      console.error("Error al obtener el rol:", err.message)
      setRole('user') // Valor por defecto si hay error
    }
  }

  useEffect(() => {
    // 1. Carga inicial
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      
      setUser(currentUser)
      
      if (currentUser) {
        await fetchUserRole(currentUser.id)
      }
      
      setLoading(false)
    }
    initializeAuth()

    // 2. Cambios de Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        await fetchUserRole(currentUser.id)
      } else {
        setRole(null) // Limpiar rol al cerrar sesión
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Métodos
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/tienda',
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })
    if (error) throw error
    return { data, error }
  }

  const signIn = async (email, password) => await supabase.auth.signInWithPassword({ email, password })
  const signUp = async (email, password) => await supabase.auth.signUp({ email, password })
  const signOut = async () => {
    setRole(null) // Reset local previo
    await supabase.auth.signOut()
  }
  const updateProfile = async (updates) => await supabase.auth.updateUser({ data: updates })
  const updatePassword = async (newPassword) => await supabase.auth.updateUser({ password: newPassword })

  return (
    // Ahora exportamos 'role' para que Links.jsx pueda usarlo
    <AuthContext.Provider value={{ 
      user, 
      role, 
      loading, 
      signInWithGoogle, 
      signIn, 
      signUp, 
      signOut, 
      updateProfile, 
      updatePassword 
    }}>
      {children}
    </AuthContext.Provider>
  )
}