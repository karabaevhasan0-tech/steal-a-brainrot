import { Telegraf } from 'telegraf';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Конфигурация
const BOT_TOKEN = '8248495430:AAEvv62KBym8runvsbEnz37s_hJoUIYZYY8';
const OWNER_USERNAME = 'Karabaev_Hasan';
const ALLOWED_CHAT_ID = -100123456789; // Замените после первого запуска

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './database.json';

// Загрузка базы данных
let db = {
    users: {
        'Karabaev_Hasan': { roles: { 'Владелец': { note: '' } }, status: 'clean' }
    },
    captcha: {},
    complaints: {}, // Список активных жалоб
    states: {} // Состояния пользователей (для пошаговых команд)
};

if (fs.existsSync(DB_FILE)) {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const loadedDB = JSON.parse(data);
        // Глубокое слияние для уверенности в наличии всех ключей
        db = {
            ...db,
            ...loadedDB,
            captcha: {}, // Капчу сбрасываем при перезагрузке
            states: loadedDB.states || {} // Состояния жалоб сохраняем
        };
        console.log('✅ База данных успешно загружена');
    } catch (err) {
        console.error('Ошибка загрузки базы:', err);
    }
}

// Функция сохранения
const saveDB = () => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (err) {
        console.error('Ошибка сохранения базы:', err);
    }
};

// Middleware для ограничения по чату
bot.use(async (ctx, next) => {
    // Разрешаем личные сообщения и конкретную группу
    if (ctx.chat.type === 'private' || ctx.chat.username === 'TradeGameChat') {
        return next();
    }
    // В других группах бот молчит
    return;
});

// Middleware для проверки прав
const isOwner = (ctx) => {
    if (!ctx.from || !ctx.from.username) return false;
    return ctx.from.username.toLowerCase() === OWNER_USERNAME.toLowerCase();
};

// Middleware для логирования и регистрации
bot.use(async (ctx, next) => {
    if (ctx.message) console.log(`📩 [MSG] From: ${ctx.from.username || ctx.from.id}, Text: ${ctx.message.text || '[Photo/Other]'}`);
    if (ctx.callbackQuery) console.log(`🔘 [BTN] From: ${ctx.from.username || ctx.from.id}, Data: ${ctx.callbackQuery.data}`);

    if (ctx.from) {
        const username = ctx.from.username || ctx.from.first_name;
        if (!db.users[username]) {
            db.users[username] = {
                roles: { 'Участник': { note: '' } },
                status: 'clean',
                id: ctx.from.id,
                username: ctx.from.username || null,
                firstName: ctx.from.first_name
            };
            saveDB();
        } else {
            // Обновляем ID если его не было
            db.users[username].id = ctx.from.id;
            db.users[username].username = ctx.from.username || db.users[username].username;
            saveDB();
        }
    }
    return next();
});

// Команда /id
bot.command('id', (ctx) => {
    if (ctx.message.reply_to_message) {
        const target = ctx.message.reply_to_message.from;
        ctx.reply(`🆔 ID пользователя ${target.first_name}: \`${target.id}\``, { parse_mode: 'Markdown' });
    } else {
        ctx.reply(`🆔 Твой ID: \`${ctx.from.id}\`\n💬 ID чата: \`${ctx.chat.id}\``, { parse_mode: 'Markdown' });
    }
});

// Команда /scammer
bot.command('scammer', (ctx) => {
    if (!isOwner(ctx)) return ctx.reply('❌ У тебя нет прав для этой команды.');

    const text = ctx.message.text.split(' ');
    let targetUsername;

    if (ctx.message.reply_to_message) {
        targetUsername = ctx.message.reply_to_message.from.username;
    } else if (text.length >= 2) {
        targetUsername = text[1].replace('@', '');
    }

    if (!targetUsername) {
        return ctx.reply('Использование: /scammer @username или ответом на сообщение');
    }

    if (!db.users[targetUsername]) db.users[targetUsername] = { roles: {}, status: 'clean' };
    db.users[targetUsername].status = 'scammer';
    db.users[targetUsername].roles['Скамер ❌'] = { note: 'Автоматически добавлен' };

    saveDB();
    ctx.reply(`⚠️ ВНИМАНИЕ! Пользователь @${targetUsername} теперь в списке СКАМЕРОВ!`);
});

