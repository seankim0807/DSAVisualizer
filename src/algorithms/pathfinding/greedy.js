function greedyBestFirst(grid, startNode, endNode) {
  // Initialize all nodes
  const allNodes = getAllNodes(grid)
  for (const node of allNodes) {
    node.previousNode = null
    node.isVisited = false
    node.hScore = Infinity
  }

  const visitedNodesInOrder = []
  const openSet = [startNode]
  startNode.hScore = heuristic(startNode, endNode)

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.hScore - b.hScore)
    const current = openSet.shift()

    if (current.isWall) continue
    if (current.isVisited) continue

    current.isVisited = true
    visitedNodesInOrder.push(current)

    if (current === endNode) {
      return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(endNode) }
    }

    const neighbors = getNeighbors(current, grid)
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = current
        neighbor.hScore = heuristic(neighbor, endNode)

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor)
        }
      }
    }
  }

  return { visitedNodesInOrder, shortestPath: [] }
}

function heuristic(nodeA, nodeB) {
  const dx = Math.abs(nodeA.row - nodeB.row)
  const dy = Math.abs(nodeA.col - nodeB.col)
  return dx + dy
}

function getAllNodes(grid) {
  const nodes = []
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node)
    }
  }
  return nodes
}

function getNeighbors(node, grid) {
  const neighbors = []
  const { row, col } = node
  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
  return neighbors
}

function getNodesInShortestPathOrder(endNode) {
  const nodesInShortestPathOrder = []
  let currentNode = endNode
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode)
    currentNode = currentNode.previousNode
  }
  return nodesInShortestPathOrder
}

export default greedyBestFirst
