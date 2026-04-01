function insertionSort(array) {
  const animations = []
  const arr = [...array]
  const n = arr.length

  for (let i = 1; i < n; i++) {
    let key = arr[i]
    let j = i - 1

    while (j >= 0 && arr[j] > key) {
      animations.push({ type: 'compare', indices: [j, i] })
      animations.push({ type: 'swap', indices: [j + 1, j] })
      arr[j + 1] = arr[j]
      j--
    }

    arr[j + 1] = key
  }

  for (let i = 0; i < n; i++) {
    animations.push({ type: 'sorted', indices: [i] })
  }

  return animations
}

export default insertionSort
