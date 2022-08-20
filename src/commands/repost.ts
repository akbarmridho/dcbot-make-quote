import { ChannelType, Message } from 'discord.js'
import { createHash, imageHashes } from '../database/models/images'
import { getSimilarHash } from '../utils/image-similarity/compare'
import { hash } from '../utils/image-similarity/hash'

const hashes = imageHashes
const mediaTypes = ['image/webp', 'image/png', 'image/jpeg']
// first key is channelId, second key is the hash, and the last value is the referenced imageId

export const check = async (message: Message) => {
  const channelHashes = hashes.get(message.channelId)

  if (!channelHashes) return

  for (const attachment of message.attachments.values()) {
    if (mediaTypes.includes(attachment.contentType!)) {
      const imageHash = await hash(attachment.url)
      const similarity = getSimilarHash(imageHash, channelHashes)

      if (similarity) {
        if (message.channel.type === ChannelType.GuildText) {
          const msg = await message.channel.messages.fetch(similarity)
          msg.reply('Similar content was found!')
        }
      } else {
        channelHashes.set(imageHash, message.id)
        await createHash(message.channelId, imageHash, message.id)
      }
    }
  }
}
