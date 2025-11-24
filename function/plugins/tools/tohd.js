import { uploadUguu } from '../../myfunc.js'

export default {
  id: ['hd', 'remini'],
  run: async ({ client, m, text, quoted, mime, command }) => {    
     if (!/image/.test(mime)) return m.reply(`Send photos with caption: .${command}`)
     let media = await quoted.download()
     let url = await uploadUguu(media)
     let hd = await fetch('https://api-faa.my.id/faa/hdv3?image='+url.files[0].url)

     client.sendMessage(m.chat, {
         image: hd,
         caption: mess.done
     }, {
         quoted: m
     })
  }
}