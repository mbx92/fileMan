export interface User {
  id: string
  email: string
  name: string
  username?: string
  employeeId?: string
  department?: string
  position?: string
  avatarUrl?: string
  roleId?: string
  roleName?: string
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN'
  ssoProvider?: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  idToken: string
  expiresAt: number
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}
