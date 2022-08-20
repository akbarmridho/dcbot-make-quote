import { REST } from '@discordjs/rest'
import { commandList } from '../commands/_command-list'
import { Routes } from 'discord.js'

export const updateCommands = async () => {
  const rest = new REST({ version: '9' }).setToken(
    process.env.DISCORD_BOT_TOKEN!
  )

  const commandData = commandList.map((command) => command.data.toJSON())

  if (process.env.PRODUCTION) {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commandData
    })
  } else {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID!,
        process.env.DISCORD_SERVER_ID!
      ),
      { body: commandData }
    )
  }
}
