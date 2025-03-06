import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    await pool.query('INSERT INTO teachers (email,password) VALUES ($1,$2)', [email, password])
    res.status(201).json({ message: 'Teacher Registered' })
  }
}
