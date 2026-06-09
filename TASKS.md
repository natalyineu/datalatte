# DataLatte — Task Board

## 🔄 В работе

### Lead Collection Pipeline — переход на бесплатную схему

**Контекст:**
Текущая схема (Apify → Supabase → Resend) стоит $5/месяц и дала 0 ответов.
Проблема не только в цене — cold email на `info@` адреса плохо конвертит.

**Что нашли:**
- [omkarcloud/google-maps-scraper](https://github.com/omkarcloud/google-maps-scraper) — десктопное приложение
  - **200 поисков/месяц бесплатно** (без карты, без регистрации)
  - 1 поиск = 1 ключевое слово + 1 город ("coffee shops Denver")
  - ~500 результатов на поиск (Fast mode), тысячи на Zoom 18
  - ~3 000–3 500 бизнесов в день бесплатно
  - Отдаёт: название, адрес, телефон, **сайт**, рейтинг, соцсети
  - Email НЕ отдаёт (Google Maps не хранит email)
  - Платная версия: **$28 один раз** = безлимит навсегда
  - Использует настоящий Chrome → Google не блокирует

**Новая схема (бесплатно):**
```
omkarcloud desktop app
→ CSV с сайтами бизнесов (бесплатно, ~3k/день)
        ↓
scripts/scrape-emails.mjs (написать)
→ заходит на каждый сайт → ищет email в HTML
        ↓
scripts/collect-leads.mjs (уже есть, адаптировать)
→ сохраняет в Supabase
        ↓
scripts/broadcast-leads.mjs (уже есть)
→ Resend рассылка
```

**Что нужно сделать:**
- [ ] Написать `scripts/scrape-emails.mjs` — принимает CSV с сайтами, вытаскивает email с каждого сайта (главная + /contact + /about), сохраняет в Supabase
- [ ] Адаптировать `scripts/collect-leads.mjs` — принять CSV из omkarcloud вместо Apify dataset ID
- [ ] Скачать omkarcloud и протестировать на реальном запросе ("coffee shops Denver CO")

**Почему email с сайтов лучше чем info@:**
- email на сайте часто более прямой (owner@, name@)
- бизнес сам его разместил → более живой

---

## ✅ Сделано

- Создан `scripts/collect-leads.mjs` — Apify → Supabase
- Создан `scripts/broadcast-leads.mjs` — Resend broadcast по нишам
- Настроены 3 Resend аудитории (coffee, salon, fitness+pet)
- Исследованы альтернативы Apify — выбран omkarcloud как лучший бесплатный вариант
