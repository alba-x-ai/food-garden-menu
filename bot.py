import asyncio
import json
import os

from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiohttp import web


TOKEN = "8681478285:AAEHzhsTN7XkJqkEiVGpbusSm9BpNexA1Q0"
ADMIN_ID = 8796252165


bot = Bot(token=TOKEN)
dp = Dispatcher()


DEFAULT_SPOTS = {
    "Понедельник": 15,
    "Среда": 15,
    "Пятница": 15
}


# ---------- БАЗА ----------

def save_spots(data):
    with open("spots.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_spots():

    try:
        with open("spots.json", "r", encoding="utf-8") as f:
            return json.load(f)

    except:
        return DEFAULT_SPOTS.copy()


# ---------- START ----------

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
        "👨‍🍳 FOOD GARDEN\n\n"
        "Готовое меню на 2 дня.",
        reply_markup=markup
    )


# ---------- КНОПКИ ----------

@dp.message()
async def handle_buttons(message: types.Message):

    if message.text == "📍 Контакты":

    await message.answer(
        "📍 Локация: Дананг\n\n"
        "Связаться с нами:\n"
        "👤 Администратор\n"
        "https://t.me/Foodgardenadmin\n\n"
        "💬 Чат отзывов и вопросов\n"
        "https://t.me/foodgardendanang"
    )

# ---------- ПРИЁМ ЗАКАЗА ----------

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
        "Оплата при получении."
    )


# ---------- API ДЛЯ MINI APP ----------

async def get_spots(request):

    data = load_spots()

    response = web.json_response(data)

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
