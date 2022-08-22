import { registerFont } from 'canvas'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { updateWatchedChannels } from './commands/repost'
import { connectDatabase } from './database/connect'
import { deleteOldHash, getImages } from './database/models/images'
import { deleteOldUrl, getUrls } from './database/models/links'
import { interactionCreate } from './events/interaction-create'
import { messageCreate } from './events/message-create'
import { onReady } from './events/on-ready'
import { validateEnv } from './utils/validate-env'
;(async () => {
  if (!validateEnv()) return
  registerFont('fonts/Roboto-Bold.ttf', {
    family: 'Roboto',
    weight: 'bold'
  })

  registerFont('fonts/Roboto-Italic.ttf', {
    family: 'Roboto',
    weight: 'normal',
    style: 'italic'
  })

  registerFont('fonts/Roboto-BoldItalic.ttf', {
    family: 'Roboto',
    weight: 'bold',
    style: 'italic'
  })

  registerFont('fonts/Roboto-Regular.ttf', {
    family: 'Roboto',
    weight: 'normal'
  })

  const bot = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  })

  bot.on('ready', onReady)

  bot.on('interactionCreate', interactionCreate)

  bot.on('messageCreate', messageCreate)

  await connectDatabase()

  await bot.login(process.env.DISCORD_BOT_TOKEN)

  await deleteOldHash()
  await deleteOldUrl()

  await getImages()
  await getUrls()

  await updateWatchedChannels()
})()
