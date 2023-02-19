// Comments + naming + github action + precommit
// Rename position to game state
// Make copy and then move
// Storage as bigint
// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
// https://react-dnd.github.io/react-dnd/docs/tutorial

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import BoardSquare from "./BoardSquare/BoardSquare.tsx"
import { initGameState, copyGameState, makeMove, validateMove } from "./GameState/GameState.tsx"

import BlackBishop from "./Pieces/BlackBishop.tsx"
import BlackKing from "./Pieces/BlackKing.tsx"
import BlackKnight from "./Pieces/BlackNight.tsx"
import BlackPawn from "./Pieces/BlackPawn.tsx"
import BlackQueen from "./Pieces/BlackQueen.tsx"
import BlackRook from "./Pieces/BlackRook.tsx"
import WhiteBishop from "./Pieces/WhiteBishop.tsx"
import WhiteKing from "./Pieces/WhiteKing.tsx"
import WhiteKnight from "./Pieces/WhiteKnight.tsx"
import WhitePawn from "./Pieces/WhitePawn.tsx"
import WhiteQueen from "./Pieces/WhiteQueen.tsx"
import WhiteRook from "./Pieces/WhiteRook.tsx"

const repr_to_react = {
  "b": BlackBishop,
  "k": BlackKing,
  "n": BlackKnight,
  "p": BlackPawn,
  "q": BlackQueen,
  "r": BlackRook,
  "B": WhiteBishop,
  "K": WhiteKing,
  "N": WhiteKnight,
  "P": WhitePawn,
  "Q": WhiteQueen,
  "R": WhiteRook,
}

const start_position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

function renderSquare(row, col, size, Piece, handleSquareClick, doMove, isValidMove) {
  const light = (row + col) % 2 === 0

  return (
    <div
      key={row * 8 + col}
      style={{ width: size, height: size }}
      onClick={() => handleSquareClick(row, col)}
    >
      <BoardSquare row={row} col={col} makeMove={doMove} isValidMove={isValidMove}>
        {Piece && <Piece row={row} col={col}/>}
      </BoardSquare>
    </div>
  )
}

export default function Board({ knightPosition }) {
  let [gameState, setGameState] = React.useState(initGameState(start_position));
  const gameStateRef = React.useRef();
  gameStateRef.current = gameState;
  console.log("current game state", gameStateRef.current)

  let [moving, setMoving] = React.useState(false)
  let [selectedRow, setSelectedRow] = React.useState(0)
  let [selectedCol, setSelectedCol] = React.useState(0)

  const square_size = 100
  const board_size = 8 * 100

  function handleSquareClick(row, col) {
    if (!moving) {
      setMoving(true)
      setSelectedRow(row)
      setSelectedCol(col)
      //highlight moves
    } else {
      isValidMove(selectedRow, selectedCol, row, col)
      doMove(selectedRow, selectedCol, row, col)
      setMoving(false)
    }
  }

  function doMove(currRow, currCol, targetRow, targetCol) {
    setGameState(makeMove(gameStateRef.current, currRow, currCol, targetRow, targetCol))
  }

  function isValidMove(currRow, currCol, targetRow, targetCol) {
    return validateMove(gameStateRef.current, currRow, currCol, targetRow, targetCol)
  }

  const squares = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let representation = gameStateRef.current.grid[row][col]
      let Piece = repr_to_react[representation]
  
      squares.push(renderSquare(
        row, col, square_size, Piece, handleSquareClick, doMove, isValidMove
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
