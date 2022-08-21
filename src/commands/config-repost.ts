import { PermissionsBitField, SlashCommandBuilder } from 'discord.js'
import { getRepostConfig } from '../database/models/repost'
import { Command, CommandError } from '../interfaces/command'
import { updateWatchedChannels } from './repost'

export const configRepost: Command = {
  data: new SlashCommandBuilder()
    .setName('config-repost')
    .setDescription('Configure channel target to watch for repost.'),
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

    const serverConfig = await getRepostConfig(
      interaction.guildId,
      interaction.channelId
    )

    await serverConfig.save()
    await updateWatchedChannels()
    await interaction.editReply('Perubahan berhasil disimpan.')
  }
}
