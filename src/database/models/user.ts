import { model, Schema } from 'mongoose'

type Options = 'default' | 'server'

export interface UserConfigInterface {
  userId: string
  serverId: string
  profileImage: Options
  authorTag: Options
}

export const userConfigSchema = new Schema<UserConfigInterface>({
  serverId: { type: String, required: true },
  userId: { type: String, required: true },
  profileImage: { type: String, default: 'default' },
  authorTag: { type: String, default: 'default' }
})

export const userConfigModel = model<UserConfigInterface>(
  'UserConfig',
  userConfigSchema
)

export const getuserConfig = async (userId: string, serverId: string) => {
  return await userConfigModel.findOne({
    userId,
    serverId
  })
}

export const createUserConfig = async (
  userId: string,
  serverId: string,
  profileImage: Options,
  authorTag: Options
) => {
  return await userConfigModel.findOneAndUpdate(
    {
      userId,
      serverId
    },
    {
      profileImage,
      authorTag,
      userId,
      serverId
    },
    {
      upsert: true,
      new: true
    }
  )
}
