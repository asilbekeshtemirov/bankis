# 🏦 BankIS – Zamonaviy bank ilovasi

Bu loyiha zamonaviy web texnologiyalar asosida yaratilgan **bank axborot tizimi** bo‘lib, foydalanuvchilarga o‘z hisoblarini yuritish, balansni kuzatish, tranzaksiyalarni boshqarish va xavfsiz muhitda ishlash imkoniyatini beradi.

---

## 🎯 Loyihaning maqsadi

BankIS loyihasining asosiy maqsadi — moliyaviy xizmatlarni raqamlashtirish orqali quyidagi imkoniyatlarni ta’minlash:

- Foydalanuvchilarga **xavfsiz ro‘yxatdan o‘tish va kirish** imkonini berish (JWT + Google)
- Har bir foydalanuvchiga **bir nechta bank hisobini yuritish** imkoniyatini yaratish
- **Real vaqtda pul o‘tkazmalarini** amalga oshirish (user-to-user transaction)
- Foydalanuvchilar o‘rtasida **rolga asoslangan ruxsat tizimi**ni yo‘lga qo‘yish
- Ilovani **bir nechta tilda ishlashga moslashtirish** (i18n)
- Ishlab chiquvchilar uchun **to‘liq Swagger API hujjatlari**ni taqdim etish
- **Docker yordamida konteynerlashtirish** va CI/CD orqali ishlab chiqarishga tayyor holatda saqlash
- **Telegram bot moduli qo‘shish:** foydalanuvchilar bot orqali hisoblarini boshqarishlari, tranzaksiyalarni ko‘rishlari va eslatmalar olishlari mumkin.

---

## 🌆 Asosiy imkoniyatlar

- ✅ JWT va Google orqali avtorizatsiya
- ✅ Role asosidagi ruxsat: `Admin`, `User`, `Manager`
- ✅ Bir foydalanuvchiga bir nechta `Account`
- ✅ Tranzaksiyalar: `PENDING`, `COMPLETED`, `FAILED`
- ✅ Ko‘p tilli qo‘llab-quvvatlash (UZ, EN, RU)
- ✅ Swagger hujjatlari
- ✅ Guard, Pipe, Filter, Interceptor
- ✅ Prisma Studio
- ✅ Docker + GitHub Actions (CI/CD)
- ✅ **Telegram bot orqali hisob holati, tranzaksiyalar va eslatmalarni boshqarish**

---

## 🧰 Texnologiyalar

| Yo‘nalish          | Texnologiya                 |
| ------------------ | ---------------------------|
| Backend            | NestJS, TypeScript          |
| Ma’lumotlar bazasi | PostgreSQL, Prisma ORM      |
| Autentifikatsiya   | JWT + Google OAuth          |
| API Hujjatlar      | Swagger (OpenAPI)           |
| Tillar             | nestjs-i18n (UZ, EN, RU)    |
| Ruxsat nazorati    | Guard, Role, Pipe, Filter   |
| Paket menejeri     | pnpm                        |
| Konteynerlash      | Docker, Docker Compose      |
| CI/CD              | GitHub Actions              |
| Chatbot            | Telegram Bot (nestjs-telegraf) |

---

## 🚀 Ishga tushirish

1. Loyihani klonlash va kerakli paketlarni o‘rnatish:

   ```bash
   git clone https://github.com/your-org/bankis.git
   cd bankis
   pnpm install
   ```

2. `.env` faylni sozlash (Telegram bot tokeni qo‘shildi):

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/bankis"
   JWT_SECRET="supersecret"
   JWT_EXPIRES_IN="15m"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
   FRONTEND_URL="http://localhost:3000"
   ```

3. Prisma migratsiya va generatsiya bajarish:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. Ilovani ishga tushirish:

   ```bash
   pnpm start:dev
   ```

---

## 📊 Ma’lumotlar bazasi modellari

### 🧍 User

| Maydon     | Tavsif                           |
|------------|---------------------------------|
| id         | Unikal foydalanuvchi identifikatori |
| email      | Elektron pochta                 |
| password   | Parol (hash qilingan)           |
| googleId   | Google OAuth identifikatori     |
| roleId     | Foydalanuvchi roli              |
| languageId | Tanlangan til                   |

- `accounts: Account[]` — foydalanuvchining bank hisoblari

---

### 🧑‍💼 Role

| Maydon | Tavsif           |
|--------|------------------|
| id     | Rol identifikatori |
| name   | Rol nomi (ADMIN, USER, MANAGER) |

- `users: User[]` — ushbu rolga mansub foydalanuvchilar

---

### 💳 Account

| Maydon       | Tavsif                    |
|--------------|---------------------------|
| id           | Hisob identifikatori      |
| accountNumber| Hisob raqami              |
| balance      | Balans                   |
| userId       | Foydalanuvchi identifikatori |

- `transactionsFrom: Transaction[]` — hisobdan amalga oshirilgan tranzaksiyalar
- `transactionsTo: Transaction[]` — hisobga kelgan tranzaksiyalar

---

### ↺ Transaction

| Maydon        | Tavsif                           |
|---------------|----------------------------------|
| id            | Tranzaksiya identifikatori       |
| fromAccountId | Pul jo‘natilgan hisob            |
| toAccountId   | Pul qabul qiluvchi hisob         |
| amount        | Miqdor                           |
| status        | Holat (`PENDING`, `COMPLETED`, `FAILED`) |
| timestamp     | Vaqt                             |

---

### 🌐 Language

| Maydon | Tavsif           |
|--------|------------------|
| id     | Til identifikatori |
| code   | Til kodi (UZ, EN, RU) |
| name   | Til nomi          |

- `users: User[]` — ushbu tilni tanlagan foydalanuvchilar

---

## 🔮 Swagger API dokumentatsiyasi

Swagger interfeysi quyidagi manzilda mavjud:

```
http://localhost:3000/api
```

---

## 🛡️ Xavfsizlik

- **Guardlar** — Role-based access control (RBAC)
- **Filterlar** — Global exception handling
- **Pipelar** — DTO validatsiyasi
- **Interseptorlar** — Logging, transformatsiya

---

## 🌐 Til qo‘llab-quvvatlash

- 🇺🇿 O‘zbekcha (UZ)
- 🇬🇧 Inglizcha (EN)
- 🇷🇺 Ruscha (RU)

---

## 🤖 Telegram Bot moduli

Telegram bot foydalanuvchilarga quyidagilarni taqdim etadi:

- Hisob balansini ko‘rish
- Tranzaksiyalar ro‘yxatini ko‘rish
- Eslatmalar yaratish va boshqarish
- Xavfsiz autentifikatsiya Telegram orqali

Bot `nestjs-telegraf` kutubxonasi asosida yaratilgan va to‘liq backendga integratsiyalashgan.

---

## 📞 Bog‘lanish

Agar savollaringiz yoki takliflaringiz bo‘lsa, quyidagi manzil orqali bog‘lanishingiz mumkin:

📧 Email: your-email@example.com

---

## 📃 Litsenziya

Ushbu loyiha MIT litsenziyasi asosida tarqatiladi. Siz uni erkin foydalanishingiz, o‘zgartirishingiz va tarqatishingiz mumkin.

[MIT License](https://opensource.org/licenses/MIT)
