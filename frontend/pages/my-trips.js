import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'

export default function MyTrips() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session) {
                fetchTrips(session);
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                fetchTrips(session);
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchTrips = async (currentSession) => {
        if (!currentSession) return;
        setLoading(true)
        try {
            const response = await fetch('http://localhost:8000/api/v1/trip/trips', {
                headers: {
                    'Authorization': `Bearer ${currentSession.access_token}`,
                },
            })
            if (response.ok) {
                const data = await response.json()
                setTrips(data)
            } else {
                console.error('Failed to fetch trips')
            }
        } catch (error) {
            console.error('An error occurred:', error)
        }
        setLoading(false)
    }

    if (loading) {
        return <div className="p-4">Loading...</div>
    }

    if (!session) {
        return <div className="p-4">Please log in to see your trips.</div>
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Trips</h1>
            {trips.length > 0 ? (
                <ul className="space-y-4">
                    {trips.map((trip) => (
                        <li key={trip.id} className="bg-white p-4 rounded-lg shadow-md">
                            <Link href={`/trips/${trip.id}`} legacyBehavior>
                                <a className="text-xl font-semibold text-blue-600 hover:underline">
                                    {trip.destination}
                                </a>
                            </Link>
                            <p className="text-gray-600">Created at: {new Date(trip.created_at).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven't planned any trips yet.</p>
            )}
        </div>
    )
}