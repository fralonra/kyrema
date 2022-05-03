interface Centroid<T> {
  value: T
  count: number
  indexes: number[]
}

const MAX_TRY = 50

function kyrema<T>(
  k: number,
  data: T[],
  distanceCalculator: (data: T, centroid: T) => number,
  averageCalculator: (datas: T[]) => T,
  centroidEqualator: (c1: T, c2: T) => boolean,
  maxTry = MAX_TRY
): Centroid<T>[] {
  if (data.length <= 0) {
    return []
  }
  if (k >= data.length) {
    throw 'Data count is less than k.'
  }

  const centroids: T[] = []
  let tryTimes = 0
  let idx = 0
  let step = Math.floor((data.length - 1) / (k - 1))
  while (centroids.length < k) {
    if (++tryTimes >= k * 100) {
      throw 'Tried to find centroids too many times. Please specify centroids manually.'
    }

    const centroid = data[idx]
    if (centroids.every((c) => !centroidEqualator(c, centroid))) {
      centroids.push(centroid)
    } else {
      step = Math.floor((data.length - 1 - idx) / (k - centroids.length))
    }
    idx += step
  }

  return kyremaWithCentroids(
    k,
    centroids,
    data,
    distanceCalculator,
    averageCalculator,
    centroidEqualator,
    maxTry
  )
}

function kyremaWithCentroids<T>(
  k: number,
  initialCentroids: T[],
  data: T[],
  distanceCalculator: (data: T, centroid: T) => number,
  averageCalculator: (datas: T[]) => T,
  centroidEqualator: (c1: T, c2: T) => boolean,
  maxTry = MAX_TRY
): Centroid<T>[] {
  const dataGroups: T[][] = []
  for (let i = 0; i < k; i++) {
    dataGroups.push([] as T[])
  }
  const result: Centroid<T>[] = initialCentroids.map((value) => ({
    value,
    count: 0,
    indexes: [],
  }))

  let iterCount = 0
  while (true) {
    data.forEach((d, i) => groupItem(d, i))
    let equalCentroidCount = 0
    for (let i = 0; i < k; i++) {
      const datas = dataGroups[i]
      const centroid = result[i]
      const averageCentroid = averageCalculator(datas)
      if (!centroidEqualator(centroid.value, averageCentroid)) {
        centroid.value = averageCentroid
      } else {
        equalCentroidCount++
      }
    }

    if (++iterCount >= maxTry || equalCentroidCount === k) {
      break
    }

    for (let i = 0; i < k; i++) {
      result[i].count = 0
      result[i].indexes = []
      dataGroups[i] = []
    }
  }

  return result

  function groupItem(data: T, idx: number) {
    let minDistance = Number.MAX_SAFE_INTEGER
    let groupIdx = 0
    for (let i = 0; i < k; i++) {
      const d = distanceCalculator(data, result[i].value)
      if (d < minDistance) {
        minDistance = d
        groupIdx = i
      }
    }

    result[groupIdx].count++
    result[groupIdx].indexes.push(idx)
    dataGroups[groupIdx].push(data)
  }
}

export { kyrema, kyremaWithCentroids }
