const menu = {

"Супы":[
{name:"Борщ",price:70},
{name:"Сборная мясная солянка",price:90},
{name:"Гороховый суп с копченостями",price:80},
{name:"Куриный суп с клецками",price:70}
],

"Гарниры":[
{name:"Спагетти",price:30,sauce:true},
{name:"Рис",price:20,sauce:true},
{name:"Гречка",price:40,sauce:true}
],

"Горячие блюда":[
{name:"Тушёная свинина",price:100},
{name:"Тушёная говядина в томате",price:140},
{name:"Тушёная куриная печень с луком и морковью",price:80},
{name:"Овощное рагу со свининой",price:120},
{name:"Котлеты свинино-говяжьи",price:45,sauce:true},
{name:"Котлеты куриные",price:35,sauce:true}
],

"Пельмени":[
{name:"Пельмени свинина-говядина",price:90,sauce:true},
{name:"Пельмени курица",price:80,sauce:true}
],

"Заморозка (предзаказ)":[
{name:"Пельмени свинина-говядина 500г",price:150},
{name:"Пельмени курица 500г",price:130}
],

"Соленья":[
{name:"Огурцы",price:40},
{name:"Помидоры черри",price:45},
{name:"Квашеная капуста",price:35}
],

"Молочные продукты":[
{name:"Творог",price:80},
{name:"Сливки",price:50},
{name:"Сыр",price:65},
{name:"Сыворотка 500г",price:25}
],

"Выпечка":[
{name:"Домашний хлеб",price:55},
{name:"Домашний хлеб ломтик",price:10},
{name:"Беляш",price:45}
]

}

const popular = [
"Борщ",
"Пельмени свинина-говядина",
"Беляш",
"Котлеты куриные"
]

const sauces = [
"Бешамель с чесноком",
"Томатный",
"Сметана",
"Майонез",
"Айоли"
]

let cart = []

const categoriesDiv = document.getElementById("categories")
const menuDiv = document.getElementById("menu")
const cartDiv = document.getElementById("cart")

function renderCategories(){

categoriesDiv.innerHTML=""

Object.keys(menu).forEach(cat=>{

const btn=document.createElement("div")
btn.className="category"
btn.innerText=cat

btn.onclick=()=>renderMenu(cat)

categoriesDiv.appendChild(btn)

})

}

function renderPopular(){

menuDiv.innerHTML=""

Object.keys(menu).forEach(category=>{

menu[category].forEach(item=>{

if(popular.includes(item.name)){

createCard(item)

}

})

})

}

function renderMenu(category){

menuDiv.innerHTML=""

menu[category].forEach(item=>{

createCard(item)

})

}

function createCard(item){

const div=document.createElement("div")
div.className="item"

let sauceHTML=""

if(item.sauce){

sauceHTML=`
<select id="sauce_${item.name}">
<option value="">Соус</option>
${sauces.map(s=>`<option>${s}</option>`).join("")}
</select>
`

}

div.innerHTML=`

<div class="itemContent">

<h3>${popular.includes(item.name) ? "🔥 " : ""}${item.name}</h3>

<div class="price">${item.price} VND</div>

${sauceHTML}

<button onclick="add('${item.name}',${item.price},'sauce_${item.name}')">Добавить</button>

</div>

`

menuDiv.appendChild(div)

}

function add(name,price,sauceId){

let sauce=""

if(sauceId){

const select=document.getElementById(sauceId)

if(select && select.value){
sauce=" + "+select.value
}

}

cart.push({name:name+sauce,price})

updateCart()

}

function updateCart(){

cartDiv.innerHTML=""

let total=0

cart.forEach((item,i)=>{

const div=document.createElement("div")

div.innerHTML=`
${item.name} — ${item.price} VND
<button onclick="remove(${i})">❌</button>
`

cartDiv.appendChild(div)

total+=item.price

})

const totalDiv=document.createElement("p")

totalDiv.innerHTML="<b>Итого: "+total+" VND</b>"

cartDiv.appendChild(totalDiv)

document.getElementById("cartCount").innerText=cart.length

}

function remove(i){

cart.splice(i,1)

updateCart()

}

function toggleCart(){

const panel=document.getElementById("cartPanel")

panel.style.display = panel.style.display === "block" ? "none" : "block"

}

function checkout(){

let text="Заказ Food Garden\n\n"

let total=0

cart.forEach(i=>{
text+=`${i.name} — ${i.price} VND\n`
total+=i.price
})

text+="\nИтого: "+total+" VND"

Telegram.WebApp.sendData(text)

}

renderCategories()
renderPopular()
