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

    // 🔍 Check if student exists in the DB
    const studentQuery = await pool.query(
      'SELECT id FROM students WHERE email = $1',
      [student.email]
    );
    if (studentQuery.rows.length === 0) {
      console.error(`❌ Student not found: ${student.email}`);
      return res.status(400).json({ message: 'Student not registered' });
    }

    const studentId = studentQuery.rows[0].id;
    console.log(`✅ Student Found: ID ${studentId}`);

    // 📝 Fetch the exam and its questions
    const examQuery = await pool.query(
      'SELECT questions FROM exams WHERE id = $1',
      [exam_id]
    );
    if (examQuery.rows.length === 0) {
      console.error(`❌ Exam not found: ${exam_id}`);
      return res.status(404).json({ message: 'Exam not found' });
    }

    const questions = examQuery.rows[0].questions;
    let totalScore = 0;
    let maxScore = 0;

    // ✅ Calculate score properly
    questions.forEach((question, index) => {
      const correctAnswer = String(question.correctAnswer || '').trim();
      const studentAnswer = String(answers[index] || '').trim();

      console.log(`➡️ Q${index + 1}: student="${studentAnswer}", correct="${correctAnswer}"`);

      maxScore += question.score;

      if (studentAnswer === correctAnswer && correctAnswer !== '') {
        totalScore += question.score;
      }
    });

    console.log(`✅ Final Score: ${totalScore} / ${maxScore}`);

    // 🧾 Save result
    const insertAnswer = await pool.query(
      'INSERT INTO exam_results (student_id, exam_id, answers, score) VALUES ($1, $2, $3, $4) RETURNING id',
      [studentId, exam_id, JSON.stringify(answers), totalScore]
    );

    console.log(`🎉 Exam submitted. Result ID: ${insertAnswer.rows[0].id}`);
    return res.status(200).json({
      message: 'Exam submitted successfully',
      totalScore,
      maxScore,
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}
