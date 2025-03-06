import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  console.log("🔹 API /submit-exam called");  // ✅ Debugging

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log("🔹 Request Body:", req.body); // ✅ Log incoming data

    const { student, exam_id, answers } = req.body;

    if (!student || !exam_id || !answers) {
      console.log("❌ Missing required fields:", { student, exam_id, answers }); // Debugging
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch the exam
    console.log("🔹 Fetching exam with ID:", exam_id);
    const examResult = await pool.query('SELECT * FROM exams WHERE id = $1', [exam_id]);

    if (examResult.rows.length === 0) {
      console.log("❌ Exam not found");
      return res.status(404).json({ error: 'Exam not found' });
    }

    const exam = examResult.rows[0];
    console.log("🔹 Exam found:", exam);

    const examQuestions = typeof exam.questions === "string" ? JSON.parse(exam.questions) : exam.questions;

    let score = 0;

    // Calculate score
    examQuestions.forEach((question, index) => {
      if (answers[index] && answers[index] === question.correctAnswer) {
        score += question.score;
      }
    });

    // Get student ID from the database
    console.log("🔹 Fetching student ID for:", student.email);
    const studentRes = await pool.query('SELECT id FROM students WHERE email = $1', [student.email]);

    if (studentRes.rows.length === 0) {
      console.log("❌ Student not found:", student.email);
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = studentRes.rows[0].id;
    console.log("🔹 Student ID:", studentId);

    // Insert student exam record
    console.log("🔹 Inserting exam results...");
    await pool.query(
      'INSERT INTO student_exams (student_id, exam_id, answers, score) VALUES ($1, $2, $3, $4)',
      [studentId, exam_id, JSON.stringify(answers), score]
    );

    console.log("✅ Exam submitted successfully with score:", score);
    res.status(200).json({ message: 'Exam submitted successfully!', score });
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ error: error.message });
  }
   console.log("🔹 API /submit-exam called");
    console.log("🔹 Request Body:", req.body);

}
