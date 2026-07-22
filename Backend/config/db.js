import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.DB_NAME || 'titan_portal'
  if (!uri) throw new Error('MONGODB_URI is missing from .env')
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, { dbName })
  console.log(`[MongoDB] Connected -> database: "${dbName}"`)
}