const tg = window.Telegram.WebApp
tg.ready()

const menuDiv = document.getElementById("menu")
const cartDiv = document.getElementById("cart")

let cart = []
let currentMenu = null
let currentType = null

// 🔥 ВОТ ЭТО ГЛАВНОЕ
let currentSelection = {}

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
}
],
international: [
{
day:"Понедельник",
fixed:["Греческий салат","Бутерброд с сыром","Солёные огурцы"],
soups:["Шурпа + Крем-суп грибной","Харчо + Овощной суп-пюре"],
mains:["Гуляш + Курица терияки","Курица Кун Пао + Ломо сальтадо"]
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

menuDiv.innerHTML = `<button onclick="renderMenuTypes()">← Назад</button>`

currentMenu.forEach((set,i)=>{
menuDiv.innerHTML += `
<div>
<h2>${set.day}</h2>
<button onclick="openDay(${i})">Выбрать</button>
</div>
`
})

}

// --- ДЕНЬ ---
function openDay(index){

const set = currentMenu[index]
const saved = currentSelection[set.day] || {bread:[], pies:[]}

menuDiv.innerHTML = `
<button onclick="openMenu('${currentType}')">← Назад</button>

<h2>${set.day}</h2>

<h3>СУПЫ</h3>
${set.soups.map(s=>`
<label>
<input type="radio" name="soup" value="${s}" 
${saved.soup===s?"checked":""}
onchange="updateSelection('${set.day}')">
${s}
</label><br>
`).join("")}

<h3>ВТОРЫЕ</h3>
${set.mains.map(m=>`
<label>
<input type="radio" name="main" value="${m}"
${saved.main===m?"checked":""}
onchange="updateSelection('${set.day}')">
${m}
</label><br>
`).join("")}

<h3>ХЛЕБ</h3>
${breadOptions.map(b=>`
<label>
<input type="checkbox" value="${b}"
${saved.bread.includes(b)?"checked":""}
onchange="toggleBread('${set.day}','${b}')">
${b}
</label><br>
`).join("")}

<h3>ПИРОЖКИ</h3>
${pieOptions.map(p=>`
<label>
<input type="checkbox" value="${p}"
${saved.pies.includes(p)?"checked":""}
onchange="togglePies('${set.day}','${p}')">
${p}
</label><br>
`).join("")}

<textarea id="comment" oninput="updateSelection('${set.day}')">${saved.comment || ""}</textarea>

<button onclick="addToCart('${set.day}')">Добавить</button>
`

}

// --- СОХРАНЕНИЕ ---
function updateSelection(day){

const soup = document.querySelector('input[name="soup"]:checked')?.value
const main = document.querySelector('input[name="main"]:checked')?.value
const comment = document.getElementById("comment")?.value || ""

currentSelection[day] = {
...currentSelection[day],
soup,
main,
comment
}

}

// 🔥 ГЛАВНОЕ — чекбоксы руками
function toggleBread(day,value){

if(!currentSelection[day]) currentSelection[day]={bread:[],pies:[]}

const arr = currentSelection[day].bread || []

if(arr.includes(value)){
currentSelection[day].bread = arr.filter(i=>i!==value)
}else{
currentSelection[day].bread = [...arr,value]
}

}

function togglePies(day,value){

if(!currentSelection[day]) currentSelection[day]={bread:[],pies:[]}

const arr = currentSelection[day].pies || []

if(arr.includes(value)){
currentSelection[day].pies = arr.filter(i=>i!==value)
}else{
currentSelection[day].pies = [...arr,value]
}

}

// --- ДОБАВИТЬ ---
function addToCart(day){

const sel = currentSelection[day]

if(!sel || !sel.soup || !sel.main){
alert("Выберите суп и второе")
return
}

cart.push({
day,
soup: sel.soup,
main: sel.main,
bread: sel.bread || [],
pies: sel.pies || [],
comment: sel.comment || ""
})

console.log("SEND ITEM:", cart)

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
<div style="position:fixed;bottom:0;background:white;width:100%;padding:10px">
<b>Корзина (${cart.length})</b>
<button onclick="checkout()">Оформить заказ</button>
</div>
`

}

// --- ОФОРМЛЕНИЕ ---
function checkout(){

tg.sendData(JSON.stringify({cart}))

setTimeout(()=>tg.close(),500)

}

// --- СТАРТ ---
renderMenuTypes()
