const menu = {

"Супы":[
{name:"Борщ",price:70,img:"https://images.unsplash.com/photo-1604908176997-4318e7c0dfd4"},
{name:"Сборная мясная солянка",price:90,img:"https://images.unsplash.com/photo-1543352634-99a5d50ae78e"},
{name:"Гороховый суп с копченостями",price:80,img:"https://images.unsplash.com/photo-1617093727343-374698b1b08d"},
{name:"Куриный суп с клецками",price:70,img:"https://images.unsplash.com/photo-1547592180-85f173990554"}
],

"Гарниры":[
{name:"Спагетти",price:30,img:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",sauce:true},
{name:"Рис",price:20,img:"https://images.unsplash.com/photo-1604908177079-6d9b1d2e1c9d",sauce:true},
{name:"Гречка",price:40,img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0",sauce:true}
],

"Горячие блюда":[
{name:"Тушёная свинина",price:100,img:"https://images.unsplash.com/photo-1604908554025-0f5d21e9b2f7"},
{name:"Тушёная говядина в томате",price:140,img:"https://images.unsplash.com/photo-1600891964092-4316c288032e"},
{name:"Тушёная куриная печень с луком и морковью",price:80,img:"https://images.unsplash.com/photo-1604908177155-bc2c1af9da6d"},
{name:"Овощное рагу со свининой",price:120,img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c"},
{name:"Котлеты свинино-говяжьи",price:45,img:"https://images.unsplash.com/photo-1606755962773-d324e0a13086",sauce:true},
{name:"Котлеты куриные",price:35,img:"https://images.unsplash.com/photo-1606755962773-d324e0a13086",sauce:true}
],

"Пельмени":[
{name:"Пельмени свинина-говядина",price:90,img:"https://images.unsplash.com/photo-1604908177194-21c2a6c9c1b1",sauce:true},
{name:"Пельмени курица",price:80,img:"https://images.unsplash.com/photo-1604908177194-21c2a6c9c1b1",sauce:true}
],

"Заморозка":[
{name:"Пельмени свинина-говядина 500г",price:150,img:"https://images.unsplash.com/photo-1604908177194-21c2a6c9c1b1"},
{name:"Пельмени курица 500г",price:130,img:"https://images.unsplash.com/photo-1604908177194-21c2a6c9c1b1"}
],

"Соленья":[
{name:"Огурцы",price:40,img:"https://images.unsplash.com/photo-1604908177070-51e3f0a5f3c0"},
{name:"Помидоры черри",price:45,img:"https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"},
{name:"Квашеная капуста",price:35,img:"https://images.unsplash.com/photo-1617196038431-4e7d182d4c3f"}
],

"Молочные продукты":[
{name:"Творог",price:80,img:"https://images.unsplash.com/photo-1585238342024-78d387f4a707"},
{name:"Сливки",price:50,img:"https://images.unsplash.com/photo-1604908177155-bc2c1af9da6d"},
{name:"Сыр",price:65,img:"https://images.unsplash.com/photo-1600891964092-4316c288032e"},
{name:"Сыворотка 500г",price:25,img:"https://images.unsplash.com/photo-1585238342024-78d387f4a707"}
],

"Выпечка":[
{name:"Домашний хлеб",price:55,img:"https://images.unsplash.com/photo-1608198093002-ad4e005484ec"},
{name:"Домашний хлеб ломтик",price:10,img:"https://images.unsplash.com/photo-1589367920969-ab8e050bbb04"},
{name:"Беляш",price:45,img:"https://images.unsplash.com/photo-1604908177155-bc2c1af9da6d"}
]

}

const sauces=[
"Бешамель с чесноком",
"Томатный",
"Сметана",
"Майонез",
"Айоли"
]

let cart=[]

const categoriesDiv=document.getElementById("categories")
const menuDiv=document.getElementById("menu")
const cartDiv=document.getElementById("cart")

function renderCategories(){

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

<img src="${item.img}">

<div class="itemContent">

<h3>${item.name}</h3>

<div class="price">${item.price} VND</div>

${sauceHTML}

<button onclick="add('${item.name}',${item.price},'sauce_${item.name}')">Добавить</button>

</div>

`

menuDiv.appendChild(div)

})

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
