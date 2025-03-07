import Navbar from '../../../components/Navbar';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';

export default function ExamAccessPage() {
    const router = useRouter();
    const { id } = router.query;

    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStudentRegister = async () => {
        if (!email || !fullname || !studentClass || !year) {
            alert("Please fill in all fields before starting the exam.");
            return;
        }

        const studentData = { email, fullname, studentClass, year };

        try {
            setLoading(true);

            // 🔹 Register student or get existing student
            const response = await axios.post('/api/student/register', studentData);
            console.log("✅ Student found/registered:", response.data);

            // 🔹 Store student info in session (for later)
            sessionStorage.setItem('student', JSON.stringify(studentData));

            // 🔹 Redirect to the exam page
            router.push(`/student/exam/start/${id}`);

        } catch (error) {
            console.error("❌ Registration Error:", error);
            alert("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto py-10">
                <h1 className="text-2xl font-bold text-primary">Register or Login to Start Exam</h1>

                <input placeholder="Email" className="border p-2 w-full mt-4" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Full Name" className="border p-2 w-full mt-2" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                <input placeholder="Class" className="border p-2 w-full mt-2" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
                <input placeholder="Year" className="border p-2 w-full mt-2" type="number" value={year} onChange={(e) => setYear(e.target.value)} />

                <button className="bg-secondary text-white p-2 w-full mt-4" onClick={handleStudentRegister} disabled={loading}>
                    {loading ? "Processing..." : "Start Exam"}
                </button>
            </div>
        </>
    );
}
