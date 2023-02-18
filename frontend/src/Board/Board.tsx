import "./Board.css"
import BlackBishop from "../assets/pieces/BlackBishop.tsx"

function Board() {
  let cells = []
  let cell_size = 20;
  let dims = 8;

  for (let r = 0; r < dims; r++) {
    let row = []
   
    for (let c = 0; c < dims; c++) {
      if ((r + c) % 2 == 0) {
        row.push(<div className="white-cell" style={{"width": cell_size, "height": cell_size}}><BlackBishop /></div>)
      } else {
        row.push(<div className="black-cell" style={{"width": cell_size, "height": cell_size}}></div>)
      }
    }

    cells.push(<div className="row" style={{"width": cell_size * dims, "height": cell_size}} key={r}>{row}</div>)
  } 
  
  return (
    <div>
      <div className="border" style={{"width": cell_size * dims * 1.1, "height": cell_size * dims * 1.1}}>
        {cells}
      </div>
    </div>
  )
}

export default Board;
