import ChessState from "./ChesState"

// TODO:
// Add move and coords types

export default class ChessGame {
    curr_state: ChessState

    constructor(curr_state: ChessState) {
        this.curr_state = curr_state
    }

    static from_fen(fen: string): ChessGame {
        return new ChessGame(ChessState.from_fen(fen))
    }

    canMove(currX: number, currY: number): boolean {
        return this.curr_state.canMove(currX, currY)
    }

    playMove(currX: number, currY: number, targetX: number, targetY: number): ChessGame {
        return new ChessGame(this.curr_state.playMove(currX, currY, targetX, targetY))
    }
   
    isValidMove(currX: number, currY: number, targetX: number, targetY: number) {
        return this.curr_state.isValidMove(currX, currY, targetX, targetY)
    }
    
    getSquare(x: number, y: number): string {
        return this.curr_state.getSquare(x, y)
    }
}