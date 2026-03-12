export interface Criteria {
  purpose: string | null   // Назначение: повседневные, спорт, выход, без разницы
  budget: number | null    // Бюджет: верхняя граница в рублях
  size: string | null      // Размер EU
  color: string | null     // Цвет (опционально)
  brand: string | null     // Бренд (опционально)
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Product {
  id: string
  brand: string
  name: string
  price: number
  sizes: string[]
  imageUrl: string | null
  badge?: string
  bitrixUrl?: string
}

export interface ProductGroup {
  key: 'exact' | 'premium' | 'alternative'
  title: string
  description: string
  products: Product[]
}

// Состояние машины чата
export type ChatPhase =
  | 'idle'         // начало, ждем первого сообщения
  | 'collecting'   // собираем критерии
  | 'ready'        // все 3 обязательных критерия собраны
  | 'loading'      // запрос к API
  | 'results'      // подборка готова
  | 'empty'        // ничего не нашли
  | 'error'        // ошибка сети/API

export interface SearchResult {
  groups: ProductGroup[]
  totalCount: number
  criteria: Criteria
}

// Запрос к /api/chat
export interface ChatRequest {
  messages: Pick<Message, 'role' | 'content'>[]
  criteria: Criteria
}

// Ответ от /api/chat
export interface ChatResponse {
  message: string
  criteria: Criteria
  isComplete: boolean
}

// Запрос к /api/catalog
export interface CatalogRequest {
  criteria: Criteria
}

// Ответ от /api/catalog
export interface CatalogResponse {
  groups: ProductGroup[]
  totalCount: number
}
