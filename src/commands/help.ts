import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { Command } from '../interfaces/command'

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides information on using this bot.'),
  async run (interaction) {
    await interaction.deferReply()
    const embed = new MessageEmbed()
    embed.setTitle('Mood tracker bot')
    embed.setDescription(
      'This discord bot is designed to help you track your daily mood'
    )
    embed.addField(
      'Create or update today mood record',
      "Use the '/mood' command to create your update for today."
    )
    embed.addField(
      'Show mood history',
      "Use the '/history' command to show your weekly or monthly mood history."
    )
    embed.addField(
      'Show mood record',
      "Use the '/show' command to show detail of a particular record."
    )
    embed.addField(
      'Toggle reminder',
      "Use the '/remind' command if you want the bot to remind you every day."
    )
    embed.setFooter({ text: `Version ${process.env.npm_package_version}` })
    await interaction.editReply({ embeds: [embed] })
  }
}
