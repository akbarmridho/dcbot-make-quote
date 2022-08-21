import { model, Schema } from 'mongoose'

export interface ConfigRepostInterface {
  serverId: string
  channelId: string
}

export const repostConfigSchema = new Schema<ConfigRepostInterface>({
  serverId: { type: String, required: true },
  channelId: { type: String, required: true }
})

export const repostModel = model<ConfigRepostInterface>(
  'ConfigRepost',
  repostConfigSchema
)

export const getRepostConfig = async (serverId: string, channelId: string) => {
  return (
    (await repostModel.findOne({ serverId, channelId })) ||
    (await repostModel.create({
      serverId,
      channelId
    }))
  )
}

export const getWatchedChannels = async () => {
  const configs = await repostModel.find()
  const result: string[] = []

  for (const config of configs) {
    result.push(config.channelId)
  }

  return result
}
