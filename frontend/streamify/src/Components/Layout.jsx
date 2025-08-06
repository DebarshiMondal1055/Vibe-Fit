import React from 'react'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import { useShowSideBarStore } from '../Hooks/useShowSideBar.js';

const Layout = ({children}) => {
  const {showSideBar,toggleSideBar}=useShowSideBarStore();
  return (
    <div className='min-h-screen max-h-[100vh] overflow-x-hidden overflow-y-hidden'>
        <Navbar/>
        <div className='flex w-[100vw] overflow-x-hidden'>
            {showSideBar && <Sidebar/>}
            <main className='flex-1 overflow-y-auto'>
                {children}
            </main>
        </div>
    </div>
  )
}

    export default Layout
