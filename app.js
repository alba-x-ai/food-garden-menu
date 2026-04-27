const tg = window.Telegram.WebApp
tg.ready()

let cart = []
let currentMenu = null
let currentType = null

const menuDiv = document.getElementById("menu")
const cartDiv = document.getElementById("cart")

// --- ДОПЫ ---
const breadOptions = [
"Пшеничный с орегано",
"Пшеничный с грецкими орехами и семенами",
"Пшеничный с зирой"
]

const pieOptions = [
"С капустой",
"С картошкой",
"С яйцом, луком и рисом"
]

// --- ДВА МЕНЮ ---
const menus = {

russian: [
{
day:"Понедельник",
fixed:[
"Салат «Летний»",
"Гречка с грибами и луком",
"Солёные огурцы"
],
soups:[
"Борщ + Гороховый суп",
"Куриный суп с сухариками + Рассольник"
],
mains:[
"Говядина тушёная с картофельным пюре + Куриная печень с рисом",
"Котлета из говядины с гречкой + Котлета куриная с запечёнными овощами"
]
},
{
day:"Среда",
fixed:[
"Свекольный салат с орехом, чесноком, изюмом",
"Перловая каша с грибами и луком",
"Квашеная капуста"
],
soups:[
"Куриный суп с сухариками + Рассольник",
"Солянка + Щи"
],
mains:[
"Котлета из говядины с гречкой + Котлета куриная с запечёнными овощами",
"Курица запечённая с лапшой + Свиные рёбра с тушёной капустой"
]
},
{
day:"Пятница",
fixed:[
"Салат «Витаминный»",
"Гороховая каша с грибами и луком",
"Маринованные помидоры"
],
soups:[
"Борщ + Гороховый суп",
"Солянка + Щи"
],
mains:[
"Говядина тушёная с картофельным пюре + Куриная печень с рисом",
"Курица запечённая с лапшой + Свиные рёбра с тушёной капустой"
]
}
],

international: [
{
day:"Понедельник",
fixed:[
"Греческий салат",
"Бутерброд с сыром",
"Солёные огурцы"
],
soups:[
"Шурпа + Крем-суп грибной",
"Харчо + Овощной суп-пюре"
],
mains:[
"Гуляш + Курица терияки",
"Курица Кун Пао + Ломо сальтадо"
]
},
{
day:"Среда",
fixed:[
"Свекольный салат",
"Бутерброд с сыром",
"Квашеная капуста"
],
soups:[
"Харчо + Овощной суп-пюре",
"Lohikeitto + Яично-помидорный"
],
mains:[
"Курица Кун Пао + Ломо сальтадо",
"Кёнигсбергские клопсы + Индийское карри"
]
},
{
day:"Пятница",
fixed:[
"Салат с фунчозой",
"Бутерброд с сыром",
"Маринованные помидоры"
],
soups:[
"Шурпа + Крем-суп грибной",
"Lohikeitto + Яично-помидорный"
],
mains:[
"Гуляш + Курица терияки",
"Кёнигсбергские клопсы + Индийское карри"
]
}
]

}

// --- ЭКРАН 1: ВЫБОР МЕНЮ ---
function renderMenuTypes(){

menuDiv.innerHTML = `
<div class="card">
<h2>Выберите меню</h2>

<button onclick="openMenu('russian')">Русское меню</button>
<button onclick="openMenu('international')">Интернациональное меню</button>

</div>
`

}

// --- ЭКРАН 2: ДНИ ---
function openMenu(type){

currentType = type
currentMenu = menus[type]

menuDiv.innerHTML = ""

currentMenu.forEach((set,i)=>{

menuDiv.innerHTML += `
<div class="card">
<h2>${set.day}</h2>
<button onclick="openDay(${i})">Выбрать</button>
</div>
`

})

// 🔥 КНОПКА НАЗАД (ВОТ ЧТО ТЫ ПРОСИЛА)
menuDiv.innerHTML += `
<button onclick="renderMenuTypes()">← Назад</button>
`

}

// --- ЭКРАН 3: ДЕНЬ ---
function openDay(index){

const set = currentMenu[index]

menuDiv.innerHTML = `

<h2>${set.day}</h2>

<h3>ФИКС</h3>
<ul>${set.fixed.map(i=>`<li>${i}</li>`).join("")}</ul>

<h3>СУПЫ (1)</h3>
${set.soups.map((s,i)=>`
<label>
<input type="radio" name="soup" value="${s}" ${i===0?"checked":""}>
${s}
</label><br>
`).join("")}

<h3>ВТОРЫЕ (1)</h3>
${set.mains.map((m,i)=>`
<label>
<input type="radio" name="main" value="${m}" ${i===0?"checked":""}>
${m}
</label><br>
`).join("")}

<h3>ХЛЕБ</h3>
${breadOptions.map(b=>`
<label>
<input type="checkbox" name="bread" value="${b}">
${b}
</label><br>
`).join("")}

<h3>ПИРОЖКИ</h3>
${pieOptions.map(p=>`
<label>
<input type="checkbox" name="pies" value="${p}">
${p}
</label><br>
`).join("")}

<textarea id="comment" placeholder="Комментарий"></textarea>

<button onclick="addToCart('${set.day}')">Добавить в корзину</button>

<button onclick="openMenu('${currentType}')">← Назад</button>

`

}

// --- ДОБАВИТЬ ---
function addToCart(day){

const soupEl = document.querySelector('input[name="soup"]:checked')
const mainEl = document.querySelector('input[name="main"]:checked')

if(!soupEl || !mainEl){
alert("Выберите суп и второе")
return
}

const soup = soupEl.value
const main = mainEl.value

const breads = [...document.querySelectorAll('input[name="bread"]:checked')].map(i=>i.value)
const pies = [...document.querySelectorAll('input[name="pies"]:checked')].map(i=>i.value)

const comment = document.getElementById("comment").value

cart.push({
day,
soup,
main,
bread:breads,
pies:pies,
comment
})

renderCart()
alert("Добавлено")

}

// --- КОРЗИНА ---
function renderCart(){

if(cart.length === 0){
cartDiv.innerHTML = ""
return
}

cartDiv.innerHTML = `
<div class="cart">

<b>Корзина (${cart.length})</b>

${cart.map(i=>`
<div>
${i.day}<br>
${i.soup}<br>
${i.main}
</div>
<hr>
`).join("")}

<button onclick="checkout()">Оформить заказ</button>

</div>
`

}

// --- ОФОРМЛЕНИЕ ---
function checkout(){

if(cart.length === 0){
alert("Корзина пуста")
return
}

tg.sendData(JSON.stringify({cart}))

setTimeout(()=>{
tg.close()
},500)

}

// --- СТАРТ ---
renderMenuTypes()
