import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { title, questions, teacher_id } = req.body;

      // Ensure questions is a JS object or array directly
      const questionsJSON = JSON.stringify(questions);

      const result = await pool.query(
        'INSERT INTO exams (title, questions, teacher_id) VALUES ($1, $2, $3) RETURNING *',
        [title, questionsJSON, teacher_id]
      );

      res.status(201).json(result.rows[0]);
    } else if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM exams ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
