import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../../../components/Navbar';

export default function ExamResult() {
  const router = useRouter();
  const { id } = router.query;

  const [exam, setExam] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!id) return;

    const storedStudent = localStorage.getItem('student');
    if (!storedStudent) {
      setError("Student not logged in.");
      setLoading(false);
      return;
    }

    const studentData = JSON.parse(storedStudent);
    setStudent(studentData);

    const fetchResult = async () => {
      try {
        // 1. Get exam questions
        const examRes = await axios.get(`/api/exams/${id}`);
        setExam(examRes.data);

        // 2. Get result from DB
        const resultRes = await axios.post(`/api/student/result/${id}`, {
          email: studentData.email,
        });

        setResult(resultRes.data);
      } catch (err) {
        console.error("❌ Error fetching result:", err);
        setError("No result found for this exam.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading result...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 max-w-3xl mt-24">
        <h1 className="text-2xl font-bold text-primary mb-4">🎯 Exam Result</h1>

        <div className="bg-white bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-md space-y-4">
  <p><strong>👤 Student:</strong> {result.student_name}</p>
  <p><strong>🏫 Class:</strong> {result.student_class}</p>
  <p><strong>📅 Year:</strong> {result.student_year}</p>
  <hr />

  {exam.questions.map((q, idx) => {
    const studentAns = (result.answers[idx] || "").trim();
    const correctAns = (q.correctAnswer || "").trim();
    const isCorrect = studentAns === correctAns;

    return (
      <div key={idx} className={`p-2 rounded-md ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className="font-semibold">➡️ Q{idx + 1}:</p>
        <p className="ml-4">Student Answer: <span className="font-mono">"{studentAns || 'No Answer'}"</span></p>
        <p className="ml-4">Correct Answer: <span className="font-mono">"{correctAns}"</span></p>
      </div>
    );
  })}

  <p className="font-bold text-lg mt-4 text-green-700">
    ✅ Final Score: {result.score} / {result.total_score}
  </p>
</div>


        <button
          className="bg-blue-500 text-white px-4 py-2 mt-6 rounded hover:bg-blue-600"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    </>
  );
}
