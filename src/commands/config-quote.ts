import { PermissionsBitField, SlashCommandBuilder } from 'discord.js'
import { getQuoteConfig } from '../database/models/config'
import { Command, CommandError } from '../interfaces/command'

export const configQuote: Command = {
  data: new SlashCommandBuilder()
    .setName('config-quote')
    .setDescription('Configure channel target to send quotes.')
    .addBooleanOption((option) =>
      option
        .setName('same-channel')
        .setRequired(true)
        .setDescription(
          'Jika True, hasil quote akan selalu dikirim ke channel ini.'
        )
    ),
  async run(interaction) {
    await interaction.deferReply()

    if (!interaction.inGuild()) throw new CommandError('Not in guild')

    const member = await interaction.guild!.members.fetch(interaction.user!.id)

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.editReply({
        content:
          'You need administrator permission to be able to change this settings.'
      })
      return
    }

    const serverConfig = await getQuoteConfig(interaction.guildId)

    const sameChannel = interaction.options.getBoolean('same-channel', true)

    serverConfig.sameChannel = sameChannel

    if (sameChannel) {
      serverConfig.channelId = interaction.channelId
    } else {
      serverConfig.channelId = ''
    }

    await serverConfig.save()
    await interaction.editReply('Perubahan berhasil disimpan.')
  }
}
