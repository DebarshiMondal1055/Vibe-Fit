import {create} from 'zustand'


const useThemeStore=create((set)=>({
    theme:"night",
    setTheme:(newTheme)=>set({theme:newTheme})
}))

export {useThemeStore}