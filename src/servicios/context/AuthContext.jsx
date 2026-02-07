// src/servicios/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/tienda',
        queryParams: { access_type: 'offline', prompt: 'select_account' },
      },
    })
    if (error) throw error
    return { data, error }
  }

  const signIn = async (email, password) => await supabase.auth.signInWithPassword({ email, password })
  const signUp = async (email, password) => await supabase.auth.signUp({ email, password })
  const signOut = async () => await supabase.auth.signOut()
  const updateProfile = async (updates) => await supabase.auth.updateUser({ data: updates })
  const updatePassword = async (newPassword) => await supabase.auth.updateUser({ password: newPassword })

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signIn, signUp, signOut, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}