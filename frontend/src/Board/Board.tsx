// Comments + naming + github action + precommit
// Rename position to game state
// Make copy and then move
// Storage as bigint
// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
// https://react-dnd.github.io/react-dnd/docs/tutorial

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import BoardSquare from './BoardSquare/BoardSquare'
import ChessGame from './ChessGame/ChessGame'

import BlackBishop from './Pieces/BlackBishop'
import BlackKing from './Pieces/BlackKing'
import BlackKnight from './Pieces/BlackNight'
import BlackPawn from './Pieces/BlackPawn'
import BlackQueen from './Pieces/BlackQueen'
import BlackRook from './Pieces/BlackRook'
import WhiteBishop from './Pieces/WhiteBishop'
import WhiteKing from './Pieces/WhiteKing'
import WhiteKnight from './Pieces/WhiteKnight'
import WhitePawn from './Pieces/WhitePawn'
import WhiteQueen from './Pieces/WhiteQueen'
import WhiteRook from './Pieces/WhiteRook'

const repr_to_react: { [key: string]: Function } = {
    'b': BlackBishop,
    'k': BlackKing,
    'n': BlackKnight,
    'p': BlackPawn,
    'q': BlackQueen,
    'r': BlackRook,
    'B': WhiteBishop,
    'K': WhiteKing,
    'N': WhiteKnight,
    'P': WhitePawn,
    'Q': WhiteQueen,
    'R': WhiteRook,
}

const starting_position: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const test_position: string = '4k3/8/8/8/8/8/5P2/RNBQKBNR w KQkq - 0 1'

function renderSquare(
    x: number,
    y: number,
    size: number,
    Piece: Function,
    handleSquareClick: Function,
    doMove: Function,
    isValidMove: Function,
    canMove: Function,
) {
    return (
        <div
            key={y * 8 + x}
            style={{ width: size, height: size }}
            onClick={() => handleSquareClick(x, y)}
        >
            <BoardSquare x={x} y={y} makeMove={doMove} isValidMove={isValidMove}>
                {Piece && <Piece x={x} y={y} canMove={canMove}/>}
            </BoardSquare>
        </div>
    )
}

export default function Board() {
    let [gameState, setGameState] = React.useState<ChessGame>(() => {
        return ChessGame.from_fen(test_position)
    })

    let gameStateRef = React.useRef(gameState)
    gameStateRef.current = gameState
    // console.log("u", gameStateRef.current.curr_state.#white_to_move)

    let [moving, setMoving] = React.useState(false)
    let [selectedRow, setSelectedRow] = React.useState(0)
    let [selectedCol, setSelectedCol] = React.useState(0)

    const square_size = 100
    const board_size = 8 * 100

    function handleSquareClick(x: number, y: number) {
        if (!moving) {
            setMoving(true)
            setSelectedRow(y)
            setSelectedCol(x)
            //highlight moves
        } else {
            isValidMove(selectedRow, selectedCol, x, y)
            playMove(selectedRow, selectedCol, x, y)
            setMoving(false)
        }
    }

    function canMove(currX: number, currY: number): boolean {
        return gameStateRef.current.canMove(currX, currY)
    }

    function playMove(currX: number, currY: number, targetX: number, targetY: number) {
        setGameState(gameStateRef.current.playMove(currX, currY, targetX, targetY))
    }

    function isValidMove(currX: number, currY: number, targetX: number, targetY: number) {
        return gameStateRef.current.isValidMove(currX, currY, targetX, targetY)
    }

    const squares = []
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let representation = gameState.getSquare(x, y)
            let Piece = repr_to_react[representation]

            squares.push(renderSquare(
                x, y, square_size, Piece, handleSquareClick, playMove, isValidMove, canMove
            ))
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div
                style={{
                    width: board_size,
                    height: board_size,
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                {squares}
            </div>
        </DndProvider>
    )
}
