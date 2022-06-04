import { Command } from '../interfaces/command'
import { Collection } from 'discord.js'
import { help } from './help'


const commandList : Command[] = [help]

const commandCollection: Collection<string, Command> = new Collection()

for (const command of commandList) {
  commandCollection.set(command.data.name, command)
}

export {
  commandCollection,
  commandList
}
