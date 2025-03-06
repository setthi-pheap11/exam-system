import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { title, questions, teacher_id } = req.body
      const result = await pool.query(
        'INSERT INTO exams (title, questions, teacher_id) VALUES ($1, $2, $3) RETURNING *',
        [title, JSON.stringify(questions), teacher_id]
      )
      res.status(201).json(result.rows[0])
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}
