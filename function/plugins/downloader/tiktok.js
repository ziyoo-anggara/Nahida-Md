import { tiktok } from '../../scraper/downloader.js'

export default {
  id: ['tiktok', 'tt'],
  run: async ({ client, m, args }) => {
    if (args.length == 0) return m.reply(`Example: .tiktok link`)
     let res = await tiktok(args[0])  
     client.sendMessage(m.chat, {
         video: {
             url: res.no_watermark
         },
         caption: res.title,
         fileName: `tiktok.mp4`,
         mimetype: 'video/mp4'        
     }).then(() => {  
         client.sendMessage(m.chat, {
             audio: {
                 url: res.music
             },
             fileName: `tiktok.mp3`,
             mimetype: 'audio/mp4'
         })       
     })
  }
}
