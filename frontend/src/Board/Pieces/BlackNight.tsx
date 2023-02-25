import { useDrag } from 'react-dnd'

import { ItemTypes } from './Types'
import { PieceProps } from './PieceProps'


function BlackKnight(props: PieceProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.BLACKKNIGHT,
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
                <path d='M 1658.305,1806.04 C 1249.6904,1505.0048 1586.7546,886.01425 1206.264,463.414 l 59.65,-16.274 c 0,0 296.14,166.891 319.639,256.663 182.5346,468.4872 41.7595,691.1612 135.679,1076.966 z m -686.5,-1283.088 120.43,175.73 -311.811,-2.642 z m -473.534,458.494 -92.96,-41.258 41.481,-93.656 127.335,28.017 z' fill='#f9f9f9' />
                <path d='M502 868l-52 1-26 64 69 21 46-55zm536-187q34 1-16-68t-80-42L826 680zm-338-98q6-39 115.5-107.5T1036 332l115-154 96 217q342 172 432.5 417.5T1727 1416q-18 128 4.5 236t57.5 190l-1242 1q-9-178 39-301.5T769 1304q50-11 82.5-39.5T905 1206l62.5-1 138-29 139-97 66.5-207q0-17-8.5-34t-11.5-37q-62 228-161 288.5T939 1148q-236-42-292 60l-56 102-217-121 115-82-51-50-122 86-12-297zm981 1192q-102-130-85-308.5t27-362.5-50-351.5T1257 477q220 164 252.5 342t16.5 350.5-12 329 167 276.5z' fill='#101010' />
            </svg>
        </div>
    )
}

export default BlackKnight
