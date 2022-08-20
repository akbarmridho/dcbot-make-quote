import { Message } from 'discord.js'
import { quoteOnMentioned } from '../commands/quote'
import { check } from '../commands/repost'

export const messageCreate = async (message: Message) => {
  try {
    if (
      message.inGuild() &&
      message.mentions.has(message.client.user!, { ignoreEveryone: true }) &&
      message.reference?.messageId
    ) {
      const referencedMessage = await message.channel.messages.fetch(
        message.reference.messageId
      )
      await quoteOnMentioned(referencedMessage)
      await message.reply('Done!')
    } else if (message.inGuild() && message.attachments.size > 0) {
      await check(message)
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(`${e.name} - ${e.message}`)
    }
  }
}
