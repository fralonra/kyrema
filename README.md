# kyrema

[![npm version](https://img.shields.io/npm/v/kyrema.svg)](https://www.npmjs.com/package/kyrema)

A simple k-means clustering implement.

## Usage

```javascript
import { kyrema } from 'kyrema'

const dataset = [0, 1, 2, 5, 6, 7, 8, 9]

const centroids = kyrema(
  2,
  dataset,
  (d, c) => Math.abs(d - c), // calculate the distance
  (datas) => datas.reduce((p, c) => p + c, 0) / datas.length, // calculate the mean
  (c1, c2) => c1 === c2, // check if equal
)
console.log(centroids) // The value of centroids: 1, 7.
```

## API

- **kyrema(k, data, distanceCalculator, averageCalculator, centroidEqualator, maxTry)**
  - Parameters:
    - `k` - *number*
      -  The cluster count.
    - `data` - *T[]*
      - The dataset, where `T` is a generic type.
    - `distanceCalculator` - *(data: T, centroid: T) => number*
      - Determine how to calculate the distance between a data and the centroid.
    - `averageCalculator` - *(datas: T[]) => T*
      - Determine how to calculate the mean value of a cluster.
    - `centroidEqualator` - *(c1: T, c2: T) => boolean*
      - Determine how to check if the two datas are equal to each other.
    - `maxTry` - *number*
      - [Optional] The maximum repeat times of the algorithm. Default: `50`.
  - Return:
    - *Centroid[]*
      - An array with *k* centroids.

- **kyremaWithCentroids(k, initialCentroids, data, distanceCalculator, averageCalculator, centroidEqualator, maxTry)**
  - Parameters:
    - `initialCentroids` - *T[]*
      - Initial centroids, an array with *k* elements.
    - *Note: Other parameters are the same as the above function: `kyrema`*
  - Return:
    - *Centroid[]*
      - An array with *k* centroids.

- **Centroid**
  - The returned object of the algorithm, with the following properties:
    - `value` - *T*
      - The value of the cluster mean. It's of type *T*.
    - `count` - *number*
      - The amount of items in the cluster.
    - `indexes` - *number[]*
      - The index of each item in the original dataset. 

## License

[MIT](./LICENSE)