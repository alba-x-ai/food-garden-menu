const tg = window.Telegram.WebApp
tg.ready()

const menuDiv = document.getElementById("menu")
const cartDiv = document.getElementById("cart")

let cart = []
let currentMenu = null
let currentType = null

const breadOptions = [
"Пшеничный с орегано",
"Пшеничный с грецкими орехами и семенами чиа и льна",
"Пшеничный с зирой"
]

const pieOptions = [
"С капустой",
"С картошкой",
"С яйцом, луком и рисом"
]

const menus = {

russian: [
{
day:"Понедельник",
fixed:["Салат «Летний»","Гречка с грибами и луком","Солёные огурцы"],
soups:["Борщ + Гороховый суп","Куриный суп с сухариками + Рассольник"],
mains:[
"Говядина тушёная с картофельным пюре + Куриная печень с рисом",
"Котлета из говядины с гречкой + Котлета куриная с запечёнными овощами"
]
},
{
day:"Среда",
fixed:["Свекольный салат с орехом, чесноком, изюмом","Перловая каша с грибами и луком","Квашеная капуста"],
soups:["Куриный суп с сухариками + Рассольник","Солянка + Щи"],
mains:[
"Котлета из говядины с гречкой + Котлета куриная с запечёнными овощами",
"Курица запечённая с лапшой + Свиные рёбра с тушёной капустой"
]
},
{
day:"Пятница",
fixed:["Салат «Витаминный»","Гороховая каша с грибами и луком","Маринованные помидоры"],
soups:["Борщ + Гороховый суп","Солянка + Щи"],
mains:[
"Говядина тушёная с картофельным пюре + Куриная печень с рисом",
"Курица запечённая с лапшой + Свиные рёбра с тушёной капустой"
]
}
],

international: [
{
day:"Понедельник",
fixed:["Греческий салат","Бутерброд с сыром","Солёные огурцы"],
soups:["Шурпа + Крем-суп грибной","Харчо + Овощной суп-пюре"],
mains:["Гуляш + Курица терияки","Курица Кун Пао + Ломо сальтадо"]
},
{
day:"Среда",
fixed:["Свекольный салат","Бутерброд с сыром","Квашеная капуста"],
soups:["Харчо + Овощной суп-пюре","Lohikeitto + Яично-помидорный"],
mains:["Курица Кун Пао + Ломо сальтадо","Кёнигсбергские клопсы + Индийское карри"]
},
{
day:"Пятница",
fixed:["Салат с фунчозой","Бутерброд с сыром","Маринованные помидоры"],
soups:["Шурпа + Крем-суп грибной","Lohikeitto + Яично-помидорный"],
mains:["Гуляш + Курица терияки","Кёнигсбергские клопсы + Индийское карри"]
}
]

}

// --- ВЫБОР МЕНЮ ---
function renderMenuTypes(){

menuDiv.innerHTML = `
<h2>Выберите меню</h2>

<button onclick="openMenu('russian')">Русское меню</button>
<button onclick="openMenu('international')">Интернациональное меню</button>
`

}

// --- ДНИ ---
function openMenu(type){

currentType = type
currentMenu = menus[type]

menuDiv.innerHTML = `
<button onclick="renderMenuTypes()">← Назад</button>
`

currentMenu.forEach((set,i)=>{

menuDiv.innerHTML += `
<div style="background:white;padding:10px;margin:10px 0;border-radius:10px">
<h2>${set.day}</h2>
<button onclick="openDay(${i})">Выбрать</button>
</div>
`

})

}

// --- ДЕНЬ ---
function openDay(index){

const set = currentMenu[index]

menuDiv.innerHTML = `
<button onclick="openMenu('${currentType}')">← Назад</button>

<h2>${set.day}</h2>

<h3>ФИКС</h3>
<ul>${set.fixed.map(i=>`<li>${i}</li>`).join("")}</ul>

<h3>СУПЫ</h3>
${set.soups.map((s,i)=>`
<label>
<input type="radio" name="soup" value="${s}" ${i===0?"checked":""}>
${s}
</label><br>
`).join("")}

<h3>ВТОРЫЕ</h3>
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
`

}

// --- ДОБАВИТЬ (ГЛАВНЫЙ ФИКС) ---
function addToCart(day){

// 🔥 ВСЕГДА читаем DOM
const soup = document.querySelector('input[name="soup"]:checked')?.value
const main = document.querySelector('input[name="main"]:checked')?.value

const breads = Array.from(document.querySelectorAll('input[name="bread"]:checked')).map(i=>i.value)
const pies = Array.from(document.querySelectorAll('input[name="pies"]:checked')).map(i=>i.value)

const comment = document.getElementById("comment")?.value || ""

if(!soup || !main){
alert("Выберите суп и второе")
return
}

const item = {
day,
soup,
main,
bread: breads,
pies: pies,
comment
}

console.log("ORDER ITEM:", item)

cart.push(item)

renderCart()
alert("Добавлено в корзину")

}

// --- КОРЗИНА ---
function renderCart(){

if(cart.length === 0){
cartDiv.innerHTML = ""
return
}

cartDiv.innerHTML = `
<div style="position:fixed;bottom:0;background:white;width:100%;padding:10px">

<b>Корзина (${cart.length})</b>

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

console.log("SEND:", cart)

tg.sendData(JSON.stringify({cart}))

setTimeout(()=>{
tg.close()
},500)

}

// --- СТАРТ ---
renderMenuTypes()
