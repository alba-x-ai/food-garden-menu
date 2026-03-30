import asyncio
import json
import os
import sqlite3

from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiohttp import web


TOKEN = "8681478285:AAEHzhsTN7XkJqkEiVGpbusSm9BpNexA1Q0"
ADMIN_ID = 430678042

LIMIT = 15


bot = Bot(token=TOKEN)
dp = Dispatcher()


# ---------- БАЗА ДАННЫХ ----------

conn = sqlite3.connect("orders.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS spots(
day TEXT PRIMARY KEY,
places INTEGER
)
""")

for day in ["Понедельник","Среда","Пятница"]:
    cursor.execute(
        "INSERT OR IGNORE INTO spots(day,places) VALUES(?,?)",
        (day,LIMIT)
    )

conn.commit()


def get_spots():

    data = {}

    for row in cursor.execute("SELECT day,places FROM spots"):
        data[row[0]] = row[1]

    return data


def decrease_spot(day):

    cursor.execute(
        "UPDATE spots SET places = places - 1 WHERE day=? AND places>0",
        (day,)
    )

    conn.commit()


def reset_spots():

    cursor.execute("UPDATE spots SET places=?", (LIMIT,))
    conn.commit()


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
        "Готовое меню на 2 дня с доставкой.\n\n"
        "📦 Доставка: Понедельник / Среда / Пятница\n"
        "⏰ Время доставки: 8:00 – 12:00\n\n"
        "Нажмите «Открыть меню», чтобы оформить заказ.",
        reply_markup=markup
    )


# ---------- КОНТАКТЫ И ЗАКАЗ ----------

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


    if message.web_app_data:

        try:

            data = json.loads(message.web_app_data.data)

            day = data["day"]
            comment = data.get("comment","")

            spots = get_spots()

            if spots[day] <= 0:

                await message.answer(
                    "❌ Места на этот день закончились."
                )
                return


            decrease_spot(day)

            username = message.from_user.username
            name = message.from_user.full_name

            if username:
                user = f"@{username}"
            else:
                user = f"id:{message.from_user.id}"

            spots = get_spots()

            admin_text = (
                "🆕 Новый заказ\n\n"
                f"📅 День: {day}\n\n"
                f"👤 Клиент: {name}\n"
                f"{user}\n\n"
                f"💬 Комментарий: {comment}\n\n"
                f"📦 Осталось мест: {spots[day]}"
            )

            try:
                await bot.send_message(ADMIN_ID, admin_text)
            except Exception as e:
                print("ADMIN ERROR:",e)

            await message.answer(
                "✅ Заказ принят!\n"
                "Оплата при получении."
            )

        except Exception as e:

            print("ORDER ERROR:",e)

            await message.answer(
                "Ошибка обработки заказа."
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

    spots = get_spots()

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

    reset_spots()

    await message.answer("Места сброшены.")


# ---------- API ДЛЯ MINI APP ----------

async def get_spots_api(request):

    response = web.json_response(get_spots())

    response.headers["Access-Control-Allow-Origin"] = "*"

    return response


async def start_api():

    app = web.Application()

    app.router.add_get("/spots", get_spots_api)

    runner = web.AppRunner(app)
    await runner.setup()

    port = int(os.environ.get("PORT",10000))

    site = web.TCPSite(runner,"0.0.0.0",port)

    await site.start()


# ---------- ЗАПУСК ----------

async def main():

    await start_api()

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
