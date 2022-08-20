import { bmvbhash } from 'blockhash-core'
import { imageBufferFromUrl } from '../image-quote/image'
import sharp from 'sharp'

interface ImageData {
  width: number
  height: number
  data: Uint8Array | Uint8ClampedArray | number[]
}

function hex2bin(hex: string) {
  return parseInt(hex, 16).toString(2).padStart(8, '0')
}

async function getImageData(src: string | Buffer): Promise<ImageData> {
  let data: Uint8ClampedArray

  if (typeof src === 'string') {
    const buffer = await imageBufferFromUrl(src)
    data = Uint8ClampedArray.from(buffer)
  } else {
    data = Uint8ClampedArray.from(src)
  }

  const metadata = await sharp(data).metadata()

  return {
    data,
    width: metadata.width!,
    height: metadata.height!
  }
}

export async function hash(src: string | Buffer) {
  const hash = bmvbhash(await getImageData(src), 8)
  return hex2bin(hash)
}
