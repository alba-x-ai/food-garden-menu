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

function renderDays(){

container.innerHTML=""

sets.forEach((set,i)=>{

container.innerHTML += `
<h2>${set.day}</h2>
<button onclick="openDay(${i})">Выбрать</button>
`

})

}

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

<textarea id="comment" placeholder="Комментарий"></textarea>

<button onclick="addToCart('${set.day}')">
Добавить в корзину
</button>

<button onclick="renderDays()">← Назад</button>

`

}

function addToCart(day){

const soup = document.querySelector('input[name="soup"]:checked').value
const main = document.querySelector('input[name="main"]:checked').value

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

alert("Добавлено")

renderCart()

}

function renderCart(){

const cartDiv = document.getElementById("cart")

cartDiv.innerHTML = `

<div style="position:fixed;bottom:0;background:white;width:100%;padding:10px">

Корзина: ${cart.length}

<button onclick="checkout()">Оформить заказ</button>

</div>

`

}

function checkout(){

tg.sendData(JSON.stringify({cart}))

setTimeout(()=>{
tg.close()
},500)

}

renderDays()
