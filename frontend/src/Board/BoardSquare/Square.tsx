import React from 'react'

import './Square.css'

type Props = {
    light: boolean,
    children?: React.ReactNode,
}

export default function Square(props: Props) {
  let className = (props.light ? "light-square" : "dark-square")

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {props.children}
    </div>
  )
}
