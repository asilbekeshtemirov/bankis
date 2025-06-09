# 🏦 BankIS – Zamonaviy bank ilovasi

Bu loyiha zamonaviy web texnologiyalar asosida yaratilgan **bank axborot tizimi** bo‘lib, foydalanuvchilarga o‘z hisoblarini yuritish, balansni kuzatish, tranzaksiyalarni boshqarish va xavfsiz muhitda ishlash imkoniyatini beradi.

---

## 🎯 Loyihaning maqsadi

BankIS loyihasining asosiy maqsadi — moliyaviy xizmatlarni raqamlashtirish orqali quyidagi imkoniyatlarni ta’minlash:

* Foydalanuvchilarga **xavfsiz ro‘yxatdan o‘tish va kirish** imkonini berish (JWT + Google)
* Har bir foydalanuvchiga **bir nechta bank hisobini yuritish** imkoniyatini yaratish
* **Real vaqtda pul o‘tkazmalarini** amalga oshirish (user-to-user transaction)
* Foydalanuvchilar o‘rtasida **rolga asoslangan ruxsat tizimi**ni yo‘lga qo‘yish
* Ilovani **bir nechta tilda ishlashga moslashtirish** (i18n)
* Ishlab chiquvchilar uchun **to‘liq Swagger API hujjatlari**ni taqdim etish
* **Docker yordamida konteynerlashtirish** va CI/CD orqali ishlab chiqarishga tayyor holatda saqlash

---

## 🌆 Asosiy imkoniyatlar

* ✅ JWT va Google orqali avtorizatsiya
* ✅ Role asosidagi ruxsat: `Admin`, `User`, `Manager`
* ✅ Bir foydalanuvchiga bir nechta `Account`
* ✅ Tranzaksiyalar: `PENDING`, `COMPLETED`, `FAILED`
* ✅ Ko‘p tilli qo‘llab-quvvatlash (UZ, EN, RU)
* ✅ Swagger hujjatlari
* ✅ Guard, Pipe, Filter, Interceptor
* ✅ Prisma Studio
* ✅ Docker + GitHub Actions (CI/CD)

---

## 🧰 Texnologiyalar

| Yo‘nalish          | Texnologiya               |
| ------------------ | ------------------------- |
| Backend            | NestJS, TypeScript        |
| Ma’lumotlar bazasi | PostgreSQL, Prisma ORM    |
| Autentifikatsiya   | JWT + Google OAuth        |
| API Hujjatlar      | Swagger (OpenAPI)         |
| Tillar             | nestjs-i18n (UZ, EN, RU)  |
| Ruxsat nazorati    | Guard, Role, Pipe, Filter |
| Paket menejeri     | pnpm                      |
| Konteynerlash      | Docker, Docker Compose    |
| CI/CD              | GitHub Actions            |

---

## 🚀 Ishga tushirish

1. Klonlash:

```bash
git clone https://github.com/asilbekeshtemirov/bankis.git
cd bankis
pnpm install
```

