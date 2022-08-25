import { ChannelType, Message } from 'discord.js'
import { createHash, deleteHash, imageHashes } from '../database/models/images'
import { createUrl, deleteUrl, urls } from '../database/models/links'
import { getWatchedChannels } from '../database/models/repost'
import { getSimilarHash } from '../utils/image-similarity/compare'
import { hash } from '../utils/image-similarity/hash'

export const watchedChannels: string[] = []

const mediaTypes = ['image/webp', 'image/png', 'image/jpeg']
// first key is channelId, second key is the hash, and the last value is the referenced imageId

export const updateWatchedChannels = async () => {
  const updatedChannels = await getWatchedChannels()
  watchedChannels.length = 0
  watchedChannels.push(...updatedChannels)
}

const checkImage = async (message: Message, maps: Map<string, string>) => {
  for (const attachment of message.attachments.values()) {
    if (mediaTypes.includes(attachment.contentType!)) {
      const imageHash = await hash(attachment.url)
      const similarity = getSimilarHash(imageHash, maps)

      if (similarity) {
        if (message.channel.type === ChannelType.GuildText) {
          const { messageId, key } = similarity
          try {
            const msg = await message.channel.messages.fetch(messageId)
            await msg.reply(
              `Hello, <@${message.author.id}>! Potentially similar content was found here. Have you checked it if it's a repost?`
            )
          } catch (e) {
            maps.delete(key)
            await deleteHash(key, message.channelId)
          }
        }
      }

      maps.set(imageHash, message.id)
      const createdImageHash = await createHash(
        message.channelId,
        imageHash,
        message.id
      )
      await createdImageHash.save()
    }
  }
}

const checkUrl = async (message: Message, maps: Map<string, string>) => {
  const embed = message.embeds[0]

  if (embed.url) {
    const url = embed.url.split('?')[0]

    if (maps.has(url)) {
      const refMessageId = maps.get(url)!

      try {
        const refMessage = await message.channel.messages.fetch(refMessageId)
        await refMessage.reply(
          `Hello, <@${message.author.id}>! Potentially similar content was found here. Have you checked it if it's a repost?`
        )
      } catch (e) {
        maps.delete(url)
        await deleteUrl(url, message.channelId)
      }
    }
    maps.set(url, message.id)
    const createdUrl = await createUrl(message.channelId, url, message.id)
    await createdUrl.save()
  }
}

export const checkRepost = async (message: Message) => {
  if (message.attachments.size > 0) {
    if (
      watchedChannels.includes(message.channelId) &&
      !imageHashes.get(message.channelId)
    ) {
      imageHashes.set(message.channelId, new Map<string, string>())
    }

    const channelImageHashes = imageHashes.get(message.channelId)

    if (!channelImageHashes) return

    await checkImage(message, channelImageHashes)
  } else if (message.embeds.length > 0) {
    if (
      watchedChannels.includes(message.channelId) &&
      !urls.get(message.channelId)
    ) {
      urls.set(message.channelId, new Map<string, string>())
    }

    const channelUrls = urls.get(message.channelId)

    if (!channelUrls) return

    await checkUrl(message, channelUrls)
  }
}
