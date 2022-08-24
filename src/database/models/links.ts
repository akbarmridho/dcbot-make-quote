import { model, Schema } from 'mongoose'
import dayjs from 'dayjs'

export const urls = new Map<string, Map<string, string>>()
const EXPIRE_OFFSET = 7 // in days

export interface UrlInterface {
  channelId: string
  url: string
  messageId: string
  createdAt: Date
  updatedAt: Date
}

export const urlSchema = new Schema<UrlInterface>(
  {
    url: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true }
  },
  { timestamps: true }
)

export const urlModel = model<UrlInterface>('Urls', urlSchema)

export const getUrls = async () => {
  const result = await urlModel.find({
    createdAt: {
      $gte: dayjs().subtract(EXPIRE_OFFSET, 'day')
    }
  })
  urls.clear()

  for (const each of result) {
    if (urls.has(each.channelId)) {
      urls.get(each.channelId)!.set(each.url, each.messageId)
    } else {
      const channelHashes = new Map<string, string>()
      channelHashes.set(each.url, each.messageId)
      urls.set(each.channelId, channelHashes)
    }
  }

  return urls
}

export const createUrl = async (
  channelId: string,
  url: string,
  messageId: string
) => {
  return await urlModel.create({
    channelId,
    url,
    messageId
  })
}

export const deleteUrl = async (url: string, channelId: string) => {
  return await urlModel.deleteOne({
    url,
    channelId
  })
}
export const deleteOldUrl = async () => {
  return await urlModel.deleteMany({
    createdAt: {
      $lte: dayjs().subtract(EXPIRE_OFFSET, 'day')
    }
  })
}
