import Navbar from '../../../components/Navbar'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function ExamAccessPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [year, setYear] = useState('');

  // ✅ Define the function properly
  const handleStudentRegister = () => {
    if (!email || !fullname || !studentClass || !year) {
      alert("Please fill in all fields before starting the exam.");
      return;
    }

    const studentData = { email, fullname, studentClass, year };
    sessionStorage.setItem('student', JSON.stringify(studentData));

    // ✅ Redirect to the actual exam start page with the exam ID
    router.push(`/student/exam/start/${id}`);
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

        {/* ✅ Call the function properly */}
        <button className="bg-secondary text-white p-2 w-full mt-4" onClick={handleStudentRegister}>
          Start Exam
        </button>
      </div>
    </>
  );
}