// Команда /igiveout (выдача ролей)
bot.command('igiveout', (ctx) => {
    if (!isOwner(ctx)) return ctx.reply('❌ Только админ может выдавать роли.');

    const args = ctx.message.text.split(' ');
    // /igiveout [role] @user [note]
    if (args.length < 3 && !ctx.message.reply_to_message) {
        return ctx.reply('Использование: /igiveout [intern/guarante] @username [заметка]');
    }

    const roleType = args[1];
    let targetUsername;
    let note = "";

    if (ctx.message.reply_to_message) {
        targetUsername = ctx.message.reply_to_message.from.username;
        note = args.slice(2).join(' ');
    } else {
        targetUsername = args[2].replace('@', '');
        note = args.slice(3).join(' ');
    }

    if (!db.users[targetUsername]) db.users[targetUsername] = { roles: {}, status: 'clean' };
    if (!db.users[targetUsername].roles) db.users[targetUsername].roles = {};

    let roleName = "";
    if (roleType === 'intern') roleName = 'Стажер 🐣';
    else if (roleType === 'guarante') roleName = 'Гарант 🛡️';
    else return ctx.reply('❌ Тип роли должен быть intern или guarante.');

    db.users[targetUsername].roles[roleName] = { note: note };
    saveDB();
    ctx.reply(`✅ Роль "${roleName}" ${note ? `(${note}) ` : ''}выдана пользователю @${targetUsername}`);
});

// Команда /bio
bot.command('bio', async (ctx) => {
    const args = ctx.message.text.split(' ');
    let targetUsername;

    if (ctx.message.reply_to_message) {
        targetUsername = ctx.message.reply_to_message.from.username;
    } else if (args.length > 1) {
        if (!args[1].startsWith('@') && isNaN(args[1])) {
            return ctx.reply('❌ Пожалуйста, укажите юзернейм через @ (например, /bio @username) или укажите ID.');
        }
        targetUsername = args[1].replace('@', '');
    } else {
        targetUsername = ctx.from.username;
    }

    if (!targetUsername) {
        return ctx.reply('❌ У вас не установлен юзернейм в Telegram. Пожалуйста, ответьте на сообщение пользователя или укажите его юзернейм/ID через /bio @username.');
    }

    // Проверка на русские буквы
    if (/[а-яА-ЯёЁ]/.test(targetUsername)) {
        return ctx.reply('❌ Юзернейм должен содержать только английские буквы, цифры и нижнее подчеркивание.');
    }

    // Поиск пользователя в базе
    let userData = db.users[targetUsername];
    if (!userData) {
        userData = Object.values(db.users).find(u => u.username === targetUsername);
    }

    // Если нет в базе, пробуем запросить у Telegram
    if (!userData) {
        try {
            const chat = await ctx.telegram.getChat(`@${targetUsername}`);
            userData = {
                roles: { 'Участник': { note: '' } },
                status: 'clean',
                username: chat.username || targetUsername,
                firstName: chat.first_name || targetUsername,
                isFromTelegram: true
            };
        } catch (err) {
            return ctx.reply('❌ Пользователь не найден. Он должен быть участником чата или запустить бота.');
        }
    }

    let response = `👤 <b>Профиль:</b> @${targetUsername}\n\n`;

    response += `🎭 <b>Роли:</b> \n`;
    const rolesList = Object.entries(userData.roles || { 'Участник': { note: '' } });
    rolesList.forEach(([role, info]) => {
        response += `• ${role}${info.note ? ` (${info.note})` : ''}\n`;
    });

    response += `\n🛡️ <b>Проверка:</b> ${userData.status === 'scammer' ? '<pre>❌ СКАМЕР</pre>' : '✅ Чист'}`;
    if (userData.isFromTelegram) {
        response += `\n\nℹ️ <i>Пользователь еще не зарегистрирован в базе бота, но существует в Telegram.</i>`;
    }

    ctx.reply(response, { parse_mode: 'HTML' });
});

// Команда /allscammers (список всех скамеров)
bot.command('allscammers', (ctx) => {
    const scammers = Object.entries(db.users)
        .filter(([_, data]) => data.status === 'scammer')
        .map(([username, _]) => `@${username}`);

    if (scammers.length === 0) {
        return ctx.reply('✅ Список скамеров пуст. Все чисты!');
    }

    let response = `🚫 <b>Список известных скамеров:</b>\n\n`;
    response += scammers.join('\n');
    response += `\n\n⚠️ <i>Будьте осторожны при сделках!</i>`;

    ctx.reply(response, { parse_mode: 'HTML' });
});


