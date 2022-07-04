import { Message } from 'discord.js'
import { quoteOnMentioned } from '../commands/quote'

export const messageCreate = async (message: Message) => {
  try {
    if (message.inGuild() && message.mentions.has(message.client.user!, { ignoreEveryone : true }) && message.reference?.messageId) {
      const referencedMessage = await message.channel.messages.fetch(message.reference.messageId)
      await quoteOnMentioned(referencedMessage)
      await message.reply('Done!')
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(`${e.name} - ${e.message}`)
    }
  }
}
