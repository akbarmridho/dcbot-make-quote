import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '../interfaces/command'

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides information on using this bot.'),
  async run(interaction) {
    await interaction.deferReply()
    const embed = new EmbedBuilder()
    embed.setTitle('Message Quote Bot')
    embed.setDescription('Designed to document discord message')
    embed.addFields([
      {
        name: 'Config Quote',
        value:
          "Use the '/config-quote' command to create update the bot configuration."
      },
      {
        name: 'Config Repost',
        value:
          "Use the '/config-repost' command to add repost tracker to certain channel"
      },
      {
        name: 'Config User',
        value: "Use the 'config-user' command to update user's quote style"
      },
      {
        name: 'Quote (via command)',
        value: "Use the '/quote' command to show quote certain message. "
      },
      {
        name: 'Quote (via mention)',
        value:
          'Just reply to a message that want to be quoted and mention this bot. Optional query: add nickname or serverImage argument to overwrite the quote configuration'
      }
    ])

    embed.setFooter({ text: `Version ${process.env.npm_package_version}` })
    await interaction.editReply({ embeds: [embed] })
  }
}
