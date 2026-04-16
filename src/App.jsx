import React, { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import WelcomeModal from './components/WelcomeModal'
import Toast from './components/Toast'
import AIPanel from './components/AIPanel/AIPanel'
import PathfindingPage from './pages/PathfindingPage'
import SortingPage from './pages/SortingPage'
import TreePage from './pages/TreePage'
import HeapPage from './pages/HeapPage'
import GraphPage from './pages/GraphPage'
import LinkedListPage from './pages/LinkedListPage'
import StackQueuePage from './pages/StackQueuePage'
import BinarySearchPage from './pages/BinarySearchPage'
import AboutPage from './pages/AboutPage'
import './App.css'

// Default algorithm names shown in AI panel when switching tabs
const TAB_DEFAULT_ALGORITHMS = {
  pathfinding: "Dijkstra's Algorithm",
  sorting: 'Bubble Sort',
  tree: 'Binary Search Tree',
  heap: 'Heap Data Structure',
  graph: 'Breadth-First Search (BFS)',
  linkedlist: 'Linked List',
  stackqueue: 'Stack & Queue',
  binarysearch: 'Binary Search',
  about: null,
}

function App() {
  const [activeTab, setActiveTab] = useState('pathfinding')
  const [showWelcome, setShowWelcome] = useState(true)
  const [toast, setToast] = useState(null)
  const [currentAlgorithm, setCurrentAlgorithm] = useState("Dijkstra's Algorithm")
  const [vizStatus, setVizStatus] = useState('idle')

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setVizStatus('idle')
    const defaultAlgo = TAB_DEFAULT_ALGORITHMS[tabId]
    if (defaultAlgo) setCurrentAlgorithm(defaultAlgo)
  }

  const handleAlgorithmChange = useCallback((name) => {
    setCurrentAlgorithm(name)
  }, [])

  const handleVizStatusChange = useCallback((status) => {
    setVizStatus(status)
  }, [])

  const tabs = [
    { id: 'pathfinding', label: 'Pathfinding' },
    { id: 'sorting', label: 'Sorting' },
    { id: 'tree', label: 'Tree' },
    { id: 'heap', label: 'Heap' },
    { id: 'graph', label: 'Graph' },
    { id: 'linkedlist', label: 'Linked List' },
    { id: 'stackqueue', label: 'Stack & Queue' },
    { id: 'binarysearch', label: 'Binary Search' },
    { id: 'about', label: 'About' },
  ]

  const renderPage = () => {
    switch (activeTab) {
      case 'pathfinding':
        return (
          <PathfindingPage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'sorting':
        return (
          <SortingPage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'tree':
        return (
          <TreePage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'heap':
        return (
          <HeapPage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'graph':
        return (
          <GraphPage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'linkedlist':
        return (
          <LinkedListPage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'stackqueue':
        return (
          <StackQueuePage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'binarysearch':
        return (
          <BinarySearchPage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
      case 'about':
        return <AboutPage />
      default:
        return (
          <PathfindingPage
            showToast={showToast}
            onAlgorithmChange={handleAlgorithmChange}
            onVizStatusChange={handleVizStatusChange}
          />
        )
    }
  }

  return (
    <div className="app">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        tabs={tabs}
      />
      <div className="page-container" key={activeTab}>
        {renderPage()}
      </div>
      {toast && <Toast message={toast} />}
      <AIPanel
        currentAlgorithm={currentAlgorithm}
        currentTab={activeTab}
        vizStatus={vizStatus}
      />
    </div>
  )
}

export default App
