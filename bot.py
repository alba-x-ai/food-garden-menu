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


# ---------------- БАЗА ----------------

def save_spots(data):
    with open("spots.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_spots():

    if not os.path.exists("spots.json"):

        data = {
            "Понедельник": 15,
            "Среда": 15,
            "Пятница": 15
        }

        save_spots(data)
        return data

    with open("spots.json", "r", encoding="utf-8") as f:
        return json.load(f)


# ---------------- START ----------------

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
        "👨‍🍳 Privet Kitchen\n\n"
        "Готовое меню на 2 дня.\n"
        "Выберите действие:",
        reply_markup=markup
    )


# ---------------- КОНТАКТЫ ----------------

@dp.message(lambda m: m.text == "📍 Контакты")
async def contacts(message: types.Message):

    await message.answer(
        "📍 Локация: Дананг\n\n"
        "Связаться с нами можно:\n"
        "@Foodgardenadmin"
    )


# ---------------- ЗАКАЗ ----------------

@dp.message(lambda m: m.web_app_data)
async def order_from_webapp(message: types.Message):

    day = message.web_app_data.data.strip()

    spots = load_spots()

    if spots.get(day, 0) <= 0:

        await message.answer(
            "❌ Места на этот день закончились."
        )
        return

    spots[day] -= 1
    save_spots(spots)

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
        f"📦 Осталось мест: {spots[day]}"
    )

    await bot.send_message(ADMIN_ID, text)

    await message.answer(
        "✅ Заказ принят!\n"
        "Оплата при получлении."
    )


# ---------------- API ДЛЯ MINI APP ----------------

async def get_spots(request):

    data = load_spots()

    return web.json_response(data)


async def start_api():

    app = web.Application()

    app.router.add_get("/spots", get_spots)

    runner = web.AppRunner(app)
    await runner.setup()

    port = int(os.environ.get("PORT", 10000))

    site = web.TCPSite(runner, "0.0.0.0", port)

    await site.start()


# ---------------- ЗАПУСК ----------------

async def main():

    await start_api()

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
