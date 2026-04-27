const tg = window.Telegram.WebApp
tg.ready()

let cart = []

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

const sets = [

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

const container = document.getElementById("menu")
const cartDiv = document.getElementById("cart")

// --- СПИСОК ДНЕЙ ---
function renderDays(){

container.innerHTML=""

sets.forEach((set,i)=>{

container.innerHTML += `
<div style="background:white;padding:15px;margin-bottom:10px;border-radius:10px">
<h2>${set.day}</h2>
<button onclick="openDay(${i})">Выбрать</button>
</div>
`

})

}

// --- ОТКРЫТЬ ДЕНЬ ---
function openDay(index){

const set = sets[index]

container.innerHTML = `

<h2>${set.day}</h2>

<h3>ФИКС</h3>
<ul>
${set.fixed.map(i=>`<li>${i}</li>`).join("")}
</ul>

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

<textarea id="comment" placeholder="Комментарий" style="width:100%;margin-top:10px"></textarea>

<button onclick="addToCart('${set.day}')">
Добавить в корзину
</button>

<button onclick="renderDays()">← Назад</button>

`

}

// --- ДОБАВИТЬ В КОРЗИНУ ---
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

<div style="position:fixed;bottom:0;background:white;width:100%;padding:10px;max-height:50%;overflow:auto">

<b>Корзина (${cart.length})</b>

<div style="font-size:12px;margin-top:5px">

${cart.map((i,index)=>`

<div style="margin-bottom:10px">

<b>${i.day}</b><br>
Суп: ${i.soup}<br>
Второе: ${i.main}<br>

${i.bread.length ? "Хлеб: "+i.bread.join(", ")+"<br>" : ""}
${i.pies.length ? "Пирожки: "+i.pies.join(", ")+"<br>" : ""}
${i.comment ? "Комментарий: "+i.comment+"<br>" : ""}

<button onclick="removeItem(${index})">Удалить</button>

</div>
<hr>

`).join("")}

</div>

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
renderDays()
