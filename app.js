const tg = window.Telegram.WebApp
tg.ready()

const menuDiv = document.getElementById("menu")
const cartDiv = document.getElementById("cart")

let cart = []
let currentMenu = null
let currentType = null
let currentSelection = {}

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

// --- МЕНЮ ---
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

// --- ЭКРАН 1 ---
function renderMenuTypes(){

menuDiv.innerHTML = `
<div>
<h2>Выберите меню</h2>

<button onclick="openMenu('russian')">Русское меню</button>
<button onclick="openMenu('international')">Интернациональное меню</button>

</div>
`

}

// --- ЭКРАН 2 ---
function openMenu(type){

currentType = type
currentMenu = menus[type]

menuDiv.innerHTML = `

<div style="margin-bottom:15px">
<button onclick="renderMenuTypes()">← Назад</button>
</div>

`

currentMenu.forEach((set,i)=>{

menuDiv.innerHTML += `
<div style="background:white;padding:15px;margin-bottom:10px;border-radius:10px">
<h2>${set.day}</h2>
<button onclick="openDay(${i})">Выбрать</button>
</div>
`

})

}

// --- ЭКРАН 3 ---
function openDay(index){

const set = currentMenu[index]
const saved = currentSelection[set.day] || {}

menuDiv.innerHTML = `

<div style="margin-bottom:15px">
<button onclick="saveAndBack('${set.day}')">← Назад</button>
</div>

<h2>${set.day}</h2>

<h3>ФИКС</h3>
<ul>${set.fixed.map(i=>`<li>${i}</li>`).join("")}</ul>

<h3>СУПЫ</h3>
${set.soups.map((s,i)=>`
<label>
<input type="radio" name="soup" value="${s}" 
${saved.soup === s ? "checked" : (!saved.soup && i===0 ? "checked":"")}>
${s}
</label><br>
`).join("")}

<h3>ВТОРЫЕ</h3>
${set.mains.map((m,i)=>`
<label>
<input type="radio" name="main" value="${m}"
${saved.main === m ? "checked" : (!saved.main && i===0 ? "checked":"")}>
${m}
</label><br>
`).join("")}

<h3>ХЛЕБ</h3>
${breadOptions.map(b=>`
<label>
<input type="checkbox" name="bread" value="${b}"
${saved.bread?.includes(b) ? "checked":""}>
${b}
</label><br>
`).join("")}

<h3>ПИРОЖКИ</h3>
${pieOptions.map(p=>`
<label>
<input type="checkbox" name="pies" value="${p}"
${saved.pies?.includes(p) ? "checked":""}>
${p}
</label><br>
`).join("")}

<textarea id="comment">${saved.comment || ""}</textarea>

<button onclick="addToCart('${set.day}')">Добавить в корзину</button>

`

}

// --- СОХРАНИТЬ ---
function saveSelection(day){

const soup = document.querySelector('input[name="soup"]:checked')?.value
const main = document.querySelector('input[name="main"]:checked')?.value

const breads = [...document.querySelectorAll('input[name="bread"]:checked')].map(i=>i.value)
const pies = [...document.querySelectorAll('input[name="pies"]:checked')].map(i=>i.value)

const comment = document.getElementById("comment").value

currentSelection[day] = {soup,main,bread:breads,pies:pies,comment}

}

function saveAndBack(day){
saveSelection(day)
openMenu(currentType)
}

// --- ДОБАВИТЬ ---
function addToCart(day){

saveSelection(day)

const sel = currentSelection[day]

if(!sel.soup || !sel.main){
alert("Выберите суп и второе")
return
}

cart.push({day,...sel})

renderCart()
alert("Добавлено в корзину")

}

// --- УДАЛИТЬ ---
function removeItem(index){
cart.splice(index,1)
renderCart()
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

${cart.map((i,index)=>`
<div>
${i.day}<br>
${i.soup}<br>
${i.main}<br>
<button onclick="removeItem(${index})">Удалить</button>
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
