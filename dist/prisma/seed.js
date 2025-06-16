"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const uzLang = await prisma.language.upsert({
        where: { code: 'uz' },
        update: {},
        create: {
            code: 'uz',
            name: 'O\'zbekcha',
            isActive: true,
        },
    });
    const enLang = await prisma.language.upsert({
        where: { code: 'en' },
        update: {},
        create: {
            code: 'en',
            name: 'English',
            isActive: true,
        },
    });
    const ruLang = await prisma.language.upsert({
        where: { code: 'ru' },
        update: {},
        create: {
            code: 'ru',
            name: 'Русский',
            isActive: true,
        },
    });
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            displayName: 'Administrator',
            description: 'Full access to system',
        },
    });
    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
            name: 'USER',
            displayName: 'User',
            description: 'Regular user access',
        },
    });
    const managerRole = await prisma.role.upsert({
        where: { name: 'MANAGER' },
        update: {},
        create: {
            name: 'MANAGER',
            displayName: 'Manager',
            description: 'Manager access',
        },
    });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@bankis.uz' },
        update: {},
        create: {
            email: 'admin@bankis.uz',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            roleId: adminRole.id,
            languageId: uzLang.id,
        },
    });
    await prisma.account.upsert({
        where: { accountNumber: '8600000000000001' },
        update: {},
        create: {
            accountNumber: '8600000000000001',
            balance: 100000000,
            currency: 'UZS',
            userId: adminUser.id,
        },
    });
    const translations = [
        { languageId: uzLang.id, key: 'welcome', value: 'Xush kelibsiz' },
        { languageId: uzLang.id, key: 'login', value: 'Kirish' },
        { languageId: uzLang.id, key: 'register', value: 'Ro\'yxatdan o\'tish' },
        { languageId: uzLang.id, key: 'balance', value: 'Balans' },
        { languageId: uzLang.id, key: 'transfer', value: 'Pul o\'tkazish' },
        { languageId: uzLang.id, key: 'history', value: 'Tarix' },
        { languageId: enLang.id, key: 'welcome', value: 'Welcome' },
        { languageId: enLang.id, key: 'login', value: 'Login' },
        { languageId: enLang.id, key: 'register', value: 'Register' },
        { languageId: enLang.id, key: 'balance', value: 'Balance' },
        { languageId: enLang.id, key: 'transfer', value: 'Transfer' },
        { languageId: enLang.id, key: 'history', value: 'History' },
        { languageId: ruLang.id, key: 'welcome', value: 'Добро пожаловать' },
        { languageId: ruLang.id, key: 'login', value: 'Войти' },
        { languageId: ruLang.id, key: 'register', value: 'Регистрация' },
        { languageId: ruLang.id, key: 'balance', value: 'Баланс' },
        { languageId: ruLang.id, key: 'transfer', value: 'Перевод' },
        { languageId: ruLang.id, key: 'history', value: 'История' },
    ];
    for (const translation of translations) {
        await prisma.translation.upsert({
            where: {
                languageId_key: {
                    languageId: translation.languageId,
                    key: translation.key,
                },
            },
            update: {},
            create: translation,
        });
    }
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map