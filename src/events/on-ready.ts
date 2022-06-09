import { Client } from 'discord.js'
import { updateCommands } from '../jobs/updateCommands'

export const onReady = async (client:Client) => {
  await updateCommands()

  console.log('Bot ready')
}
