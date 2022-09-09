import { SlashCommandBuilder } from 'discord.js'
import { Command, CommandError } from '../interfaces/command'
import { Periods } from '../utils/dates'

export const leaderboard: Command = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Get the most quoted users at a period of time')
    .addStringOption((option) =>
      option
        .setName('profile-image')
        .setRequired(true)
        .addChoices(
          {
            name: 'All time',
            value: Periods.ALL_TIME
          },
          {
            name: 'This Month',
            value: Periods.THIS_MONTH
          },
          {
            name: 'Last month',
            value: Periods.LAST_MONTH
          },
          {
            name: 'This week',
            value: Periods.THIS_WEEK
          },
          {
            name: 'Last week',
            value: Periods.LAST_WEEK
          }
        )
        .setDescription('Atur gambar profil pengguna yang ditampilkan')
    ),
  async run(interaction) {
    await interaction.deferReply()

    if (!interaction.inGuild()) throw new CommandError('Not in guild')

    await interaction.editReply('Perubahan berhasil disimpan.')
  }
}
