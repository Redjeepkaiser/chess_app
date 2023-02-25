import React from 'react'
import Square from './Square'
import Overlay from './Overlay'
import { ItemTypes } from '../Pieces/Types'
import { useDrop } from 'react-dnd'

type Props = {
    x: number,
    y: number,
    makeMove: Function,
    isValidMove: Function,
    children?: React.ReactNode,
}

type DropMessage = {
    x: number,
    y: number,
}

export default function BoardSquare(props: Props) {
    const x: number = props.x
    const y: number = props.y
    const light = (x + y) % 2 === 1

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: Object.values(ItemTypes),
        drop: (item: DropMessage, monitor) => {
            props.makeMove(item.x, item.y, x, y)
        },
        canDrop: (item: DropMessage, monitor) => {
            return props.isValidMove(item.x, item.y, x, y)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),
    }), [x, y])

    return (
        <div
            ref={drop}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            <Square light={light}>{props.children}</Square>
            {isOver && !canDrop && <Overlay color="red" />}
            {!isOver && canDrop && <Overlay color="yellow" />}
            {isOver && canDrop && <Overlay color="black" />}
        </div>
    )
}
