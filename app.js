const sets = [

{
day:"Понедельник",
price:895000,
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

const container=document.getElementById("menu")

function renderSets(){

container.innerHTML=""

sets.forEach((set,i)=>{

const card=document.createElement("div")
card.className="setCard"

card.innerHTML=`

<h2>${set.day}</h2>

<div class="price">${set.price.toLocaleString()} ₫</div>

<button onclick="openSet(${i})">
Посмотреть меню
</button>

`

container.appendChild(card)

})

}

function openSet(index){

const set=sets[index]

container.innerHTML=""

const menuItems=set.menu.map(i=>`<li>${i}</li>`).join("")

container.innerHTML=`

<div class="setFull">

<h2>${set.day}</h2>

<ul>
${menuItems}
</ul>

<div class="priceBig">
${set.price.toLocaleString()} ₫
</div>

<button class="orderBtn" onclick="orderSet('${set.day}',${set.price})">
Заказать
</button>

<button class="backBtn" onclick="renderSets()">
← Назад
</button>

</div>

`

}

function orderSet(day,price){

let text=`
Заказ Privet Kitchen

Сет: ${day}
Цена: ${price} ₫
`

Telegram.WebApp.sendData(text)

}

renderSets()
