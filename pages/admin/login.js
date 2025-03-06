import Navbar from '../../components/Navbar'
import { useState } from 'react'
import axios from 'axios'

export default function TeacherLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginTeacher = async () => {
    const res = await axios.post('/api/teachers/login', { email, password })
    if (res.data.success) {
      alert('Login Successful')
      window.location.href = '/admin/create-exam'
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold text-primary">Teacher Login</h1>
        <input className="border p-2 w-full mt-4" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input className="border p-2 w-full mt-2" placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)} />
        <button className="bg-secondary text-white p-2 w-full mt-4" onClick={loginTeacher}>Login</button>
      </div>
    </>
  );
}
