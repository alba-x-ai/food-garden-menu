import asyncio
import json
import os

from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiohttp import web


TOKEN = "8681478285:AAEHzhsTN7XkJqkEiVGpbusSm9BpNexA1Q0"
ADMIN_ID = 430678042


bot = Bot(token=TOKEN)
dp = Dispatcher()

LIMIT = 15

spots = {
    "Понедельник": LIMIT,
    "Среда": LIMIT,
    "Пятница": LIMIT
}


# ---------- СТАРТ / ПРИВЕТСТВИЕ ----------
@dp.message(Command("start"))
async def start(message: types.Message):

    keyboard = [
        [
            types.KeyboardButton(
                text="🍽 Открыть меню",
                web_app=types.WebAppInfo(
                    url="https://alba-x-ai.github.io/food-garden-menu/"
                )
            )
        ],
        [
            types.KeyboardButton(text="📍 Контакты")
        ]
    ]

    markup = types.ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True
    )

    await message.answer(
        "👨‍🍳 Food Garden\n\n"
        "Готовое меню на 2 дня с доставкой.\n\n"
        "📦 Доставка: Понедельник / Среда / Пятница\n"
        "⏰ Время доставки: 8:00 – 12:00\n\n"
        "Нажмите «Открыть меню», чтобы оформить заказ.",
        reply_markup=markup
    )


# ---------- КНОПКИ ----------
@dp.message()
async def handle_buttons(message: types.Message):

    if message.text == "📍 Контакты":

        await message.answer(
            "📍 Локация: Дананг\n\n"
            "Связаться с нами:\n\n"
            "👤 Администратор\n"
            "https://t.me/Foodgardenadmin\n\n"
            "💬 Чат отзывов и вопросов\n"
            "https://t.me/foodgardendanang"
        )


# ---------- ПРИЁМ ЗАКАЗА ----------
@dp.message(lambda m: m.web_app_data)
async def order_from_webapp(message: types.Message):

    data = json.loads(message.web_app_data.data)

    day = data["day"]
    comment = data.get("comment", "")

    if spots.get(day, 0) <= 0:

        await message.answer(
            "❌ Места на этот день закончились."
        )
        return

    spots[day] -= 1

    username = message.from_user.username
    name = message.from_user.full_name

    if username:
        user = f"@{username}"
    else:
        user = f"id:{message.from_user.id}"

    text = (
        "🆕 Новый заказ\n\n"
        f"📅 День: {day}\n\n"
        f"👤 Клиент: {name}\n"
        f"{user}\n\n"
        f"💬 Комментарий: {comment}\n\n"
        f"📦 Осталось мест: {spots[day]}"
    )

    await bot.send_message(ADMIN_ID, text)

    await message.answer(
        "✅ Заказ принят!\n"
        "Оплата при получении."
    )


# ---------- АДМИН ПАНЕЛЬ ----------
@dp.message(Command("admin"))
async def admin_panel(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        await message.answer("Нет доступа")
        return

    keyboard = [
        [types.KeyboardButton(text="📊 Статистика")],
        [types.KeyboardButton(text="🔄 Сбросить места")]
    ]

    markup = types.ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True
    )

    await message.answer(
        "⚙️ Админ панель",
        reply_markup=markup
    )


# ---------- СТАТИСТИКА ----------
@dp.message(lambda m: m.text == "📊 Статистика")
async def stats(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    text = (
        "📊 Статистика заказов\n\n"
        f"Понедельник: {LIMIT - spots['Понедельник']} / {LIMIT}\n"
        f"Среда: {LIMIT - spots['Среда']} / {LIMIT}\n"
        f"Пятница: {LIMIT - spots['Пятница']} / {LIMIT}"
    )

    await message.answer(text)


# ---------- СБРОС ----------
@dp.message(lambda m: m.text == "🔄 Сбросить места")
async def reset(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    spots["Понедельник"] = LIMIT
    spots["Среда"] = LIMIT
    spots["Пятница"] = LIMIT

    await message.answer("Места сброшены.")


# ---------- API ДЛЯ MINI APP ----------
async def get_spots(request):

    response = web.json_response(spots)

    response.headers["Access-Control-Allow-Origin"] = "*"

    return response


async def start_api():

    app = web.Application()

    app.router.add_get("/spots", get_spots)

    runner = web.AppRunner(app)
    await runner.setup()

    port = int(os.environ.get("PORT", 10000))

    site = web.TCPSite(runner, "0.0.0.0", port)

    await site.start()


# ---------- ЗАПУСК ----------
async def main():

    await start_api()

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
