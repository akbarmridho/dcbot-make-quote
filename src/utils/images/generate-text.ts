import { createCanvas, CanvasRenderingContext2D } from 'canvas'

interface TextLine {
  text: string,
  width: number
}

class HeightError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'HeightError'
  }
}

const splitText = (ctx: CanvasRenderingContext2D, text:string) : TextLine[] => {
  const words = new Map(text.split(' ').map(word => {
    return [word, ctx.measureText(` ${word}`).width]
  }))

  const result : TextLine[] = []

  const currentLine:TextLine = {
    text: '',
    width: 0
  }

  for (const [word, width] of words) {
    if (currentLine.width + width <= ctx.canvas.width) {
      currentLine.text = currentLine.text + ` ${word}`
      currentLine.width = currentLine.width + width
    } else if (width >= ctx.canvas.width) {
      continue // skip the word
    } else {
      result.push(Object.assign({}, currentLine))
      currentLine.width = width
      currentLine.text = word
    }
  }

  result.push(Object.assign({}, currentLine))

  let sizePx: number

  try {
    const size = ctx.font.split(' ')[0]
    sizePx = parseInt(size.substring(0, size.indexOf('px')))
  } catch {
    sizePx = 40
  }

  const heightApprox = result.length * sizePx + (result.length - 1) * sizePx / 4

  if (heightApprox > ctx.canvas.height) {
    throw new HeightError('String too high')
  }

  return result
}

export const generateText = (canvasWidth: number, canvasHeight:number, text:string) => {
  let fontSize = 50
  let lines: TextLine[]|undefined

  const ctx = createCanvas(canvasWidth, canvasHeight).getContext('2d')
  ctx.fillStyle = 'rgb(255,255,255)'

  while (fontSize >= 20) {
    ctx.font = `${fontSize}px sans-serif`

    try {
      lines = splitText(ctx, text)
      break
    } catch (error) {
      if (error instanceof HeightError) {
        fontSize = fontSize - 10
        continue
      }
    }
  }

  let yPos = 50

  if (lines) {
    const newHeight = fontSize * lines.length + 0.25 * fontSize * (lines.length - 1) + fontSize
    const newCanvas = createCanvas(canvasWidth, newHeight)
    const newCtx = newCanvas.getContext('2d')
    newCtx.fillStyle = 'rgb(255,255,255)'
    newCtx.font = `${fontSize}px sans-serif`

    for (const { width, text } of lines) {
      const xPos = Math.ceil((canvasWidth - width) / 2)
      newCtx.fillText(text, xPos, yPos, canvasWidth)
      yPos = yPos + Math.ceil(5 * fontSize / 4)
    }

    return newCanvas
  }

  throw Error('Failed to generate text')
}
