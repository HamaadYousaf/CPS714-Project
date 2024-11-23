import React, { useState, useEffect } from 'react'
import { BadgeCheck, Loader2 } from 'lucide-react'

const FeedbackDashboard = ({ userId = 1 }) => {
    const [points, setPoints] = useState(null)
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(false)
    const [summaryLoading, setSummaryLoading] = useState(false)

    useEffect(() => {
        fetchUserPoints()
    }, [userId])

    const fetchUserPoints = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `https://whkhxoqclrbwsapozcsx.supabase.co/rest/v1/14_user_points?user_id=eq.${userId}`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_SUPABASE_TOKEN,
                        Authorization: `Bearer ${
                            import.meta.env.VITE_SUPABASE_TOKEN
                        }`,
                    },
                }
            )
            const data = await response.json()
            if (data.length > 0) {
                setPoints(data[0].points_balance)
            }
        } catch (error) {
            console.error('Error fetching points:', error)
        }
        setLoading(false)
    }

    const handleGetSummary = async () => {
        setSummaryLoading(true)
        try {
            const response = await fetch('http://localhost:3000/summary')
            const data = await response.json()
            if (data.success) {
                setSummary(data.summary)
            }
        } catch (error) {
            console.error('Error fetching summary:', error)
        }
        setSummaryLoading(false)
    }

    return (
        <div className="space-y-4 p-4">
            <div className="card max-w-md mx-auto">
                <h2 className="card-title m-4">
                    Your Points
                    {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    ) : (
                        <BadgeCheck className="h-6 w-6 text-green-500" />
                    )}
                </h2>
                <div className="card-body">
                    <div className="text-3xl font-bold text-center">
                        {points !== null ? points : '-'} points
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-2">
                        Earn more points by providing feedback!
                    </p>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto">
                <h2 className="card-title">Feedback Summary</h2>
                <div className="card-body space-y-4">
                    <button
                        className="btn btn-primary btn-block w-full"
                        onClick={handleGetSummary}
                        disabled={summaryLoading}
                    >
                        {summaryLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Summary...
                            </>
                        ) : (
                            'Generate Feedback Summary'
                        )}
                    </button>

                    {summary && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{summary}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FeedbackDashboard
