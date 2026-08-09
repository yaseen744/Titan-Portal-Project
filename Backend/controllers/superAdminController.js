import SuperAdmin from '../models/SuperAdmin.js'
import { findDuplicateAccount } from '../utils/checkUnique.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const updateMySuperAdminProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, photo, country } = req.body
  const superAdmin = await SuperAdmin.findById(req.user._id)

  if (email || phone) {
    const dup = await findDuplicateAccount({ email, phone, excludeId: superAdmin._id, excludeModel: 'SuperAdmin' })
    if (dup.duplicate) {
      return res.status(409).json({ message: `This ${dup.field} is already used by another account (${dup.inModel}).` })
    }
  }

  if (name) superAdmin.name = name
  if (email) superAdmin.email = email
  if (phone) superAdmin.phone = phone
  if (photo) superAdmin.photo = photo
  if (country) superAdmin.country = country

  await superAdmin.save()
  const safe = superAdmin.toObject()
  delete safe.password
  res.json(safe)
})
