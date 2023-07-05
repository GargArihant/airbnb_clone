import { useEffect, useState } from "react";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
export default function PlacesFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (!id) {
            return
        }
        axios.get('/places/' + id).then((response) => {
            const {data} = response;
            setTitle(data.title);
            setDescription(data.description);
            setExtraInfo(data.extraInfo);
            setPerks(data.perks);
            setAddedPhotos(data.photos);
            setAddress(data.address);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    },[id])
    function inputHeader (text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription (text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header, description) {
        return (
            <>
            {inputHeader(header)}
            {inputDescription(description)}
            </>
        )
    }
    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink});
        setAddedPhotos(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    }
    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
        data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response;
            setAddedPhotos(prev => {
                return [...prev, ...filenames];
            });
        })
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {title, description,address,
            addedPhotos, perks, checkIn, checkOut, extraInfo, maxGuests, price};
            if (id) {
                await axios.put('/places',{
                    id, ...placeData
                });
                setRedirect(true);
            } else {
                await axios.post('/places', placeData);
                setRedirect(true);
            }
     
    }
    function removePhoto(ev,filename) {
        ev.preventDefault();
        onChange([...addedPhotos.filter(photo => photo !== filename)]);
    }
    function selectAsMainPhoto(ev,filename) {
        ev.preventDefault();
        const addedPhotosWithoutSelectd = addedPhotos.filter(photo => photo !== filename);
        const newAddedPhotos = [filename,...addedPhotosWithoutSelectd];
        onChange(newAddedPhotos);
    };

    if (redirect) {
        return (
            <Navigate to={'/account/places'} />
        )
    }

    return (
        <>
        <div>
            <AccountNav />
                    <form onSubmit={savePlace}>
                        {preInput('Title','Title for your place. should be catchy as in advertisement')}
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title, for example: my apt" />
                        {preInput('Address','Adress to this place')}
                        <input value={address} onChange={ev => setAddress(ev.target.value)} type="text" placeholder="address" />
                        {preInput('Photos','more = better')}
                        <div className="flex gap-2">
                            <input value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} type="text" placeholder={'Add using a link ...jpg'}/>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                        </div>
                        <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {
                                addedPhotos.length > 0 && addedPhotos.map(link => (
                                    <div className="h-32 flex relative" key={link}>
                                        <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/' + link} alt="" />
                                        <button onClick={(ev) => removePhoto(ev.link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                        <button onClick={(ev) => selectAsMainPhoto(ev.link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                                            {link === addedPhotos[0] && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                              </svg>                                              
                                            )}
                                            {link !== addedPhotos[0] && (
                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                             </svg>
                                            )}
                                           
                                        </button>
                                    </div>
                                ))
                            }
                        <label className="flex h-32 cursor-pointer items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                            <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload
                        </label>
                        </div>
                        {preInput('Description','Description of the place')}
                        <textarea value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
                        {preInput('Perks','select all the perk of your place')}
                        <div className="grid mt-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            <Perks selected={perks} onChange={setPerks} />
                        </div>
                        {preInput('Extra info','house rules, etc.')}
                        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}></textarea>
                        {preInput('Check in & out times','add check in and out times, remember to have time for cleaning the room between guests')}
                        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input value={checkIn} onChange={ev => setCheckIn(ev.target.value)} type="text" placeholder="14 : 00"/>
                            </div>
                            <div>
                            <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input value={checkOut} onChange={ev => setCheckOut(ev.target.value)} type="text" placeholder="11:00"/>
                            </div>
                            <div>
                            <h3 className="mt-2 -mb-1">Max guests</h3>
                                <input value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} type="number"/></div> 
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Price per night.</h3>
                                <input value={price} onChange={ev => setPrice(ev.target.value)} type="number"/></div> 
                        
                        <button className="primary my-4">Save</button>
                    </form>
                </div>
        </>
    )
}