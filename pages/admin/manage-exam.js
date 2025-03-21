import Navbar from '../../components/Navbar'
import axios from 'axios'
import { useEffect, useState } from 'react'


export default function ManageExams() {
  const [exams, setExams] = useState([])

  useEffect(() => {
    axios.get('/api/exams').then(res => setExams(res.data))
  }, [])

  const deleteExam = (id) => {
    axios.delete(`/api/exams/${id}`).then(() => {
      setExams(exams.filter(e => e.id !== id))
    })
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold text-primary">My Exams</h1>
        {exams.map(exam => (
          <div key={exam.id} className="border p-4 my-2 rounded">
            <h2 className="font-bold">{exam.title}</h2>
            <button className="bg-secondary text-white px-2 py-1 mt-2" onClick={()=>router.push(`/admin/edit-exam/${exam.id}`)}>Edit</button>
            <button className="bg-red-500 text-white px-2 py-2 ml-2" onClick={()=>deleteExam(exam.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}
