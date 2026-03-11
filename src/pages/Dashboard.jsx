import { useEffect, useState } from "react";

export default function Dashboard(){

const [tickets,setTickets] = useState([])
const [editIndex,setEditIndex] = useState(null)
const [editData,setEditData] = useState({})

const API_URL = "https://bus-booking-backend-yni2.onrender.com/api/tickets/closed"


// Fetch bookings from backend
const fetchTickets = async () => {

try{

const res = await fetch(API_URL)
const data = await res.json()

const formatted = data.map(ticket => ({
name: ticket.firstName + " " + ticket.lastName,
email: ticket.email,
seat: ticket.seatNumber,
date: new Date(ticket.bookingDate).toLocaleDateString()
}))

setTickets(formatted)

}catch(error){

console.error("Error loading tickets:",error)

}

}


// Load tickets when page opens
useEffect(()=>{

fetchTickets()

},[])


// Delete only selected seat
const deleteTicket = async (seatNumber) => {

try{

await fetch(
`https://bus-booking-backend-yni2.onrender.com/api/tickets/${seatNumber}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
firstName:"",
lastName:"",
email:""
})
}
)

alert("Booking removed")

fetchTickets()

}catch(error){

console.error("Delete failed:",error)

}

}


// Open edit modal
const openEditModal = (index) => {

setEditIndex(index)
setEditData(tickets[index])

}


// Close modal
const closeModal = () => {

setEditIndex(null)

}


// Save edit locally (UI only)
const saveEdit = () => {

let updated = [...tickets]

updated[editIndex] = editData

setTickets(updated)

setEditIndex(null)

}


return(

<div className="dashboard-container">

<div className="dashboard-card">

<h2>Passengers Dashboard</h2>

<table className="dashboard-table">

<thead>

<tr>
<th>Name</th>
<th>Email</th>
<th>Seat</th>
<th>Date</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{tickets.length === 0 ? (

<tr>
<td colSpan="5" className="no-bookings">
No bookings yet
</td>
</tr>

) : (

tickets.map((ticket,index)=>(

<tr key={index}>

<td>{ticket.name}</td>
<td>{ticket.email}</td>
<td>{ticket.seat}</td>
<td>{ticket.date}</td>

<td>

<button
className="edit-btn"
onClick={()=>openEditModal(index)}
>
Edit
</button>

<button
className="delete-btn"
onClick={()=>deleteTicket(ticket.seat)}
>
Delete
</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>


{/* EDIT MODAL */}

{editIndex !== null && (

<div className="modal-overlay">

<div className="modal">

<h3>Edit Passenger</h3>

<input
value={editData.name}
onChange={(e)=>setEditData({...editData,name:e.target.value})}
/>

<input
value={editData.email}
onChange={(e)=>setEditData({...editData,email:e.target.value})}
/>

<div className="modal-buttons">

<button className="save-btn" onClick={saveEdit}>
Save
</button>

<button className="cancel-btn" onClick={closeModal}>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

)

}