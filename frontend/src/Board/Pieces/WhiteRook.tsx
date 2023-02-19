import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'

function WhiteRook({row, col}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.WHITEROOK,
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
        <path d="m 434.91236,1804.0809 16.10786,-211.7034 151.87416,-115.0562 50.62472,-688.03591 -147.27191,-115.05618 -6.90337,-276.13483 209.40225,-2.30112 4.60224,138.06741 197.89663,2.30113 6.90337,-140.36854 211.70339,-2.30113 13.8067,144.97079 193.2944,-4.60225 4.6023,-138.06741 h 204.8 l -6.9034,285.33932 -144.9708,105.85169 41.4202,692.63823 172.5843,124.2606 18.409,207.1012 z" fill="#f9f9f9"/>
        <path d="M1024 1501H643l5-74h752l5 74zm0-661H692l5-74h654l5 74zm0 1003H383l29-264 159-118 50-659-149-107-17-341h289v147h137V354h286v147h137V354h289l-17 341-149 107 50 659 159 118 29 264zm0-74h557l-15-149-161-119-54-735 152-109 13-230h-138v148h-285V427H955v148H670V427H532l13 230 152 109-54 735-161 119-15 149z" fill="#101010"/>
      </svg>
    </div>
  );
}

export default WhiteRook;
