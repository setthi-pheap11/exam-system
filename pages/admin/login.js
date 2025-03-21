import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const teacher = JSON.parse(localStorage.getItem('teacher'));
      if (teacher && teacher.email) {
        router.push('/admin/create-exam'); // ✅ Redirect if already logged in
      }
    }
  }, []);

  const login = async () => {
    try {
      const response = await axios.post('/api/teachers/login', { email, password });
      if (response.data.success) {
        // ✅ Save login session persistently
        localStorage.setItem('teacher', JSON.stringify({ email }));
        alert('Login successful!');
        router.push('/admin/create-exam'); // Redirect to admin dashboard
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Teacher Login</h1>
      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 w-full" onClick={login}>
        Login
      </button>
      
    </div>
    
  );
}
