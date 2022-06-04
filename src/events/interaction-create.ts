import { Interaction } from 'discord.js'
import { commandCollection } from '../commands/_command-list'

export const interactionCreate = async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    console.log(`${interaction.user.tag} in #${interaction.channel?.id} triggered a command interaction`)

    if (commandCollection.has(interaction.commandName)) {
      await commandCollection.get(interaction.commandName)!.run(interaction)
    }
  }
}
