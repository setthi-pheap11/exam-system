import { pool } from '../../../../config/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Missing student email' });

  try {
    const studentRes = await pool.query('SELECT id, fullname, class, year FROM students WHERE email = $1', [email]);
    if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const student = studentRes.rows[0];

    const result = await pool.query(`
      SELECT er.score, er.answers, 
             (SELECT SUM((q->>'score')::int) FROM jsonb_array_elements(e.questions) q) AS total_score
      FROM exam_results er
      JOIN exams e ON e.id = er.exam_id
      WHERE er.student_id = $1 AND er.exam_id = $2
      ORDER BY er.id DESC
      LIMIT 1
    `, [student.id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Result not found" });
    }

    return res.status(200).json({
      ...result.rows[0],
      student_name: student.fullname,
      student_class: student.class,
      student_year: student.year,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
