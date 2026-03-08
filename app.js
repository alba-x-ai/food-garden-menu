let cart=[]

function add(name,price){

cart.push({name,price})

alert(name+" добавлен")
}

function checkout(){

let text="Заказ:\n"

let total=0

cart.forEach(i=>{
text+=i.name+" - "+i.price+" VND\n"
total+=i.price
})

text+="\nИтого: "+total+" VND"

Telegram.WebApp.sendData(text)
}