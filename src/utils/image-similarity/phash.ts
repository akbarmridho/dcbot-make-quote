import sharp from 'sharp'

/*
SOURCE: https://github.com/btd/sharp-phash/blob/master/index.js
*/

const SAMPLE_SIZE = 128

function initSQRT(N: number) {
  const c: number[] = new Array(N)

  for (let i = 1; i < N; i++) {
    c[i] = 1
  }

  c[0] = 1 / Math.sqrt(2.0)

  return c
}

const SQRT = initSQRT(SAMPLE_SIZE)

function initCOS(N: number) {
  const cosines: number[][] = new Array(N)

  for (let k = 0; k < N; k++) {
    cosines[k] = new Array(N)
    for (let n = 0; n < N; n++) {
      cosines[k][n] = Math.cos(((2 * k + 1) / (2.0 * N)) * n * Math.PI)
    }
  }

  return cosines
}

const COS = initCOS(SAMPLE_SIZE)

function applyDCT(data: number[][], size: number) {
  const result = new Array(size)

  for (let u = 0; u < size; u++) {
    result[u] = new Array(size)

    for (let v = 0; v < size; v++) {
      let sum = 0

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          sum += COS[i][u] * COS[j][v] * data[i][j]
        }
      }

      sum *= (SQRT[u] * SQRT[v]) / 4

      result[u][v] = sum
    }
  }

  return result
}

const LOW_SIZE = 16

export async function phash(image: Buffer) {
  const data = await sharp(image)
    .grayscale()
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
    .rotate()
    .raw()
    .toBuffer()

  // copy signal
  const signal: number[][] = new Array(SAMPLE_SIZE)
  for (let x = 0; x < SAMPLE_SIZE; x++) {
    signal[x] = new Array(SAMPLE_SIZE)
    for (let y = 0; y < SAMPLE_SIZE; y++) {
      signal[x][y] = data[SAMPLE_SIZE * y + x]
    }
  }

  // Apply 2D DCT
  const dct = applyDCT(signal, SAMPLE_SIZE)

  // get AVG on high frequencies
  let totalSum = 0
  for (let x = 0; x < LOW_SIZE; x++) {
    for (let y = 0; y < LOW_SIZE; y++) {
      totalSum += dct[x + 1][y + 1]
    }
  }

  const avg = totalSum / (LOW_SIZE * LOW_SIZE)

  // compute hash
  let fingerprint = ''

  for (let x = 0; x < LOW_SIZE; x++) {
    for (let y = 0; y < LOW_SIZE; y++) {
      fingerprint += dct[x + 1][y + 1] > avg ? '1' : '0'
    }
  }

  return fingerprint
}
