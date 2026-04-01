import React, { useState, useEffect } from 'react'
import Grid from '../components/Grid'
import './Page.css'

function PathfindingPage({ showToast }) {
  const ROWS = 20
  const COLS = 50
  const [grid, setGrid] = useState([])
  const [startNode, setStartNode] = useState({ row: 10, col: 5 })
  const [endNode, setEndNode] = useState({ row: 10, col: 44 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra')
  const [nodeCounter, setNodeCounter] = useState({ visited: 0, pathLength: 0 })

  useEffect(() => {
    initializeGrid()
  }, [])

  const initializeGrid = () => {
    const newGrid = Array.from({ length: ROWS }, (_, row) =>
      Array.from({ length: COLS }, (_, col) => ({
        row,
        col,
        isWall: false,
        isStart: row === startNode.row && col === startNode.col,
        isEnd: row === endNode.row && col === endNode.col,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        gScore: Infinity,
        fScore: Infinity,
        previousNode: null,
      }))
    )
    setGrid(newGrid)
  }

  const resetGrid = () => {
    setIsAnimating(false)
    setNodeCounter({ visited: 0, pathLength: 0 })
    initializeGrid()
    showToast('Board cleared!')
  }

  const clearPath = () => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false,
      }))
    )
    setGrid(newGrid)
    setNodeCounter({ visited: 0, pathLength: 0 })
    showToast('Path cleared!')
  }

  const handleVisualize = async (algorithmName) => {
    if (isAnimating) return
    setIsAnimating(true)
    setNodeCounter({ visited: 0, pathLength: 0 })

    const clearedGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        gScore: Infinity,
        fScore: Infinity,
        previousNode: null,
      }))
    )
    setGrid(clearedGrid)

    await new Promise(resolve => setTimeout(resolve, 50))

    const algorithm = (await import(`../algorithms/pathfinding/${algorithmName}`)).default
    const startNodeObj = clearedGrid[startNode.row][startNode.col]
    const endNodeObj = clearedGrid[endNode.row][endNode.col]

    const { visitedNodesInOrder, shortestPath } = algorithm(clearedGrid, startNodeObj, endNodeObj)
    setNodeCounter(prev => ({ ...prev, visited: visitedNodesInOrder.length, pathLength: shortestPath.length }))

    for (const node of visitedNodesInOrder) {
      await new Promise(resolve => setTimeout(resolve, 10))
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r])
        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isVisited: true }
        return newGrid
      })
    }

    for (const node of shortestPath) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r])
        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isPath: true }
        return newGrid
      })
    }

    setIsAnimating(false)
  }

  const handleGenerateMaze = async () => {
    setIsAnimating(true)
    const { default: generateMaze } = await import('../algorithms/pathfinding/maze')
    const walls = generateMaze(grid)

    for (const wall of walls) {
      await new Promise(resolve => setTimeout(resolve, 5))
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r])
        newGrid[wall.row][wall.col] = { ...newGrid[wall.row][wall.col], isWall: true }
        return newGrid
      })
    }

    setIsAnimating(false)
    showToast('Maze generated!')
  }

  const algorithmInfo = {
    dijkstra: { name: "Dijkstra's", guarantees: true },
    astar: { name: "A*", guarantees: true },
    bfs: { name: "BFS", guarantees: true },
    dfs: { name: "DFS", guarantees: false },
    greedy: { name: "Greedy Best First", guarantees: false },
  }

  return (
    <div className="page pathfinding-page">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="algo-select">Algorithm:</label>
          <select
            id="algo-select"
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isAnimating}
          >
            {Object.entries(algorithmInfo).map(([key, info]) => (
              <option key={key} value={key}>
                {info.name} {info.guarantees ? '✓' : '(no guarantee)'}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => handleVisualize(selectedAlgorithm)}
          disabled={isAnimating}
        >
          {isAnimating ? 'Visualizing...' : 'Visualize'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleGenerateMaze}
          disabled={isAnimating}
        >
          Generate Maze
        </button>

        <button
          className="btn btn-secondary"
          onClick={clearPath}
          disabled={isAnimating}
        >
          Clear Path
        </button>

        <button
          className="btn btn-danger"
          onClick={resetGrid}
          disabled={isAnimating}
        >
          Clear Board
        </button>
      </div>

      <div className="grid-container">
        <Grid
          grid={grid}
          setGrid={setGrid}
          startNode={startNode}
          setStartNode={setStartNode}
          endNode={endNode}
          setEndNode={setEndNode}
          isAnimating={isAnimating}
        />
      </div>

      {nodeCounter.visited > 0 && (
        <div className="counter">
          <span>Nodes visited: {nodeCounter.visited}</span>
          <span>Path length: {nodeCounter.pathLength}</span>
        </div>
      )}
    </div>
  )
}

export default PathfindingPage
