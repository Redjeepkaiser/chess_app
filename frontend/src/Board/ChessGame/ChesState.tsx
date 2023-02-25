import { FEN_TO_INT_MAPPING, INT_TO_FEN_MAPPING } from './Fen';

//https://web.archive.org/web/20130212063528/http://www.cis.uab.edu/hyatt/boardrep.html
// add piece records for black and white do this in rust optimalisation, or here
// bitmaps
// add tests
// Basic checks are all the same, except for pawns, BLACK/WHITE PIECE
// Checks for in the field


const X88_MAPPING: number[] = [
    112, 113, 114, 115, 116, 117, 118, 119,
    96, 97, 98, 99, 100, 101, 102, 103,
    80, 81, 82, 83, 84, 85, 86, 87,
    64, 65, 66, 67, 68, 69, 70, 71,
    48, 49, 50, 51, 52, 53, 54, 55,
    32, 33, 34, 35, 36, 37, 38, 39,
    16, 17, 18, 19, 20, 21, 22, 23,
    0, 1, 2, 3, 4, 5, 6, 7
]

const SECOND_RANK = 1
const SEVENTH_RANK = 6

const DIAGONAL_WEST= 15
const FORWARD = 16
const DIAGONAL_EAST = 17

const KNIGHT_NORTH_WEST = 31
const KNIGHT_NORTH_EAST = 33
const KNIGHT_EAST_NORTH = 18
const KNIGHT_EAST_SOUTH = -18
const KNIGHT_SOUTH_EAST = -31
const KNIGHT_SOUTH_WEST = -33
const KNIGHT_WEST_NORTH = 14
const KNIGHT_WEST_SOUTH = -14
const KNIGHT_MOVES = [
    KNIGHT_NORTH_WEST,
    KNIGHT_NORTH_EAST,
    KNIGHT_EAST_NORTH,
    KNIGHT_EAST_SOUTH,
    KNIGHT_SOUTH_EAST,
    KNIGHT_SOUTH_WEST,
    KNIGHT_WEST_NORTH,
    KNIGHT_WEST_SOUTH,
]

const BISHOP_NORTH_EAST = 17
const BISHOP_NORTH_WEST = 15
const BISHOP_SOUTH_EAST = -17
const BISHOP_SOUTH_WEST = -15
const BISHOP_DIRECTIONS = [
    BISHOP_NORTH_EAST,
    BISHOP_NORTH_WEST,
    BISHOP_SOUTH_EAST,
    BISHOP_SOUTH_WEST,
]

const ROOK_FORWARD = 16
const ROOK_BACKWARD = -16
const ROOK_RIGHT = 1
const ROOK_LEFT = -1
const ROOK_DIRECTIONS = [
    ROOK_FORWARD,
    ROOK_BACKWARD,
    ROOK_RIGHT,
    ROOK_LEFT,
]

const QUEEN_DIRECTIONS = [
    BISHOP_NORTH_EAST,
    BISHOP_NORTH_WEST,
    BISHOP_SOUTH_EAST,
    BISHOP_SOUTH_WEST,
    ROOK_FORWARD,
    ROOK_BACKWARD,
    ROOK_RIGHT,
    ROOK_LEFT,
]

const KING_DIRECTIONS = QUEEN_DIRECTIONS

const IS_EMPTY = (repr: number) => { return !repr }
const IS_BLACK_PIECE = (repr: number) => { return 1 <= repr && repr <= 6 }
const IS_WHITE_PIECE = (repr: number) => { return 7 <= repr }
const IS_IN_BOARD = (idx: number) => { return 0 <= idx && idx < 128 && idx % 16 < 8 }

function mapToX88(x: number, y: number): number {
    return X88_MAPPING[y * 8 + x]
}

function getRowX88(idx: number) {
    return Math.floor(idx / 16)
}

function isNumeric(num: any): boolean {
    return (
        (
            typeof (num) === 'number' ||
            typeof (num) === 'string' && num.trim() !== ''
        ) &&
        !isNaN(num as number)
    );
}

export default class ChessState {
    #grid: Uint8Array
    #white_to_move: boolean
    #black_castle_kingside: boolean
    #black_castle_queenside: boolean
    #white_castle_kingside: boolean
    #white_castle_queenside: boolean
    #en_passant_possible: boolean
    #half_move_number: number
    #full_move_number: number
    #white_king_idx: number
    #black_king_idx: number
    #valid_moves: Map<number, number[]>

