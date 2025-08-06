import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import SignUpPage from './Pages/SignUpPage.jsx'
import ChatPage from './Pages/ChatPage.jsx'
import NotificationsPage from './Pages/NotificationsPage.jsx'
import OnBoardingPage from './Pages/OnBoardingPage.jsx'
import CallPage from './Pages/CallPage.jsx'
import { Toaster, toast } from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './utils/axios.js'
import { useAuthUser } from './Hooks/useAuthUser.js'
import PageLoader from './Components/PageLoader.jsx'
import Layout from './Components/Layout.jsx'
import { useThemeStore } from './Hooks/useThemeStore.js'
import FriendsPage from './Pages/FriendsPage.jsx'
import UserProfilePage from './Pages/UserProfilePage.jsx'
import MyProfilePage from './Pages/MyProfilePage.jsx'

function App() {
  const {theme,setTheme}=useThemeStore()
  const {userData,isLoading,error}=useAuthUser();
  const isAuthenticated=Boolean(userData);
  const isOnBoarded=userData?.isOnBoarded;
  
  const toggleSideBar=()=>{
    setShowSideBar((prev)=>!prev)
  }
  if(isLoading){
    return (
      <PageLoader/>
    )
  }
  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path='/' element={userData && isOnBoarded ? <Layout  children={<HomePage/>}></Layout>:(
          isAuthenticated?<Navigate to={"/on-board"}/>:
          <Navigate to={"/login"}/>)} />
        <Route path='/signUp' element={!userData?<SignUpPage />:<Navigate to={isOnBoarded?"/":"/on-board"}/>} />
        <Route path='/login' element={!userData?<LoginPage />:<Navigate to={isOnBoarded?"/":"/on-board"}/>} />
        <Route path='/on-board' element={userData?(isOnBoarded?<Navigate to={"/"}/>:<OnBoardingPage/>):<Navigate to={"/login"}/>} />
        <Route path='/notifications' element={userData && isOnBoarded?<Layout  children={<NotificationsPage/>}></Layout>:<Navigate to={isAuthenticated?"/on-board":"/login"}/>} />
        <Route path='/chats/:id' element={userData && isOnBoarded?<Layout  children={<ChatPage/>}></Layout>:<Navigate to={isAuthenticated?"/on-board":"/login"}/>} />
        <Route path='/call/:id' element={userData && isOnBoarded?<CallPage />:<Navigate to={isAuthenticated?"/on-board":"/login"}/> } />
        <Route path='/friends' element={userData && isOnBoarded?<Layout  children={<FriendsPage/>}></Layout>:<Navigate to={isAuthenticated?"/on-board":"/login"}/>} />
        <Route path='/user-profile/:id' element={userData && isOnBoarded?<Layout children={<UserProfilePage/>}></Layout>:<Navigate to={isAuthenticated?"/on-board":"/login"}/>}></Route>
        <Route path='/my-profile' element={userData && isOnBoarded?<Layout children={<MyProfilePage/>}></Layout>:<Navigate to={isAuthenticated?"/on-board":"/login"}/>}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;
