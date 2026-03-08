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

const sauces=[
"Бешамель с чесноком",
"Томатный",
"Сметана",
"Майонез",
"Айоли"
]

let cart={}

const categoriesDiv=document.getElementById("categories")
const menuDiv=document.getElementById("menu")

function renderCategories(){

categoriesDiv.innerHTML=""

Object.keys(menu).forEach(cat=>{

const btn=document.createElement("div")
btn.className="category"
btn.innerText=cat

btn.onclick=()=>{

document.querySelectorAll(".category").forEach(c=>{
c.classList.remove("active")
})

btn.classList.add("active")

renderMenu(cat)

}

categoriesDiv.appendChild(btn)

})

}

function renderMenu(category){

menuDiv.innerHTML=""

menu[category].forEach(item=>{

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

<h3>${item.name}</h3>

<div class="price">${item.price} VND</div>

${sauceHTML}

<div class="counter">

<button onclick="minus('${item.name}',${item.price})">−</button>

<span id="count_${item.name}">0</span>

<button onclick="plus('${item.name}',${item.price},'sauce_${item.name}')">+</button>

</div>

</div>
`

menuDiv.appendChild(div)

})

}

function plus(name,price,sauceId){

let sauce=""

if(sauceId){

const select=document.getElementById(sauceId)

if(select && select.value){
sauce=" + "+select.value
}

}

const key=name+sauce

if(!cart[key]){
cart[key]={name:key,price:price,count:0}
}

cart[key].count++

updateItem(name)

updateCheckout()

}

function minus(name){

Object.keys(cart).forEach(key=>{

if(key.startsWith(name)){

cart[key].count--

if(cart[key].count<=0){
delete cart[key]
}

}

})

updateItem(name)

updateCheckout()

}

function updateItem(name){

let count=0

Object.values(cart).forEach(i=>{
if(i.name.startsWith(name)){
count+=i.count
}
})

const el=document.getElementById("count_"+name)

if(el){
el.innerText=count
}

}

function updateCheckout(){

let total=0
let items=0

Object.values(cart).forEach(i=>{
total+=i.price*i.count
items+=i.count
})

const bar=document.getElementById("checkoutBar")
const info=document.getElementById("checkoutInfo")

if(items===0){
bar.style.display="none"
return
}

info.innerText=`${items} блюда • ${total} VND`

bar.style.display="flex"

}

function checkout(){

let text="Заказ Food Garden\n\n"

let total=0

Object.values(cart).forEach(i=>{

text+=`${i.name} x${i.count} — ${i.price*i.count} VND\n`

total+=i.price*i.count

})

text+="\nИтого: "+total+" VND"

Telegram.WebApp.sendData(text)

}

renderCategories()
renderMenu(Object.keys(menu)[0])
