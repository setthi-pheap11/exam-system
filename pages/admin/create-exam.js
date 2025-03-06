import Navbar from '../../components/Navbar'
import { useState } from 'react'
import axios from 'axios'

export default function CreateExam() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      choices: [''],
      correctAnswer: '',
      score: 1
    }]);
  };

  const addChoice = (qIdx) => {
    questions[qIdx].choices.push('');
    setQuestions([...questions]);
  };

  const saveExam = async () => {
    await axios.post('/api/exams', { title, questions, teacher_id: 1 });
    alert('Exam Created!');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-primary">Create Exam</h1>
        <input className="border p-2 w-full mt-4" placeholder="Exam Title" onChange={(e) => setTitle(e.target.value)} />

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border p-4 my-4">
            <input className="border p-2 w-full" placeholder={`Question ${qIdx + 1}`} 
              onChange={(e)=> {
                questions[qIdx].question=e.target.value;
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
              questions[qIdx].correctAnswer=e.target.value; 
              setQuestions([...questions]);
            }}/>

            <input className="border p-2 w-full mt-2" placeholder="Score" type="number" onChange={(e) => {
              questions[qIdx].score=parseInt(e.target.value); 
              setQuestions([...questions]);
            }}/>
          </div>
        ))}

        <button className="bg-secondary text-white px-4 py-2 mt-4" onClick={addQuestion}>Add Question</button>
        <button className="bg-primary text-white px-4 py-2 ml-4" onClick={saveExam}>Save Exam</button>
      </div>
    </>
  );
}
