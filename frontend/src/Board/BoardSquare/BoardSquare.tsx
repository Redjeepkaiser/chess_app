import React from 'react'
import Square from './Square.tsx'
import Overlay from './Overlay.tsx'
import { ItemTypes } from '../Pieces/Constants.tsx'
import { useDrop } from 'react-dnd'

export default function BoardSquare({ row, col, children, makeMove, isValidMove }) {
  const light = (row + col) % 2 === 1
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: Object.values(ItemTypes),
    drop: (item, monitor) => { makeMove(item.row, item.col, row, col) },
    canDrop: (item, monitor) => { return isValidMove(item.row, item.col, row, col) },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
  }), [row, col])

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Square light={light}>{children}</Square>
      {isOver && !canDrop && <Overlay color="red" />}
      {!isOver && canDrop && <Overlay color="yellow" />}
      {isOver && canDrop && <Overlay color="black" />}
    </div>
  )
}
