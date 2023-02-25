import { useDrag } from 'react-dnd'

import { ItemTypes } from './Types'
import { PieceProps } from './PieceProps'


function WhitePawn(props: PieceProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.WHITEPAWN,
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
                <path d='M 734.04938,980.80816 930.09079,787.95523 c 0,0 -189.13173,-81.58724 -79.40174,-287.85087 79.33675,-149.13229 302.99555,-114.32681 361.18885,50.20491 63.2501,178.82926 -112.8165,240.05645 -112.8165,240.05645 L 1324.943,986.78963 Z M 498.69315,1779.8054 c 0,0 -7.85253,-106.8733 50.80185,-154.2608 195.48756,-173.0158 337.28665,-385.3706 370.88726,-598.9165 l 209.23414,1.9935 c 33.3484,206.5537 182.5006,447.0041 321.0372,561.7471 101.736,59.0524 98.9842,198.3937 98.9842,198.3937 z' fill='#f9f9f9' />
                <path d='M520 1769h1008q8-97-132-182-132-101-196.5-239.5T1120 1039H928q-15 170-79.5 308.5T652 1587q-141 85-132 182zm504 74H446v-74q-4-80 41.5-137T613 1524q117-91 171.5-217.5T863 1039H576l284-239q-86-74-86-188 0-103 73-177t177-74q103 0 176.5 74t73.5 177q0 114-86 188l284 239h-287q23 141 78 267.5t172 217.5q79 51 124.5 108t42.5 137v74zM756 974h536l-225-191q134-31 134-171 0-76-52.5-126.5T1024 435q-73 0-125 50.5T847 612q0 140 134 171z' fill='#101010' />
            </svg>
        </div>
    )
}

export default WhitePawn
