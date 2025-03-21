import { pool } from '../../../config/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fullname, email, password } = req.body;

  try {
    // Check if email already exists
    const exists = await pool.query('SELECT email FROM students WHERE email=$1', [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Insert new student
    await pool.query('INSERT INTO students (fullname, email, password) VALUES ($1, $2, $3)', [fullname, email, password]);

    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
