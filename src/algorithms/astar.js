function astar(grid, startNode, endNode) {
  // Initialize all nodes
  const allNodes = getAllNodes(grid)
  for (const node of allNodes) {
    node.gScore = Infinity
    node.fScore = Infinity
    node.previousNode = null
    node.isVisited = false
  }

  const visitedNodesInOrder = []
  const openSet = [startNode]
  startNode.gScore = 0
  startNode.fScore = heuristic(startNode, endNode)

  while (openSet.length > 0) {
    let current = openSet[0]
    let currentIndex = 0

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].fScore < current.fScore) {
        current = openSet[i]
        currentIndex = i
      }
    }

    if (current === endNode) {
      return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(endNode) }
    }

    openSet.splice(currentIndex, 1)
    current.isVisited = true
    visitedNodesInOrder.push(current)

    const neighbors = getUnvisitedNeighbors(current, grid)
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue

      const tentativeGScore = current.gScore + 1
      if (tentativeGScore < (neighbor.gScore || Infinity)) {
        neighbor.previousNode = current
        neighbor.gScore = tentativeGScore
        neighbor.fScore = tentativeGScore + heuristic(neighbor, endNode)

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
  return dx + dy // Manhattan distance
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

function getUnvisitedNeighbors(node, grid) {
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

export default astar
