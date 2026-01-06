import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'

export interface TokenPayload extends JWTPayload {
  userId: string
  email: string
  role: string
}

const config = useRuntimeConfig()

// Get secret key as Uint8Array
function getSecretKey(): Uint8Array {
  const secret = config.jwtSecret || 'default-secret-change-me'
  return new TextEncoder().encode(secret)
}

// Parse expires in string to seconds
function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/)
  if (!match) return 7 * 24 * 60 * 60 // default 7 days

  const value = parseInt(match[1])
  const unit = match[2]

  switch (unit) {
    case 's': return value
    case 'm': return value * 60
    case 'h': return value * 60 * 60
    case 'd': return value * 24 * 60 * 60
    default: return 7 * 24 * 60 * 60
  }
}

/**
 * Sign a JWT token with the given payload
 */
export async function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  const expiresIn = config.jwtExpiresIn || '7d'
  const expiresInSeconds = parseExpiresIn(expiresIn)

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(getSecretKey())
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as TokenPayload
  } catch {
    return null
  }
}

/**
 * Get expiration time for cookies
 */
export function getTokenExpiration(): Date {
  const expiresIn = config.jwtExpiresIn || '7d'
  const expiresInSeconds = parseExpiresIn(expiresIn)
  return new Date(Date.now() + expiresInSeconds * 1000)
}
