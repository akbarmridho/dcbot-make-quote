import { SlashCommandBuilder } from '@discordjs/builders'
import { Message } from 'discord.js'
import { getConfig } from '../database/models/config'
import { Command } from '../interfaces/command'
import { imageBufferFromUrl } from '../utils/images/image'
import { generateBnw } from '../utils/images/style-bnw'

export const quoteOnMentioned = async (message:Message) => {
  const profileImageBuffer = await imageBufferFromUrl(message.author.avatarURL()!)
  const generatedImage = await generateBnw(profileImageBuffer, message.content, message.author.tag)

  const serverConfig = await getConfig(message.guildId!)

  const channel = await message.guild?.channels.fetch(serverConfig.channelId!)
  if (channel?.isText()) {
    channel.send({ files: [generatedImage] })
  }
}

export const quote: Command = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Create quote from message id')
    .addStringOption(option => option.setName('message')
      .setDescription('Desired message id. You might need developer mode for this').setRequired(true))
    .addBooleanOption(option => option.setName('this-channel')
      .setDescription('Send quote to this channel instead')),
  async run (interaction) {
    // generate message via mention
    await interaction.deferReply()

    if (!interaction.channel) return
    const messageId = interaction.options.getString('message', true)
    const message = await interaction.channel.messages.fetch(messageId)
    const profileImageBuffer = await imageBufferFromUrl(message.author.avatarURL()!)
    const generatedImage = await generateBnw(profileImageBuffer, message.content, message.author.tag)

    const serverConfig = await getConfig(interaction.guildId!)

    if (serverConfig.sameChannel && !interaction.options.getBoolean('this-channel')) {
      const channel = await interaction.guild?.channels.fetch(serverConfig.channelId!)
      if (channel?.isText()) {
        channel.send({ files: [generatedImage] })
      }
      await interaction.editReply('Done')
    } else {
      await interaction.editReply({ files: [generatedImage] })
    }
  }
}