// Команда /allguarante (список всех гарантов)
bot.command('allguarante', (ctx) => {
    const list = Object.entries(db.users)
        .filter(([_, data]) => data.roles && data.roles['Гарант 🛡️'])
        .map(([username, data]) => {
            return `@${username}${data.roles['Гарант 🛡️'].note ? ` (${data.roles['Гарант 🛡️'].note})` : ''}`;
        });

    if (list.length === 0) return ctx.reply('ℹ️ Список гарантов пуст.');

    let response = `🛡️ <b>Список официальных гарантов:</b>\n\n`;
    response += list.join('\n');
    ctx.reply(response, { parse_mode: 'HTML' });
});

// Команда /allintern (список всех стажеров)
bot.command('allintern', (ctx) => {
    const list = Object.entries(db.users)
        .filter(([_, data]) => data.roles && data.roles['Стажер 🐣'])
        .map(([username, data]) => {
            return `@${username}${data.roles['Стажер 🐣'].note ? ` (${data.roles['Стажер 🐣'].note})` : ''}`;
        });

    if (list.length === 0) return ctx.reply('ℹ️ Список стажеров пуст.');

    let response = `🐣 <b>Список активных стажеров:</b>\n\n`;
    response += list.join('\n');
    ctx.reply(response, { parse_mode: 'HTML' });
});

// Команда /unscam (удаление из ЧС)
bot.command('unscam', (ctx) => {
    if (!isOwner(ctx)) return ctx.reply('❌ Только админ может убирать из ЧС.');
    const text = ctx.message.text.split(' ');
    let targetUsername;
    if (ctx.message.reply_to_message) {
        targetUsername = ctx.message.reply_to_message.from.username;
    } else if (text.length >= 2) {
        targetUsername = text[1].replace('@', '');
    }
    if (!targetUsername) return ctx.reply('Использование: /unscam @username');
    if (db.users[targetUsername]) {
        db.users[targetUsername].status = 'clean';
        // Если у пользователя нет других ролей, ставим "Участник"
        if (!db.users[targetUsername].roles || Object.keys(db.users[targetUsername].roles).length === 0) {
            db.users[targetUsername].roles = { 'Участник': { note: '' } };
        }
        saveDB();
        ctx.reply(`✅ Пользователь @${targetUsername} убран из списка скамеров.`);
    } else {
        ctx.reply('❌ Пользователь не найден в базе.');
    }
});

// Команда /unintern (убрать стажерку)
bot.command('unintern', (ctx) => {
    if (!isOwner(ctx)) return ctx.reply('❌ У тебя нет прав.');
    const text = ctx.message.text.split(' ');
    let targetUsername;
    if (ctx.message.reply_to_message) {
        targetUsername = ctx.message.reply_to_message.from.username;
    } else if (text.length >= 2) {
        targetUsername = text[1].replace('@', '');
    }
    if (!targetUsername) return ctx.reply('Использование: /unintern @username');
    if (db.users[targetUsername] && db.users[targetUsername].roles && db.users[targetUsername].roles['Стажер 🐣']) {
        delete db.users[targetUsername].roles['Стажер 🐣'];
        // Если ролей не осталось вообще
        if (Object.keys(db.users[targetUsername].roles).length === 0) {
            db.users[targetUsername].roles = { 'Участник': { note: '' } };
        }
        saveDB();
        ctx.reply(`✅ У пользователя @${targetUsername} убрана роль Стажера.`);
    } else {
        ctx.reply('❌ У этого пользователя нет роли Стажера.');
    }
});

// Команда /unguarante (убрать гаранта)
bot.command('unguarante', (ctx) => {
    if (!isOwner(ctx)) return ctx.reply('❌ У тебя нет прав.');
    const text = ctx.message.text.split(' ');
    let targetUsername;
    if (ctx.message.reply_to_message) {
        targetUsername = ctx.message.reply_to_message.from.username;
    } else if (text.length >= 2) {
        targetUsername = text[1].replace('@', '');
    }
    if (!targetUsername) return ctx.reply('Использование: /unguarante @username');
    if (db.users[targetUsername] && db.users[targetUsername].roles && db.users[targetUsername].roles['Гарант 🛡️']) {
        delete db.users[targetUsername].roles['Гарант 🛡️'];
        // Если ролей не осталось вообще
        if (Object.keys(db.users[targetUsername].roles).length === 0) {
            db.users[targetUsername].roles = { 'Участник': { note: '' } };
        }
        saveDB();
        ctx.reply(`✅ У пользователя @${targetUsername} убрана роль Гаранта.`);
    } else {
        ctx.reply('❌ У этого пользователя нет роли Гаранта.');
    }
});

