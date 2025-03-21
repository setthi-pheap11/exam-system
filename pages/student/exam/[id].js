import Navbar from '../../../components/Navbar';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExamPage() {
  const router = useRouter();
  const { id } = router.query;
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    async function fetchExam() {
      try {
        const response = await axios.get(`/api/exams/${id}`);
        setExam(response.data);
        updateCountdown(response.data.start_date, response.data.end_date);
      } catch (error) {
        console.error("❌ Error loading exam:", error);
      }
    }

    if (id) fetchExam();
  }, [id]);

  // 🕒 Countdown Timer Logic
  const updateCountdown = (startDate, endDate) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();

      if (now < startTime) {
        // Countdown until exam starts
        const timeUntilStart = startTime - now;
        setTimeLeft(formatTime(timeUntilStart));
        setExamStarted(false);
      } else if (now >= startTime && now < endTime) {
        // Exam is ongoing, countdown until it expires
        const timeUntilEnd = endTime - now;
        setTimeLeft(formatTime(timeUntilEnd));
        setExamStarted(true);
      } else {
        // Exam expired
        setTimeLeft("Time Expired");
        setIsExpired(true);
        setExamStarted(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  // ⏳ Helper function to format countdown time
  const formatTime = (milliseconds) => {
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleSubmit = async () => {
    if (!examStarted || isExpired) return; // Prevents submission if expired

    const student = JSON.parse(localStorage.getItem('student'));
    if (!student) {
      alert("You must log in first!");
      router.push('/');
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
      <div className="container mx-auto py-10 max-w-3xl mt-24">

        {exam ? (
          <>
            <h1 className="text-2xl font-bold text-primary">{exam.title}</h1>
            <p><strong>Start Time:</strong> {new Date(exam.start_date).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(exam.end_date).toLocaleString()}</p>

            {/* ⏳ Countdown Display */}
            <h2 className={`text-lg font-bold mt-4 ${isExpired ? "text-red-500" : "text-green-500"}`}>
              {isExpired ? "This exam has expired." : examStarted ? `Time Left: ${timeLeft}` : `Exam starts in: ${timeLeft}`}
            </h2>

            {/* ❌ Disable exam if it's expired or not started */}
            {!examStarted || isExpired ? (
              <button className="bg-gray-400 text-white p-2 w-full mt-4 cursor-not-allowed" disabled>
                {isExpired ? "Exam Expired" : "Exam Not Available"}
              </button>
            ) : (
              <>
                {exam.questions.map((question, index) => (
                  <div key={index} className="border p-4 my-4">
                    <p className="font-bold">{question.question}</p>
                    {question.choices.map((choice, i) => (
                      <label key={i} className="block">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={choice}
                          onChange={() => setAnswers({ ...answers, [index]: choice })}
                        />
                        {choice}
                      </label>
                    ))}
                  </div>
                ))}

                <button
                  className="bg-secondary text-black p-2 w-full mt-4"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Exam"}
                </button>
              </>
            )}
          </>
        ) : (
          <p>Loading Exam...</p>
        )}
      </div>
    </>
  );
}
