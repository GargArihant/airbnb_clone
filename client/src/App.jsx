import { useState } from 'react'
import './App.css'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import {Routes, Route} from 'react-router-dom'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import PlacePage from './pages/PlacePage'
import BookingsPage from './pages/BookingsPage'
import BookingPage from './pages/BookingPage'

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <UserContextProvider>
      <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<IndexPage />}></Route>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/register' element={<RegisterPage />}></Route>
      <Route path='/account' element={<ProfilePage />}></Route>
      <Route path='/account/places' element={<PlacesPage />}></Route>
      <Route path='/account/places/new' element={<PlacesFormPage />}></Route>
      <Route path='/account/places/:id' element={<PlacesFormPage />}></Route>
      <Route path='/place/:id' element={<PlacePage />}></Route>
      <Route path='/account/bookings' element={<BookingsPage />}></Route>
      <Route path='/account/bookings/:id' element={<BookingPage />}></Route>
      </Route>
      
    </Routes>
    </UserContextProvider>
    
      
  )
}

export default App
