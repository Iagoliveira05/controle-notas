import { createWorker } from 'tesseract.js'

async function enhanceImage(file: File) {
  const image = await createImageBitmap(file)
  const scale = Math.min(2, 1800 / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))
  const context = canvas.getContext('2d')
  if (!context) return file
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  for (let index = 0; index < pixels.data.length; index += 4) {
    const gray = Math.min(255, Math.max(0, (0.299 * pixels.data[index] + 0.587 * pixels.data[index + 1] + 0.114 * pixels.data[index + 2] - 128) * 1.35 + 128))
    pixels.data[index] = gray
    pixels.data[index + 1] = gray
    pixels.data[index + 2] = gray
  }
  context.putImageData(pixels, 0, 0)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  image.close()
  return blob ? new File([blob], 'receipt-enhanced.png', { type: 'image/png' }) : file
}

export async function recognizeReceipt(file: File, onProgress: (progress: number) => void) {
  const enhancedFile = await enhanceImage(file)
  const worker = await createWorker('por', 1, { logger: (message) => {
    if (message.status === 'recognizing text' && typeof message.progress === 'number') onProgress(message.progress)
  } })
  try {
    const result = await worker.recognize(enhancedFile)
    return result.data.text.trim()
  } finally {
    await worker.terminate()
  }
}
