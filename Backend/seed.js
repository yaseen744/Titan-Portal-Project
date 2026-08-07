import bcrypt from 'bcryptjs'
import SuperAdmin from './models/SuperAdmin.js'
import Counter from './models/Counter.js'

// Runs automatically every time the server boots. It's fully idempotent -
// if the Super Admin / counters already exist, it does nothing - so it's
// safe to leave wired into server.js permanently.
export async function seedInitialData() {
  const existing = await SuperAdmin.findOne()
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || 'ChangeMe123!', 10)
    await SuperAdmin.create({
      name: process.env.SUPERADMIN_NAME || 'Super Admin',
      email: (process.env.SUPERADMIN_EMAIL || 'admin@example.com').toLowerCase(),
      password: hashed,
      phone: process.env.SUPERADMIN_PHONE || '03000000000',
    })
    console.log(`[Seed] Super Admin account created (${process.env.SUPERADMIN_EMAIL})`)
  }

  const ensureCounter = async (name, start) => {
    const exists = await Counter.findById(name)
    if (!exists) await Counter.create({ _id: name, seq: start - 1 })
  }
  await ensureCounter('studentRoll', 100001)
  await ensureCounter('teacherEmployeeId', 10001)
  await ensureCounter('invoiceNumber', 1000)
}
