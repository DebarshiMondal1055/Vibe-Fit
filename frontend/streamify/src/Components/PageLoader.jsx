import React from 'react'
import {LoaderIcon} from 'lucide-react'
import { useThemeStore } from '../Hooks/useThemeStore'
const PageLoader = () => {
  const {theme}=useThemeStore();
  return (
    <div className='h-screen w-[100vw] flex justify-center items-center' data-theme={theme}>
      <LoaderIcon className='animate-spin size-15 text-primary bg-primary '/>
    </div>
  )
}

export default PageLoader
