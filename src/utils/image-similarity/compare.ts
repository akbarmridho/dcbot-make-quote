const CONFIDENCE_INTERVAL = 90

export function calculateSimilarity(hash1: string, hash2: string) {
  let similarity = 0

  hash1.split('').forEach((bit, index) => {
    if (hash2[index] === bit) {
      similarity++
    }
  })

  return Math.floor((similarity / hash1.length) * 100) // in percentage, not decimal
}

export function getSimilarHash(hash1: string, hashList: Map<string, string>) {
  for (const key of hashList.keys()) {
    const similarityScore = calculateSimilarity(hash1, key)

    if (similarityScore > CONFIDENCE_INTERVAL) {
      return { messageId: hashList.get(key)!, key }
    }
  }

  return null
}
