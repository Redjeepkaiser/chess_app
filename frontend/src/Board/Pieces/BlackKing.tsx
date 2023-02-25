import { useDrag } from 'react-dnd'

import { ItemTypes } from './Types'
import { PieceProps } from './PieceProps'


function BlackKing(props: PieceProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.BLACKKING,
        item: () => {
            return { 'x': props.x, 'y': props.y }
        },
        canDrag: () => {
            return props.canMove(props.x, props.y)
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
            <svg viewBox='0 0 2048 2048' xmlns='http://www.w3.org/2000/svg'>
                <path d='m 553.33333,1485 -55,320 1047.33337,5 -47.3334,-335 c 0,0 323.3334,-313.3333 330,-466.6667 C 1835,855 1793.2385,677.36891 1586.6667,601.66667 1404.4831,534.90195 1215,723.33333 1215,723.33333 l -181.6667,-161.66666 -189.99997,160 c 0,0 -185.06774,-135.89105 -256.66666,-130 C 323.33333,613.33334 235,811.66667 225,925 c 10.16447,331.252 328.33333,560 328.33333,560 z' fill='#f9f9f9' />
                <path d='M1024 1769h489l-12-73H547l-12 73zm0-921q-25-60-62-111 31-48 62-65 30 17 62 65-38 51-62 111zm-97 454q-154 11-303 58-123-108-200-213.5T347 945q0-89 73.5-159T569 716q67 0 134.5 62.5T806 909q30 54 75 175t46 218zm-350 217l-26 156 145-84zm447-907q-47 0-136 121-31-36-50-55 93-140 186-140 92 0 186 140-20 19-50 55-90-121-136-121zm0 775q-1-126-42-267.5T898 893q-8-14-14-27t-12-23q-28-43-48-69-51-63-120-105t-134-42q-103 0-208 93T257 949q0 120 99 254.5T605 1463q201-74 419-76zm0 456H448l61-365q-325-280-326-535-1-159 125-274.5T575 553q78 0 158.5 47T876 719q61 74 98.5 164.5T1024 1034q12-60 49-150.5t99-164.5q61-72 142-119t159-47q140 0 266 115.5T1865 943q-2 255-326 535l61 365zm97-541q0-97 45-218t76-175q34-68 101.5-130.5T1479 716q74 0 147.5 70t74.5 159q0 96-77 201.5T1424 1360q-150-47-303-58zm350 217l-119 72 145 84zm-447-132q217 2 419 76 150-125 249-259.5t99-254.5q0-136-105.5-229T1478 627q-66 0-135 42t-119 105q-21 26-48 69-6 10-12.5 23l-13.5 27q-44 85-85 226.5t-41 267.5zm-139 159l139 86 139-84-139-86zm92-1248v-95h94v95h107v95h-107v153q-48-16-94 0V393H870v-95z' fill='#101010' />
            </svg>
        </div>
    )
}

export default BlackKing
