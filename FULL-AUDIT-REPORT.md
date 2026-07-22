# DataLatte SEO Audit — datalatte.pro
**Date:** 2026-07-22 | **Auditor:** Claude SEO Skill | **Scope:** Full site (homepage + key pages)
**Previous audit:** 2026-07-01 | **Score then:** 71/100

---

## Overall Score: 74/100 — Good (+3 vs прошлый аудит)

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 82/100 | 25% | 20.5 |
| Content Quality | 78/100 | 20% | 15.6 |
| On-Page SEO | 68/100 | 15% | 10.2 |
| Schema / Structured Data | 72/100 | 15% | 10.8 |
| Performance (CWV) | 65/100 | 10% | 6.5 |
| Image Optimization | 90/100 | 10% | 9.0 |
| AI Search Readiness (GEO) | 95/100 | 5% | 4.75 |
| **TOTAL** | | | **74** |

---

## ✅ ПРОШЛО (сильные стороны)

| Элемент | Значение | Оценка |
|---|---|---|
| Title homepage | "DataLatte — Data-Driven Local Marketing for Small Businesses" (60 chars) | ✅ Идеально |
| Canonical | `https://datalatte.pro` — без дублей | ✅ |
| HTTPS + HSTS | max-age=63072000 | ✅ |
| Security headers | 100/100 — CSP, X-Frame, X-Content-Type, Referrer-Policy | ✅ |
| llms.txt | Score 100/100, 2865 ссылок, 8 секций | ✅ Отлично |
| llms-full.txt | Присутствует | ✅ |
| robots.txt | Все AI-краулеры явно разрешены (GPTBot, ClaudeBot, Perplexity, Bingbot…) | ✅ |
| Redirect chains | 0 хопов, 115ms — прямой 200 | ✅ |
| Viewport meta | Присутствует | ✅ |
| Alt-теги изображений | 0 нарушений из 7 на главной | ✅ |
| Hreflang | en-US, en-GB, en-AU, en-CA, x-default — на всех страницах | ✅ |
| OG meta | og:title, og:description, og:image, og:type на всех страницах | ✅ |
| Twitter Card | summary_large_image | ✅ |
| Robots meta | index, follow + max-image-preview:large, max-snippet:-1 | ✅ |
| Blog Article schema | og:type=article, article:published_time/modified_time, JSON-LD | ✅ |
| BreadcrumbList | На каждом blog post | ✅ |
| Blog noindex | /blog?q= правильно noindexed | ✅ |
| IndexNow | Настроен, key file присутствует | ✅ |
| Bing verification | msvalidate.01 в head + txt-файл в public/ | ✅ |
| GSC 301 redirect | /blog/is-google-ads-worth-it-small-business исправлен | ✅ |

---

## 🔴 КРИТИЧНО (исправить срочно)

### 1. Meta description на главной — 171 символ (лимит 155)
- **Файл:** `src/app/page.tsx`
- **Текущее (171 chars):** "Freelance marketing & analytics built for local SMBs. Google Ads, Meta Ads, local SEO, and Google Business Profile optimization — with real data backed results."
- **Проблема:** Google обрезает на ~155 символах, теряется конец строки с ключевыми словами.
- **Fix:** Сократить до ≤155. Пример:
  > "Google Ads, Meta Ads & Local SEO for coffee shops, salons, pet groomers and gyms. Real data, transparent results. Free audit."
- **Impact:** Прямо влияет на CTR в SERP.

### 2. About page — дублирование бренда в title
- **Файл:** `src/app/about/page.tsx`
- **Текущее:** `About Nataliia — the person behind DataLatte | DataLatte`
- **Проблема:** "DataLatte" дважды — один раз в тексте, второй раз добавляет шаблон `%s | DataLatte`.
- **Fix:** Изменить title страницы на просто `"Nataliia Makota — DataLatte Founder"` (шаблон добавит `| DataLatte` автоматически).

---

## ⚠️ ВАЖНО (исправить в течение 2 недель)

### 3. Schema logo — строка вместо ImageObject
- **Файл:** `src/app/page.tsx` (ProfessionalService schema)
- **Текущее:** `"logo": "https://datalatte.pro/icon"`
- **Проблема:** Google Knowledge Panel требует ImageObject с url + width + height.
- **Fix:**
```json
"logo": {
  "@type": "ImageObject",
  "url": "https://datalatte.pro/icon",
  "width": 512,
  "height": 512
}
```

### 4. Schema: нет contactPoint
- **Файл:** `src/app/page.tsx`
- **Fix:** Добавить в ProfessionalService schema:
```json
"contactPoint": {
  "@type": "ContactPoint",
  "contactType": "customer service",
  "email": "hi@datalatte.pro",
  "availableLanguage": ["English"]
}
```

### 5. HSTS без includeSubDomains
- **Файл:** `next.config.ts`
- **Fix:** В headers добавить `; includeSubDomains` к `Strict-Transport-Security`.

### 6. Blog post SEO title — символ `…` (U+2026) в тeге `<title>`
- **Файл:** `src/app/blog/[slug]/page.tsx` — функция `truncateSeoTitle()`
- **Текущее:** `Google Business Profile 2026: The Complete… | DataLatte`
- **Проблема:** Юникодный `…` в `<title>` провоцирует Google заменять title своим вариантом.
- **Fix:** В `truncateSeoTitle()` заменить `"…"` на `"..."` (три ASCII-точки) либо убрать суффикс совсем.

### 7. IndexNow не пингует автоматически при деплое
- Hourly cron отключён с 19 июня. Новый контент не сигнализирует Bing/Google при push.
- **Fix:** Добавить ping sitemap + IndexNow в GitHub Actions при каждом деплое с `[vercel skip]`.

---

## ℹ️ НИЗКИЙ ПРИОРИТЕТ

| # | Проблема | Файл |
|---|---|---|
| 8 | Keywords meta одинаковы на всех страницах — добавить page-specific keywords для сервисных страниц | `src/app/layout.tsx` |
| 9 | WebSite SearchAction ведёт на /blog?q= (noindexed) — семантическое противоречие | `src/app/page.tsx` |
| 10 | FacebookBot не в explicit allow list в robots.ts | `src/app/robots.ts` |

---

## 📊 КОНТЕНТНЫЙ РИСК

| Тип страниц | Кол-во | Статус |
|---|---|---|
| Нишевые (`/for/coffee-shops` и др.) | 4 | ✅ |
| Сервисные (`/services/*`) | 9+ | ✅ |
| Блог-статьи | 2800+ | ⚠️ Требует контроля уникальности |
| Country guides | 180+ | ⚠️ Thin content риск |
| City pages (`/for/[niche]/[city]`) | 204 | ✅ noindexed правильно |

**Главный риск:** 2800+ статей в content/blog — если много шаблонных, Google может снизить crawl budget или применить HCU (Helpful Content Update) penalty. Рекомендуется регулярный аудит качества случайной выборки статей.

---

## 🤖 AI SEARCH READINESS: 95/100

| Элемент | Статус |
|---|---|
| llms.txt | ✅ 100/100 quality score |
| llms-full.txt | ✅ Присутствует |
| GPTBot, ClaudeBot, Perplexity | ✅ Explicitly allowed |
| Google-Extended (Gemini) | ✅ |
| Applebot-Extended, DeepSeek, Grok | ✅ |
| Person schema на /about | ✅ Nataliia Makota |
| E-E-A-T: автор, опыт, авторитет | ✅ OMD, Dentsu, BBDO, GroupM упомянуты |
| Structured data для AI-парсинга | ✅ |
