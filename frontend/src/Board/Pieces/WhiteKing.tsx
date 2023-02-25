import { useDrag } from 'react-dnd'

import { ItemTypes } from './Types'
import { PieceProps } from './PieceProps'


function WhiteKing(props: PieceProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.WHITEKING,
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
                <path d='m 501.64494,1810.9843 48.3236,-354.3731 -260.02697,-269.2314 c 0,0 -166.32924,-288.13389 29.91461,-480.93486 262.32809,-257.72584 506.24719,20.71012 506.24719,20.71012 l 195.59553,-165.6809 184.0899,165.6809 c 0,0 216.3056,-232.41349 430.3101,-75.93708 214.0045,156.4764 255.4247,317.55505 117.3573,531.55952 -138.0674,214.0045 -250.8225,280.7371 -250.8225,280.7371 l 55.227,347.4697 z' fill='#f9f9f9' />
                <path d='M977 298v-95h94v95h107v95h-107v153q-48-16-94 0V393H870v-95zm47 314q-47 0-136 121-31-36-50-55 93-140 186-140 92 0 186 140-20 19-50 55-90-121-136-121zm-447 907l-26 156 145-84zm410-206q-1-147-36.5-274.5T870 845q-45-88-131.5-153T570 627q-103 0-208 93T257 949q0 109 86.5 236T546 1408q212-88 441-95zm37 530H448l61-365q-325-280-326-535-1-159 125-274.5T575 553q78 0 158.5 47T876 719q61 74 98.5 164.5T1024 1034q12-60 49-150.5t99-164.5q61-72 142-119t159-47q140 0 266 115.5T1865 943q-2 255-326 535l61 365zm0-74h489l-50-298q-216-84-439-84t-439 84l-50 298zm447-250l26 156-145-84zm-410-206q229 7 441 95 115-96 202-223t87-236q0-136-105.5-229T1478 627q-83 0-169.5 65T1178 845q-46 66-81.5 193.5T1061 1313zm-176 233l141-84 137 86-141 84z' fill='#101010' />
            </svg>
        </div>
    )
}

export default WhiteKing
