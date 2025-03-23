import { Pool } from 'pg';
import { DateTime } from 'luxon';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (req.method === 'GET') {
      // ✅ Fetch the exam data by ID
      const result = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      const exam = result.rows[0];

      // ✅ Convert start_time and end_time to Cambodia time if they exist
      if (exam.start_time) {
        exam.start_time = DateTime.fromISO(exam.start_time).setZone('Asia/Phnom_Penh').toISO();
      }

      if (exam.end_time) {
        exam.end_time = DateTime.fromISO(exam.end_time).setZone('Asia/Phnom_Penh').toISO();
      }

      res.status(200).json(exam);
    }

    else if (req.method === 'PUT') {
      
      const { title, questions } = req.body;

      await pool.query(
        'UPDATE exams SET title = $1, questions = $2 WHERE id = $3',
        [title, JSON.stringify(questions), id]
      );

      res.status(200).json({ message: 'Exam updated successfully' });
    }

    else if (req.method === 'DELETE') {
      
      await pool.query('DELETE FROM exams WHERE id = $1', [id]);
      res.status(200).json({ message: 'Exam deleted successfully' });
    }

    else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
