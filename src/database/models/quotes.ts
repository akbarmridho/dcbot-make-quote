import { Dayjs } from 'dayjs'
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

interface LeaderboardInterface {
  _id: string
  score: number
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

export const getLeaderboard = async (
  channelId: string,
  startDate?: Dayjs,
  endDate?: Dayjs
) => {
  return await quoteModel
    .aggregate<LeaderboardInterface>()
    .match({
      channelId,
      createdAt: {
        $gte: startDate?.toDate()
      },
      endDate: {
        $lte: endDate?.toDate()
      }
    })
    .group({
      _id: '$userId',
      score: {
        $sum: {
          $add: [
            {
              $multiply: ['$reactionCount', 3]
            },
            {
              $multiply: ['$directReplyCount', 2]
            },
            10
          ]
        }
      }
    })
    .sort({ score: 'desc' })
    .limit(10)
    .exec()

  // useCache
  // bila lebih dari satu bulan, buat agregat dan simpan ke model lain
  // hasil agregat bisa merupakan leaderboard per bulan
  //   const result = await quoteModel.find({
  //     channelId,
  //     createdAt: {
  //       $gte: startDate?.toDate()
  //     },
  //     endDate: {
  //       $lte: endDate?.toDate()
  //     }
  //   })

  //   // key as userId and value as total score
  //   const userScore = new Map<string, number>()

  //   result.forEach((data) => {
  //     const score = 10 + data.reactionCount * 3 + data.directReplyCount * 2
  //     if (userScore.has(data.userId)) {
  //       userScore.set(data.userId, userScore.get(data.userId)! + score)
  //     } else {
  //       userScore.set(data.userId, score)
  //     }
  //   })

  //   return userScore
}
