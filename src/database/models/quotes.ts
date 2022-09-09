import { model, Schema } from 'mongoose'

export interface QuoteConfigInterface {
  userId: string
  serverId: string
  channelId: string
  messageId: string
  directReplyCount: number
  reactionCount: number
  content: string
  createdAt: Date
  updatedAt: Date
}

export const quoteSchema = new Schema<QuoteConfigInterface>(
  {
    serverId: { type: String, required: true },
    userId: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true },
    directReplyCount: { type: Number, default: 0 },
    reactionCount: { type: Number, default: 0 },
    content: { type: String, required: true }
  },
  { timestamps: true }
)

export const quoteModel = model<QuoteConfigInterface>('Quotes', quoteSchema)

export const updateStats = async (
  messageId: string,
  directReplyCount: number,
  reactionCount: number
) => {
  return await quoteModel.updateOne(
    {
      messageId
    },
    {
      directReplyCount,
      reactionCount
    }
  )
}

export const createQuote = async (
  userId: string,
  serverId: string,
  channelId: string,
  messageId: string,
  content: string
) => {
  return await quoteModel.create({
    userId,
    serverId,
    channelId,
    messageId,
    content
  })
}

export const getUserTopQuote = () => {}
