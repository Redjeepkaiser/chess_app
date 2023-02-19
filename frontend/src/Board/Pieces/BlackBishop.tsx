import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'

function BlackBishop({row, col}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.BLACKBISHOP,
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
        <path d="M 732.3355,1289.835 627.8342,993.05919 1014,576.30865 l 420.6826,374.83597 -132.1147,379.61628 49.674,151.806 -658.07476,-8.7101 z" fill="#f9f9f9"/>
        <path d="M768 1365q-5 39-26 82h564q-18-36-26-82zm495-73l46-73q-142-49-285-47-144-2-285 47l46 73q118-40 239-38 120-2 239 38zm-432 227H624q67-116 72-229-114-119-162-223.5T528 843q33-96 118-189.5T958 407q-17-11-46-36t-29-79q0-58 41-96t100-38q58 0 99.5 38t41.5 96q0 54-29.5 79t-45.5 36q226 153 311 246.5T1520 843q42 119-6 223.5T1352 1290q4 113 72 229h-207q-2-4 10 16 33 53 70 60t89 7h250q76 0 141.5 62t65.5 179h-495q-123 0-223.5-84.5T1024 1560q0 114-101 198.5T700 1843H205q0-117 65-179t142-62h250q51 0 88-7t71-60q12-20 10-16zm146-701h-95v89h95v165h94V907h95v-89h-95V714h-94z" fill="#101010"/>
      </svg>
    </div>
  );
}

export default BlackBishop;

