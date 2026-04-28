const tg = window.Telegram.WebApp
tg.ready()

const menuDiv = document.getElementById("menu")

let cart = []
let selection = {}
let currentMenu = null
let currentType = null

// --- МЕНЮ ---
const menus = {

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
"Гуляш с картофельным пюре + Курица терияки с запечёнными овощами",
"Курица Кун Пао с рисом + Ломо сальтадо"
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
"Курица Кун Пао с рисом + Ломо сальтадо",
"Кёнигсбергские клопсы с картофелем + Индийское карри с рисом"
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
"Гуляш с картофельным пюре + Курица терияки с запечёнными овощами",
"Кёнигсбергские клопсы с картофелем + Индийское карри с рисом"
]
}

],

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

]

}

// --- ДОПЫ ---
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

// --- UI (теперь button) ---
function chip(text, active, onclick){
return `<button class="${active ? 'active' : ''}" onclick="${onclick}">${text}</button>`
}

function header(){
return `<button class="orderBtn" onclick="openCart()">🛒 Корзина (${cart.length})</button>`
}

// --- ГЛАВНЫЙ ---
function renderTypes(){
menuDiv.innerHTML = `
<h1>Food Garden</h1>
${header()}
<div class="setCard">
<button onclick="openMenu('russian')">Русское меню</button>
</div>
<div class="setCard">
<button onclick="openMenu('international')">Интернациональное меню</button>
</div>
`
}

// --- ДНИ ---
function openMenu(type){

currentType = type
currentMenu = menus[type]

menuDiv.innerHTML = `
${header()}
<button class="backBtn" onclick="renderTypes()">← Назад</button>
`

currentMenu.forEach((set,i)=>{
menuDiv.innerHTML += `
<div class="setCard">
<h2>${set.day}</h2>
<button onclick="openDay(${i})">Открыть</button>
</div>
`
})

}

// --- ДЕНЬ ---
function openDay(index){

const set = currentMenu[index]

if(!selection[set.day]){
selection[set.day] = { soup:null, main:null, bread:null, pies:null }
}

const sel = selection[set.day]

menuDiv.innerHTML = `
${header()}
<button class="backBtn" onclick="openMenu('${currentType}')">← Назад</button>

<div class="setFull">

<h2>${set.day}</h2>

<h3>Фиксированное меню</h3>
<ul>${set.fixed.map(i=>`<li>${i}</li>`).join("")}</ul>

<h3>Пара супов</h3>
${set.soups.map(s=>chip(s, sel.soup===s, `selectSoup('${set.day}','${s}')`)).join("")}

<h3>Пара вторых</h3>
${set.mains.map(m=>chip(m, sel.main===m, `selectMain('${set.day}','${m}')`)).join("")}

<h3>Хлеб</h3>
${breadOptions.map(b=>chip(b, sel.bread===b, `selectBread('${set.day}','${b}')`)).join("")}

<h3>Пирожки</h3>
${pieOptions.map(p=>chip(p, sel.pies===p, `selectPies('${set.day}','${p}')`)).join("")}

<button class="orderBtn" onclick="addToCart(${index})">Добавить в корзину</button>

</div>
`
}

// --- ВЫБОР ---
function selectSoup(day,val){ selection[day].soup=val; rerender(day) }
function selectMain(day,val){ selection[day].main=val; rerender(day) }
function selectBread(day,val){ selection[day].bread=val; rerender(day) }
function selectPies(day,val){ selection[day].pies=val; rerender(day) }

function rerender(day){
const i = currentMenu.findIndex(x=>x.day===day)
openDay(i)
}

// --- ДОБАВИТЬ ---
function addToCart(index){

const set = currentMenu[index]
const sel = selection[set.day]

if(!sel.soup || !sel.main){
alert("Выберите супы и второе")
return
}

cart.push({...sel, day:set.day})
alert("Добавлено")
}

// --- КОРЗИНА ---
function openCart(){

menuDiv.innerHTML = `
<button class="backBtn" onclick="renderTypes()">← Назад</button>
<h2>Корзина</h2>

${cart.map(i=>`
<div class="setCard">
<b>${i.day}</b><br>
Супы: ${i.soup}<br>
Второе: ${i.main}<br>
Хлеб: ${i.bread || "-"}<br>
Пирожки: ${i.pies || "-"}
</div>
`).join("")}

<button class="orderBtn" onclick="checkout()">Оформить заказ</button>
`
}

// --- ОТПРАВКА ---
function checkout(){

if(cart.length===0){
alert("Корзина пустая")
return
}

tg.sendData(JSON.stringify({cart}))
tg.close()
}

// --- СТАРТ ---
renderTypes()
