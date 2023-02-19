import React from 'react'
import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'

function BlackQueen({row, col}) {
  const [{isDragging, dropResult}, drag] = useDrag(() => ({
    type: ItemTypes.BLACKQUEEN,
    item: () => {
      return {"row": row, "col": col}
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <svg viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
        <path d="m 520.05393,1801.7798 41.42023,-448.7191 474.03144,-128.8629 457.9236,133.4651 34.5169,446.418 z" fill="#f9f9f9"/>
        <path d="M590 1519q4 72-15 158l134-86zm434 324H441q114-231 57.5-456.5T296 937q-12 2-19 2-54 0-92.5-38.5T146 808t38.5-92.5T277 677t92.5 38.5T408 808q0 20-6 38-4 14-15 33l196 139 100-486q-64-31-72-103-5-44 29-91t88-53q54-5 96 29t48 88q7 68-46 114l198 412 198-412q-54-46-46-114 6-54 48-88t96-29q54 6 87.5 53t29.5 91q-9 72-72 103l100 486 196-139q-12-19-15-33-6-18-6-38 0-54 38.5-92.5T1771 677t92.5 38.5T1902 808t-38.5 92.5T1771 939q-7 0-19-2-147 224-203 449.5t58 456.5zm0-450q109 0 222 28.5t213 67.5q2-41 11-89-108-42-221.5-68t-224.5-26-225 26-221 68q8 48 11 89 99-39 212-67.5t223-28.5zm0 376h478q-15-34-24-73H570q-10 39-24 73zm434-250l-119 72 134 86q-20-86-15-158zm-573 47l139 87 139-84-139-86z" fill="#101010"/>
      </svg>
    </div>
  );
}

export default BlackQueen;

