import fs from 'fs'

export default {
  id: ['s', 'sticker', 'stiker'],
  run: async ({ client, m, quoted, mime, command }) => {
        if (/image/.test(mime)) {
            let media = await quoted.download()
            let encmedia = await client.sendImageAsSticker(m.chat, media, m, {
                packname: global.packname,
                author: global.author
            })
            await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 11) return m.reply('Maximum 10 seconds!')
            let media = await quoted.download()
            let encmedia = await client.sendVideoAsSticker(m.chat, media, m, {
                packname: global.packname,
                author: global.author
            })
            await fs.unlinkSync(encmedia)
        } else {
            return m.reply(`Send Images/Videos With Caption: .${command}`)
        }
    }
}