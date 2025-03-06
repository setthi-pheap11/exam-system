import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, fullname, studentClass, year } = req.body;

    if (!email || !fullname || !studentClass || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if student already exists
    const existingStudent = await pool.query('SELECT id FROM students WHERE email = $1', [email]);
    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ error: 'Student already registered' });
    }

    // Insert new student
    await pool.query(
      'INSERT INTO students (email, fullname, class, year) VALUES ($1, $2, $3, $4)',
      [email, fullname, studentClass, year]
    );

    res.status(200).json({ message: 'Student registered successfully!' });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
}
