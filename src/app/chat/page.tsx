'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Criteria, Message, ProductGroup, ChatPhase } from '@/lib/types'
import { withBasePath } from '@/lib/paths'

// ─── Начальное состояние критериев ───────────────────────────────────────────

const EMPTY_CRITERIA: Criteria = {
  purpose: null,
  budget: null,
  size: null,
  color: null,
  brand: null,
}

// ─── Mock данные (TODO: заменить на реальный API) ────────────────────────────

const MOCK_GROUPS: ProductGroup[] = [
  {
    key: 'exact',
    title: 'ТОЧНОЕ ПОПАДАНИЕ',
    description: 'Лучшее совпадение по запросу и бюджету',
    products: [
      { id: '1', brand: 'Nike', name: "Air Force 1 '07 White", price: 9500, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-1.jpg'), badge: 'хит' },
      { id: '2', brand: 'Adidas', name: 'Stan Smith Cloud White', price: 8200, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-2.jpg') },
      { id: '3', brand: 'New Balance', name: '327 White Grey', price: 10900, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-3.jpg') },
      { id: '4', brand: 'Puma', name: 'Cali Star White', price: 9900, sizes: ['40', '41', '42'], imageUrl: withBasePath('/images/sneaker-1.jpg') },
      { id: '5', brand: 'Reebok', name: 'Club C 85 Chalk', price: 8700, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-2.jpg') },
      { id: '6', brand: 'Asics', name: 'Japan S White', price: 9100, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-3.jpg') },
      { id: '7', brand: 'Nike', name: 'Court Vision Low White', price: 7800, sizes: ['40', '41', '42'], imageUrl: withBasePath('/images/sneaker-1.jpg') },
    ],
  },
  {
    key: 'premium',
    title: 'ЧУТЬ ДОРОЖЕ, НО СТОИТ ТОГО',
    description: '+15–25% к бюджету — топ‑рейтинг и материалы',
    products: [
      { id: '8', brand: 'Nike', name: 'Dunk Low Retro White Black', price: 13500, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-2.jpg'), badge: 'топ' },
      { id: '9', brand: 'Converse', name: 'Chuck 70 Hi White', price: 14000, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-3.jpg') },
      { id: '10', brand: 'Adidas', name: 'Samba OG White', price: 14900, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-1.jpg') },
      { id: '11', brand: 'New Balance', name: '550 White Green', price: 15800, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-2.jpg') },
      { id: '12', brand: 'Nike', name: 'Air Max 90 White', price: 16200, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-3.jpg') },
      { id: '13', brand: 'Asics', name: 'Gel-Kayano 14 White Silver', price: 17500, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-1.jpg') },
      { id: '14', brand: 'Onitsuka', name: 'Mexico 66 SD White', price: 15200, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-2.jpg') },
    ],
  },
  {
    key: 'alternative',
    title: 'АЛЬТЕРНАТИВНЫЙ ВАРИАНТ',
    description: 'Похожие по стилю и посадке, но другой акцент',
    products: [
      { id: '15', brand: 'Vans', name: 'Old Skool Black White', price: 7900, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-3.jpg') },
      { id: '16', brand: 'New Balance', name: '574 Grey Day', price: 9800, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-1.jpg') },
      { id: '17', brand: 'Adidas', name: 'Gazelle Grey', price: 9200, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-2.jpg') },
      { id: '18', brand: 'Nike', name: 'Blazer Low White', price: 8600, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-3.jpg') },
      { id: '19', brand: 'Puma', name: 'Suede Classic Grey', price: 8400, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-1.jpg') },
      { id: '20', brand: 'Reebok', name: 'Classic Leather Grey', price: 9000, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-2.jpg') },
      { id: '21', brand: 'Saucony', name: 'Jazz Original Grey', price: 8800, sizes: ['41', '42', '43'], imageUrl: withBasePath('/images/sneaker-3.jpg') },
    ],
  },
]

// ─── Mock LLM-симуляция (TODO: заменить на /api/chat) ────────────────────────

function simulateLLMResponse(
  userMsg: string,
  currentCriteria: Criteria,
): { reply: string; updatedCriteria: Criteria } {
  const lower = userMsg.toLowerCase()
  const updated = { ...currentCriteria }

  // Назначение
  if (!updated.purpose) {
    if (/бег|спорт|тренировк/.test(lower)) updated.purpose = 'спорт'
    else if (/повседневн|каждый день|casual/.test(lower)) updated.purpose = 'повседневные'
    else if (/выход|нарядн|парадн/.test(lower)) updated.purpose = 'на выход'
    else if (/без разниц|любые|неважно/.test(lower)) updated.purpose = 'без разницы'
  }

  // Бюджет
  if (!updated.budget) {
    const budgetMatch = lower.match(/(\d[\d\s]*)\s*(т\.?\s*р?|тыс|тысяч|руб|р\b|₽)/)
    if (budgetMatch) {
      const num = parseInt(budgetMatch[1].replace(/\s/g, ''))
      updated.budget = num < 1000 ? num * 1000 : num
    }
  }

  // Размер
  if (!updated.size) {
    const sizeMatch = lower.match(/(\d{2})\s*(eu|eur|европ)?/)
    if (sizeMatch) updated.size = sizeMatch[1] + ' EU'
  }

  // Цвет (опционально)
  if (!updated.color) {
    if (/бел/.test(lower)) updated.color = 'белый'
    else if (/чёрн|черн/.test(lower)) updated.color = 'чёрный'
    else if (/сер/.test(lower)) updated.color = 'серый'
  }

  // Бренд (опционально)
  if (!updated.brand) {
    const brands = ['nike', 'adidas', 'new balance', 'vans', 'converse', 'puma', 'reebok', 'asics']
    for (const b of brands) {
      if (lower.includes(b)) {
        updated.brand = b.charAt(0).toUpperCase() + b.slice(1)
        break
      }
    }
  }

  // Генерируем ответ
  const missing = []
  if (!updated.purpose) missing.push('назначение')
  if (!updated.budget) missing.push('бюджет')
  if (!updated.size) missing.push('размер')

  let reply = ''
  if (missing.length === 0) {
    reply = 'Отлично, всё собрал. Готовлю подборку из 20+ моделей — сейчас покажу.'
  } else if (missing.length === 3) {
    reply = 'Привет! Подберу кроссовки под тебя за 2 минуты.\n\nРасскажи — что ищешь? Можно в свободной форме: стиль, размер и ориентир по цене.'
  } else {
    const questions: Record<string, string> = {
      назначение: 'Для чего нужны кроссовки — спорт, повседневка или на выход?',
      бюджет: 'Какой ориентир по цене? Хотя бы примерно, верхняя граница.',
      размер: 'И какой размер EU?',
    }
    reply = missing.map((m) => questions[m]).join('\n\n')
  }

  return { reply, updatedCriteria: updated }
}

// ─── Вспомогательные компоненты ──────────────────────────────────────────────

function CriteriaBar({ criteria }: { criteria: Criteria }) {
  const items = [
    { key: 'size', label: criteria.size ?? 'Размер' },
    { key: 'color', label: criteria.color ?? 'Цвет' },
  ] as const

  return (
    <div className="bg-navy-mid px-4 py-2.5 flex gap-2 flex-wrap">
      {items.map((item) => {
        const filled = criteria[item.key] !== null
        return (
          <span
            key={item.key}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              filled
                ? 'bg-coral/25 text-[#ffb3aa]'
                : 'bg-white/10 text-sky'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-coral' : 'bg-gray-text'}`}
            />
            {item.label}
          </span>
        )
      })}
    </div>
  )
}

function ProductCard({ product }: { product: ProductGroup['products'][number] }) {
  return (
    <div className="bg-white rounded-card min-w-[180px] max-w-[180px] flex-shrink-0 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer overflow-hidden">
      {/* Фото */}
      <div className="h-[130px] bg-navy flex items-center justify-center relative">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl">👟</span>
        )}
        {product.badge && (
          <span className="absolute top-2 right-2 bg-coral text-white text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      {/* Инфо */}
      <div className="p-3">
        <div className="text-[10px] font-bold text-gray-text uppercase tracking-wider mb-0.5">
          {product.brand}
        </div>
        <div className="text-[13px] font-extrabold text-navy leading-tight mb-2 line-clamp-2">
          {product.name}
        </div>
        <div className="text-coral font-extrabold text-base">
          {product.price.toLocaleString('ru')} р
        </div>
        <div className="text-[11px] text-gray-text font-semibold mt-0.5">
          {product.sizes.join(', ')} EU · в наличии
        </div>
        <button
          className="block w-full mt-2.5 bg-navy hover:bg-navy-light text-white rounded-[10px] py-2 text-xs font-bold transition-colors font-nunito"
          onClick={() => {
            if (product.bitrixUrl) window.open(product.bitrixUrl, '_blank')
            // TODO: ссылка на карточку Bitrix
          }}
        >
          Заказать
        </button>
      </div>
    </div>
  )
}

function ResultsPanel({
  groups,
  onEditRequest,
  criteria,
  isDesktop,
}: {
  groups: ProductGroup[]
  onEditRequest: () => void
  criteria: Criteria
  isDesktop?: boolean
}) {
  const total = groups.reduce((s, g) => s + g.products.length, 0)
  const summaryParts = [
    criteria.color,
    criteria.purpose,
    criteria.size ? `${criteria.size}` : null,
    criteria.budget ? `до ${criteria.budget.toLocaleString('ru')} р` : null,
  ].filter(Boolean)

  return (
    <div className="flex flex-col h-full">
      {/* Шапка результатов */}
      <div className="bg-navy px-5 py-5 flex-shrink-0">
        <div className="font-bebas text-3xl tracking-wide text-white">
          ТВОЯ ПОДБОРКА — {total} МОДЕЛЕЙ
        </div>
        <div className="text-sky text-sm font-semibold mt-1">
          {summaryParts.join(' · ')}
        </div>
        <button
          onClick={onEditRequest}
          className="mt-3 inline-block bg-white/10 hover:bg-white/20 text-sky border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors font-nunito"
        >
          Изменить запрос
        </button>
      </div>

      {/* Группы карточек */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-5 space-y-6 ${
          isDesktop ? 'scrollbar-hide' : ''
        }`}
      >
        {groups.map((group) => (
          <div key={group.key}>
            <div className="font-bebas text-xl text-navy tracking-wide mb-1">
              {group.title}
            </div>
            <div className="text-xs font-semibold text-[#6677aa] mb-3">
              {group.description}
            </div>
            {isDesktop ? (
              // На десктопе — сетка
              <div className="flex flex-wrap gap-3">
                {group.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              // На мобайле — горизонтальный скролл
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {group.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyPanel({
  onRelax,
  criteria,
}: {
  onRelax: (type: string) => void
  criteria: Criteria
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-navy px-5 py-5 flex-shrink-0">
        <div className="font-bebas text-3xl tracking-wide text-white">НИЧЕГО НЕ НАШЛИ</div>
        <div className="text-sky text-sm font-semibold mt-1">Слишком строгие параметры</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-4">
        <span className="text-6xl opacity-30">👟</span>
        <div className="font-bebas text-3xl text-navy tracking-wide">ФИЛЬТРЫ СЛИШКОМ СТРОГИЕ</div>
        <p className="text-[#6677aa] font-semibold text-sm max-w-xs leading-relaxed">
          Кроссовок с такими параметрами нет в каталоге. Попробуй ослабить условия.
        </p>

        <div className="bg-white rounded-card p-5 w-full max-w-sm text-left space-y-2 mt-2">
          <div className="text-sm font-bold text-navy mb-1">Что можно изменить?</div>
          {criteria.budget && (
            <button
              onClick={() => onRelax('budget')}
              className="w-full text-left bg-bg hover:bg-[#dde4f5] text-navy font-bold text-sm rounded-xl px-4 py-3 transition-colors font-nunito"
            >
              Поднять бюджет до {Math.round(criteria.budget * 1.3).toLocaleString('ru')} р
            </button>
          )}
          {criteria.color && (
            <button
              onClick={() => onRelax('color')}
              className="w-full text-left bg-bg hover:bg-[#dde4f5] text-navy font-bold text-sm rounded-xl px-4 py-3 transition-colors font-nunito"
            >
              Убрать ограничение по цвету
            </button>
          )}
          <button
            onClick={() => onRelax('chat')}
            className="w-full text-left bg-bg hover:bg-[#dde4f5] text-navy font-bold text-sm rounded-xl px-4 py-3 transition-colors font-nunito"
          >
            Изменить запрос в чате
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingPanel({ criteria }: { criteria: Criteria }) {
  const rows = [
    { key: 'Размер', val: criteria.size },
    { key: 'Цвет', val: criteria.color },
    { key: 'Бренд', val: criteria.brand },
  ].filter((r) => r.val)

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 bg-navy text-center gap-7">
      {/* Точки */}
      <div className="flex gap-2.5">
        {[0, 200, 400].map((delay) => (
          <div
            key={delay}
            className="w-3.5 h-3.5 bg-coral rounded-full animate-bounce3"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>

      <div>
        <div className="font-bebas text-4xl tracking-wide text-white mb-2">ИЩЕМ КРОССОВКИ</div>
        <div className="text-sky text-sm font-semibold max-w-[260px] leading-relaxed">
          Анализируем каталог и подбираем лучшее под твои параметры
        </div>
      </div>

      {rows.length > 0 && (
        <div className="bg-navy-mid rounded-card px-6 py-4 w-full max-w-xs text-left space-y-2">
          <div className="text-[11px] font-bold text-gray-text uppercase tracking-widest mb-2">
            Твои параметры
          </div>
          {rows.map((r) => (
            <div key={r.key} className="flex justify-between text-sm font-semibold">
              <span className="text-sky">{r.key}</span>
              <span className="text-white">{r.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Основная страница ────────────────────────────────────────────────────────

export default function ChatPage() {
  const [phase, setPhase] = useState<ChatPhase>('idle')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content:
        'Привет! Подберу кроссовки под тебя за 2 минуты.\n\nРасскажи — что ищешь? Можно в свободной форме: стиль, размер и ориентир по цене.',
      timestamp: new Date(),
    },
  ])
  const [criteria, setCriteria] = useState<Criteria>(EMPTY_CRITERIA)
  const [inputValue, setInputValue] = useState('')
  const [groups, setGroups] = useState<ProductGroup[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const allCriteriaMet = criteria.purpose !== null && criteria.budget !== null && criteria.size !== null

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = useCallback(async () => {
    const text = inputValue.trim()
    if (!text || isThinking) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsThinking(true)
    setPhase('collecting')

    // TODO: заменить на реальный вызов /api/chat с Claude
    await new Promise((r) => setTimeout(r, 700))

    const { reply, updatedCriteria } = simulateLLMResponse(text, criteria)
    setCriteria(updatedCriteria)

    const allMet =
      updatedCriteria.purpose !== null &&
      updatedCriteria.budget !== null &&
      updatedCriteria.size !== null

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMsg])
    setIsThinking(false)

    if (allMet) setPhase('ready')
  }, [inputValue, isThinking, criteria])

  const handleQuickReply = (text: string) => {
    setInputValue(text)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleShowResults = async () => {
    setPhase('loading')
    // TODO: заменить на реальный вызов /api/catalog
    await new Promise((r) => setTimeout(r, 2000))
    setGroups(MOCK_GROUPS)
    setPhase('results')
  }

  const handleEditRequest = () => {
    setPhase('ready')
  }

  const handleRelax = (type: string) => {
    if (type === 'chat') {
      setPhase('collecting')
      return
    }
    if (type === 'budget') {
      setCriteria((prev) => ({ ...prev, budget: prev.budget ? Math.round(prev.budget * 1.3) : null }))
    }
    if (type === 'color') {
      setCriteria((prev) => ({ ...prev, color: null }))
    }
    setPhase('loading')
    setTimeout(() => {
      setGroups(MOCK_GROUPS)
      setPhase('results')
    }, 2000)
  }

  const quickReplies =
    phase === 'idle' || phase === 'collecting'
      ? [
          'Повседневные белые, до 10 тысяч',
          'Для бега, Nike или Adidas',
          'На каждый день, размер 42',
        ]
      : []

  // ─── Рендер правой панели (desktop) ─────────────────────────────────────────
  const renderRightPanel = () => {
    if (phase === 'loading') return <LoadingPanel criteria={criteria} />
    if (phase === 'results') {
      return (
        <ResultsPanel
          groups={groups}
          onEditRequest={handleEditRequest}
          criteria={criteria}
          isDesktop
        />
      )
    }
    if (phase === 'empty') {
      return <EmptyPanel onRelax={handleRelax} criteria={criteria} />
    }

    // Дефолтная правая панель
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-6 bg-navy-mid">
        <div className="font-bebas text-5xl tracking-widest text-white/10 select-none">SNR</div>
        <div className="bg-navy rounded-card px-6 py-5 text-left shadow-lg max-w-sm w-full">
          <div className="text-white font-bold text-sm">
            Как только расскажешь, что ищешь, тут появится подборка
          </div>
          <div className="text-sky text-xs font-semibold leading-relaxed mt-1.5">
            Минимум 20 моделей по группам: точное попадание, чуть дороже и альтернативы.
          </div>
        </div>
      </div>
    )
  }

  // ─── Мобильный контент: что показываем вместо чата ──────────────────────────
  const renderMobileContent = () => {
    if (phase === 'loading') {
      return (
        <div className="flex-1 flex">
          <LoadingPanel criteria={criteria} />
        </div>
      )
    }
    if (phase === 'results') {
      return (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResultsPanel
            groups={groups}
            onEditRequest={handleEditRequest}
            criteria={criteria}
          />
        </div>
      )
    }
    if (phase === 'empty') {
      return (
        <div className="flex-1 flex flex-col overflow-hidden">
          <EmptyPanel onRelax={handleRelax} criteria={criteria} />
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-bg lg:flex-row">

      {/* ─── Шапка ──────────────────────────────────────────────────────── */}
      <header className="bg-navy flex items-center gap-3 px-5 py-3 flex-shrink-0 lg:hidden">
        <Link href="/" className="text-sky hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <div className="font-bebas text-xl tracking-wide text-white leading-none">SHNUROK</div>
          <div className="text-[11px] font-bold text-sky">Умный подбор кроссовок</div>
        </div>
      </header>

      {/* ─── Левая колонка: чат ─────────────────────────────────────────── */}
      <div
        className={`flex flex-col lg:w-[460px] xl:w-[500px] lg:flex-shrink-0 lg:border-r border-navy-mid overflow-hidden ${
          phase === 'loading' || phase === 'results' || phase === 'empty'
            ? 'hidden lg:flex'
            : 'flex flex-1'
        }`}
      >
        {/* Desktop шапка */}
        <div className="hidden lg:flex bg-navy items-center gap-3 px-5 py-4 flex-shrink-0">
          <Link href="/" className="text-sky hover:text-white transition-colors mr-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="font-bebas text-xl tracking-wide text-white leading-none">SHNUROK</div>
            <div className="text-[11px] font-bold text-sky">Умный подбор кроссовок</div>
          </div>
        </div>

        {/* Трекер критериев */}
        <CriteriaBar criteria={criteria} />

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3.5 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === 'assistant' ? (
                <div className="flex items-start gap-2.5 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center font-bebas text-xs text-sky flex-shrink-0 mt-0.5">
                    SN
                  </div>
                  <div className="bg-navy text-white rounded-tl rounded-[18px] px-4 py-3 text-sm font-semibold leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="bg-coral text-white rounded-tr rounded-[18px] px-4 py-3 text-sm font-semibold leading-relaxed max-w-[75%]">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Индикатор "думает" */}
          {isThinking && (
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center font-bebas text-xs text-sky flex-shrink-0">
                SN
              </div>
              <div className="bg-navy rounded-tl rounded-[18px] px-4 py-3 flex gap-1.5 items-center">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-2 h-2 bg-sky rounded-full animate-bounce3"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Быстрые ответы */}
        {quickReplies.length > 0 && !isThinking && (
          <div className="flex flex-wrap gap-2 px-4 pb-2 pl-11">
            {quickReplies.map((r) => (
              <button
                key={r}
                onClick={() => handleQuickReply(r)}
                className="bg-white text-navy border-2 border-navy rounded-full px-4 py-1.5 text-xs font-bold hover:bg-navy hover:text-white transition-colors font-nunito"
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Кнопка "Показать подборку" (когда все критерии собраны) */}
        {allCriteriaMet && phase === 'ready' && !isThinking && (
          <div className="px-4 py-3 bg-white border-t-2 border-[#e0e6f5]">
            <button
              onClick={handleShowResults}
              className="w-full bg-coral hover:bg-coral-hover text-white font-extrabold font-nunito text-base py-3.5 rounded-full transition-colors"
            >
              Показать 20+ моделей
            </button>
          </div>
        )}

        {/* Поле ввода */}
        {phase !== 'loading' && (
          <div className="bg-white border-t-2 border-[#e0e6f5] px-4 py-3 flex gap-2.5 items-center flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Напиши что ищешь..."
              className="flex-1 border-2 border-[#dde4f5] focus:border-navy rounded-full px-4 py-2.5 text-sm font-semibold text-navy outline-none transition-colors placeholder:text-[#aab5d0] font-nunito"
              disabled={isThinking}
            />
            <button
              onClick={handleSend}
              disabled={isThinking || !inputValue.trim()}
              className="w-11 h-11 bg-coral hover:bg-coral-hover disabled:opacity-40 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <svg className="w-4.5 h-4.5 fill-white w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ─── Правая колонка (desktop) / полноэкранный контент (mobile) ─── */}
      <div className={`flex flex-col overflow-hidden lg:flex-1 ${
        phase === 'loading' || phase === 'results' || phase === 'empty' ? 'flex-1' : ''
      }`}>
        {/* Mobile: экраны loading/results/empty поверх чата */}
        <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
          {renderMobileContent()}
        </div>

        {/* Desktop: правая панель */}
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden">
          {renderRightPanel()}
        </div>
      </div>

    </div>
  )
}
