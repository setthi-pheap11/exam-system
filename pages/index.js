import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import StudentAuthModal from '../components/StudentAuthModal';

export default function Home() {
  const [exams, setExams] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get('/api/exams').then(res => setExams(res.data));

    // Check if student is already logged in
    const storedStudent = JSON.parse(localStorage.getItem('student'));
    if (storedStudent) {
      setStudent(storedStudent);
    }
  }, []);

  return (
    <>
      <Navbar />
      {!student && <StudentAuthModal onLoginSuccess={(studentData) => setStudent(studentData)} />}
      <div className="container mx-auto py-10 max-w-3xl mt-24">

        <h1 className="text-3xl font-bold text-primary mb-4">Available Exams</h1>
        {exams.length === 0 ? (
          <p>No exams available yet.</p>
        ) : (
          exams.map(exam => (
            <Link key={exam.id} href={`/student/exam/${exam.id}`}>
              
              <div className="border rounded p-4 my-2 cursor-pointer hover:bg-gray-100">
                {exam.title}
              </div>
            </Link>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
