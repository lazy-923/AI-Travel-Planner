import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../utils/supabaseClient'

export default function TripDetails() {
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session && id) {
                fetchTrip(session, id);
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session && id) {
                fetchTrip(session, id);
            }
        })

        return () => subscription.unsubscribe()
    }, [id])

    const fetchTrip = async (currentSession, tripId) => {
        if (!currentSession) return;
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8000/api/v1/trip/trips/${tripId}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.access_token}`,
                },
            })
            if (response.ok) {
                const data = await response.json()
                setTrip(data)
            } else {
                console.error('Failed to fetch trip details')
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
        return <div className="p-4">Please log in to see your trip details.</div>
    }

    if (!trip) {
        return <div className="p-4">Trip not found.</div>
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Trip to {trip.destination}</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">Trip Plan</h2>
                <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(trip.plan, null, 2)}</pre>
            </div>
        </div>
    )
}