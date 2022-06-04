import { Message } from 'discord.js'

export const messageCreate = (message: Message) => {
  console.log(`Received message ${message.content}`)
}
