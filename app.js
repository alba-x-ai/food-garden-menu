const API = "https://food-garden-menu.onrender.com/spots"

const LIMIT = 15

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
onclick="orderSet('${set.day}')">

${soldOut ? "Недоступно" : "Заказать"}

</button>

<button class="backBtn" onclick="renderSets()">
← Назад
</button>

</div>

`

}



function orderSet(day){

const comment = document.getElementById("comment").value

const order = {
day: day,
comment: comment
}

Telegram.WebApp.sendData(JSON.stringify(order))

}



async function init(){

await loadSpots()

renderSets()

}

init()
