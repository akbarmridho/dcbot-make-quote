import { model, Schema } from 'mongoose'
import dayjs from 'dayjs'

export const imageHashes = new Map<string, Map<string, string>>()
const EXPIRE_OFFSET = 3 // in days

export interface ImageInterface {
  channelId: string
  hash: string
  messageId: string
  createdAt: Date
  updatedAt: Date
}

export const imageSchema = new Schema<ImageInterface>(
  {
    hash: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true }
  },
  { timestamps: true }
)

export const imageModel = model<ImageInterface>('Images', imageSchema)

export const getImages = async () => {
  const result = await imageModel.find()
  imageHashes.clear()

  for (const each of result) {
    if (imageHashes.has(each.channelId)) {
      imageHashes.get(each.channelId)!.set(each.hash, each.messageId)
    } else {
      const channelHashes = new Map<string, string>()
      channelHashes.set(each.hash, each.messageId)
      imageHashes.set(each.channelId, channelHashes)
    }
  }

  return imageHashes
}

export const createHash = async (
  channelId: string,
  hash: string,
  messageId: string
) => {
  return await imageModel.create({
    channelId,
    hash,
    messageId
  })
}

export const deleteHash = async (hash: string) => {
  return await imageModel.deleteOne({
    hash
  })
}
export const deleteOldHash = async () => {
  return await imageModel.deleteMany({
    createdAt: {
      $lte: dayjs().subtract(EXPIRE_OFFSET, 'day')
    }
  })
}
