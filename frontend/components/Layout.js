import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
    const [user, setUser] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const session = supabase.auth.getSession()
        setUser(session?.user ?? null)

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between">
                    <Link href="/" className="text-white text-lg font-bold">
                        AI Travel Planner
                    </Link>
                    <div>
                        {user ? (
                            <>
                                <Link href="/my-trips" legacyBehavior>
                                    <a className="text-gray-300 hover:text-white mr-4">My Trips</a>
                                </Link>
                                <button onClick={handleLogout} className="text-gray-300 hover:text-white">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" legacyBehavior>
                                    <a className="text-gray-300 hover:text-white mr-4">Login</a>
                                </Link>
                                <Link href="/register" legacyBehavior>
                                    <a className="text-gray-300 hover:text-white">Register</a>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    )
}