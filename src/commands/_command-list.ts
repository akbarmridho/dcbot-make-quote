import { Command } from '../interfaces/command'
import { Collection } from 'discord.js'
import { help } from './help'
import { quote } from './quote'
import { config } from './config'

const commandList : Command[] = [help, quote, config]

const commandCollection: Collection<string, Command> = new Collection()

for (const command of commandList) {
  commandCollection.set(command.data.name, command)
}

export {
  commandCollection,
  commandList
}
