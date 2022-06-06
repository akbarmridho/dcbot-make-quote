import axios from 'axios'

export const imageBufferFromUrl = async (url: string) => {
  return (await axios({ url, responseType: 'arraybuffer' })).data as Buffer
}
