import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { title, questions, teacher_id, start_date, end_date } = req.body;

      // Convert questions to JSON format
      const questionsJSON = JSON.stringify(questions);

      // ✅ Insert exam with start_date & end_date
      const result = await pool.query(
        'INSERT INTO exams (title, questions, teacher_id, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, questionsJSON, teacher_id, start_date, end_date]
      );

      res.status(201).json(result.rows[0]);
    } 
    else if (req.method === 'GET') {
      // ✅ Fetch all exams with start_date & end_date
      const result = await pool.query('SELECT * FROM exams ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