2. `.env` fayl yaratish:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/bankis"
JWT_SECRET="supersecret"
JWT_EXPIRES_IN="15m"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
FRONTEND_URL="http://localhost:3000"
```

3. Prisma migratsiya:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Ishga tushirish:

```bash
pnpm start:dev
```

---

## 📊 Ma’lumotlar bazasi modellari

### 🧍 User

* `id`, `email`, `password`, `googleId`, `roleId`, `languageId`
* `accounts`: Account\[]

### 🧑‍💼 Role

* `id`, `name`: ADMIN, USER, MANAGER
* `users`: User\[]

### 💳 Account

* `id`, `accountNumber`, `balance`, `userId`
* `transactionsFrom`: Transaction\[]
* `transactionsTo`: Transaction\[]

### ↺ Transaction

* `id`, `fromAccountId`, `toAccountId`, `amount`, `status`, `timestamp`

### 🌐 Language

* `id`, `code`, `name`
* `users`: User\[]

---

## 🔮 Swagger

```
http://localhost:3000/api
```

---

## 🛡️ Rollar

| Rol     | Imkoniyatlar                     |
| ------- | -------------------------------- |
| Admin   | Foydalanuvchilarni boshqarish    |
| User    | O‘z hisobi va tranzaksiyalari    |
| Manager | Statistikani ko‘rish (read-only) |

---

## 🚮 Xavfsizlik

* Guard: Role-based access
* Filter: Global exception handling
* Pipe: DTO validation
* Interceptor: Logging, transform

---

## 🌐 Tillar

* 🇺🇿 O‘zbekcha (UZ)
* 🇬🇧 Inglizcha (EN)
* 🇷🇺 Ruscha (RU)

---

## 🛋️ CI/CD

* Docker orqali build
* GitHub Actions orqali test/deploy

---

## 📃 Litsenziya

MIT — erkin foydalanishingiz mumkin.
# 🏦 BankIS – Zamonaviy bank ilovasi

Bu loyiha zamonaviy web texnologiyalar asosida yaratilgan **bank axborot tizimi** bo‘lib, foydalanuvchilarga o‘z hisoblarini yuritish, balansni kuzatish, tranzaksiyalarni boshqarish va xavfsiz muhitda ishlash imkoniyatini beradi.

---

## 🎯 Loyihaning maqsadi

BankIS loyihasining asosiy maqsadi — moliyaviy xizmatlarni raqamlashtirish orqali quyidagi imkoniyatlarni ta’minlash:

* Foydalanuvchilarga **xavfsiz ro‘yxatdan o‘tish va kirish** imkonini berish (JWT + Google)
* Har bir foydalanuvchiga **bir nechta bank hisobini yuritish** imkoniyatini yaratish
* **Real vaqtda pul o‘tkazmalarini** amalga oshirish (user-to-user transaction)
* Foydalanuvchilar o‘rtasida **rolga asoslangan ruxsat tizimi**ni yo‘lga qo‘yish
* Ilovani **bir nechta tilda ishlashga moslashtirish** (i18n)
* Ishlab chiquvchilar uchun **to‘liq Swagger API hujjatlari**ni taqdim etish
* **Docker yordamida konteynerlashtirish** va CI/CD orqali ishlab chiqarishga tayyor holatda saqlash

---

## 🌆 Asosiy imkoniyatlar

* ✅ JWT va Google orqali avtorizatsiya
* ✅ Role asosidagi ruxsat: `Admin`, `User`, `Manager`
* ✅ Bir foydalanuvchiga bir nechta `Account`
* ✅ Tranzaksiyalar: `PENDING`, `COMPLETED`, `FAILED`
* ✅ Ko‘p tilli qo‘llab-quvvatlash (UZ, EN, RU)
* ✅ Swagger hujjatlari
* ✅ Guard, Pipe, Filter, Interceptor
* ✅ Prisma Studio
* ✅ Docker + GitHub Actions (CI/CD)

---

## 🧰 Texnologiyalar

| Yo‘nalish          | Texnologiya               |
| ------------------ | ------------------------- |
| Backend            | NestJS, TypeScript        |
| Ma’lumotlar bazasi | PostgreSQL, Prisma ORM    |
| Autentifikatsiya   | JWT + Google OAuth        |
| API Hujjatlar      | Swagger (OpenAPI)         |
| Tillar             | nestjs-i18n (UZ, EN, RU)  |
| Ruxsat nazorati    | Guard, Role, Pipe, Filter |
| Paket menejeri     | pnpm                      |
| Konteynerlash      | Docker, Docker Compose    |
| CI/CD              | GitHub Actions            |

---

## 🚀 Ishga tushirish

1. Klonlash:

```bash
git clone https://github.com/your-org/bankis.git
cd bankis
pnpm install
```

2. `.env` fayl yaratish:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/bankis"
JWT_SECRET="supersecret"
JWT_EXPIRES_IN="15m"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
FRONTEND_URL="http://localhost:3000"
```

3. Prisma migratsiya:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Ishga tushirish:

```bash
pnpm start:dev
```

---

## 📊 Ma’lumotlar bazasi modellari

### 🧍 User

* `id`, `email`, `password`, `googleId`, `roleId`, `languageId`
* `accounts`: Account\[]

### 🧑‍💼 Role

* `id`, `name`: ADMIN, USER, MANAGER
* `users`: User\[]

### 💳 Account

* `id`, `accountNumber`, `balance`, `userId`
* `transactionsFrom`: Transaction\[]
* `transactionsTo`: Transaction\[]

### ↺ Transaction

* `id`, `fromAccountId`, `toAccountId`, `amount`, `status`, `timestamp`

### 🌐 Language

* `id`, `code`, `name`
* `users`: User\[]

---

## 🔮 Swagger

```
http://localhost:3000/api
```

---

## 🛡️ Rollar

| Rol     | Imkoniyatlar                     |
| ------- | -------------------------------- |
| Admin   | Foydalanuvchilarni boshqarish    |
| User    | O‘z hisobi va tranzaksiyalari    |
| Manager | Statistikani ko‘rish (read-only) |

---

## 🚮 Xavfsizlik

* Guard: Role-based access
* Filter: Global exception handling
* Pipe: DTO validation
* Interceptor: Logging, transform

---

## 🌐 Tillar

* 🇺🇿 O‘zbekcha (UZ)
* 🇬🇧 Inglizcha (EN)
* 🇷🇺 Ruscha (RU)

---

## 🛋️ CI/CD

* Docker orqali build
* GitHub Actions orqali test/deploy

---

## 📞 Bog‘lanish

📧 Email: [your-email@example.com](mailto:your-email@example.com)

---

## 📃 Litsenziya

MIT — erkin foydalanishingiz mumkin.
