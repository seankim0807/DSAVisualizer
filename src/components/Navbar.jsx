import React, { useState } from 'react'
import './Navbar.css'

function Navbar({ 
  onVisualize, 
  onClearBoard, 
  onClearPath,
  onGenerateMaze,
  isAnimating 
}) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra')

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h1 className="title">Pathfinding Visualizer</h1>
        </div>

        <div className="navbar-center">
          <div className="control-group">
            <label htmlFor="algorithm-select">Algorithm:</label>
            <select 
              id="algorithm-select"
              value={selectedAlgorithm} 
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              disabled={isAnimating}
            >
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="astar">A* Algorithm</option>
              <option value="bfs">Breadth First Search</option>
            </select>
          </div>

          <button 
            className="btn btn-visualize"
            onClick={() => onVisualize(selectedAlgorithm)}
            disabled={isAnimating}
          >
            {isAnimating ? 'Visualizing...' : 'Visualize'}
          </button>

          <button 
            className="btn btn-secondary"
            onClick={onGenerateMaze}
            disabled={isAnimating}
          >
            Generate Maze
          </button>

          <button 
            className="btn btn-secondary"
            onClick={onClearPath}
            disabled={isAnimating}
          >
            Clear Path
          </button>

          <button 
            className="btn btn-danger"
            onClick={onClearBoard}
            disabled={isAnimating}
          >
            Clear Board
          </button>
        </div>

        <div className="navbar-right">
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color start"></div>
              <span>Start</span>
            </div>
            <div className="legend-item">
              <div className="legend-color end"></div>
              <span>End</span>
            </div>
            <div className="legend-item">
              <div className="legend-color wall"></div>
              <span>Wall</span>
            </div>
            <div className="legend-item">
              <div className="legend-color visited"></div>
              <span>Visited</span>
            </div>
            <div className="legend-item">
              <div className="legend-color path"></div>
              <span>Path</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
