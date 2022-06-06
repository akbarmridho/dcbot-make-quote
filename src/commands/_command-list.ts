import { Command } from '../interfaces/command'
import { Collection } from 'discord.js'
import { help } from './help'
import { quote } from './quote'

const commandList : Command[] = [help, quote]

const commandCollection: Collection<string, Command> = new Collection()

for (const command of commandList) {
  commandCollection.set(command.data.name, command)
}

export {
  commandCollection,
  commandList
}
