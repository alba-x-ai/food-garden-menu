const tg = window.Telegram.WebApp
tg.ready()

const lang = tg.initDataUnsafe?.user?.language_code || "en"
const RU = lang.startsWith("ru")

function t(ru,en){
return RU ? ru : en
}

let selectedMenu = null
let selectedDay = null

let selectedSoup = null
let selectedMain = null

let bread = false
let pies = false

let cart = []

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
mains:["Котлета говяжья + гречка","Курица запечённая"]
},

Пятница:{
fix:["Салат «Витаминный»","Гороховая каша","Маринованные помидоры"],
soups:["Борщ + Гороховый суп","Солянка + Щи"],
mains:["Говядина тушёная + пюре","Курица запечённая + лапша"]
}

},

international:{

Понедельник:{
fix:["Greek salad","Cheese sandwich","Pickled cucumbers"],
soups:["Shurpa + Mushroom cream soup","Kharcho + Vegetable puree soup"],
mains:["Goulash + mashed potatoes","Teriyaki chicken + vegetables"]
},

Среда:{
fix:["Beet salad","Cheese sandwich","Sauerkraut"],
soups:["Kharcho + Vegetable puree soup","Lohikeitto + Tomato egg soup"],
mains:["Kung Pao chicken + rice","Königsberg meatballs"]
},

Пятница:{
fix:["Glass noodle salad","Cheese sandwich","Pickled tomatoes"],
soups:["Shurpa + Mushroom cream soup","Lohikeitto + Tomato egg soup"],
mains:["Goulash + mashed potatoes","Königsberg meatballs"]
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

document.getElementById("mealTitle").innerText =
selectedDay + " — " + (selectedMenu==="russian"
? t("Русское меню","Russian menu")
: t("Интернациональное меню","International menu"))

const fixDiv=document.getElementById("fix")
fixDiv.innerHTML=data.fix.map(i=>`<div>${i}</div>`).join("")

const soupsDiv=document.getElementById("soups")
soupsDiv.innerHTML=""

data.soups.forEach(soup=>{

const el=document.createElement("div")
el.className="option"
el.innerText=soup

el.onclick=()=>{

selectedSoup=soup

document.querySelectorAll("#soups .option").forEach(o=>o.classList.remove("selected"))
el.classList.add("selected")

}

soupsDiv.appendChild(el)

})

const mainsDiv=document.getElementById("mains")
mainsDiv.innerHTML=""

data.mains.forEach(main=>{

const el=document.createElement("div")
el.className="option"
el.innerText=main

el.onclick=()=>{

selectedMain=main

document.querySelectorAll("#mains .option").forEach(o=>o.classList.remove("selected"))
el.classList.add("selected")

}

mainsDiv.appendChild(el)

})

}



function toggleBread(el){

bread=!bread
el.classList.toggle("selected")

}



function togglePies(el){

pies=!pies
el.classList.toggle("selected")

}



function addToCart(){

if(!selectedSoup || !selectedMain){

alert(t("Выберите суп и второе блюдо","Select soup and main dish"))
return

}

const comment=document.getElementById("comment").value

const order={
menu:selectedMenu,
day:selectedDay,
soup:selectedSoup,
main:selectedMain,
bread:bread,
pies:pies,
comment:comment
}

cart.push(order)

renderCart()

}



function renderCart(){

const cartDiv=document.getElementById("cart")
const itemsDiv=document.getElementById("cartItems")

cartDiv.classList.remove("hidden")

itemsDiv.innerHTML=cart.map(i=>`

<div>

<b>${i.day}</b><br>

${i.soup}<br>
${i.main}<br>

${i.bread ? t("Хлеб","Bread")+"<br>" : ""}
${i.pies ? t("Пирожки","Pies")+"<br>" : ""}

</div>

`).join("<hr>")

}



function checkout(){

if(cart.length===0){

alert(t("Корзина пуста","Cart is empty"))
return

}

const order={
cart:cart
}

tg.sendData(JSON.stringify(order))

setTimeout(()=>{

tg.close()

},500)

}
