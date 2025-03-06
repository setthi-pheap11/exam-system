import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM teachers WHERE email=$1 AND password=$2', [email, password])

    if (result.rows.length > 0) {
      res.status(200).json({ success: true })
    } else {
      res.status(401).json({ success: false })
    }
  }
}
