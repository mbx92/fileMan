// Update superadmin email
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.update({
    where: { username: 'superadmin' },
    data: { email: 'superadmin@fileman.id' }
  })
  console.log('✅ Email updated:', user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
