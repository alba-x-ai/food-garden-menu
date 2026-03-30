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


# ---------- БАЗА ----------

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
        "👨‍🍳 Food Garden\n\n"
        "Готовое меню на 2 дня.\n"
        "Выберите действие:",
        reply_markup=markup
    )


# ---------- КОНТАКТЫ ----------

@dp.message(lambda message: message.text == "📍 Контакты")
async def contacts(message: types.Message):

    await message.answer(
        "📍 Локация: Дананг\n\n"
        "Связаться с нами можно:\n"
        "@Foodgardenadmin"
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


# ---------- АДМИН-ПАНЕЛЬ ----------

@dp.message(Command("admin"))
async def admin_panel(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    keyboard = [
        [types.KeyboardButton(text="🔄 Сбросить места")],
        [types.KeyboardButton(text="❌ Закрыть Понедельник")],
        [types.KeyboardButton(text="✅ Открыть Понедельник")],
        [types.KeyboardButton(text="❌ Закрыть Среда")],
        [types.KeyboardButton(text="✅ Открыть Среда")],
        [types.KeyboardButton(text="❌ Закрыть Пятница")],
        [types.KeyboardButton(text="✅ Открыть Пятница")]
    ]

    markup = types.ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True
    )

    await message.answer(
        "Админ-панель управления заказами",
        reply_markup=markup
    )


# ---------- СБРОС МЕСТ ----------

@dp.message(lambda m: m.text == "🔄 Сбросить места")
async def reset_spots(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    data = {
        "Понедельник": 15,
        "Среда": 15,
        "Пятница": 15
    }

    save_spots(data)

    await message.answer("Места сброшены на 15.")


# ---------- ЗАКРЫТИЕ ДНЕЙ ----------

@dp.message(lambda m: m.text == "❌ Закрыть Понедельник")
async def close_mon(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    spots = load_spots()
    spots["Понедельник"] = 0
    save_spots(spots)

    await message.answer("Понедельник закрыт.")


@dp.message(lambda m: m.text == "❌ Закрыть Среда")
async def close_wed(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    spots = load_spots()
    spots["Среда"] = 0
    save_spots(spots)

    await message.answer("Среда закрыта.")


@dp.message(lambda m: m.text == "❌ Закрыть Пятница")
async def close_fri(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    spots = load_spots()
    spots["Пятница"] = 0
    save_spots(spots)

    await message.answer("Пятница закрыта.")


# ---------- ОТКРЫТИЕ ДНЕЙ ----------

@dp.message(lambda m: m.text == "✅ Открыть Понедельник")
async def open_mon(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    spots = load_spots()
    spots["Понедельник"] = 15
    save_spots(spots)

    await message.answer("Понедельник открыт.")


@dp.message(lambda m: m.text == "✅ Открыть Среда")
async def open_wed(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    spots = load_spots()
    spots["Среда"] = 15
    save_spots(spots)

    await message.answer("Среда открыта.")


@dp.message(lambda m: m.text == "✅ Открыть Пятница")
async def open_fri(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    spots = load_spots()
    spots["Пятница"] = 15
    save_spots(spots)

    await message.answer("Пятница открыта.")


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
