import { ChannelType, Message } from 'discord.js'
import { createHash, deleteHash, imageHashes } from '../database/models/images'
import { getWatchedChannels } from '../database/models/repost'
import { getSimilarHash } from '../utils/image-similarity/compare'
import { hash } from '../utils/image-similarity/hash'

const hashes = imageHashes
export const watchedChannels: string[] = []
const mediaTypes = ['image/webp', 'image/png', 'image/jpeg']
// first key is channelId, second key is the hash, and the last value is the referenced imageId

export const updateWatchedChannels = async () => {
  const updatedChannels = await getWatchedChannels()
  watchedChannels.length = 0
  watchedChannels.push(...updatedChannels)
}

export const checkImage = async (message: Message) => {
  if (
    watchedChannels.includes(message.channelId) &&
    !hashes.get(message.channelId)
  ) {
    hashes.set(message.channelId, new Map<string, string>())
  }

  const channelHashes = hashes.get(message.channelId)

  if (!channelHashes) return

  for (const attachment of message.attachments.values()) {
    if (mediaTypes.includes(attachment.contentType!)) {
      const imageHash = await hash(attachment.url)
      const similarity = getSimilarHash(imageHash, channelHashes)

      if (similarity) {
        if (message.channel.type === ChannelType.GuildText) {
          const { messageId, key } = similarity
          try {
            const msg = await message.channel.messages.fetch(messageId)
            msg.reply('Similar content was found!')
          } catch (e) {
            channelHashes.delete(key)
            await deleteHash(key)
          }
        }
      }

      channelHashes.set(imageHash, message.id)
      const createdImageHash = await createHash(
        message.channelId,
        imageHash,
        message.id
      )
      await createdImageHash.save()
    }
  }
}
