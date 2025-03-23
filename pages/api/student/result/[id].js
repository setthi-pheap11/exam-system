import { pool } from '../../../../config/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Missing student email' });

  try {
    const studentRes = await pool.query(
      'SELECT id, fullname, class, year FROM students WHERE email = $1',
      [email]
    );
    if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const student = studentRes.rows[0];

    const result = await pool.query(`
      SELECT er.id AS result_id, er.score, er.answers, 
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

    const { result_id, score, answers, total_score } = result.rows[0];

    // Calculate rank
    const rankQuery = await pool.query(
      `SELECT COUNT(*) + 1 AS rank
       FROM exam_results
       WHERE exam_id = $1 AND score > $2`,
      [id, score]
    );

    const rank = rankQuery.rows[0].rank;

    return res.status(200).json({
      student_name: student.fullname,
      student_class: student.class,
      student_year: student.year,
      answers,
      score,
      total_score,
      rank,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
