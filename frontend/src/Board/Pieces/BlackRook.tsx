import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'

function BlackRook({row, col}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.BLACKROOK,
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
        <path d="m 674.03596,731.7573 -75.74383,807.6944 850.72807,13.8067 -75.1415,-833.00671 z" fill="#f9f9f9"/>
        <path d="M1024 1843H383l29-264 159-118 50-659-149-107-17-341h289v147h137V354h286v147h137V354h289l-17 341-149 107 50 659 159 118 29 264zm0-989h333l-6-88H697l-6 88zm0 647h381l-6-87H649l-6 87z" fill="#101010"/>
      </svg>
    </div>
  );
}

export default BlackRook;

