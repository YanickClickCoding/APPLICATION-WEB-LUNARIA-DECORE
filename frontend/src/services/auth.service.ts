import api from './api'
import type { AuthTokens, LoginDto, RegisterDto, User } from '@/types'

export const authService = {
  register: (dto: RegisterDto) =>
    api.post<{ user: User; tokens: AuthTokens }>('/auth/register', dto),

  login: (dto: LoginDto) =>
    api.post<{ user: User; tokens: AuthTokens }>('/auth/login', dto),

  sendOtp: (phone: string) =>
    api.post('/auth/otp/send', { phone }),

  verifyOtp: (phone: string, code: string) =>
    api.post<{ user: User; tokens: AuthTokens }>('/auth/otp/verify', { phone, code }),

  me: () => api.get<User>('/auth/me'),

  logout: () => api.post('/auth/logout'),
}
