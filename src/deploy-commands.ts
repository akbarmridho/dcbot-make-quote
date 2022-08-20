import { REST } from '@discordjs/rest'
import { Routes } from 'discord.js'
import { commandList } from './commands/_command-list'

;(async () => {
  const rest = new REST({ version: '9' }).setToken(
    process.env.DISCORD_BOT_TOKEN!
  )

  const commandData = commandList.map((command) => command.data.toJSON())

  await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commandData
  })

  console.log('Global app command deployed')
})()
