import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (req.method === 'GET') {
      // ✅ Fetch the exam data by ID
      const result = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      res.status(200).json(result.rows[0]); // ✅ Send the exam data properly
    }

    else if (req.method === 'PUT') {
      // ✅ Update exam title and questions
      const { title, questions } = req.body;
      await pool.query(
        'UPDATE exams SET title = $1, questions = $2 WHERE id = $3',
        [title, JSON.stringify(questions), id]
      );
      res.status(200).json({ message: 'Exam updated successfully' });
    }

    else if (req.method === 'DELETE') {
      // ✅ Delete the exam by ID
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
