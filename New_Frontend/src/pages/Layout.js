import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <div className="flex flex-col h-screen"> 
        <div className="h-16">
            <Navbar/>
        </div>
        <div className="flex-grow overflow-auto bg-blue-100 scrollbar-hide">
            <Outlet/>
        </div>
    </div>
  )
}

export default Layout