import { resolve } from 'node:path'
import sharp from 'sharp'
import { _imagesPath } from '../get-cwd'
import { generateText } from './generate-text'

const imagePath = resolve(_imagesPath, 'bnw/template.png')

export const generateBnw = async (profilePicture: Buffer, text: string, author?:string) => {
  const textCanvas = await generateText(700, 400, text, author)

  const background = sharp(imagePath)
  const backgroundMetric = await background.metadata()
  const authorImage = sharp(profilePicture).resize({ height: backgroundMetric.height })

  return await sharp({
    create: {
      width: backgroundMetric.width!,
      height: backgroundMetric.height!,
      channels: 4,
      background: '#FFFFFF'
    }
  }).composite([
    {
      input: await authorImage.extract({
        width: Math.ceil(2 * backgroundMetric.height! / 3),
        height: backgroundMetric.height!,
        top: 0,
        left: Math.ceil(backgroundMetric.height! / 6)
      }).grayscale().toBuffer(),
      top: 0,
      left: 0
    },
    {
      input: await background.toBuffer()
    },
    {
      input: textCanvas.toBuffer(),
      top: Math.ceil((backgroundMetric.height! - textCanvas.height) / 2),
      left: 400 + Math.ceil((backgroundMetric.width! - textCanvas.width - 400) / 2)
    }
  ]).jpeg({
    quality: 75
  })
    .toBuffer()
}
