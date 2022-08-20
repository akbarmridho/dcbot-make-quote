import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction
} from 'discord.js'

export interface Command {
  data:
    | Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'>
    | SlashCommandSubcommandsOnlyBuilder
  run: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export class CommandError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Command failed'
  }
}
