function quickSort(array) {
  const animations = []
  const arr = [...array]

  function partition(low, high) {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      animations.push({ type: 'compare', indices: [j, high] })

      if (arr[j] < pivot) {
        i++
        animations.push({ type: 'swap', indices: [i, j] })
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }

    animations.push({ type: 'swap', indices: [i + 1, high] })
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    return i + 1
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high)
      quickSortHelper(low, pi - 1)
      quickSortHelper(pi + 1, high)
    }
  }

  quickSortHelper(0, arr.length - 1)

  for (let i = 0; i < arr.length; i++) {
    animations.push({ type: 'sorted', indices: [i] })
  }

  return animations
}

export default quickSort
