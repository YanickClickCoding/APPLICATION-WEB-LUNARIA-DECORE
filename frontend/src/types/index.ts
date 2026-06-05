// ─── USER ──────────────────────────────────────────────────────────────────
export interface User {
  _id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  role: 'CLIENT' | 'ADMIN' | 'LIVREUR'
  avatar?: string
  address?: Address
  isVerified: boolean
  isActive?: boolean
  favorites: string[]
  createdAt: string
}

export interface Address {
  quartier: string
  ville: string
  commune: string
  indications?: string
}

// ─── AUTH ──────────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email?: string
  phone?: string
  password: string
}

export interface RegisterDto {
  firstName: string
  lastName: string
  email?: string
  phone: string
  password: string
}

// ─── CATEGORY ──────────────────────────────────────────────────────────────
export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  isActive: boolean
  order: number
}

// ─── PRODUCT ───────────────────────────────────────────────────────────────
export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  images: string[]
  category: Category
  tags: string[]
  stock: number
  isAvailable: boolean
  isFeatured: boolean
  ratings: { average: number; count: number }
  createdAt: string
}

// ─── DECORATION SERVICE ────────────────────────────────────────────────────
export interface DecorationService {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  category: Category
  basePrice: number
  priceNote?: string
  images: string[]
  includes: string[]
  options: { name: string; price: number }[]
  duration?: string
  isAvailable: boolean
  isFeatured: boolean
  ratings: { average: number; count: number }
}

// ─── CART ──────────────────────────────────────────────────────────────────
export interface CartItem {
  _id: string
  product?: Product
  service?: DecorationService
  quantity: number
  price: number
  selectedOptions?: string[]
}

export interface Cart {
  _id: string
  items: CartItem[]
  total: number
}

// ─── ORDER ─────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'EN_ATTENTE'
  | 'CONFIRME'
  | 'EN_PREPARATION'
  | 'PRET'
  | 'EN_LIVRAISON'
  | 'LIVRE'
  | 'ANNULE'

export interface OrderItem {
  product?: Product
  service?: DecorationService
  name: string
  price: number
  quantity: number
  image?: string
  selectedOptions?: string[]
}

export interface Order {
  _id: string
  orderNumber: string
  client: User
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  promoCode?: string
  status: OrderStatus
  deliveryAddress: Address & { phone: string }
  deliveryType: 'DOMICILE' | 'RETRAIT_BOUTIQUE' | 'INSTALLATION_SITE'
  payment?: Payment
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── PLANNING ──────────────────────────────────────────────────────────────
export type PlanningStatus =
  | 'EN_ATTENTE'
  | 'DEVIS_ENVOYE'
  | 'DEVIS_ACCEPTE'
  | 'DEVIS_REFUSE'
  | 'CONFIRME'
  | 'EN_COURS'
  | 'TERMINE'
  | 'ANNULE'

export interface DecorationPlanning {
  _id: string
  planningNumber: string
  client: User
  service?: DecorationService
  eventType: string
  eventDate: string
  eventLocation: { type: string; address: string; ville: string; indications?: string }
  guestCount?: number
  budgetMin?: number
  budgetMax?: number
  inspirations?: string[]
  description?: string
  status: PlanningStatus
  visitSlot?: { date: string; timeSlot: string }
  installationSlot?: { date: string; timeSlot: string }
  quote?: {
    amount: number
    description: string
    validUntil: string
    sentAt: string
  }
  createdAt: string
}

// ─── PAYMENT ───────────────────────────────────────────────────────────────
export type PaymentMethod = 'MTN_MOMO' | 'MOOV_MONEY'
export type PaymentStatus = 'EN_ATTENTE' | 'EN_COURS' | 'CONFIRME' | 'ECHOUE' | 'REMBOURSE'

export interface Payment {
  _id: string
  paymentNumber: string
  amount: number
  currency: string
  method: PaymentMethod
  type: 'COMMANDE' | 'ACOMPTE' | 'SOLDE'
  status: PaymentStatus
  phone: string
  transactionId?: string
  paidAt?: string
  failReason?: string
  createdAt: string
}

// ─── MESSAGING ─────────────────────────────────────────────────────────────
export interface Message {
  _id: string
  conversation: string
  sender: User
  type: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'SYSTEM'
  content: string
  attachments?: { url: string; name: string; type: string; size: number }[]
  readBy: string[]
  isDeleted: boolean
  createdAt: string
}

export interface Conversation {
  _id: string
  client: User
  agent?: User
  participants: User[]
  subject?: string
  lastMessage?: { content: string; sentAt: string; senderId: string; senderRole?: string }
  clientUnread: number
  adminUnread: number
  isArchived?: boolean
  createdAt: string
  updatedAt?: string
}

// ─── NOTIFICATION ──────────────────────────────────────────────────────────
export interface Notification {
  _id: string
  type: string
  title: string
  body: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

// ─── REVIEW ────────────────────────────────────────────────────────────────
export interface Review {
  _id: string
  client: User
  product?: Product
  service?: DecorationService
  rating: number
  title?: string
  comment: string
  images?: string[]
  status: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE'
  createdAt: string
}

// ─── API RESPONSES ─────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}
