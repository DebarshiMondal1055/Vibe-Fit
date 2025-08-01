import React from 'react'
import { useAuthUser } from '../Hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios';
import toast from 'react-hot-toast';
import { LogOutIcon } from 'lucide-react';
import PageLoader from './PageLoader';
import { Link } from 'react-router-dom';
import ThemeSelector from './ThemeSelector.jsx';
import LogoutModal from './LogoutModal.jsx';
import { useThemeStore } from '../Hooks/useThemeStore.js';
import { useShowSideBarStore } from '../Hooks/useShowSideBar.js';
const Navbar = () => {
    const {userData,isLoading,error}=useAuthUser();
    const {theme}=useThemeStore
    const {showSideBar,toggleSideBar}=useShowSideBarStore();

    return (
        <div className="navbar border-b bg-base-300 shadow-sm  min-h-10 p-1 sticky top-0 z-30" data={theme}>
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} onClick={toggleSideBar} 
            role="button" className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
            </div>

            </div>
        </div>
        <div className="navbar-center">
            <a className="btn btn-ghost text-xl text-primary">daisyUI</a>
        </div>
        <div className="navbar-end flex gap-2">
            <button className="btn btn-ghost btn-circle">
                <img src={userData.avatar} alt="" className='rounded-full h-[35px] w-[35px] bg-white'/>
            </button>
                
            <ThemeSelector/>          


            <button className="btn btn-ghost btn-circle">
            <Link to={"/notifications"} className="indicator" >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
            </Link>
            </button>
                <LogoutModal/>

            
        </div>
        </div>
  )
}

export default Navbar
