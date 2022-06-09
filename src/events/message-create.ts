import { Message } from 'discord.js'
import { quoteOnMentioned } from '../commands/quote'

export const messageCreate = async (message: Message) => {
  if (message.inGuild() && message.mentions.has(message.client.user!) && message.reference?.messageId) {
    const referencedMessage = await message.channel.messages.fetch(message.reference.messageId)
    await quoteOnMentioned(referencedMessage)
    await message.reply('Done!')
  }
}
