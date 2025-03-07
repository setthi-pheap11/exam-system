import Navbar from '../../../../components/Navbar';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExamPage() {
    const router = useRouter();
    const { id } = router.query;
    
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitingTime, setWaitingTime] = useState(null);

    useEffect(() => {
        async function fetchExam() {
            try {
                const response = await axios.get(`/api/exams/${id}`);
                setExam(response.data);

                if (response.data.start_date && response.data.end_date) {
                    const startTime = new Date(response.data.start_date).getTime();
                    const endTime = new Date(response.data.end_date).getTime();
                    checkExamTiming(startTime, endTime);
                }
            } catch (error) {
                console.error("❌ Error loading exam:", error);
            }
        }

        fetchExam();
    }, [id]);

    // ✅ Check Exam Timing (Start & End)
    const checkExamTiming = (startTime, endTime) => {
        const now = new Date().getTime();

        // If the exam has **not started yet**
        if (now < startTime) {
            setIsWaiting(true);
            startCountdown(startTime, setWaitingTime, () => setIsWaiting(false));
            return;
        }

        // If the exam **is running**, show time left until expiration
        setIsWaiting(false);
        startCountdown(endTime, setTimeLeft, () => setIsExpired(true));
    };

    // ⏳ Countdown Timer
    const startCountdown = (targetTime, setCountdownState, onComplete) => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = targetTime - now;

            if (diff <= 0) {
                clearInterval(interval);
                setCountdownState("Time Expired");
                onComplete(); // ✅ Call function when time is up
            } else {
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setCountdownState(`${minutes}m ${seconds}s`);
            }
        }, 1000);
    };

    const handleSubmit = async () => {
        if (isExpired || isWaiting) return; // ⛔ Prevent submission if expired or waiting

        const student = JSON.parse(sessionStorage.getItem('student'));
        if (!student) {
            alert("Please register first!");
            router.push(`/student/exam/${id}`);
            return;
        }

        try {
            setLoading(true);
            await axios.post('/api/student/submit-exam', {
                student,
                exam_id: id,
                answers
            });

            alert("Exam Submitted!");
            router.push(`/student/exam/result/${id}`);

        } catch (error) {
            console.error("❌ Submission Error:", error);
            alert("Failed to submit exam. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-lg mx-auto py-10">
                <h1 className="text-2xl font-bold text-primary">{exam?.title}</h1>
                
                {/* 🔹 Exam Start Time Countdown */}
                {isWaiting ? (
                    <h3 className="text-blue-500 text-lg">
                        Please wait until exam starts: {waitingTime || "Loading..."}
                    </h3>
                ) : (
                    exam?.end_date && (
                        <h3 className="text-red-500 text-lg">
                            Time Left: {timeLeft || "Loading..."}
                        </h3>
                    )
                )}

                {exam?.questions?.map((question, index) => (
                    <div key={index} className="border p-4 my-4">
                        <p className="font-bold">{question.question}</p>
                        {question.choices.map((choice, i) => (
                            <label key={i} className="block">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={choice}
                                    onChange={() => setAnswers({ ...answers, [index]: choice })}
                                    disabled={isWaiting}
                                />
                                {choice}
                            </label>
                        ))}
                    </div>
                ))}

                <button 
                    className={`p-2 w-full mt-4 ${isWaiting || isExpired ? "bg-gray-400 cursor-not-allowed" : "bg-secondary text-white"}`}
                    onClick={handleSubmit}
                    disabled={loading || isWaiting || isExpired}
                >
                    {isWaiting ? "Exam Not Started" : isExpired ? "Time Expired" : loading ? "Submitting..." : "Submit Exam"}
                </button>
            </div>
        </>
    );
}
