import { useState } from 'react'
import FeedbackDashboard from './components/FeedBack.jsx'
import SubmissionForm from './components/SubmissionForm.jsx'

function App() {
    return (
        <div className="text-6xl">
            <FeedbackDashboard />
            <SubmissionForm />
        </div>
    )
}

export default App
