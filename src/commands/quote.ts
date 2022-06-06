import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../interfaces/command'
import { imageBufferFromUrl } from '../utils/images/image'
import { generateBnw } from '../utils/images/style-bnw'

export const quote: Command = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Create quote from message id')
    .addStringOption(option => option.setName('message')
      .setDescription('Desired message id. You might need developer mode for this').setRequired(true)),
  async run (interaction) {
    await interaction.deferReply()

    if (!interaction.channel) return
    const messageId = interaction.options.getString('message', true)
    const message = await interaction.channel.messages.fetch(messageId)
    const profileImageBuffer = await imageBufferFromUrl(message.author.avatarURL()!)
    const generatedImage = await generateBnw(profileImageBuffer, message.content, message.author.tag)

    await interaction.editReply({ files: [generatedImage] })
  }
}