    constructor(
        grid: Uint8Array,
        white_to_move: boolean,
        black_castle_kingside: boolean,
        black_castle_queenside: boolean,
        white_castle_kingside: boolean,
        white_castle_queenside: boolean,
        en_passant_possible: boolean,
        half_move_number: number,
        full_move_number: number,
        black_king_idx: number,
        white_king_idx: number,
        valid_moves?: Map<number, number[]>,
    ) {
        this.#grid = grid
        this.#white_to_move = white_to_move
        this.#black_castle_kingside = black_castle_kingside
        this.#black_castle_queenside = black_castle_queenside
        this.#white_castle_kingside = white_castle_kingside
        this.#white_castle_queenside = white_castle_queenside
        this.#en_passant_possible = en_passant_possible
        this.#half_move_number = half_move_number
        this.#full_move_number = full_move_number
        this.#black_king_idx = black_king_idx
        this.#white_king_idx = white_king_idx
        this.#valid_moves = valid_moves ? valid_moves : this.#computeValidMoves()
    }

    static from_fen(fen: string): ChessState {
        const parts: string[] = fen.split(' ')
        if (parts.length < 6) {
            throw new Error('Invalid fen.')
        }

        const rows: string[] = parts[0].split('/')
        let grid: Uint8Array = new Uint8Array(128)
        let black_king_idx: number = -1
        let white_king_idx: number = -1
        let curr_index: number = 0
        rows.forEach(row => {
            Array.from(row).forEach(char => {
                if (isNumeric(char)) {
                    curr_index += parseInt(char, 10)
                } else {
                    let piece: number

                    try {
                        piece = FEN_TO_INT_MAPPING[char]
                    } catch (error) {
                        throw new Error(`Invalid character: ${error}.`)
                    }

                    try {
                        grid[X88_MAPPING[curr_index]] = piece
                    } catch (error) {
                        throw new Error(`Invalid dimensions: ${error}.`)
                    }

                    if (char == 'k') {
                        black_king_idx = X88_MAPPING[curr_index]
                    } else if (char == 'K') {
                        white_king_idx = X88_MAPPING[curr_index]
                    }

                    curr_index += 1
                }
            })
        })

        if (black_king_idx < 0) {
            throw Error('Missing black king.')
        }
        if (white_king_idx < 0) {
            throw Error('Missing white king.')
        }

        return new ChessState(
            grid,
            parts[1] == 'w',
            parts[2].includes('k'),
            parts[2].includes('q'),
            parts[2].includes('K'),
            parts[2].includes('Q'),
            parts[3] != '-',
            parseInt(parts[4], 10),
            parseInt(parts[5], 10),
            black_king_idx,
            white_king_idx,
        )
    }

    copy() {
        return new ChessState(
            this.#grid,
            this.#white_to_move,
            this.#black_castle_kingside,
            this.#black_castle_queenside,
            this.#white_castle_kingside,
            this.#white_castle_queenside,
            this.#en_passant_possible,
            this.#half_move_number,
            this.#full_move_number,
            this.#black_king_idx,
            this.#white_king_idx,
            this.#valid_moves,
        )
    }

    isValidMove(currX: number, currY: number, targetX: number, targetY: number): boolean {
        let from = mapToX88(currX, currY)
        let to = mapToX88(targetX, targetY)
        return this.#valid_moves.get(from)?.includes(to) ?? false
    }

