import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function BookingPage() {
    const id = useParams();
    const [booking,setBooking] = useState(null);
    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(res => {
                const foundBooking = res.data.find(({_id}) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                };
            })
        }
    },[id]) 
    return (
        <div>my booking</div>
    )
}