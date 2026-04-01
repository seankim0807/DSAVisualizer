import React from 'react'
import './Grid.css'

function Grid({ 
  grid, 
  setGrid, 
  startNode, 
  setStartNode, 
  endNode, 
  setEndNode,
  isAnimating 
}) {
  const [draggingType, setDraggingType] = React.useState(null) // 'wall', 'start', or 'end'

  const handleMouseDown = (e, row, col) => {
    if (isAnimating) return

    const cell = grid[row][col]
    
    if (cell.isStart) {
      setDraggingType('start')
    } else if (cell.isEnd) {
      setDraggingType('end')
    } else {
      setDraggingType('wall')
      toggleWall(row, col)
    }
  }

  const handleMouseEnter = (row, col) => {
    if (!draggingType) return
    
    if (draggingType === 'wall') {
      toggleWall(row, col)
    } else if (draggingType === 'start') {
      if (!grid[row][col].isEnd) {
        setStartNode({ row, col })
      }
    } else if (draggingType === 'end') {
      if (!grid[row][col].isStart) {
        setEndNode({ row, col })
      }
    }
  }

  const handleMouseUp = () => {
    setDraggingType(null)
  }

  const toggleWall = (row, col) => {
    const newGrid = grid.map(r => [...r])
    const cell = newGrid[row][col]
    
    if (cell.isStart || cell.isEnd) return
    
    cell.isWall = !cell.isWall
    setGrid(newGrid)
  }

  React.useEffect(() => {
    // Update grid when start/end nodes change
    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => ({
        ...cell,
        isStart: rIdx === startNode.row && cIdx === startNode.col,
        isEnd: rIdx === endNode.row && cIdx === endNode.col,
      }))
    )
    setGrid(newGrid)
  }, [startNode, endNode])

  return (
    <div 
      className="grid"
      onMouseLeave={handleMouseUp}
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`cell ${cell.isStart ? 'start' : ''} ${cell.isEnd ? 'end' : ''} ${cell.isWall ? 'wall' : ''} ${cell.isVisited ? 'visited' : ''} ${cell.isPath ? 'path' : ''}`}
              onMouseDown={(e) => handleMouseDown(e, rowIdx, colIdx)}
              onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
              onMouseUp={handleMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Grid
