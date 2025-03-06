import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body
    await pool.query('INSERT INTO students (name) VALUES ($1)', [name])
    res.status(201).json({ message: 'Student Registered' })
  }
}
