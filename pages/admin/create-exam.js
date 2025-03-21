import Navbar from '../../components/Navbar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Footer from '../../components/Footer'


export default function CreateExam() {
  const router = useRouter()
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false); //  Restored state
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') { // ✅ Ensure it's running on the client-side
      const storedTeacher = JSON.parse(localStorage.getItem('teacher'));
      
      if (!storedTeacher || !storedTeacher.email) {
        router.push('/admin/login'); // Redirect if not logged in
      } else {
        setTeacher(storedTeacher); // ✅ Set teacher state
        fetchExams(); // Fetch exams only if logged in
      }
    }
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get('/api/exams');
      setExams(res.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };
  const logout = () => {
    localStorage.removeItem('teacher'); // ✅ Clear session
    router.push('/admin/login'); // Redirect to login page
  };


  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students/finished');
      setStudents(res.data);
      setShowStudents(true); //  Show students list when clicked
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', choices: [''], correctAnswer: '', score: 1 }]);
  };

  const addChoice = (qIdx) => {
    questions[qIdx].choices.push('');
    setQuestions([...questions]);
  };

  const saveExam = async () => {
    console.log("🚀 Submitting Exam:", { title, questions, teacher_id: 1, start_date: startDate, end_date: endDate });

    await axios.post('/api/exams', { title, questions, teacher_id: 1, start_date: startDate, end_date: endDate });
    alert('Exam Created!');
    fetchExams();
  };

const exportToCSV = () => {
  if (!students.length) return;

  const headers = ['Full Name', 'Email', 'Exam ID','Class' ,'Year','Score', 'Rank'];
  const rows = students.map(s => [
    s.fullname, s.email, s.exam_id, s.class, s.year, s.score, s.rank
  ]);

  let csvContent = "data:text/csv;charset=utf-8,"
    + headers.join(",") + "\n"
    + rows.map(r => r.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "students_exam_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const handleDeleteExam = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      await axios.delete(`/api/exams/${id}`);
      fetchExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-4">Logout</button>
        <h1 className="text-2xl font-bold text-primary">Create Exam</h1>

        <input className="border p-2 w-full mt-4" placeholder="Exam Title" onChange={(e) => setTitle(e.target.value)} />
        
        <input 
          className="border p-2 w-full mt-4" 
          type="datetime-local" 
          placeholder="Start Date" 
          onChange={(e) => setStartDate(e.target.value)} 
        />

        <input 
          className="border p-2 w-full mt-4" 
          type="datetime-local" 
          placeholder="End Date (Expiration)" 
          onChange={(e) => setEndDate(e.target.value)} 
        />

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border p-4 my-4">
            <input className="border p-2 w-full" placeholder={`Question ${qIdx + 1}`} 
              onChange={(e)=> {
                questions[qIdx].question = e.target.value;
                setQuestions([...questions]);
              }}/>

            {q.choices.map((choice, cIdx) => (
              <input key={cIdx} className="border p-2 w-full mt-2" placeholder={`Choice ${cIdx+1}`}
                onChange={(e) => {
                  q.choices[cIdx] = e.target.value;
                  setQuestions([...questions]);
                }}
              />
            ))}
            <button className="bg-green-500 text-white px-2 py-1 mt-2"
              onClick={() => addChoice(qIdx)}>+ Add Choice</button>

            <input className="border p-2 w-full mt-2" placeholder="Correct Answer" onChange={(e) => {
              questions[qIdx].correctAnswer = e.target.value; 
              setQuestions([...questions]);
            }}/>

            <input className="border p-2 w-full mt-2" placeholder="Score" type="number" onChange={(e) => {
              questions[qIdx].score = parseInt(e.target.value); 
              setQuestions([...questions]);
            }}/>
          </div>
        ))}

        <button className="bg-secondary text-black px-4 py-2 mt-4" onClick={addQuestion}>Add Question</button>
        <button className="bg-primary text-black px-4 py-2 ml-4" onClick={saveExam}>Save Exam</button>

        <h2 className="text-xl font-bold mt-8">Existing Exams</h2>
        <div className="border mt-2 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="p-2 border">Exam Title</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">End Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <tr key={exam.id} className="border">
                    <td className="p-2 border">{exam.title}</td>
                    <td className="p-2 border">{exam.start_date ? new Date(exam.start_date).toLocaleString() : "Not Set"}</td>
                    <td className="p-2 border">{exam.end_date ? new Date(exam.end_date).toLocaleString() : "No Expiration"}</td>
                    <td className="p-2 border">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center">No exams found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       
        <button className="bg-blue-500 text-white px-4 py-2 mt-6" onClick={fetchStudents}>
          View Students Who Finished Exams
        </button>
        <button
              className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
              onClick={exportToCSV}
          >
                Export to CSV
            </button>
    
        {showStudents && (
          
          <div className="mt-6 border p-4 rounded-lg bg-black-100">
            <h2 className="text-lg font-bold mb-2">Students Who Finished Exams</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-300 text-left">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Exam ID</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Year</th>
                  <th className="p-2 border">Score</th>
                  <th className="p-2 border">Rank</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} className="border">
                      <td className="p-2 border">{student.fullname}</td>
                      <td className="p-2 border">{student.email}</td>
                      <td className="p-2 border">{student.exam_id}</td>
                      <td className="p-2 border">{student.class}</td>
                      <td className="p-2 border">{student.year}</td>
                      <td className="p-2 border">{student.score}</td>
                      <td className="p-2 border">{student.rank}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
    
  );
}
