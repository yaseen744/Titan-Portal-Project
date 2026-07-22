import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import studentRoutes from './routes/studentRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/student', studentRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[Server] Running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('[MongoDB] Connection failed:', err.message)
    process.exit(1)
  })