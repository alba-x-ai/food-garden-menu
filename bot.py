import asyncio
import json
import sqlite3
import os

from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiohttp import web


TOKEN = "8681478285:AAEHzhsTN7XkJqkEiVGpbusSm9BpNexA1Q0"
ADMIN_ID = 430678042

LIMIT = 15

bot = Bot(token=TOKEN)
dp = Dispatcher()


# ---------- БАЗА ----------
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


# ---------- ВРЕМЕННЫЕ ДАННЫЕ ----------
pending_orders = {}
payment_state = {}


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
        [types.KeyboardButton(text="📍 Контакты")]
    ]

    markup = types.ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True
    )

    await message.answer(
        "👨‍🍳 Food Garden\n\n"
        "Готовое меню на 2 дня.\n"
        "📦 Доставка: Пн / Ср / Пт\n"
        "⏰ 8:00–12:00\n\n"
        "Нажмите «Открыть меню».",
        reply_markup=markup
    )


# ---------- КОНТАКТЫ ----------
@dp.message(F.text == "📍 Контакты")
async def contacts(message: types.Message):

    await message.answer(
        "📍 Дананг\n\n"
        "👤 Администратор\n"
        "https://t.me/Foodgardenadmin\n\n"
        "💬 Чат вопросов и отзывов\n"
        "https://t.me/foodgardendanang"
    )


# ---------- ЗАКАЗ ИЗ MINI APP ----------
@dp.message(F.web_app_data)
async def webapp_order(message: types.Message):

    data = json.loads(message.web_app_data.data)

    day = data["day"]
    comment = data.get("comment","")

    spots = get_spots()

    if spots[day] <= 0:
        await message.answer("❌ Места закончились.")
        return

    decrease_spot(day)

    pending_orders[message.from_user.id] = {
        "day": day,
        "comment": comment
    }

    keyboard = [
        [types.KeyboardButton(text="📍 Отправить геопозицию", request_location=True)]
    ]

    markup = types.ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True,
        one_time_keyboard=True
    )

    await message.answer(
        "✅ Заказ принят.\n\n"
        "📍 Нажмите кнопку и отправьте геопозицию доставки.",
        reply_markup=markup
    )


# ---------- ГЕОПОЗИЦИЯ ----------
@dp.message(F.location)
async def location_handler(message: types.Message):

    user_id = message.from_user.id

    if user_id not in pending_orders:
        return

    order = pending_orders[user_id]

    payment_state[user_id] = {
        "day": order["day"],
        "comment": order["comment"],
        "lat": message.location.latitude,
        "lon": message.location.longitude
    }

    keyboard = [
        [
            types.KeyboardButton(text="💵 Наличными"),
            types.KeyboardButton(text="💳 Картой")
        ]
    ]

    markup = types.ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True,
        one_time_keyboard=True
    )

    await message.answer(
        "💳 Как оплатить заказ?",
        reply_markup=markup
    )


# ---------- ВЫБОР ОПЛАТЫ ----------
@dp.message(F.text.in_(["💵 Наличными","💳 Картой"]))
async def payment_type(message: types.Message):

    user_id = message.from_user.id

    if user_id not in payment_state:
        return

    if message.text == "💵 Наличными":

        payment_state[user_id]["payment"] = "Наличные"

        await message.answer(
            "Напишите сумму, с которой нужна сдача."
        )

    else:

        payment_state[user_id]["payment"] = "Карта"

        keyboard = [
            [
                types.KeyboardButton(text="💳 Vietcombank"),
                types.KeyboardButton(text="💳 Techcombank")
            ],
            [
                types.KeyboardButton(text="💳 Momo"),
                types.KeyboardButton(text="💳 ZaloPay")
            ]
        ]

        markup = types.ReplyKeyboardMarkup(
            keyboard=keyboard,
            resize_keyboard=True,
            one_time_keyboard=True
        )

        await message.answer(
            "Выберите банк:",
            reply_markup=markup
        )


# ---------- БАНК ----------
@dp.message(F.text.in_([
    "💳 Vietcombank",
    "💳 Techcombank",
    "💳 Momo",
    "💳 ZaloPay"
]))
async def bank_payment(message: types.Message):

    user_id = message.from_user.id

    if user_id not in payment_state:
        return

    payment_state[user_id]["payment_detail"] = message.text

    await finish_order(message)


# ---------- НАЛИЧНЫЕ ----------
@dp.message()
async def cash_handler(message: types.Message):

    user_id = message.from_user.id

    if user_id not in payment_state:
        return

    if payment_state[user_id].get("payment") == "Наличные":

        payment_state[user_id]["payment_detail"] = message.text

        await finish_order(message)


# ---------- ФИНАЛ ----------
async def finish_order(message):

    user_id = message.from_user.id
    order = payment_state[user_id]

    username = message.from_user.username
    name = message.from_user.full_name

    if username:
        user = f"@{username}"
    else:
        user = f"id:{user_id}"

    admin_text = (
        "🆕 Новый заказ\n\n"
        f"📅 День: {order['day']}\n"
        f"👤 Клиент: {name}\n"
        f"{user}\n\n"
        f"💬 Комментарий: {order['comment']}\n\n"
        f"💳 Оплата: {order['payment']}\n"
        f"💰 Детали: {order['payment_detail']}"
    )

    await bot.send_message(ADMIN_ID, admin_text)

    await bot.send_location(
        ADMIN_ID,
        latitude=order["lat"],
        longitude=order["lon"]
    )

    await message.answer("✅ Заказ оформлен.")

    del payment_state[user_id]
    del pending_orders[user_id]


# ---------- АДМИН ----------
@dp.message(Command("admin"))
async def admin(message: types.Message):

    if message.from_user.id != ADMIN_ID:
        return

    keyboard = [
        [types.KeyboardButton(text="📊 Статистика")],
        [types.KeyboardButton(text="🔄 Сбросить места")]
    ]

    markup = types.ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True
    )

    await message.answer("⚙️ Админ панель", reply_markup=markup)


@dp.message(F.text == "📊 Статистика")
async def stats(message: types.Message):

    spots = get_spots()

    text = (
        "📊 Статистика\n\n"
        f"Пн: {LIMIT - spots['Понедельник']}/{LIMIT}\n"
        f"Ср: {LIMIT - spots['Среда']}/{LIMIT}\n"
        f"Пт: {LIMIT - spots['Пятница']}/{LIMIT}"
    )

    await message.answer(text)


@dp.message(F.text == "🔄 Сбросить места")
async def reset(message: types.Message):

    reset_spots()
    await message.answer("Места сброшены.")


# ---------- API ----------
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
