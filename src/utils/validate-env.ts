export const validateEnv = () => {
  const envs : Array<string> = ['DISCORD_BOT_TOKEN', 'DISCORD_CLIENT_ID', 'MONGODB_URI']

  if (!(process.env.PRODUCTION || false)) {
    envs.push('DISCORD_SERVER_ID')
  }

  for (const env of envs) {
    if (!process.env[env]) {
      console.log(`Missing ${env} in environemnt variables.`)
      return false
    }
  }

  return true
}
