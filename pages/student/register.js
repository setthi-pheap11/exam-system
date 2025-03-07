import Navbar from '../../components/Navbar'
import { useState } from 'react'
import axios from 'axios'

export default function StudentRegister() {
    const [form, setForm] = useState({email: '', fullname: '', studentClass: '', year: ''})

  const register = async () => {
    await axios.post('/api/student/register', form)

    alert('Registered!')
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold text-primary">Student Registration</h1>
        <input placeholder="Email" className="border p-2 w-full" onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input placeholder="Full Name" className="border p-2 w-full mt-2" onChange={(e)=>setForm({...form,fullname:e.target.value})} />
        <input placeholder="Class" className="border p-2 w-full mt-2" onChange={(e)=>setForm({...form,class:e.target.value})} />
        <input placeholder="Year" className="border p-2 w-full mt-2" type="number" onChange={(e)=>setForm({...form,year:e.target.value})} />
        <button className="bg-secondary text-black p-2 w-full mt-4" onClick={register}>Register</button>
      </div>
    </>
  );
}
