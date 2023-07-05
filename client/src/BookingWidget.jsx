import { useContext, useEffect, useState } from "react"
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
export default function BookingWidget(place) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const {user} = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }

    },[user]);

    async function bookThisPlace() {
        const data = {checkIn, checkOut, numberOfGuests, name,phone,
        place: place._id,
        price:numberOfnights*place.price}
        const response = await axios.post('/bookings',data);
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`)
    };
    
    if (redirect) {
        return <Navigate to={redirect}/>
    }

    let numberOfnights = 0;
    if (checkIn && checkOut) {
        numberOfnights  = differenceInCalendarDays(new Date(checkOut),new Date(checkIn)); 
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
                            <div className="text-2xl text-center">
                                Price: {place.price} / per night.
                            </div>
                            <div className="border rounded-2xl mt-4">
                                <div className="flex">
                                <div className="py-3 px-4">
                                <label htmlFor="">Check in:</label>
                                <input type="date" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}/>
                            </div>
                            <div className="py-3 px-4 border-l">
                                <label htmlFor="">Check out:</label>
                                <input type="date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)}/>
                            </div>
                                </div>                            
                            </div>
                            <div className="py-3 px-4 border-l">
                                <label htmlFor="">Number of guests</label>
                                <input type="number" value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)}/>
                            </div>
                            {numberOfnights > 0 && (
                                 <div className="py-3 px-4 border-l">
                                 <label htmlFor="">Your full name</label>
                                 <input type="text" value={name} 
                                 onChange={ev => setName(ev.target.value)}/>
                                   <label htmlFor="">Phone number</label>
                                 <input type="tel" value={phone} 
                                 onChange={ev => setPhone(ev.target.value)}/>
                             </div>
                            )}
                            <button onClick={bookThisPlace} className="primary mt-4">
                                Book this place
                                {numberOfnights  > 0 && (
                                    <span>${numberOfnights * place.price }</span>
                                )}
                            </button>
                        </div>
    )
}