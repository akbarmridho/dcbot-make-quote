import { Client } from 'discord.js'
import { updateCommands } from '../jobs/updateCommands'

export const onReady = async (client:Client) => {
  if (!(process.env.PRODUCTION || false)) {
    await updateCommands()
  }

  console.log('Bot ready')
}
