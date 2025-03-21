import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentAuthModal({ onLoginSuccess }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));
    if (student) {
      setIsOpen(false); // Close modal if already logged in
      onLoginSuccess(student);
    }
  }, []);

  // Handle Login
  const handleLogin = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    axios
      .post('/api/student/login', { email })
      .then((res) => {
        localStorage.setItem('student', JSON.stringify(res.data.student));
        setIsOpen(false);
        onLoginSuccess(res.data.student);
      })
      .catch(() => {
        setError('Student not found. Please register.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle Registration
  const handleRegister = () => {
    if (!email || !fullname || !studentClass || !year) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    axios
      .post('/api/student/register', { email, fullname, studentClass, year })
      .then(() => {
        localStorage.setItem('student', JSON.stringify({ email, fullname, studentClass, year }));
        setIsOpen(false);
        onLoginSuccess({ email, fullname, studentClass, year });
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Registration failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            className="border p-2 w-full mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isRegister && (
            <>
              <input
                className="border p-2 w-full mb-2"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Class"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </>
          )}
          <button
            className="bg-blue-500 text-white px-4 py-2 w-full"
            onClick={isRegister ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
          <p className="text-center mt-4">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </p>
        </div>
      </div>
    )
  );
}
