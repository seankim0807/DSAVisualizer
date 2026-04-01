import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Grid from './components/Grid'
import WelcomeModal from './components/WelcomeModal'
import Toast from './components/Toast'
import './App.css'

function App() {
  const ROWS = 20
  const COLS = 50
  
  const [grid, setGrid] = useState([])
  const [startNode, setStartNode] = useState({ row: 10, col: 5 })
  const [endNode, setEndNode] = useState({ row: 10, col: 44 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [toast, setToast] = useState(null)

  // Initialize grid
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
      }))
    )
    setGrid(newGrid)
  }

  const resetGrid = () => {
    setIsAnimating(false)
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
    showToast('Path cleared!')
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleVisualize = async (algorithmName) => {
    if (isAnimating) return
    setIsAnimating(true)
    
    // Clear previous animations
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
    
    // Wait a bit for state update
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Get the algorithm
    const algorithm = (await import(`./algorithms/${algorithmName}`)).default
    
    // Get start and end nodes from grid
    const startNodeObj = clearedGrid[startNode.row][startNode.col]
    const endNodeObj = clearedGrid[endNode.row][endNode.col]
    
    // Run algorithm
    const { visitedNodesInOrder, shortestPath } = algorithm(clearedGrid, startNodeObj, endNodeObj)
    
    // Animate visited nodes
    for (const node of visitedNodesInOrder) {
      await new Promise(resolve => setTimeout(resolve, 10))
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r])
        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isVisited: true }
        return newGrid
      })
    }
    
    // Animate shortest path
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
    const { default: generateMaze } = await import('./algorithms/maze')
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

  return (
    <div className="app">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <Navbar 
        onVisualize={handleVisualize}
        onClearBoard={resetGrid}
        onClearPath={clearPath}
        onGenerateMaze={handleGenerateMaze}
        isAnimating={isAnimating}
      />
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
      {toast && <Toast message={toast} />}
    </div>
  )
}

export default App
