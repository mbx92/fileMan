import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'system' }
  })

  console.log('=== OnlyOffice Settings ===')
  console.log('Enabled:', settings?.onlyofficeEnabled)
  console.log('URL:', settings?.onlyofficeUrl)
  console.log('Secret:', settings?.onlyofficeSecret ? '***set***' : '(not set)')
  console.log('Edit Enabled:', settings?.onlyofficeEditEnabled)
  console.log('CoEdit:', settings?.onlyofficeCoEdit)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
