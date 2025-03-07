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

    useEffect(() => {
        async function fetchExam() {
            try {
                const response = await axios.get(`/api/exams/${id}`);
                setExam(response.data);
            } catch (error) {
                console.error("❌ Error loading exam:", error);
            }
        }

        fetchExam();
    }, [id]);

    const handleSubmit = async () => {
        const student = JSON.parse(sessionStorage.getItem('student'));
        if (!student) {
            alert("Please register first!");
            router.push(`/student/exam/${id}`);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post('/api/student/submit-exam', {
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
                                />
                                {choice}
                            </label>
                        ))}
                    </div>
                ))}
                <button className="bg-secondary text-white p-2 w-full mt-4" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Exam"}
                </button>
            </div>
        </>
    );
}
