import { SlashCommandBuilder } from '@discordjs/builders'
import { Permissions } from 'discord.js'
import { getConfig } from '../database/models/config'
import { Command, CommandError } from '../interfaces/command'

export const config: Command = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure channel target to send quotes.')
    .addBooleanOption(option => option.setName('same-channel')
      .setRequired(true)
      .setDescription('Jika True, hasil quote akan selalu dikirim ke channel ini.')),
  async run (interaction) {
    await interaction.deferReply()

    if (!interaction.inGuild()) throw new CommandError('Not in guild')

    const member = await interaction.guild!.members.fetch(interaction.user!.id)

    if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.editReply({ content: 'You need administrator permission to be able to change this settings.' })
      return
    }

    const serverConfig = await getConfig(interaction.guildId)

    const sameChannel = interaction.options.getBoolean('same-channel', true)
    const ignoreEveryone = interaction.options.getBoolean('ignore-everyone', false)

    serverConfig.sameChannel = sameChannel

    if ( ignoreEveryone !== undefined ) serverConfig.ignoreEveryone = ignoreEveryone!

    if (sameChannel) {
      serverConfig.channelId = interaction.channelId
    } else {
      serverConfig.channelId = ''
    }

    await serverConfig.save()
    await interaction.editReply('Perubahan berhasil disimpan.')
  }
}
