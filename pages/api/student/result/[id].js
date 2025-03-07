import { pool } from '../../../../config/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    try {
        const resultQuery = await pool.query(
            `SELECT 
                e.title AS exam_title, 
                s.fullname AS student_name, 
                er.score, 
                (SELECT COUNT(*) + 1 FROM exam_results WHERE score > er.score) AS rank,
                (SELECT SUM((q->>'score')::INTEGER) FROM jsonb_array_elements(e.questions) AS q) AS total_score
            FROM exam_results er
            JOIN students s ON er.student_id = s.id
            JOIN exams e ON er.exam_id = e.id
            WHERE er.exam_id = $1
            ORDER BY er.score DESC`,
            [id]
        );

        if (resultQuery.rows.length === 0) {
            return res.status(404).json({ error: "Result not found" });
        }

        return res.json(resultQuery.rows[0]);

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
