import { Command } from '../interfaces/command'
import { Collection } from 'discord.js'
import { help } from './help'
import { quote } from './quote'
import { configQuote } from './config-quote'
import { configRepost } from './config-repost'
import { configUser } from './config-user'

const commandList: Command[] = [
  help,
  quote,
  configQuote,
  configRepost,
  configUser
]

const commandCollection: Collection<string, Command> = new Collection()

for (const command of commandList) {
  commandCollection.set(command.data.name, command)
}

export { commandCollection, commandList }
