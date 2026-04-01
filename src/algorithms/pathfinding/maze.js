function generateMaze(grid) {
  const ROWS = grid.length
  const COLS = grid[0].length
  const walls = []

  // Initialize all cells as walls
  const maze = Array.from({ length: ROWS }, () => Array(COLS).fill(true))

  // Carve starting point
  const startRow = Math.floor(Math.random() * (ROWS / 2)) * 2 + 1
  const startCol = Math.floor(Math.random() * (COLS / 2)) * 2 + 1
  maze[startRow][startCol] = false

  // Recursive division
  function divide(top, left, height, width) {
    if (height < 3 || width < 3) return

    const horizontal = Math.random() > 0.5
    let wall

    if (horizontal) {
      wall = Math.floor(Math.random() * (height / 2)) * 2 + top + 1
      for (let col = left; col < left + width; col++) {
        if (maze[wall][col]) {
          walls.push({ row: wall, col })
          maze[wall][col] = true
        }
      }

      const passage = Math.floor(Math.random() * (width / 2)) * 2 + left
      maze[wall][passage] = false

      divide(top, left, wall - top, width)
      divide(wall + 1, left, top + height - wall - 1, width)
    } else {
      wall = Math.floor(Math.random() * (width / 2)) * 2 + left + 1
      for (let row = top; row < top + height; row++) {
        if (maze[row][wall]) {
          walls.push({ row, col: wall })
          maze[row][wall] = true
        }
      }

      const passage = Math.floor(Math.random() * (height / 2)) * 2 + top
      maze[passage][wall] = false

      divide(top, left, height, wall - left)
      divide(top, wall + 1, height, left + width - wall - 1)
    }
  }

  divide(0, 0, ROWS, COLS)

  return walls
}

export default generateMaze
