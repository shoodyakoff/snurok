import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-navy flex flex-col lg:flex-row overflow-hidden relative">

      {/* Декоративные буквы на фоне */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-0 top-16 font-bebas text-[300px] leading-none text-white/[0.03] hidden lg:block"
      >
        SNR
      </span>

      {/* ─── Левая / мобильная колонка ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-7 py-12 lg:px-14 lg:py-8 lg:items-start text-center lg:text-left relative z-10">

        {/* Логотип */}
        <div className="mb-7 lg:mb-6">
          <div className="font-bebas text-6xl sm:text-7xl lg:text-6xl xl:text-7xl tracking-widest text-white leading-none">
            SHNUROK
          </div>
          <div className="text-xs font-bold text-sky tracking-[4px] uppercase mt-1">
            Sneaker Collection
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="font-bebas font-extrabold text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.03] tracking-wide text-white mb-4 max-w-md lg:max-w-2xl">
          ЗА 2 МИНУТЫ ПОДБЕРЕМ КРОССОВКИ, КОТОРЫЕ ИДЕАЛЬНО СЯДУТ
        </h1>

        {/* Подзаголовок */}
        <p className="text-sky text-sm sm:text-base lg:text-base font-semibold max-w-xs lg:max-w-sm leading-relaxed mb-7">
          Расскажи, что ищешь — подберем модели, которые реально подойдут и выглядят уверенно
        </p>

        {/* CTA */}
        <Link
          href="/chat"
          className="inline-block bg-coral hover:bg-coral-hover text-white font-extrabold font-nunito text-base sm:text-lg px-10 py-3.5 rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-coral/30"
        >
          Подобрать кроссовки
        </Link>

        {/* Фичи */}
        <div className="mt-8 flex flex-col lg:flex-row gap-3 lg:gap-6">
          {[
            { icon: '💬', text: 'Просто расскажи что ищешь' },
            { icon: '🎯', text: 'Найдем минимум 20 моделей' },
            { icon: '🛍', text: 'Заказать с доставкой до квартиры в 2 клика' },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-2 text-[13px] text-sky font-semibold">
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Правая колонка (только desktop) ─── */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-8 py-10 relative z-10">
        <div className="w-full max-w-sm">

          {/* Превью карточек */}
          <div className="space-y-2.5">
            {[
              { brand: 'Nike', name: 'Air Force 1 \'07 White', price: '9 500 р', badge: 'хит', imageUrl: '/images/sneaker-1.jpg' },
              { brand: 'Adidas', name: 'Stan Smith Cloud White', price: '8 200 р', badge: null, imageUrl: '/images/sneaker-2.jpg' },
              { brand: 'New Balance', name: '327 White Grey', price: '10 900 р', badge: null, imageUrl: '/images/sneaker-3.jpg' },
            ].map((card) => (
              <div
                key={card.name}
                className="bg-navy-mid rounded-card flex items-center gap-3 p-3.5 shadow-xl"
              >
                {/* Заглушка фото */}
                <div className="w-14 h-14 rounded-xl bg-navy-light overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-gray-text uppercase tracking-wider">
                    {card.brand}
                  </div>
                  <div className="text-[13px] font-extrabold text-white truncate">
                    {card.name}
                  </div>
                  <div className="text-coral font-extrabold text-sm mt-0.5">
                    {card.price}
                  </div>
                </div>

                {card.badge && (
                  <span className="bg-coral text-white text-[9px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-lg flex-shrink-0">
                    {card.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Подпись */}
          <p className="text-center text-gray-text text-xs font-semibold mt-5 tracking-wide">
            Подборка сформирована под твои параметры
          </p>
        </div>
      </div>

    </main>
  )
}
