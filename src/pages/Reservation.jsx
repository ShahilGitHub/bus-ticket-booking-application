import { useState, useEffect } from "react";
import wheel from "../assets/wheel.png";

export default function Reservation(){

const seats = Array.from({ length: 40 }, (_, i) => i + 1)

const lowerDeck = seats.slice(0,20)
const upperDeck = seats.slice(20,40)

const [selectedSeat,setSelectedSeat] = useState(null)

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [age,setAge] = useState("")
const [gender,setGender] = useState("")

const [bookedSeats,setBookedSeats] = useState([])

const API_URL = "https://bus-booking-backend-yni2.onrender.com/api/tickets"


// Fetch booked seats from backend
const fetchSeats = () => {

fetch(API_URL)
.then(res => res.json())
.then(data => {

const booked = data
.filter(seat => seat.status === "closed")
.map(seat => seat.seatNumber)

setBookedSeats(booked)

})

}


// Load seats when page opens
useEffect(()=>{

fetchSeats()

},[])


// Booking function
const bookSeat = async () => {

if(!name || !email){
alert("Please enter name and email")
return
}

if(age < 1 || age > 100){
alert("Age must be between 1 and 100")
return
}

try{

const names = name.trim().split(" ")

const firstName = names[0]
const lastName = names.slice(1).join(" ")

await fetch(`${API_URL}/${selectedSeat}`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
firstName,
lastName,
email
})

})

alert("Seat booked successfully!")

setSelectedSeat(null)
setName("")
setEmail("")
setAge("")
setGender("")

fetchSeats()

}catch(error){

console.error(error)
alert("Booking failed")

}

}


// Render seat
const renderSeat = (seat) => {

const isBooked = bookedSeats.includes(seat)

return(

<div key={seat} className="seat-wrapper">

<button
className={`seat 
${isBooked ? "sold" : ""} 
${selectedSeat===seat ? "selected" : ""}`}

disabled={isBooked}

onClick={()=>setSelectedSeat(seat)}
>

<div className="seat-pill"></div>

</button>

<div className="price">
{isBooked ? "Sold" : `₹${seat%2===0?1160:1410}`}
</div>

</div>

)

}


// Render deck layout
const renderDeck = (deckSeats) => {

let layout = []

for(let i=0;i<deckSeats.length;i+=3){

layout.push(renderSeat(deckSeats[i]))

layout.push(<div key={"aisle"+i}></div>)

layout.push(renderSeat(deckSeats[i+1]))

layout.push(renderSeat(deckSeats[i+2]))

}

return layout

}


return(

<div>

<div className="bus-container">

<div className="deck">

<div className="deck-header">
<h3>Lower deck</h3>
<img src={wheel} className="wheel"/>
</div>

<div className="seat-grid">
{renderDeck(lowerDeck)}
</div>

</div>


<div className="deck">

<h3>Upper deck</h3>

<div className="seat-grid">
{renderDeck(upperDeck)}
</div>

</div>

</div>


{selectedSeat && (

<div className="passenger-form">

<h3>Passenger Details (Seat {selectedSeat})</h3>

<input
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="number"
placeholder="Age"
min="1"
max="100"
value={age}
onChange={(e)=>setAge(e.target.value)}
required
/>

<select
value={gender}
onChange={(e)=>setGender(e.target.value)}
required
>

<option value="">Select Gender</option>
<option value="Male">Male</option>
<option value="Female">Female</option>

</select>

<button onClick={bookSeat}>
Confirm Booking
</button>

</div>

)}

</div>

)

}