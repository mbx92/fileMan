// Script to create a local admin user
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'superadmin@local'
  const username = 'superadmin'
  const password = 'Admin123!' // Change this after first login!
  const name = 'Super Admin'
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // Check if user already exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  })
  
  if (existing) {
    console.log('User already exists:', existing.email)
    return
  }
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      name,
      role: 'SUPERADMIN'
    }
  })
  
  console.log('✅ Local admin user created successfully!')
  console.log('─'.repeat(40))
  console.log('Email:', email)
  console.log('Username:', username)
  console.log('Password:', password)
  console.log('Role:', user.role)
  console.log('─'.repeat(40))
  console.log('⚠️  Please change the password after first login!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