    canMove(currX: number, currY: number): boolean {
        if (IS_BLACK_PIECE(this.#grid[mapToX88(currX, currY)]) && this.#white_to_move) {
            return false
        }
        else if (IS_WHITE_PIECE(this.#grid[mapToX88(currX, currY)]) && !this.#white_to_move) {
            return false
        }

        return true
    }

    playMove(currX: number, currY: number, targetX: number, targetY: number): ChessState {
        let curr: number = mapToX88(currX, currY)
        let target: number = mapToX88(targetX, targetY)
        console.log("play move", curr, target)
        let newState = this.copy()
        let piece = newState.#grid[mapToX88(currX, currY)]
        newState.#grid[mapToX88(currX, currY)] = FEN_TO_INT_MAPPING['e']
        newState.#grid[mapToX88(targetX, targetY)] = piece

        // TODO move backwards on the line of check
        // TODO make main consistent, add issues + more CI/CD
        // TODO update all piece states
        if (piece === FEN_TO_INT_MAPPING['k']) {
            newState.#black_king_idx = mapToX88(targetX, targetY)
        }
            
        newState.#white_to_move = !this.#white_to_move
        
        console.log("Checking for checks on black, loc: ", this.#black_king_idx)
        if (newState.isAttacked(newState.#black_king_idx)) {
            console.log("CHECKED")
        }

        // update all piece locations

        newState.#valid_moves = newState.#computeValidMoves()
        return newState
    }

    findAttackers(curr_idx: number): number[] {
        let attackers = []
        
        if (!this.#white_to_move) {
            if (this.#grid[curr_idx - DIAGONAL_EAST] === FEN_TO_INT_MAPPING['P']) {
                attackers.push(curr_idx - DIAGONAL_EAST)
            }

            if (this.#grid[curr_idx - DIAGONAL_WEST] === FEN_TO_INT_MAPPING['P']) {
                attackers.push(curr_idx - DIAGONAL_WEST)
            }
             
            KNIGHT_MOVES.map(movement => curr_idx + movement).forEach(move => {
                if (this.#grid[move] === FEN_TO_INT_MAPPING['N']) {
                    attackers.push(move)
                }
            })
        }

        return attackers
    }
    
    isAttacked(idx: number): boolean {
        if (!this.#white_to_move) {
            if (this.#grid[idx - DIAGONAL_EAST] === FEN_TO_INT_MAPPING['P']) {
                return true
            }

            if (this.#grid[idx - DIAGONAL_WEST] === FEN_TO_INT_MAPPING['P']) {
                return true
            }
            
            for (let movement of KNIGHT_MOVES) {
                if (this.#grid[idx + movement] === FEN_TO_INT_MAPPING['N']) {
                    return true
                }
            }
            
            direction_loop:
            for (let direction of ROOK_DIRECTIONS) {
                for (let curr_idx = idx + direction; IS_IN_BOARD(curr_idx); curr_idx += direction) {
                    if (this.#grid[curr_idx] == FEN_TO_INT_MAPPING['R'] || this.#grid[curr_idx] == FEN_TO_INT_MAPPING['Q']) {
                        return true
                    } else if (this.#grid[curr_idx] > 0) {
                        continue direction_loop
                    }
                }
            }

            direction_loop:
            for (let direction of BISHOP_DIRECTIONS) {
                for (let curr_idx = idx + direction; IS_IN_BOARD(curr_idx); curr_idx += direction) {
                    if (this.#grid[curr_idx] == FEN_TO_INT_MAPPING['B'] || this.#grid[curr_idx] == FEN_TO_INT_MAPPING['Q']) {
                        return true
                    } else if (this.#grid[curr_idx] > 0) {
                        continue direction_loop
                    }
                }
            }

            for (let direction of KING_DIRECTIONS) {
                if (this.#grid[idx + direction] === FEN_TO_INT_MAPPING['K']) {
                    return true
                }
            }
        }

        return false
    }

    #computeValidMoves(): Map<number, number[]> {
        let all_valid_moves = new Map<number, number[]>
        // Seperate function for case Double Check
        // Seperate function for case Check
        // Seperate function for rest 

        // After check
        // if attackers < 2
        // - take
        // - Move away
        // - block
        // if attackers == 2
        // - move king
        let checker: number = -1

        if (!this.#white_to_move) {
            let attackers = this.findAttackers(this.#black_king_idx)

            if (attackers.length > 2) {
                let moves: number[] = []
                KING_DIRECTIONS.forEach((direction) => {
                    let curr_idx = this.#black_king_idx + direction

                    if (IS_EMPTY(this.#grid[curr_idx]) && !this.isAttacked(curr_idx)) {
                        moves.push(curr_idx)
                    } else if (IS_WHITE_PIECE(this.#grid[curr_idx]) && !this.isAttacked(curr_idx)) {
                        moves.push(curr_idx)
                    }
                })
                all_valid_moves.set(this.#black_king_idx, moves)
                return all_valid_moves
            } else {
                checker = attackers[0]
            }
        } else {
            let attackers = this.findAttackers(this.#white_king_idx)
        }


        X88_MAPPING.forEach((idx) => {
            let moves: number[] = []

            if (IS_EMPTY(this.#grid[idx])) {
                return
            }

            if (IS_BLACK_PIECE(this.#grid[idx]) && this.#white_to_move) {
                return
            }

            if (IS_WHITE_PIECE(this.#grid[idx]) && !this.#white_to_move) {
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['p']) {
                if (IS_EMPTY(this.#grid[idx - FORWARD])) {
                    moves.push(idx - FORWARD)

                    if (getRowX88(idx) == SEVENTH_RANK && IS_EMPTY(this.#grid[idx - FORWARD - FORWARD])) {
                        moves.push(idx - FORWARD - FORWARD)
                    }
                }

                if (IS_WHITE_PIECE(this.#grid[idx - 17])) {
                    moves.push(idx - 17)
                }
                if (IS_WHITE_PIECE(this.#grid[idx - 15])) {
                    moves.push(idx - 15)
                }

                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['P']) {
                if (IS_EMPTY(this.#grid[idx + FORWARD])) {
                    moves.push(idx + FORWARD)

                    if (getRowX88(idx) == SECOND_RANK && IS_EMPTY(this.#grid[idx + FORWARD + FORWARD])) {
                        moves.push(idx + FORWARD + FORWARD)
                    }
                }

                if (IS_BLACK_PIECE(this.#grid[idx + 17])) {
                    moves.push(idx + 17)
                }
                if (IS_BLACK_PIECE(this.#grid[idx + 15])) {
                    moves.push(idx + 15)
                }

                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['n']) {
                KNIGHT_MOVES.map(movement => idx - movement).forEach((move) => {
                    if (IS_EMPTY(this.#grid[move]) || IS_WHITE_PIECE(this.#grid[move])) {
                        moves.push(move)
                    }
                })

                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['N']) {
                KNIGHT_MOVES.map(movement => idx - movement).forEach((move) => {
                    if (IS_EMPTY(this.#grid[move]) || IS_BLACK_PIECE(this.#grid[move])) {
                        moves.push(move)
                    }
                })

                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['b']) {
                BISHOP_DIRECTIONS.forEach((direction) => {
                    for (let curr_idx = idx + direction; 0 <= curr_idx && curr_idx < 128; curr_idx += direction) {
                        if (IS_EMPTY(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                        } else if (IS_WHITE_PIECE(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                            break
                        } else {
                            break
                        }
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['B']) {
                BISHOP_DIRECTIONS.forEach((direction) => {
                    for (let curr_idx = idx + direction; 0 <= curr_idx && curr_idx < 128; curr_idx += direction) {
                        if (IS_EMPTY(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                        } else if (IS_BLACK_PIECE(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                            break
                        } else {
                            break
                        }
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['r']) {
                ROOK_DIRECTIONS.forEach((direction) => {
                    for (let curr_idx = idx + direction; 0 <= curr_idx && curr_idx < 128 && curr_idx % 16 < 8; curr_idx += direction) {
                        if (IS_EMPTY(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                        } else if (IS_WHITE_PIECE(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                            break
                        } else {
                            break
                        }
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['R']) {
                ROOK_DIRECTIONS.forEach((direction) => {
                    for (let curr_idx = idx + direction; 0 <= curr_idx && curr_idx < 128 && curr_idx % 16 < 8; curr_idx += direction) {
                        if (IS_EMPTY(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                        } else if (IS_BLACK_PIECE(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                            break
                        } else {
                            break
                        }
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['q']) {
                QUEEN_DIRECTIONS.forEach((direction) => {
                    for (let curr_idx = idx + direction; 0 <= curr_idx && curr_idx < 128 && curr_idx % 16 < 8; curr_idx += direction) {
                        if (IS_EMPTY(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                        } else if (IS_WHITE_PIECE(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                            break
                        } else {
                            break
                        }
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['Q']) {
                QUEEN_DIRECTIONS.forEach((direction) => {
                    for (let curr_idx = idx + direction; 0 <= curr_idx && curr_idx < 128 && curr_idx % 16 < 8; curr_idx += direction) {
                        if (IS_EMPTY(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                        } else if (IS_BLACK_PIECE(this.#grid[curr_idx])) {
                            moves.push(curr_idx)
                            break
                        } else {
                            break
                        }
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['k']) {
                KING_DIRECTIONS.forEach((direction) => {
                    let curr_idx = idx + direction

                    if (IS_EMPTY(this.#grid[curr_idx]) && !this.isAttacked(curr_idx)) {
                        moves.push(curr_idx)
                    } else if (IS_WHITE_PIECE(this.#grid[curr_idx]) && !this.isAttacked(curr_idx)) {
                        moves.push(curr_idx)
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

            if (this.#grid[idx] == FEN_TO_INT_MAPPING['K']) {
                KING_DIRECTIONS.forEach((direction) => {
                    let curr_idx = idx + direction

                    if (IS_EMPTY(this.#grid[curr_idx])) {
                        moves.push(curr_idx)
                    } else if (IS_BLACK_PIECE(this.#grid[curr_idx])) {
                        moves.push(curr_idx)
                    }
                })
                all_valid_moves.set(idx, moves)
                return
            }

        })

        return all_valid_moves
    }

    getSquare(x: number, y: number): string {
        return INT_TO_FEN_MAPPING[this.#grid[mapToX88(x, y)]]
    }

    setSquare(x: number, y: number, val: number) {
        return this.#grid[mapToX88(x, y)] = val
    }

    toString() {
        let res = ''
        for (let y = 0; y < 8; y++) {
            let row = ''

            for (let x = 0; x < 8; x++) {
                row += this.getSquare(x, y)
            }
            row += '\n'
            res += row
        }

        return res
    }
}

