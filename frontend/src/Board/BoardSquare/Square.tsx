import React from 'react'

import './Square.css'

export default function Square({ light, children }) {
  let className = (light ? "light-square" : "dark-square")

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {children}
    </div>
  )
}
