import Navbar from '../../components/Navbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ExamList() {
  const [exams, setExams] = useState([])
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    axios.get('/api/exams').then(res => setExams(res.data))
  }, [])

  // ✅ Track cursor movement
  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 max-w-3xl relative">
        <h1 className="text-2xl font-bold text-primary mb-4">Available Exams</h1>

        {/* ✅ Cursor-following effect */}
        <motion.div
          className="absolute w-10 h-10 bg-blue-500 rounded-full opacity-50 pointer-events-none"
          animate={{
            x: cursorPosition.x - 20, 
            y: cursorPosition.y - 20
          }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        />

        {exams.map(exam => (
          <Link key={exam.id} href={`/student/exam/${exam.id}`}>
            <motion.div
              className="border rounded p-3 mb-2 cursor-pointer bg-white hover:bg-gray-100 relative"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,0,0,0.2)" }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {exam.title}
            </motion.div>
          </Link>
        ))}
      </div>
    </>
  );
}
