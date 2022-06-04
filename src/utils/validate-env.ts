export const validateEnv = () => {
  const envs : Array<string> = ['DISCORD_BOT_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_SERVER_ID', 'MONGODB_URI']

  for (const env of envs) {
    if (!process.env[env]) {
      console.log(`Missing ${env} in environemnt variables.`)
      return false
    }
  }

  return true
}
