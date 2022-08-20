import { model, Schema } from 'mongoose'

export interface ConfigRepostInterface {
  serverId: string
  channelId: string
}

export const repostConfigSchema = new Schema<ConfigRepostInterface>({
  serverId: { type: String, required: true },
  channelId: { type: String, required: true }
})

export const configModel = model<ConfigRepostInterface>(
  'ConfigRepost',
  repostConfigSchema
)

export const getRepostConfig = async (serverId: string, channelId: string) => {
  return (
    (await configModel.findOne({ serverId, channelId })) ||
    (await configModel.create({
      serverId,
      channelId
    }))
  )
}
