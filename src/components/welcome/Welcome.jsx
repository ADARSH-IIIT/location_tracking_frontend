import React from 'react'
import './Welcome.css'


import { useSelector } from 'react-redux'

const Welcome = () => {



const myinfo = useSelector((state)=> state.myinfo)



  return (
    <div className='welcomepage flex-row-center'>
         <div className='wcp1 flex-row-center'>


           welcome back
          


                
         </div>
    </div>

  
  )
}

export default Welcome