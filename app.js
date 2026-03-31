const API = "https://food-garden-menu.onrender.com/spots"

const LIMIT = 15

const tg = window.Telegram.WebApp
tg.ready()

const sets = [

{
day:"Понедельник",
price:895000,
spots:null,
menu:[
"Хлеб пшеничный с зирой",
"Салат «Витаминный»",
"Каша гречневая с грибами и луком",
"Борщ",
"Гороховый суп",
"Говядина тушёная с картофельным пюре",
"Куриная печень с рисом",
"Солёные огурцы"
]
},

{
day:"Среда",
price:925000,
spots:null,
menu:[
"Хлеб пшеничный с орегано",
"Салат «Летний»",
"Перловая каша с грибами и луком",
"Солянка",
"Щи",
"Котлета свиная/говяжья с гречкой",
"Котлета куриная с овощной смесью",
"Квашеная капуста"
]
},

{
day:"Пятница",
price:967000,
spots:null,
menu:[
"Хлеб пшеничный с грецкими орехами и семенами чиа и льна",
"Свекольный салат с грецким орехом, чесноком и изюмом",
"Гороховая каша с грибами и луком",
"Куриный суп с сухариками",
"Суп «Рассольник»",
"Курица запечённая с лапшой",
"Свиные рёбра с тушёной капустой",
"Маринованные помидоры"
]
}

]

const container = document.getElementById("menu")

let cart = []

async function loadSpots(){

try{

const res = await fetch(API)
const data = await res.json()

sets.forEach(set=>{
set.spots = data[set.day]
})

}catch(e){

console.log("spots error", e)

sets.forEach(set=>{
set.spots = LIMIT
})

}

}

function renderSets(){

container.innerHTML = ""

sets.forEach((set,i)=>{

const soldOut = set.spots === 0

const card = document.createElement("div")
card.className = "setCard"

card.innerHTML = `

<h2>${set.day}</h2>

<div class="price">
${set.price.toLocaleString()} ₫
</div>

<div class="spots">
${soldOut ? "Sold Out" : "Осталось мест: "+set.spots+" / "+LIMIT}
</div>

<button ${soldOut ? "disabled":""} onclick="openSet(${i})">
${soldOut ? "Недоступно":"Посмотреть меню"}
</button>

`

container.appendChild(card)

})

renderCart()

}

function openSet(index){

const set = sets[index]
const soldOut = set.spots === 0

const menuItems = set.menu.map(i=>`<li>${i}</li>`).join("")

container.innerHTML = `

<div class="setFull">

<h2>${set.day}</h2>

<ul>
${menuItems}
</ul>

<div class="priceBig">
${set.price.toLocaleString()} ₫
</div>

<div class="spots">
${soldOut ? "Sold Out":"Осталось мест: "+set.spots+" / "+LIMIT}
</div>

<textarea id="comment" placeholder="Комментарий к заказу (необязательно)"></textarea>

<button class="orderBtn"
${soldOut ? "disabled":""}
onclick="addToCart('${set.day}')">

Добавить в корзину

</button>

<button class="backBtn" onclick="renderSets()">
← Назад
</button>

</div>

`

}

function addToCart(day){

const set = sets.find(s=>s.day===day)

const existing = cart.find(c=>c.day===day)

if(existing){

existing.qty++

}else{

cart.push({
day:set.day,
price:set.price,
qty:1
})

}

renderCart()

tg.showPopup({
title:"Добавлено",
message:"Сет добавлен в корзину",
buttons:[{type:"ok"}]
})

}

function renderCart(){

let cartDiv = document.getElementById("cart")

if(!cartDiv){

cartDiv = document.createElement("div")
cartDiv.id = "cart"
document.body.appendChild(cartDiv)

}

if(cart.length===0){

cartDiv.innerHTML = ""

return

}

let total = 0

let items = cart.map(item=>{

const sum = item.price * item.qty
total += sum

return `
<div class="cartItem">
${item.day} × ${item.qty}
<span>${sum.toLocaleString()} ₫</span>
</div>
`

}).join("")

cartDiv.innerHTML = `

<div class="cartBox">

<h3>Корзина</h3>

${items}

<div class="cartTotal">
Итого: ${total.toLocaleString()} ₫
</div>

<button class="checkoutBtn" onclick="checkout()">
Оформить заказ
</button>

</div>

`

}

function checkout(){

const comment = document.getElementById("comment")?.value || ""

const order = {
cart: cart,
comment: comment
}

tg.sendData(JSON.stringify(order))

}

async function init(){

await loadSpots()

renderSets()

}

init()
