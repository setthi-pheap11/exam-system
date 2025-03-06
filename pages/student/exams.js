import Navbar from '../../components/Navbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ExamList() {
  const [exams, setExams] = useState([])

  useEffect(() => {
    axios.get('/api/exams').then(res => setExams(res.data))
  }, [])

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 max-w-3xl">
        <h1 className="text-2xl font-bold text-primary mb-4">Available Exams</h1>
        {exams.map(exam => (
          <Link key={exam.id} href={`/student/exam/${exam.id}`}>
            <div className="border rounded p-3 mb-2 cursor-pointer hover:bg-gray-100">
              {exam.title}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
