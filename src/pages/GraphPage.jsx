import React, { useState, useRef, useCallback } from 'react'
import './Page.css'

const NODE_R = 20
let nextId = 0

function GraphPage({ showToast }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState(new Set())
  const [currentNode, setCurrentNode] = useState(null)
  const [traversalOrder, setTraversalOrder] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [mode, setMode] = useState('add') // 'add' | 'edge' | 'delete'
  const svgRef = useRef(null)
  const nodesRef = useRef([])
  const edgesRef = useRef([])

  const delay = (ms) => new Promise(r => setTimeout(r, ms))

  const getSVGCoords = (e) => {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleSVGClick = (e) => {
    if (isAnimating) return
    if (e.target !== svgRef.current) return
    if (mode !== 'add') return

    const { x, y } = getSVGCoords(e)
    const id = nextId++
    const newNode = { id, x, y }
    const updated = [...nodesRef.current, newNode]
    nodesRef.current = updated
    setNodes([...updated])
    setSelectedNode(null)
  }

  const handleNodeClick = (e, id) => {
    e.stopPropagation()
    if (isAnimating) return

    if (mode === 'delete') {
      nodesRef.current = nodesRef.current.filter(n => n.id !== id)
      edgesRef.current = edgesRef.current.filter(e => e.from !== id && e.to !== id)
      setNodes([...nodesRef.current])
      setEdges([...edgesRef.current])
      setSelectedNode(null)
      return
    }

    if (mode === 'edge') {
      if (selectedNode === null) {
        setSelectedNode(id)
      } else if (selectedNode === id) {
        setSelectedNode(null)
      } else {
        const exists = edgesRef.current.some(
          e => (e.from === selectedNode && e.to === id) || (e.from === id && e.to === selectedNode)
        )
        if (!exists) {
          const newEdge = { from: selectedNode, to: id }
          const updated = [...edgesRef.current, newEdge]
          edgesRef.current = updated
          setEdges([...updated])
        }
        setSelectedNode(null)
      }
      return
    }

    // add mode — just select
    setSelectedNode(prev => prev === id ? null : id)
  }

  const buildAdjacency = () => {
    const adj = {}
    nodesRef.current.forEach(n => { adj[n.id] = [] })
    edgesRef.current.forEach(e => {
      adj[e.from].push(e.to)
      adj[e.to].push(e.from)
    })
    return adj
  }

  const runBFS = async () => {
    if (nodesRef.current.length === 0) { showToast('Add some nodes first'); return }
    setIsAnimating(true)
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalOrder([])

    const startId = nodesRef.current[0].id
    const adj = buildAdjacency()
    const visited = new Set()
    const queue = [startId]
    const order = []
    visited.add(startId)

    while (queue.length > 0) {
      const node = queue.shift()
      setCurrentNode(node)
      await delay(600)
      order.push(node)
      setVisitedNodes(new Set(visited))
      setTraversalOrder([...order])

      for (const neighbor of (adj[node] || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    setCurrentNode(null)
    setIsAnimating(false)
    showToast(`BFS complete — visited ${order.length} nodes`)
  }

  const runDFS = async () => {
    if (nodesRef.current.length === 0) { showToast('Add some nodes first'); return }
    setIsAnimating(true)
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalOrder([])

    const startId = nodesRef.current[0].id
    const adj = buildAdjacency()
    const visited = new Set()
    const order = []

    const dfs = async (node) => {
      visited.add(node)
      setCurrentNode(node)
      setVisitedNodes(new Set(visited))
      await delay(600)
      order.push(node)
      setTraversalOrder([...order])

      for (const neighbor of (adj[node] || [])) {
        if (!visited.has(neighbor)) {
          await dfs(neighbor)
        }
      }
    }

    await dfs(startId)
    setCurrentNode(null)
    setIsAnimating(false)
    showToast(`DFS complete — visited ${order.length} nodes`)
  }

  const reset = () => {
    if (isAnimating) return
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalOrder([])
    setSelectedNode(null)
  }

  const clearAll = () => {
    if (isAnimating) return
    nodesRef.current = []
    edgesRef.current = []
    setNodes([])
    setEdges([])
    setVisitedNodes(new Set())
    setCurrentNode(null)
    setTraversalOrder([])
    setSelectedNode(null)
  }

  const generateRandom = () => {
    if (isAnimating) return
    clearAll()
    const count = 7
    const newNodes = []
    const svgW = svgRef.current?.clientWidth || 700
    const svgH = svgRef.current?.clientHeight || 400

    for (let i = 0; i < count; i++) {
      newNodes.push({
        id: nextId++,
        x: 80 + Math.random() * (svgW - 160),
        y: 60 + Math.random() * (svgH - 120),
      })
    }

    const newEdges = []
    // Connect each node to at least one neighbor to ensure connectivity
    for (let i = 1; i < newNodes.length; i++) {
      const from = newNodes[Math.floor(Math.random() * i)].id
      newEdges.push({ from, to: newNodes[i].id })
    }
    // Add a few extra random edges
    for (let i = 0; i < 3; i++) {
      const a = newNodes[Math.floor(Math.random() * count)]
      const b = newNodes[Math.floor(Math.random() * count)]
      if (a.id !== b.id && !newEdges.some(e =>
        (e.from === a.id && e.to === b.id) || (e.from === b.id && e.to === a.id)
      )) {
        newEdges.push({ from: a.id, to: b.id })
      }
    }

    nodesRef.current = newNodes
    edgesRef.current = newEdges
    setNodes([...newNodes])
    setEdges([...newEdges])
    showToast('Generated random graph')
  }

  const getNodeColor = (id) => {
    if (id === currentNode) return '#ffaa00'
    if (visitedNodes.has(id)) return '#00ff88'
    if (id === selectedNode) return '#00d4ff'
    return '#9c88ff'
  }

  const getNodeLabel = (id) => {
    const idx = nodesRef.current.findIndex(n => n.id === id)
    return String.fromCharCode(65 + (idx % 26))
  }

  const modeLabel = mode === 'add' ? 'Click canvas to add nodes'
    : mode === 'edge' ? selectedNode !== null ? 'Now click a second node to connect' : 'Click a node to start an edge'
    : 'Click a node to delete it'

  return (
    <div className="page graph-page">
      <div className="controls">
        <div className="control-group">
          <label>Mode:</label>
          <select value={mode} onChange={e => { setMode(e.target.value); setSelectedNode(null) }} disabled={isAnimating}>
            <option value="add">Add Nodes</option>
            <option value="edge">Add Edges</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={runBFS} disabled={isAnimating || nodes.length === 0}>
          BFS
        </button>

        <button className="btn btn-primary" onClick={runDFS} disabled={isAnimating || nodes.length === 0}>
          DFS
        </button>

        <button className="btn btn-secondary" onClick={reset} disabled={isAnimating}>
          Reset Colors
        </button>

        <button className="btn btn-secondary" onClick={generateRandom} disabled={isAnimating}>
          Random Graph
        </button>

        <button className="btn btn-danger" onClick={clearAll} disabled={isAnimating}>
          Clear
        </button>

        <div className="control-group" style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {modeLabel}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
        <div style={{
          flex: 1,
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          position: 'relative',
          cursor: mode === 'add' ? 'crosshair' : 'default',
        }}>
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🕸️</div>
              <div style={{ fontSize: '15px' }}>Click the canvas to add nodes, then switch to Edge mode to connect them</div>
            </div>
          )}
          <svg
            ref={svgRef}
            width="100%" height="100%"
            onClick={handleSVGClick}
            style={{ display: 'block' }}
          >
            {edges.map((e, i) => {
              const from = nodes.find(n => n.id === e.from)
              const to = nodes.find(n => n.id === e.to)
              if (!from || !to) return null
              return (
                <line key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke="var(--border-light)" strokeWidth="2.5"
                />
              )
            })}
            {nodes.map(node => (
              <g key={node.id} onClick={e => handleNodeClick(e, node.id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={node.x} cy={node.y} r={NODE_R}
                  fill={getNodeColor(node.id)}
                  stroke={node.id === selectedNode ? '#ffffff' : 'transparent'}
                  strokeWidth="3"
                  style={{ transition: 'fill 0.3s' }}
                />
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill="var(--bg-primary)" fontSize="14" fontWeight="700"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {getNodeLabel(node.id)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {traversalOrder.length > 0 && (
          <div style={{
            padding: '10px 16px',
            background: 'var(--bg-secondary)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            flexShrink: 0,
            fontSize: '13px',
          }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Traversal Order: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>
              {traversalOrder.map(id => getNodeLabel(id)).join(' → ')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default GraphPage
