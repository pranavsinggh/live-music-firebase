import React from 'react'
import { Outlet } from 'react-router-dom'

const ProfileContent = () => {
  return (
      <aside className='basis-[84%] bg-slate-900 h-[90vh] p-2'>
          <Outlet/>
    </aside>
  )
}

export default ProfileContent