import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { toPTT, toAudio, toVideo, toMp3, toImg } from "../../converter.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  id: ["toptt", "toaudio", "tovid", "toimg"],
  run: async ({ client, m, command }) => {

    if (!m.quoted) return m.reply("Reply audio/video")

    const mime = m.quoted.mimetype || ""
    const buffer = await m.quoted.download()
    const ext = mime.split("/")[1]

    try {
      let result
      
      if (command === "toptt") {
        if (mime.startsWith("video/")) {
          result = await toPTT(buffer, ext)

          await client.sendMessage(m.chat, {
            audio: result.data,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true
          }, { quoted: m })

          await result.delete()

        } else if (mime.startsWith("audio/")) {

          await client.sendMessage(m.chat, {
            audio: buffer,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true
          }, { quoted: m })

        } else return m.reply("Reply audio/video valid!")
      }

      else if (command === "toaudio") {
        if (!mime.includes("video")) return m.reply("Reply the video first!")

        result = await toMp3(buffer, ext)

        await client.sendMessage(m.chat, {
          audio: result.data,
          mimetype: "audio/mpeg",
          fileName: "converted.mp3",
          ptt: false
        }, { quoted: m })
      }
      
      else if (command === "tovid") {
        if (!/webp|image/.test(mime)) return m.reply("Reply sticker!")

        result = await toVideo(buffer, ext)

        await client.sendMessage(m.chat, {
          video: result.data,
          mimetype: "video/mp4",
          caption: "Done.."
        }, { quoted: m })
      }
      
      else if (command === "toimg") {
        if (!/webp/.test(mime)) return m.reply("Reply sticker!")

        result = await toImg(buffer, ext)

        await client.sendMessage(m.chat, {
          image: result.data,
          mimetype: "image/png",
          fileName: "converted.png"
        }, { quoted: m })
      }
      
    } catch (e) {
      console.error(e)
      m.reply(mess.error)
    }
  }
}