// Команда /complain
bot.command('complain', (ctx) => {
    ctx.reply('⁉️ **Вы хотите подать жалобу?**\n\nЕсли вас обманул игрок, стажер или гарант, вы можете оставить официальную жалобу администрации.', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Да, пожаловаться', callback_data: 'start_complaint' },
                    { text: '❌ Нет, не хочу', callback_data: 'cancel_complaint' }
                ]
            ]
        }
    });
});

// Обработка жалоб (текст и фото)
bot.on(['text', 'photo'], async (ctx, next) => {
    const userId = ctx.from.id;
    const state = db.states[userId];

    if (!state) return next();

    // Шаг 1: Получение текста жалобы
    if (state.step === 'waiting_for_complaint_text' && ctx.message.text) {
        if (ctx.message.text.startsWith('/')) return next(); // Игнорируем команды

        state.text = ctx.message.text;
        state.step = 'waiting_for_evidence';
        return ctx.reply('📷 Теперь отправьте фото-доказательство (скриншот переписки или трейда).\n\nЕсли фото нет, напишите /skip');
    }

    // Шаг 2: Получение фото или пропуск
    if (state.step === 'waiting_for_evidence') {
        if (ctx.message.text === '/skip') {
            state.photoId = null;
        } else if (ctx.message.photo) {
            state.photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        } else {
            return ctx.reply('Пожалуйста, отправьте фото или напишите /skip');
        }

        // Завершаем сбор жалобы и отправляем владельцу
        const complaintId = `comp_${Date.now()}`;
        const complaintData = {
            id: complaintId,
            from: ctx.from.username || ctx.from.first_name,
            fromId: userId,
            text: state.text,
            photoId: state.photoId,
            status: 'pending'
        };

        db.complaints[complaintId] = complaintData;
        delete db.states[userId];
        saveDB();

        ctx.reply('✅ Ваша жалоба отправлена на рассмотрение администрации. Ожидайте вердикта.');

        // Отправка владельцу
        const owner = Object.values(db.users).find(u =>
            (u.username && u.username.toLowerCase() === OWNER_USERNAME.toLowerCase()) ||
            u.id === 8371175143 // Хардкод ID для надежности
        );

        if (owner && owner.id) {
            const adminMsg = `🆕 **НОВАЯ ЖАЛОБА**\n\nОт: @${complaintData.from}\nТекст: ${complaintData.text}`;
            const keyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '✅ Принять (Забанить)', callback_data: `approve_${complaintId}` },
                            { text: '❌ Отклонить', callback_data: `reject_${complaintId}` }
                        ]
                    ]
                }
            };

            try {
                if (complaintData.photoId) {
                    await bot.telegram.sendPhoto(owner.id, complaintData.photoId, { caption: adminMsg, parse_mode: 'Markdown', ...keyboard });
                } else {
                    await bot.telegram.sendMessage(owner.id, adminMsg, { parse_mode: 'Markdown', ...keyboard });
                }
            } catch (e) {
                console.error('Ошибка отправки жалобы владельцу:', e.message);
                // Если не получилось отправить по ID из базы, пробуем хардкод
                if (owner.id !== 8371175143) {
                    await bot.telegram.sendMessage(8371175143, adminMsg, { parse_mode: 'Markdown', ...keyboard }).catch(() => { });
                }
            }
        } else {
            console.error('Владелец не найден в базе данных!');
        }
        return;
    }

    return next();
});

