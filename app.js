const tg = window.Telegram.WebApp
tg.ready()

let selectedMenu = null
let selectedDay = null

let selectedSoup = null
let selectedMain = null

let selectedBread = null
let selectedPies = null

let cart = []



const breads = [
"Пшеничный с орегано",
"Пшеничный с грецкими орехами и семенами чиа и льна",
"Пшеничный с зирой"
]

const piesOptions = [
"С капустой",
"С картошкой",
"С яйцом, луком и рисом"
]



const menus = {

russian:{

Понедельник:{
fix:["Салат «Летний»","Гречка с грибами","Солёные огурцы"],
soups:["Борщ + Гороховый суп","Куриный суп + Рассольник"],
mains:["Говядина тушёная + пюре","Котлета + гречка"]
},

Среда:{
fix:["Свекольный салат","Перловка с грибами","Квашеная капуста"],
soups:["Куриный суп + Рассольник","Солянка + Щи"],
mains:["Котлета + гречка","Курица запечённая"]
},

Пятница:{
fix:["Салат «Витаминный»","Гороховая каша","Маринованные помидоры"],
soups:["Борщ + Гороховый суп","Солянка + Щи"],
mains:["Говядина + пюре","Курица + лапша"]
}

},

international:{

Понедельник:{
fix:["Греческий салат","Бутерброд с сыром","Солёные огурцы"],
soups:["Шурпа + Крем-суп грибной","Харчо + Овощной суп"],
mains:["Гуляш + пюре","Курица терияки"]
},

Среда:{
fix:["Свекольный салат","Бутерброд с сыром","Квашеная капуста"],
soups:["Харчо + Овощной суп","Lohikeitto + Яичный суп"],
mains:["Курица Кун Пао","Кёнигсбергские клопсы"]
},

Пятница:{
fix:["Салат с фунчозой","Бутерброд с сыром","Маринованные помидоры"],
soups:["Шурпа + Крем-суп грибной","Lohikeitto + Яичный суп"],
mains:["Гуляш + пюре","Кёнигсбергские клопсы"]
}

}

}



function selectMenu(menu){

selectedMenu = menu

document.getElementById("menuType").classList.add("hidden")
document.getElementById("daySelect").classList.remove("hidden")

}



function backToMenu(){

document.getElementById("daySelect").classList.add("hidden")
document.getElementById("menuType").classList.remove("hidden")

}



function selectDay(day){

selectedDay = day

document.getElementById("daySelect").classList.add("hidden")
document.getElementById("mealSelect").classList.remove("hidden")

renderMeals()

}



function backToDays(){

document.getElementById("mealSelect").classList.add("hidden")
document.getElementById("daySelect").classList.remove("hidden")

}



function renderMeals(){

const data = menus[selectedMenu][selectedDay]

document.getElementById("mealTitle").innerText = selectedDay

const fixDiv = document.getElementById("fix")
fixDiv.innerHTML = data.fix.map(i=>`<div>${i}</div>`).join("")



const soupsDiv = document.getElementById("soups")
soupsDiv.innerHTML = ""

data.soups.forEach(s=>{

const el = document.createElement("div")
el.className="option"
el.innerText=s

el.onclick=()=>{

selectedSoup=s

document.querySelectorAll("#soups .option").forEach(o=>o.classList.remove("selected"))
el.classList.add("selected")

}

soupsDiv.appendChild(el)

})



const mainsDiv=document.getElementById("mains")
mainsDiv.innerHTML=""

data.mains.forEach(m=>{

const el=document.createElement("div")
el.className="option"
el.innerText=m

el.onclick=()=>{

selectedMain=m

document.querySelectorAll("#mains .option").forEach(o=>o.classList.remove("selected"))
el.classList.add("selected")

}

mainsDiv.appendChild(el)

})


renderExtras()

}



function renderExtras(){



const breadDiv=document.getElementById("breadOptions")
breadDiv.innerHTML=""

breads.forEach(b=>{

const el=document.createElement("div")
el.className="option"
el.innerText=b

el.onclick=()=>{

selectedBread=b

document.querySelectorAll("#breadOptions .option").forEach(o=>o.classList.remove("selected"))
el.classList.add("selected")

}

breadDiv.appendChild(el)

})



const piesDiv=document.getElementById("piesOptions")
piesDiv.innerHTML=""

piesOptions.forEach(p=>{

const el=document.createElement("div")
el.className="option"
el.innerText=p

el.onclick=()=>{

selectedPies=p

document.querySelectorAll("#piesOptions .option").forEach(o=>o.classList.remove("selected"))
el.classList.add("selected")

}

piesDiv.appendChild(el)

})

}



function addToCart(){

if(!selectedSoup || !selectedMain){

alert("Выберите суп и второе блюдо")
return

}

const comment=document.getElementById("comment").value

cart.push({

menu:selectedMenu,
day:selectedDay,
soup:selectedSoup,
main:selectedMain,
bread:selectedBread,
pies:selectedPies,
comment:comment

})

renderCart()

}



function renderCart(){

const cartDiv=document.getElementById("cart")
const items=document.getElementById("cartItems")

cartDiv.classList.remove("hidden")

items.innerHTML=cart.map(i=>`

<div>

<b>${i.day}</b><br>

${i.soup}<br>
${i.main}<br>

${i.bread ? "Хлеб: "+i.bread+"<br>" : ""}
${i.pies ? "Пирожки: "+i.pies+"<br>" : ""}

</div>

`).join("<hr>")

}



function checkout(){

if(cart.length===0){

alert("Корзина пуста")
return

}

tg.sendData(JSON.stringify({cart:cart}))

setTimeout(()=>{

tg.close()

},500)

}
