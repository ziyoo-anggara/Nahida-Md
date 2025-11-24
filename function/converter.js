import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join(__dirname, '../data/trash/', Date.now() + '.' + ext)
      let out = tmp + '.' + ext2

      await fs.promises.writeFile(tmp, buffer)

      spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await fs.promises.unlink(tmp)
            if (code !== 0) return reject(code)

            resolve({
              data: await fs.promises.readFile(out),
              filename: out,
              delete() {
                return fs.promises.unlink(out)
              }
            })
          } catch (e) {
            reject(e)
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Convert Audio to PTT
 */
export function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
  ], ext, 'ogg')
}

/**
 * Convert Mp4 to Audio
 */
export function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus')
}

/**
 * Convert Sticker to Video
 */
export function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4')
}

/**
 * Convert Audio to MP3
 */
export function toMp3(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libmp3lame',
    '-b:a', '192k'
  ], ext, 'mp3')
}

/**
 * Convert Sticker to PNG (Image)
 */
export function toImg(buffer, ext) {
  return ffmpeg(buffer, [
    '-vcodec', 'png'
  ], ext, 'png')
}

export default {
  toAudio,
  toPTT,
  toMp3,
  toImg,
  toVideo,
  ffmpeg,
}
