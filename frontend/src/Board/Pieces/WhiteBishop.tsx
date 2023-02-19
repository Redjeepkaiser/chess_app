import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'

function WhiteBishop({row, col}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.WHITEBISHOP,
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
        <path d="m 948.18,366.344 1,-139.102 148.135,-6.95 0.254,146.408 z M 564.353,859.7 c 113.40366,-266.28751 455.981,-442.781 455.981,-442.781 0,0 391.785,176.37142 475.963,502.578 -8.846,208.7473 -183.765,331.328 -183.765,331.328 l 27.0188,221.5 -652.96255,6 46.01875,-233.5 c 0,0 -229.79094,-170.8113 -168.254,-385.125 z m -101.795,789.887 c 174.9708,5.9738 355.25488,23.0317 425.286,-141.884 l 92.354,0.725 c 0,0 0.07,190.014 -87.913,245.652 -162.79714,102.9485 -624.847,38.128 -624.847,38.128 0,0 -15.72175,-146.1088 195.12,-142.621 z m 631.296,37.493 -36.025,-184.923 101.887,5.224 c 0,0 22.612,152.792 315.124,130.958 381.2427,-17.2372 317.903,152.869 317.903,152.869 l -483.147,5 z" fill="#f9f9f9"/>
        <path d="M1024 356q66 0 64-66 1-55-64-55-66 0-64 55-3 66 64 66zm0 1204q0 114-101 198.5T700 1843H205q0-117 65-179t142-62h250q51 0 88-7t71-60q12-20 10-16h76q-7 21-3 13-45 105-109 124.5T649 1676H409q-52 0-86 40t-34 53h424q66 0 158.5-65t93.5-185H624q67-116 72-229-114-119-162-223.5T528 843q33-96 118-189.5T958 407q-17-11-46-36t-29-79q0-58 41-96t100-38q58 0 99.5 38t41.5 96q0 54-29.5 79t-45.5 36q226 153 311 246.5T1520 843q42 119-6 223.5T1352 1290q4 113 72 229h-341q0 120 93 185t159 65h424q0-13-34.5-53t-85.5-40h-240q-83 0-146.5-19.5T1144 1532q4 8-3-13h76q-2-4 10 16 33 53 70 60t89 7h250q76 0 141.5 62t65.5 179h-495q-123 0-223.5-84.5T1024 1560zm0-114h283q-28-84-29-154-120-41-254-38-135-3-254 38-2 70-29 154zm0-267q159-1 285 42 189-180 142-346-60-193-427-431-368 238-427 431-48 166 142 346 125-43 285-42zm-47-361V714h94v104h95v89h-95v165h-94V907h-95v-89z" fill="#101010"/>
      </svg>
    </div>
  );
}

export default WhiteBishop;

