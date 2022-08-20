import { ChatInputCommandInteraction, Interaction } from 'discord.js'
import { commandCollection } from '../commands/_command-list'

async function errorWrapper(
  func: (interaction: ChatInputCommandInteraction) => Promise<void>,
  interaction: ChatInputCommandInteraction
) {
  try {
    await func(interaction)
  } catch (e) {
    let message: string
    if (e instanceof Error) {
      message = `${e.name} - ${e.message}`
    } else {
      message = 'Uknown error'
    }

    if (interaction.deferred) {
      await interaction.editReply(message)
    } else {
      await interaction.reply(message)
    }
  }
}

export const interactionCreate = async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    // console.log(`${interaction.user.tag} in #${interaction.channel?.id} triggered a command interaction`)

    if (commandCollection.has(interaction.commandName)) {
      await errorWrapper(
        commandCollection.get(interaction.commandName)!.run,
        interaction
      )
    }
  }
}
