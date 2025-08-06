import React from 'react'
import { humorMap } from '../constants'

const VibeCards = ({vibe="Dark",username}) => {
    const {img,description}=humorMap.get(vibe)
  return (
        <div className="card bg-base-100 image-full w-96 shadow-sm cards-md  ">
        <figure>
            <img
            src={img}
            alt="Shoes" />
        </figure>
        <div className="card-body mt-auto ">
            <h2 className="card-title">{vibe}</h2>
            <p>{username.toUpperCase()} {description}</p>
        </div>
        </div>
  )
}

export default VibeCards
