import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    // Fetch the exam data by ID
    const result = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json(result.rows[0]); // ✅ Send the exam data properly
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
