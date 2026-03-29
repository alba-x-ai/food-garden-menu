const menu = {

"Супы":[
{name:"Борщ",price:70},
{name:"Солянка",price:90},
{name:"Гороховый суп",price:80},
{name:"Куриный суп",price:70}
],

"Гарниры":[
{name:"Спагетти",price:30},
{name:"Рис",price:20},
{name:"Гречка",price:40}
],

"Горячие блюда":[
{name:"Тушёная свинина",price:100},
{name:"Тушёная говядина",price:140},
{name:"Куриная печень",price:80},
{name:"Овощное рагу со свининой",price:120},
{name:"Котлеты свинина-говядина",price:45},
{name:"Котлеты куриные",price:35}
],

"Пельмени":[
{name:"Пельмени свинина-говядина",price:90},
{name:"Пельмени курица",price:80}
],

"Заморозка":[
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
{name:"Сыворотка",price:25}
],

"Выпечка":[
{name:"Домашний хлеб",price:55},
{name:"Ломтик хлеба",price:10},
{name:"Беляш",price:45}
],

"Соусы":[
{name:"Бешамель с чесноком",price:0},
{name:"Томатный",price:0},
{name:"Сметана",price:0},
{name:"Майонез",price:0},
{name:"Айоли",price:0}
]

}

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

function renderMenu(category){

menuDiv.innerHTML=""

menu[category].forEach(item=>{

const div=document.createElement("div")
div.className="item"

div.innerHTML=`
<h3>${item.name}</h3>
<p>${item.price} VND</p>
<button onclick="add('${item.name}',${item.price})">Добавить</button>
`

menuDiv.appendChild(div)

})

}

function add(name,price){

cart.push({name,price})

renderCart()

}

function renderCart(){

cartDiv.innerHTML=""

let total=0

cart.forEach(i=>{

const p=document.createElement("p")
p.innerText=`${i.name} — ${i.price} VND`

cartDiv.appendChild(p)

total+=i.price

})

const totalDiv=document.createElement("p")
totalDiv.innerHTML="<b>Итого: "+total+" VND</b>"

cartDiv.appendChild(totalDiv)

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