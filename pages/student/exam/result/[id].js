import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../../../components/Navbar';

export default function ExamResult() {
    const router = useRouter();
    const { id } = router.query;
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        // Fetch exam result from the backend
        axios.get(`/api/student/result/${id}`)
            .then((response) => {
                setResult(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching exam result:", error);
                setError("Failed to load exam result.");
                setLoading(false);
            });

    }, [id]);

    if (loading) return <p>Loading exam result...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto py-10">
                <h1 className="text-2xl font-bold text-primary">Exam Result</h1>

                <div className="mt-4 p-4 border rounded bg-gray-100">
                     <p><strong>Student Name:</strong> {result.student_name}</p>
                     <p><strong>Exam Title:</strong> {result.exam_title}</p>
                     <p><strong>Score:</strong> {result.score} / {result.total_score}</p>
                     <p><strong>Rank:</strong> #{result.rank}</p>
                </div>


                <button
                    className="bg-blue-500 text-black px-4 py-2 mt-4 rounded"
                    onClick={() => router.push('/')}
                >
                    Back to Home
                </button>
            </div>
        </>
    );
}
