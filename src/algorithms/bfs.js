function bfs(grid, startNode, endNode) {
  // Initialize all nodes
  const allNodes = getAllNodes(grid)
  for (const node of allNodes) {
    node.previousNode = null
    node.isVisited = false
  }

  const visitedNodesInOrder = []
  const queue = [startNode]
  const visited = new Set()
  visited.add(startNode)
  startNode.previousNode = null

  while (queue.length > 0) {
    const current = queue.shift()
    current.isVisited = true
    visitedNodesInOrder.push(current)

    if (current === endNode) {
      return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(endNode) }
    }

    const neighbors = getNeighbors(current, grid)
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !neighbor.isWall) {
        visited.add(neighbor)
        neighbor.previousNode = current
        queue.push(neighbor)
      }
    }
  }

  return { visitedNodesInOrder, shortestPath: [] }
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

export default bfs
