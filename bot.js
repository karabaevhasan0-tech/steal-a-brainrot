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
    captcha: {}
};

if (fs.existsSync(DB_FILE)) {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        db = JSON.parse(data);
        db.captcha = {}; // Капчу не сохраняем
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
const isOwner = (ctx) => ctx.from && ctx.from.username === OWNER_USERNAME;

// Регистрация всех пользователей, кто пишет боту
bot.use(async (ctx, next) => {
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
bot.command('bio', (ctx) => {
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
        // Ищем по всем пользователям (вдруг ключ - это имя, а мы ищем по username)
        userData = Object.values(db.users).find(u => u.username === targetUsername);
    }

    if (!userData) {
        return ctx.reply(`❌ Пользователь @${targetUsername} не найден в нашей базе данных. Он должен хотя бы раз написать боту /start.`);
    }

    let response = `👤 <b>Профиль:</b> @${targetUsername}\n\n`;

    response += `🎭 <b>Роли:</b> \n`;
    const rolesList = Object.entries(userData.roles || { 'Участник': { note: '' } });
    rolesList.forEach(([role, info]) => {
        response += `• ${role}${info.note ? ` (${info.note})` : ''}\n`;
    });

    response += `\n🛡️ <b>Проверка:</b> ${userData.status === 'scammer' ? '<pre>❌ СКАМЕР</pre>' : '✅ Чист'}`;

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

// Логика капчи
bot.on('text', (ctx, next) => {
    const userId = ctx.from.id;
    const challenge = db.captcha[userId];

    if (challenge && !challenge.verified) {
        const userAnswer = parseInt(ctx.message.text);
        if (userAnswer === challenge.answer) {
            challenge.verified = true;
            ctx.reply('✅ Проверка пройдена! Теперь ты полноценный участник проекта.');
            ctx.reply('🔗 Ссылка на наш основной чат: https://t.me/TradeGameChat\n\nМожешь использовать меню команд / для проверки профиля.');
        } else {
            ctx.reply('❌ Неверно. Попробуй еще раз: сколько будет ' + challenge.q + '?');
        }
        return;
    }
    return next();
});

// Настройка меню команд
bot.telegram.setMyCommands([
    { command: 'bio', description: 'Проверить статус пользователя' },
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

    const welcomeMsg = `👋 Привет, ${ctx.from.first_name}!\n\n` +
        `🤖 Я — защитник **Steal A Brainrot**.\n` +
        `✅ Ты успешно зарегистрирован в системе нашей базы!\n\n` +
        `Чтобы пользоваться ботом и попасть в чат, подтверди, что ты не робот 🤖\n\n` +
        `🌐 **ВХОД НА САЙТ (Авто-логин):**\n` +
        `🔗 [Нажми сюда, чтобы войти в аккаунт](https://steal-a-brainrot-virid.vercel.app/?auth=${ctx.from.username || ctx.from.first_name})\n\n` +
        `💡 Используй /help, чтобы увидеть список команд.\n\n` +
        `Сколько будет ${a} + ${b}?`;

    ctx.reply(welcomeMsg);
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
app.get('/api/user/:username', (req, res) => {
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

    if (!userData) {
        return res.status(404).json({
            success: false,
            message: 'Пользователь не найден в базе данных',
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
