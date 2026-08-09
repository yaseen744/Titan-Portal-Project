import { asyncHandler } from '../middleware/errorHandler.js'

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })
  const url = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`
  res.status(201).json({ url })
})
