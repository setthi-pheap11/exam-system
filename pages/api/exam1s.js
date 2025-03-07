import { pool } from '../../../config/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const examsQuery = await pool.query(
            `SELECT id, title, created_at FROM exams ORDER BY created_at DESC`
        );
        return res.status(200).json(examsQuery.rows);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
