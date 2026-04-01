function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = []
  const unvisitedNodes = getAllNodes(grid)
  startNode.distance = 0

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance)
    const closestNode = unvisitedNodes.shift()

    if (closestNode.isWall) continue
    if (closestNode.distance === Infinity) return { visitedNodesInOrder, shortestPath: [] }
    
    closestNode.isVisited = true
    visitedNodesInOrder.push(closestNode)

    if (closestNode === endNode) {
      return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(endNode) }
    }

    updateUnvisitedNeighbors(closestNode, grid)
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

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
  for (const unvisitedNeighbor of unvisitedNeighbors) {
    unvisitedNeighbor.distance = node.distance + 1
    unvisitedNeighbor.previousNode = node
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = []
  const { row, col } = node
  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
  return neighbors.filter(neighbor => !neighbor.isVisited)
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

export default dijkstra
