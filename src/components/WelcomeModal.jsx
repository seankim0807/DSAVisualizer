import React, { useState, useEffect } from 'react'
import './WelcomeModal.css'

function WelcomeModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  return (
    <>
      {isVisible && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>×</button>
            <h2>Welcome to Pathfinding Visualizer</h2>
            <div className="modal-content">
              <div className="instruction">
                <h3>How to Use:</h3>
                <ul>
                  <li><strong>Drag the green node</strong> to set the start position</li>
                  <li><strong>Drag the red node</strong> to set the end position</li>
                  <li><strong>Click and drag</strong> to draw walls (white cells)</li>
                  <li>Select an algorithm from the dropdown</li>
                  <li>Click <strong>Visualize</strong> to see the algorithm in action</li>
                  <li>Use <strong>Generate Maze</strong> to create random maze patterns</li>
                  <li><strong>Clear Path</strong> removes animation but keeps walls</li>
                  <li><strong>Clear Board</strong> resets everything</li>
                </ul>
              </div>
              <div className="algorithms-info">
                <h3>Algorithms:</h3>
                <p><strong>Dijkstra's:</strong> Guarantees shortest path, explores equally in all directions</p>
                <p><strong>A*:</strong> Guarantees shortest path, faster than Dijkstra using heuristics</p>
                <p><strong>BFS:</strong> Guarantees shortest path in unweighted grids, simple and fast</p>
              </div>
            </div>
            <button className="modal-button" onClick={handleClose}>Got it!</button>
          </div>
        </div>
      )}
    </>
  )
}

export default WelcomeModal