// Обработка действий (Inline Buttons)
bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from.id;

    // Инициализация если чего-то нет (защита от крашей)
    if (!db.states) db.states = {};
    if (!db.complaints) db.complaints = {};

    // Начало подачи жалобы
    if (data === 'start_complaint') {
        db.states[userId] = { step: 'waiting_for_complaint_text' };
        await ctx.answerCbQuery();
        return ctx.editMessageText('🛠 **Режим подачи жалобы**\n\nПожалуйста, опишите ситуацию: кто обманул (@username), на что и как это произошло.', { parse_mode: 'Markdown' });
    }

    if (data === 'cancel_complaint') {
        await ctx.answerCbQuery('Отмена');
        return ctx.editMessageText('❌ Вы отменили подачу жалобы.');
    }

    const parts = data.split('_');
    const action = parts[0];
    const complaintId = parts.slice(1).join('_');
    const complaint = db.complaints[complaintId];

    if (!isOwner(ctx)) return ctx.answerCbQuery('❌ Только владелец может это делать.');

    if (!complaint) return ctx.answerCbQuery('Жалоба не найдена.');

    if (action === 'approve') {
        complaint.status = 'approved';

        // Извлекаем юзернейм из текста (простая логика поиска @username)
        const match = complaint.text.match(/@(\w+)/);
        if (match) {
            const targetUsername = match[1];
            if (!db.users[targetUsername]) db.users[targetUsername] = { roles: {}, status: 'clean' };

            db.users[targetUsername].status = 'scammer';
            db.users[targetUsername].roles['Скамер ❌'] = { note: `Жалоба принята от @${complaint.from}` };
            saveDB();

            ctx.editMessageCaption(`✅ Жалоба одобрена. @${targetUsername} добавлен в список скамеров.`).catch(() =>
                ctx.editMessageText(`✅ Жалоба одобрена. @${targetUsername} добавлен в список скамеров.`)
            );

            // Уведомляем автора
            bot.telegram.sendMessage(complaint.fromId, `🎉 Ваша жалоба на @${targetUsername} была одобрена! Пользователь наказан.`).catch(() => { });
        } else {
            ctx.answerCbQuery('Не удалось найти @username в тексте жалобы. Пропишите /scammer вручную.');
        }
    } else if (action === 'reject') {
        complaint.status = 'rejected';
        saveDB();
        ctx.editMessageCaption('❌ Жалоба отклонена (недостаточно доказательств).').catch(() =>
            ctx.editMessageText('❌ Жалоба отклонена (недостаточно доказательств).')
        );

        // Уведомляем автора
        bot.telegram.sendMessage(complaint.fromId, `❌ Ваша жалоба была отклонена администрацией из-за нехватки доказательств.`).catch(() => { });
    }

    ctx.answerCbQuery();
});

// Логика капчи
bot.on('text', (ctx, next) => {
    const userId = ctx.from.id;
    const challenge = db.captcha[userId];
    const user = ctx.from.username || ctx.from.id;

    // Владельцу капча не нужна
    if (isOwner(ctx)) return next();

    if (challenge && !challenge.verified) {
        if (ctx.message.text === String(challenge.answer)) {
            challenge.verified = true;
            ctx.reply('✅ Проверка пройдена! Теперь вы можете пользоваться всеми функциями бота.');
            ctx.reply('🔗 Ссылка на наш основной чат: https://t.me/TradeGameChat\n\nМожешь использовать меню команд / для проверки профиля.');
        } else {
            ctx.reply(`❌ Неверно. Попробуй еще раз: сколько будет ${challenge.q}?`);
        }
        return;
    }
    return next();
});

// Настройка меню команд
bot.telegram.setMyCommands([
    { command: 'bio', description: 'Проверить статус пользователя' },
    { command: 'complain', description: 'Подать жалобу на скамера' },
    { command: 'id', description: 'Узнать свой ID или ID другого' },
    { command: 'allscammers', description: 'Список всех скамеров' },
    { command: 'allguarante', description: 'Список всех гарантов' },
    { command: 'allintern', description: 'Список всех стажеров' },
    { command: 'scammer', description: '❌ [ВЛАДЕЛЕЦ] Пометить как скамера' },
    { command: 'unscam', description: '❌ [ВЛАДЕЛЕЦ] Убрать из ЧС' },
    { command: 'igiveout', description: '❌ [ВЛАДЕЛЕЦ] Выдать роль (intern/guarante)' },
    { command: 'unintern', description: '❌ [ВЛАДЕЛЕЦ] Убрать роль стажера' },
    { command: 'unguarante', description: '❌ [ВЛАДЕЛЕЦ] Убрать роль гаранта' }
]);

// Стартовая команда
bot.start((ctx) => {
    const userId = ctx.from.id;

    // Регистрация (на случай если middleware не сработал)
    const username = ctx.from.username || ctx.from.first_name;
    if (!db.users[username]) {
        db.users[username] = {
            roles: { 'Участник': { note: '' } },
            status: 'clean',
            id: userId,
            username: ctx.from.username || null,
            firstName: ctx.from.first_name
        };
        saveDB();
    }

    // Генерация капчи
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    db.captcha[userId] = {
        q: `${a} + ${b}`,
        answer: a + b,
        verified: false
    };

    const welcomeMsg = `👋 **Привет, ${ctx.from.first_name}!**\n\n` +
        `🤖 Я — защитник **Steal A Brainrot**.\n` +
        `✅ Вы успешно зарегистрированы в системе!\n\n` +
        `Чтобы получить полный доступ, подтвердите, что вы не робот. 🤖\n\n` +
        `📝 **ЗАДАНИЕ:**\n` +
        `Сколько будет **${a} + ${b}**?\n` +
        `_(Напишите ответ цифрами в чат)_\n\n` +
        `🌐 **ЛИЧНЫЙ КАБИНЕТ:**\n` +
        `🔗 [Войти на сайт](https://steal-a-brainrot-virid.vercel.app/?auth=${ctx.from.username || ctx.from.first_name})`;

    ctx.reply(welcomeMsg, { parse_mode: 'Markdown' });
});

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error(`Ошибка для ${ctx.updateType}:`, err);
});

