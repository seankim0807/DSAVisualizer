import React, { useState } from 'react'
import './Page.css'
import './AboutPage.css'

const sections = [
  {
    id: 'pathfinding',
    icon: '🗺️',
    title: 'Pathfinding',
    color: '#00d4ff',
    desc: 'Watch algorithms navigate a grid from a start node to an end node in real time.',
    how: [
      'Drag the green node to move the start position',
      'Drag the red node to move the end position',
      'Click and drag on the grid to draw walls',
      'Select an algorithm from the dropdown',
      'Click Visualize to run it',
      'Use Generate Maze to create a random maze',
      'Clear Path removes animation but keeps walls',
      'Clear Board resets everything',
    ],
    algos: [
      { name: "Dijkstra's", desc: 'Guarantees shortest path. Explores equally in all directions.' },
      { name: 'A*', desc: 'Guarantees shortest path. Faster than Dijkstra using Manhattan distance heuristic.' },
      { name: 'BFS', desc: 'Guarantees shortest path on unweighted grids. Simple and efficient.' },
      { name: 'DFS', desc: 'Does not guarantee shortest path. Explores depth-first.' },
      { name: 'Greedy Best First', desc: 'Fast but does not guarantee shortest path. Uses heuristic only.' },
    ],
  },
  {
    id: 'sorting',
    icon: '📊',
    title: 'Sorting',
    color: '#9c88ff',
    desc: 'Visualize sorting algorithms on a bar chart with color-coded comparisons and swaps.',
    how: [
      'Click Generate New Array to create a random array',
      'Select an algorithm from the dropdown',
      'Adjust speed with the Speed selector',
      'Click Sort to start the animation',
      'Yellow = comparing, Red = swapping, Green = sorted',
    ],
    algos: [
      { name: 'Bubble Sort', desc: 'O(n²) — repeatedly swaps adjacent elements out of order.' },
      { name: 'Selection Sort', desc: 'O(n²) — finds the minimum and places it at the front each pass.' },
      { name: 'Insertion Sort', desc: 'O(n²) avg, O(n) best — builds a sorted array one element at a time.' },
      { name: 'Merge Sort', desc: 'O(n log n) — divide and conquer, stable sort.' },
      { name: 'Quick Sort', desc: 'O(n log n) avg — in-place divide and conquer with a pivot.' },
    ],
  },
  {
    id: 'tree',
    icon: '🌳',
    title: 'Binary Search Tree',
    color: '#00ff88',
    desc: 'Build a BST interactively and watch insert, delete, search, and traversal animate node by node.',
    how: [
      'Type a number (0–999) into the input field',
      'Click Insert to add the value to the tree',
      'Click Delete to remove a value',
      'Click Search to highlight the search path',
      'Use Inorder / Preorder / Postorder to animate traversals',
      'Click Generate Random to build a random tree with 10 nodes',
    ],
    algos: [
      { name: 'Inorder', desc: 'Left → Root → Right. Produces sorted output for a BST.' },
      { name: 'Preorder', desc: 'Root → Left → Right. Useful for copying a tree.' },
      { name: 'Postorder', desc: 'Left → Right → Root. Useful for deleting a tree.' },
    ],
  },
  {
    id: 'heap',
    icon: '🏔️',
    title: 'Heap',
    color: '#ffaa00',
    desc: 'Visualize a Min or Max heap as both a tree and an array, with animated bubble-up and bubble-down.',
    how: [
      'Choose Min Heap or Max Heap from the dropdown',
      'Type a value and click Insert (or press Enter)',
      'Watch the value bubble up to restore the heap property',
      'Click Extract Min/Max to remove the root',
      'Watch the new root bubble down',
      'Click Random to generate a valid heap with 8 values',
      'Blue = root, Purple = regular node, Yellow = comparing, Red = swapping',
    ],
    algos: [
      { name: 'Insert + Bubble Up', desc: 'Add to end, then swap upward until heap property is restored. O(log n).' },
      { name: 'Extract + Bubble Down', desc: 'Remove root, move last element to top, swap downward. O(log n).' },
    ],
  },
  {
    id: 'graph',
    icon: '🕸️',
    title: 'Graph Traversal',
    color: '#ff6b9d',
    desc: 'Build a custom graph by adding nodes and edges, then run BFS or DFS to watch the traversal animate.',
    how: [
      'Select Add Nodes mode and click the canvas to place nodes',
      'Select Add Edges mode, click one node then another to connect them',
      'Select Delete mode and click any node to remove it (and its edges)',
      'Click BFS to run Breadth-First Search starting from the first node',
      'Click DFS to run Depth-First Search starting from the first node',
      'Yellow = currently visiting, Green = visited',
      'The traversal order is shown below the graph',
      'Click Random Graph to generate a connected example graph',
    ],
    algos: [
      { name: 'BFS', desc: 'Explores all neighbors at the current depth before moving deeper. Uses a queue.' },
      { name: 'DFS', desc: 'Explores as far as possible along each branch before backtracking. Uses recursion.' },
    ],
  },
]

export default function AboutPage() {
  const [active, setActive] = useState('pathfinding')
  const section = sections.find(s => s.id === active)

  return (
    <div className="page about-page">
      <div className="about-layout">
        <aside className="about-sidebar">
          <div className="about-header">
            <h2>DSAVisualizer</h2>
            <p>Interactive algorithm &amp; data structure visualizations. Pick a section to learn how it works.</p>
          </div>
          <nav className="about-nav">
            {sections.map(s => (
              <button
                key={s.id}
                className={`about-nav-btn ${active === s.id ? 'active' : ''}`}
                onClick={() => setActive(s.id)}
                style={{ '--section-color': s.color }}
              >
                <span className="about-nav-icon">{s.icon}</span>
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        <div className="about-content">
          <div className="about-section-header" style={{ borderColor: section.color }}>
            <span className="about-section-icon">{section.icon}</span>
            <div>
              <h3 style={{ color: section.color }}>{section.title}</h3>
              <p>{section.desc}</p>
            </div>
          </div>

          <div className="about-body">
            <div className="about-card">
              <h4>How to Use</h4>
              <ol className="about-steps">
                {section.how.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="about-card">
              <h4>{section.algos.length > 1 ? 'Algorithms / Operations' : 'Operations'}</h4>
              <div className="about-algos">
                {section.algos.map((a, i) => (
                  <div key={i} className="about-algo-item">
                    <span className="about-algo-name" style={{ color: section.color }}>{a.name}</span>
                    <span className="about-algo-desc">{a.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
