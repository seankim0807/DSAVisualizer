function selectionSort(array) {
  const animations = []
  const arr = [...array]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      animations.push({ type: 'compare', indices: [j, minIdx] })

      if (arr[j] < arr[minIdx]) {
        minIdx = j
      }
    }

    if (minIdx !== i) {
      animations.push({ type: 'swap', indices: [i, minIdx] })
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }
  }

  for (let i = 0; i < n; i++) {
    animations.push({ type: 'sorted', indices: [i] })
  }

  return animations
}

export default selectionSort
