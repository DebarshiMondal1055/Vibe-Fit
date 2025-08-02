import React from 'react'
import { useThemeStore } from '../Hooks/useThemeStore.js'
import { themes } from '../constants.js';
import {Key, SunMoonIcon} from "lucide-react"
const ThemeSelector = () => {
    const {theme,setTheme}=useThemeStore();
    return (
        <div className="dropdown dropdown-end rounded-full ">
        <div tabIndex={0} role="button" className="btn m-1 rounded-full hover:bg-base-400"><SunMoonIcon/></div>
        <div tabIndex={0} className="dropdown-content  hover:bg-base-200 z-30 backdrop-blur-lg  rounded-2xl z-1 mt-2 w-52 border-base-content/10 p-1 shadow-2xl space-y-3 max-h-80 overflow-y-auto">
            <div className='space-y-1'>
                {themes.map((themeOption,index)=>(
                <button onClick={()=>setTheme(themeOption)} key={index} 
                className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors${
                    theme===themeOption?"bg-primary/10 text-primary":"hover:bg-base-content/5"
                }`}>{themeOption}</button>
            ))}
            </div>
        </div>
        </div>
  )
}

export default ThemeSelector
