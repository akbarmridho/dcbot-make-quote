import { Dayjs } from 'dayjs'
import { quoteModel } from './quotes'
import { Periods } from '../../utils/dates'
import { model, Schema } from 'mongoose'

interface LeaderboardDataInterface {
  _id: string
  score: number
}

interface LeaderboardInterface {
  channelId: string
  period: Periods
  data: LeaderboardDataInterface[]
  createdAt: Date
  updatedAt: Date
}

export const leaderboardSchema = new Schema<LeaderboardInterface>(
  {
    channelId: { type: String, required: true },
    period: { type: String, enum: Periods },
    data: [{ _id: String, score: Number }]
  },
  { timestamps: true }
)

export const leaderboardModel = model<LeaderboardInterface>(
  'Leaderboards',
  leaderboardSchema
)

export const getLeaderboard = async (
  channelId: string,
  startDate?: Dayjs,
  endDate?: Dayjs
) => {
  return await quoteModel
    .aggregate<LeaderboardDataInterface>()
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
}
