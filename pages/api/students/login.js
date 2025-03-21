import { pool } from '../../../config/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT id, fullname, email FROM students WHERE email=$1 AND password=$2', [email, password]);

    if (result.rows.length > 0) {
      return res.status(200).json({ success: true, student: result.rows[0] });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
