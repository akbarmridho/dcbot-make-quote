import { connect } from 'mongoose'

export const connectDatabase = async () => {
  await connect(process.env.MONGODB_URI!)
  console.log('Database connected!')
}
