const valid_fen_pieces = "BbKkNnPpQqRr"
const black_pieces = "bknpqr"
const white_pieces = "BKNPQR"

export function isNumeric(num: any) {
  return (
    (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') &&
    !isNaN(num as number)
  );
}

export function copyGameState(gameState) {
  return ({
    "grid": gameState.grid,
    "white_to_move": gameState.white_to_move,
    "black_castle_kingside": gameState.black_castle_kingside,
    "black_castle_queenside": gameState.black_castle_queenside,
    "white_castle_kingside": gameState.white_castle_kingside,
    "white_castle_queenside": gameState.white_castle_queenside,
    "en_passant_possible": gameState.en_passant_possible,
    "half_move_number": gameState.half_move_number,
    "full_move_number": gameState.full_move_number,
  })
}

export function validateMove(gameState, currR, currC, targetR, targetC) {
  //TODO: pins
  //TODO: check
  // Check detection + contraints
  let piece = gameState.grid[currR][currC]

  if (!((gameState.white_to_move && white_pieces.includes(piece)) || (!gameState.white_to_move && black_pieces.includes(piece)))) {
    return false
  }

  if (piece == 'P') {
    // Todo: en passent

    // Forward move
    if  (targetC == currC && !gameState.grid[currR-1][currC] && (targetR == currR - 1 || (currR == 6 && targetR == 4))) {
      return true
    }
 
    // Capture left
    if (targetC == currC+1 && targetR == currR-1 && black_pieces.includes(gameState.grid[currR-1][currC+1])) {
      return true
    }
    
    // Capture right
    if (targetC == currC-1 && targetR == currR-1 && black_pieces.includes(gameState.grid[currR-1][currC-1])) {
      return true
    }

    return false
  }

  if (piece == 'p') {
    // TODO: en passent

    // Forward move
    if  (targetC == currC && !gameState.grid[currR+1][currC] && (targetR == currR + 1 || (currR == 1 && targetR == 3))) {
      return true
    }

    // Capture left
    if (targetC == currC+1 && targetR == currR+1 && white_pieces.includes(gameState.grid[currR+1][currC+1])) {
      return true
    }
    
    // Capture right
    if (targetC == currC-1 && targetR == currR+1 && white_pieces.includes(gameState.grid[currR+1][currC-1])) {
      return true
    }

    return false
  }

  if (piece == 'B' || piece == 'b') {
    let opponent_pieces = piece == 'B' ? black_pieces : white_pieces

    if (targetR == currR && targetC == currC) {
      return false
    }

    // In diagonal
    if (!(Math.abs(targetR - currR) == Math.abs(targetC - currC))) {
      return false
    }

    let row
    let col
    let delta_row = targetR - currR < 0 ? -1 : 1
    let delta_col = targetC - currC < 0 ? -1 : 1

    for(row = currR + delta_row, col = currC + delta_col; col != targetC && 0 <= col && col < 8 && 0 <= row && row < 8; row += delta_row, col += delta_col) {
      if (row == targetR && col == targetC && opponent_pieces.includes(gameState.grid[row][col])) {
        return true
      } else if (gameState.grid[row][col]) {
        return false
      }
    }
   
    if (!gameState.grid[row][col]) {
      return true
    } else if (opponent_pieces.includes(gameState.grid[row][col])) {
      return true
    }

    return false
  }

  if (piece == 'N' || piece == 'n') {
    let player_pieces = piece == 'N' ? white_pieces : black_pieces
    const dr = targetR - currR
    const dc = targetC - currC

    if (!((Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2))) {
      return false
    }

    if (player_pieces.includes(gameState.grid[targetR][targetC])) {
      return false
    }

    return true
  }
 
  if (piece == 'R' || piece == 'r') {
    let opponent_pieces = piece == 'R' ? black_pieces : white_pieces

    if (!((targetC == currC && targetR != currR) || targetC != currC && targetR == currR)) {
      return false
    }

    let row
    let col
    let delta_row = targetR - currR > 0 ? 1 : targetR - currR == 0 ? 0 : -1
    let delta_col = targetC - currC > 0 ? 1 : targetC - currC == 0 ? 0 : -1

    for(row = currR + delta_row, col = currC + delta_col; col != targetC && row != targetR && 0 <= col && col < 8 && 0 <= row && row < 8; row += delta_row, col += delta_col) {
      if (row == targetR && col == targetC && opponent_pieces.includes(gameState.grid[row][col])) {
        return true
      } else if (gameState.grid[row][col]) {
        return false
      }
    }
   
    if (!gameState.grid[row][col]) {
      return true
    } else if (opponent_pieces.includes(gameState.grid[row][col])) {
      return true
    }

    return false
  }

  return false
}

export function makeMove(gameState, currR, currC, targetR, targetC) {
  let newGameState = copyGameState(gameState)
  let piece = newGameState.grid[currR][currC]

  newGameState.half_move_number += 1
  newGameState.white_to_move = gameState.white_to_move ? false : true
  newGameState.grid[currR][currC] = null
  newGameState.grid[targetR][targetC] = piece

  return newGameState
}

export function initGameState(fen) {
  //TODO: En passant square
  let s: string[] = fen.split(" ");

  if (s.length < 6) {
    throw new Error("Invalid fen.");
  }

  let ranks: string[] = s[0].split("/");
  let grid = [];
  
  for (let r = 0; r < ranks.length; r++) {
    let row: string[] = [];

    for (let i = 0; i < ranks[r].length; i++) {
      if (isNumeric(ranks[r][i])) {
        for (let c = 0; c < parseInt(ranks[r][i], 10); c++) {
          row.push(null);
        }
      } else {
        if (valid_fen_pieces.includes(ranks[r][i])) {
          row.push(ranks[r][i]); 
        } else {
          throw new Error(`Invalid characters in fen: ${ranks[r][i]}.`);
        }
      }
    }

    if (row.length < 8) {
      throw new Error("Invalid board dimensions in fen.");
    } else {
      grid.push(row);
    }
  }

  if (grid.length < 8) {
    throw new Error("Invalid board dimensions in fen.");
  }
  
  return ({
    "grid": grid,
    "white_to_move": s[1] == "w",
    "black_castle_kingside": s[2].includes("k"),
    "black_castle_queenside": s[2].includes("q"),
    "white_castle_kingside": s[2].includes("K"),
    "white_castle_queenside": s[2].includes("Q"),
    "en_passant_possible": s[3] != '-',
    "half_move_number": parseInt(s[4], 10),
    "full_move_number": parseInt(s[5], 10),
  })
}
