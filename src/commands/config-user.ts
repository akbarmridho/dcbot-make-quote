import { PermissionsBitField, SlashCommandBuilder } from 'discord.js'
import { createUserConfig } from '../database/models/user'
import { Command, CommandError } from '../interfaces/command'

export const configUser: Command = {
  data: new SlashCommandBuilder()
    .setName('config-user')
    .setDescription("Set user's quote configuration")
    .addStringOption((option) =>
      option
        .setName('profile-image')
        .setRequired(true)
        .addChoices(
          {
            name: 'Server Profile',
            value: 'server'
          },
          {
            name: 'Default Profile',
            value: 'default'
          }
        )
        .setDescription('Atur gambar profil pengguna yang ditampilkan')
    )
    .addStringOption((option) =>
      option
        .setName('profile-name')
        .setRequired(true)
        .addChoices(
          {
            name: 'Server Profile',
            value: 'server'
          },
          {
            name: 'Default Profile',
            value: 'default'
          }
        )
        .setDescription('Atur nama profil pengguna yang ditampilkan')
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

    const profileImage = interaction.options.getString('profile-image', true)
    const profileName = interaction.options.getString('profile-name', true)

    if (
      !(profileImage === 'default' || profileImage === 'server') ||
      !(profileName === 'default' || profileName === 'server')
    ) {
      throw Error('Invalid config option')
    }

    const userConfig = await createUserConfig(
      interaction.user.id,
      interaction.guildId,
      profileImage,
      profileName
    )

    if (!userConfig) {
      throw Error('User model null')
    }

    await userConfig.save()
    await interaction.editReply('Perubahan berhasil disimpan.')
  }
}
