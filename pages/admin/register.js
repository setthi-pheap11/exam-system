import Navbar from '../../components/Navbar'
import { useState } from 'react'
import axios from 'axios'

export default function TeacherRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const registerTeacher = async () => {
    await axios.post('/api/teachers/register', { email, password })
    alert('Teacher Registered')
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 max-w-md">
        <h1 className="text-2xl font-bold text-primary">Teacher Admin Registration</h1>
        <input className="border w-full p-2 mt-4" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="border w-full p-2 mt-2" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-secondary text-white p-2 w-full mt-4" onClick={registerTeacher}>
          Register
        </button>
      </div>
    </>
  );
}
