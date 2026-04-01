function mergeSort(array) {
  const animations = []
  const arr = [...array]

  function merge(left, mid, right) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      animations.push({ type: 'compare', indices: [left + i, mid + 1 + j] })

      if (leftArr[i] <= rightArr[j]) {
        animations.push({ type: 'swap', indices: [k, left + i] })
        arr[k++] = leftArr[i++]
      } else {
        animations.push({ type: 'swap', indices: [k, mid + 1 + j] })
        arr[k++] = rightArr[j++]
      }
    }

    while (i < leftArr.length) {
      animations.push({ type: 'swap', indices: [k, left + i] })
      arr[k++] = leftArr[i++]
    }

    while (j < rightArr.length) {
      animations.push({ type: 'swap', indices: [k, mid + 1 + j] })
      arr[k++] = rightArr[j++]
    }
  }

  function mergeHelper(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      mergeHelper(left, mid)
      mergeHelper(mid + 1, right)
      merge(left, mid, right)
    }
  }

  mergeHelper(0, arr.length - 1)

  for (let i = 0; i < arr.length; i++) {
    animations.push({ type: 'sorted', indices: [i] })
  }

  return animations
}

export default mergeSort
