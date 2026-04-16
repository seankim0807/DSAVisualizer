import React, { useState } from 'react'
import './Page.css'

const SORT_DISPLAY_NAMES = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
}

function SortingPage({ showToast, onAlgorithmChange, onVizStatusChange }) {
  const [array, setArray] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble')
  const [speed, setSpeed] = useState('normal')
  const [counter, setCounter] = useState({ comparisons: 0, swaps: 0 })
  const [colorStates, setColorStates] = useState({})

  const speedMap = { slow: 50, normal: 20, fast: 5 }

  const generateArray = () => {
    const newArray = Array.from({ length: 50 }, () => Math.floor(Math.random() * 500))
    setArray(newArray)
    setColorStates({})
    setCounter({ comparisons: 0, swaps: 0 })
  }

  React.useEffect(() => {
    generateArray()
    onAlgorithmChange?.(SORT_DISPLAY_NAMES['bubble'])
  }, [])

  const handleSort = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    onVizStatusChange?.('running')
    setCounter({ comparisons: 0, swaps: 0 })
    setColorStates({})

    const algorithm = (await import(`../algorithms/sorting/${selectedAlgorithm}`)).default
    const animations = algorithm(array)

    for (const animation of animations) {
      await new Promise(resolve => setTimeout(resolve, speedMap[speed]))

      if (animation.type === 'compare') {
        setColorStates(prev => {
          const newStates = { ...prev }
          animation.indices.forEach(idx => newStates[idx] = 'comparing')
          return newStates
        })
        setCounter(prev => ({ ...prev, comparisons: prev.comparisons + 1 }))
      } else if (animation.type === 'swap') {
        const [i, j] = animation.indices
        setArray(prev => {
          const newArray = [...prev]
          ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
          return newArray
        })
        setColorStates(prev => {
          const newStates = { ...prev }
          newStates[i] = 'swapping'
          newStates[j] = 'swapping'
          return newStates
        })
        setCounter(prev => ({ ...prev, swaps: prev.swaps + 1 }))
      } else if (animation.type === 'sorted') {
        setColorStates(prev => {
          const newStates = { ...prev }
          animation.indices.forEach(idx => newStates[idx] = 'sorted')
          return newStates
        })
      }
    }

    setIsAnimating(false)
    onVizStatusChange?.('complete')
    showToast('Sorting complete!')
  }

  const getBarColor = (index) => {
    const state = colorStates[index]
    if (state === 'comparing') return 'var(--color-sorting-compare)'
    if (state === 'swapping') return 'var(--color-sorting-swap)'
    if (state === 'sorted') return 'var(--color-sorting-sorted)'
    return 'var(--color-sorting-default)'
  }

  return (
    <div className="page sorting-page">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="algo-select">Algorithm:</label>
          <select
            id="algo-select"
            value={selectedAlgorithm}
            onChange={(e) => {
              setSelectedAlgorithm(e.target.value)
              onAlgorithmChange?.(SORT_DISPLAY_NAMES[e.target.value])
            }}
            disabled={isAnimating}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSort}
          disabled={isAnimating}
        >
          {isAnimating ? 'Sorting...' : 'Sort'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={generateArray}
          disabled={isAnimating}
        >
          Generate New Array
        </button>

        <div className="control-group">
          <label htmlFor="speed-select">Speed:</label>
          <select
            id="speed-select"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            disabled={isAnimating}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      <div className="sort-visualization">
        <div className="bars">
          {array.map((value, index) => (
            <div
              key={index}
              className="bar"
              style={{
                height: `${(value / 500) * 100}%`,
                backgroundColor: getBarColor(index),
              }}
            />
          ))}
        </div>
      </div>

      {(counter.comparisons > 0 || counter.swaps > 0) && (
        <div className="counter">
          <span>Comparisons: {counter.comparisons}</span>
          <span>Swaps: {counter.swaps}</span>
        </div>
      )}
    </div>
  )
}

export default SortingPage
