import { createCanvas, CanvasRenderingContext2D } from 'canvas'
import { fillTextWithTwemoji } from 'node-canvas-with-twemoji-and-discord-emoji'

type TextStyle = 'normal' | 'italic' | 'bold' | 'italicbold'

interface Word {
  text: string
  width: number
  style: TextStyle
}

interface TextLine {
  words: Word[]
  width: number
}

// catch word, but make words with italic, bold, bold italic treated as one word
const REGEX_PATTERN =
  /(?:^|(?<=[^\w\*]))\*{1,3}[^\*]+?\*{1,3}(?=[^\w\*]*)|\w*[^\s]\w*/gm // eslint-disable-line
// const REGEX_PATTERN = /[\w,.!?]*\*{1,3}[\w ]+\*{1,3}[\w,.!?]*|\w*[^\s]\w*/gm // todo

const splitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number
): [TextLine[], number] => {
  const matchedRegex = text.replaceAll('||', '').match(REGEX_PATTERN)

  if (!matchedRegex) {
    throw new Error('Cannot Match Regex')
  }

  const words = matchedRegex.flatMap((match) => {
    let style: TextStyle
    let stripped: string

    // todo
    // styled text sometimes have prefix and suffix. Currently, this is not handled
    // use second regex pattern if want to implement this

    if (match.startsWith('***') && match.endsWith('***')) {
      style = 'italicbold'
      stripped = match.slice(3, match.length - 3)
      ctx.font = `italic bold ${fontSize}px "Roboto"`
    } else if (match.startsWith('**') && match.endsWith('**')) {
      style = 'bold'
      stripped = match.slice(2, match.length - 2)
      ctx.font = `bold ${fontSize}px "Roboto"`
    } else if (match.startsWith('*') && match.endsWith('*')) {
      style = 'italic'
      stripped = match.slice(1, match.length - 1)
      ctx.font = `italic ${fontSize}px "Roboto"`
    } else {
      style = 'normal'
      stripped = match
      ctx.font = `normal ${fontSize}px "Roboto"`
    }

    return stripped.split(' ').map((word) => {
      return {
        text: word,
        width: ctx.measureText(` ${word}`).width,
        style
      }
    })
  })

  const result: TextLine[] = []

  const currentLine: TextLine = {
    words: [],
    width: 0
  }

  for (const word of words) {
    if (currentLine.width + word.width <= ctx.canvas.width) {
      currentLine.words.push(word)
      currentLine.width = currentLine.width + word.width
    } else if (word.width >= ctx.canvas.width) {
      continue // skip the word
    } else {
      result.push(Object.assign({}, currentLine))
      currentLine.width = word.width
      currentLine.words = [word]
    }
  }

  result.push(Object.assign({}, currentLine))

  const heightApprox =
    result.length * fontSize + ((result.length - 1) * fontSize) / 4

  return [result, heightApprox]
}

export const generateText = async (
  canvasWidth: number,
  canvasHeight: number,
  text: string,
  author?: string
) => {
  let fontSize = 50
  let lines: TextLine[] = []

  const ctx = createCanvas(canvasWidth, canvasHeight).getContext('2d')
  ctx.fillStyle = 'rgb(255,255,255)'

  while (fontSize >= 10) {
    let currentHeight = 0

    for (const textLine of text.split('\n')) {
      const [textLines, textHeight] = splitText(ctx, textLine, fontSize)
      currentHeight = currentHeight + textHeight
      lines.push(...textLines)
    }

    if (currentHeight <= canvasHeight) {
      break
    }

    fontSize = fontSize - 10
    lines = []
  }

  let yPos = 50

  if (lines) {
    const newHeight = author
      ? Math.ceil(1.25 * fontSize * (lines.length + 1))
      : Math.ceil(1.25 * fontSize * lines.length)
    const newCanvas = createCanvas(canvasWidth, newHeight)
    const newCtx = newCanvas.getContext('2d')
    newCtx.fillStyle = 'rgb(255,255,255)'

    for (const { width, words } of lines) {
      let xPos = Math.ceil((canvasWidth - width) / 2)
      // newCtx.fillText(text, xPos, yPos, canvasWidth)

      for (const word of words) {
        if (word.style === 'bold') {
          newCtx.font = `bold ${fontSize}px "Roboto"`
        } else if (word.style === 'italic') {
          newCtx.font = `italic ${fontSize}px "Roboto"`
        } else if (word.style === 'italicbold') {
          newCtx.font = `italic bold ${fontSize}px "Roboto"`
        } else {
          newCtx.font = `normal ${fontSize}px "Roboto"`
        }

        await fillTextWithTwemoji(newCtx, word.text, xPos, yPos)

        xPos = xPos + Math.ceil(word.width)
      }

      yPos = yPos + Math.ceil((5 * fontSize) / 4)
    }

    if (author) {
      newCtx.fillStyle = 'rgba(255,255,255,0.8)'
      newCtx.font = `italic ${Math.ceil(0.8 * fontSize)}px "Roboto"`
      newCtx.fillText(
        `- ${author}`,
        Math.ceil((canvasWidth - newCtx.measureText(`- ${author}`).width) / 2),
        yPos
      )
    }

    return newCanvas
  }

  throw new Error('Unable to generate text')
}
