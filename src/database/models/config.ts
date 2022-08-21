import { model, Schema } from 'mongoose'

export interface ConfigInterface {
  serverId: string
  sameChannel: boolean
  channelId?: string
}

export const configSchema = new Schema<ConfigInterface>({
  serverId: { type: String, required: true },
  sameChannel: { type: Boolean, required: true, default: true },
  channelId: { type: String }
})

export const configModel = model<ConfigInterface>('Config', configSchema)

export const getQuoteConfig = async (serverId: string) => {
  return (
    (await configModel.findOne({ serverId })) ||
    (await configModel.create({
      serverId,
      sameChannel: false
    }))
  )
}
