import { useEffect, useState } from 'react'

function SubmissionForm() {
    const [rating, setRating] = useState(2)
    const [comments, setComments] = useState('')
    const [anonymous, setAnonymous] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submissionState, setSubmissionState] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:3000/feedback`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    user_id: anonymous ? null : 1,
                    rating,
                    comments,
                    is_anonymous: anonymous,
                }),
            })
            setSubmissionState('Feedback submitted successfully')
        } catch (error) {
            setSubmissionState('Error submitting feedback')
            console.error('Error fetching points:', error)
        }
        setLoading(false)
        console.log(rating, comments, anonymous)
    }

    return (
        <form className="w-full max-w-md mx-auto flex flex-col gap-4 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold">Submit Feedback</h2>
            <div className="flex items-center gap-4">
                <label htmlFor="rating" className="label text-2xl">
                    Rating
                </label>
                <div className="rating">
                    <input
                        type="radio"
                        name="rating-2"
                        onClick={() => setRating(1)}
                        className="mask mask-star-2 bg-orange-400"
                    />
                    <input
                        type="radio"
                        name="rating-2"
                        className="mask mask-star-2 bg-orange-400"
                        defaultChecked
                    />
                    <input
                        type="radio"
                        name="rating-2"
                        onClick={() => setRating(3)}
                        className="mask mask-star-2 bg-orange-400"
                    />
                    <input
                        type="radio"
                        name="rating-2"
                        onClick={() => setRating(4)}
                        className="mask mask-star-2 bg-orange-400"
                    />
                    <input
                        type="radio"
                        name="rating-2"
                        onClick={() => setRating(5)}
                        className="mask mask-star-2 bg-orange-400"
                    />
                </div>
            </div>
            <textarea
                placeholder="Share your thoughts..."
                className="textarea textarea-bordered"
                name="comments"
                id="comments"
                onChange={(e) => setComments(e.target.value)}
            />
            <div className="flex items-center gap-4">
                <label htmlFor="anonymous" className="label text-2xl">
                    Anonymous
                </label>
                <input
                    type="checkbox"
                    name="anonymous"
                    id="anonymous"
                    className="checkbox-primary size-4"
                    onChange={(e) => setAnonymous(e.target.checked)}
                    size={40}
                />
            </div>
            <button
                className="btn btn-primary btn-block"
                onClick={handleSubmit}
            >
                {loading ? (
                    <>
                        <span className="loading loading-dots loading-md"></span>
                    </>
                ) : (
                    'Submit'
                )}
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
                {submissionState}
            </p>
        </form>
    )
}

export default SubmissionForm