// Запуск бота (Webhooks для Render, Polling для локалки)
const URL = process.env.RENDER_EXTERNAL_URL || '';

if (URL) {
    bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
    app.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));
    console.log('📡 Бот запущен через Webhooks (Render Mode)');
} else {
    bot.launch()
        .then(() => console.log('🤖 Бот запущен локально (Polling Mode)'))
        .catch((err) => console.error('Ошибка запуска бота:', err));
}

// API для сайта (проверка статуса пользователя)
app.get('/api/user/:username', async (req, res) => {
    let query = req.params.username;

    // Считаем это числовым ID, если нет @ и это только цифры
    const isId = !query.startsWith('@') && /^\d+$/.test(query);

    // Если это не число (ID) и не начинается с @ - выдаем ошибку
    if (!isId && !query.startsWith('@')) {
        return res.status(400).json({
            success: false,
            message: 'Юзернейм должен начинаться с @',
            isRegistered: false
        });
    }

    query = query.replace('@', '');

    // Проверка на русские буквы
    if (/[а-яА-ЯёЁ]/.test(query)) {
        return res.status(400).json({
            success: false,
            message: 'Юзернейм может содержать только английские буквы',
            isRegistered: false
        });
    }

    // Поиск по username или по ID
    let userData = db.users[query];

    // Если по ключу не нашли, ищем внутри объектов по полю id или username
    if (!userData) {
        userData = Object.values(db.users).find(u =>
            u.username === query || String(u.id) === query
        );
    }

    // Если в базе нет, пробуем найти через Telegram API (только для юзернеймов)
    if (!userData && isNaN(query)) {
        try {
            const chat = await bot.telegram.getChat(`@${query}`);
            userData = {
                roles: { 'Участник': { note: '' } },
                status: 'clean',
                username: chat.username || query,
                firstName: chat.first_name || query
            };
        } catch (err) {
            // Если Telegram тоже не нашел (или нет прав видеть)
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден. Он должен запустить бота или быть участником нашего чата.',
                isRegistered: false
            });
        }
    } else if (!userData) {
        // Если это был ID и его нет в базе
        return res.status(404).json({
            success: false,
            message: 'Такого пользователя не существует',
            isRegistered: false
        });
    }

    const roleString = Object.entries(userData.roles || {})
        .map(([name, info]) => `${name}${info.note ? ` (${info.note})` : ''}`)
        .join('\n') || 'Участник';

    res.json({
        ...userData,
        role: roleString,
        username: userData.username || query,
        avatar: userData.avatar || null,
        isRegistered: !!db.users[query] || !!Object.values(db.users).find(u => u.username === query || String(u.id) === query)
    });
});

// Обновление профиля (аватар и т.д.)
app.post('/api/user/:username/update', (req, res) => {
    const username = req.params.username.replace('@', '');
    const { avatar } = req.body;

    if (!db.users[username]) {
        db.users[username] = {
            roles: { 'Участник': { note: '' } },
            status: 'clean',
            username: username
        };
    }

    db.users[username].avatar = avatar;
    saveDB();
    res.json({ success: true, avatar: db.users[username].avatar });
});

// Endpoint для самопроверки (Keep-Alive)
app.get('/health', (req, res) => res.send('OK'));

const PORT = 3001;
const server = app.listen(PORT, () => {
    console.log(`🌐 API сервера запущен на порту ${PORT}`);
});

// Авто-перезагрузка при ошибках (Prevent Sleep/Crash)
process.on('uncaughtException', (err) => {
    console.error('Critical Error:', err);
    // В реальности здесь мог бы быть перезапуск через pm2
});

// Остановка
process.once('SIGINT', () => {
    saveDB();
    server.close();
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    saveDB();
    server.close();
    bot.stop('SIGTERM');
});
