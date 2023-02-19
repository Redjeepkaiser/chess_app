import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'

function BlackPawn({row, col}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.BLACKPAWN,
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
        <path d="M1024 1843H446v-74q-4-80 41.5-137T613 1524q117-91 171.5-217.5T863 1039H576l284-239q-86-74-86-188 0-103 73-177t177-74q103 0 176.5 74t73.5 177q0 114-86 188l284 239h-287q23 141 78 267.5t172 217.5q79 51 124.5 108t42.5 137v74z" fill="#101010"/>
      </svg>
    </div>
  );
}

export default BlackPawn;