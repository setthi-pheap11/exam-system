import Navbar from '../../../../components/Navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ExamStart() {
  const router = useRouter();
  const { id } = router.query;
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    async function fetchExam() {
      try {
        if (!id) return;
        
        const res = await axios.get(`/api/exams/${id}`);
        setExam(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading exam:', error);
        setLoading(false);
      }
    }

    fetchExam();

    // Get student data
    const studentData = JSON.parse(sessionStorage.getItem('student'));
    if (studentData) {
      setStudent(studentData);
    } else {
      alert("Please register first.");
      router.push(`/student/exam/${id}`);
    }
  }, [id]);

  const handleAnswerChange = (qIndex, choice) => {
    setAnswers({ ...answers, [qIndex]: choice });
  };

  const handleSubmit = async () => {
    if (!student) {
      alert("Student not found, please register again.");
      return;
    }
  
    try {
      const response = await axios.post('/api/student/submit-exam', {  // ✅ Ensure this is the correct URL
        student,
        exam_id: id,
        answers
      });
  
      if (response.status === 200) {
        alert(`Exam submitted successfully! Your score: ${response.data.score}`);
        router.push(`/student/exam/result/${id}`);
      } else {
        alert("Failed to submit exam. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Failed to submit exam. Please try again.");
    }
  };
  
  
  

  if (loading) return <p>Loading Exam...</p>; // ✅ Show loading only when necessary
  if (!exam) return <p>Error loading exam.</p>; // ✅ Handle missing exam

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold">{exam.title}</h1>

        {exam.questions.map((q, qIndex) => (
          <div key={qIndex} className="border rounded p-4 my-4">
            <p className="font-bold">{q.question}</p>
            {q.choices.map((choice, cIndex) => (
              <label key={cIndex} className="block mt-1">
                <input type="radio" name={`question-${qIndex}`} value={choice}
                  onChange={() => handleAnswerChange(qIndex, choice)}
                /> {choice}
              </label>
            ))}
          </div>
        ))}

        <button className="bg-primary text-white px-4 py-2 mt-4" onClick={handleSubmit}>
          Submit Exam
        </button>
      </div>
    </>
  );
}
