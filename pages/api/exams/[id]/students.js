import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async (req, res) => {
  const { id } = req.query;
  const students = await pool.query(`
    SELECT s.fullname, s.email, se.answers, se.score,
    RANK() OVER (ORDER BY score DESC) as rank
    FROM student_exams se
    JOIN students s ON s.id = se.student_id
    WHERE exam_id=$1 ORDER BY score DESC
  `, [id])

  res.json(students.rows)
}
