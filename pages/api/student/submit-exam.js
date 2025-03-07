import { pool } from '../../../config/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        console.log('🔹 API /submit-exam called');
        console.log('🔹 Request Body:', req.body);

        const { student, exam_id, answers } = req.body;
        console.log('🔹 Extracted Data:', student, exam_id, answers);

        // 🔴 Check if student exists in DB
        const studentQuery = await pool.query('SELECT id FROM students WHERE email = $1', [student.email]);
        if (studentQuery.rows.length === 0) {
            console.error(`❌ Student not found: ${student.email}`);
            return res.status(400).json({ message: 'Student not registered' });
        }

        const studentId = studentQuery.rows[0].id;
        console.log(`✅ Student Found: ID ${studentId}`);

        // 🔴 Check if exam exists
        const examQuery = await pool.query('SELECT * FROM exams WHERE id = $1', [exam_id]);
        if (examQuery.rows.length === 0) {
            console.error(`❌ Exam not found: ${exam_id}`);
            return res.status(404).json({ message: 'Exam not found' });
        }

        const examData = examQuery.rows[0];
        console.log(`✅ Exam Found:`, examData);

        // 🔴 Save the student's answers in the database
        const insertAnswer = await pool.query(
            'INSERT INTO exam_results (student_id, exam_id, answers) VALUES ($1, $2, $3) RETURNING id',
            [studentId, exam_id, JSON.stringify(answers)]
        );

        console.log(`✅ Exam submitted successfully. Result ID: ${insertAnswer.rows[0].id}`);
        return res.status(200).json({ message: 'Exam submitted successfully' });

    } catch (error) {
        console.error('❌ API Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
