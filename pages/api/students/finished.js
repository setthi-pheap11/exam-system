import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  try {
    const result = await pool.query(`
      SELECT s.fullname, s.email, s.class, s.year, er.exam_id, er.score, 
      (SELECT COUNT(*) + 1 FROM exam_results WHERE score > er.score) AS rank
      FROM exam_results er
      JOIN students s ON s.id = er.student_id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
