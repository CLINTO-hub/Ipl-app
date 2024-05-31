import React from 'react'
import {Routes, Route } from 'react-router-dom'
import Home from '../src/components/home.jsx'
import Login from '../src/components/login.jsx'

const Routers = () => {
  return (<Routes>

<Route path='/home' element={<Home/>}/>
<Route path='/login' element={<Login/>}/>


  </Routes>
    
  )
}

export default Routers