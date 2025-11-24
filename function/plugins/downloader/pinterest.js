import { pinterest } from 'btch-downloader';

export default {
  id: ['pin', 'pinterest'],
  run: async ({ client, m, args }) => {
    if (!args[0]) return m.reply(mess.query)
    const data = await pinterest(args[0])
    for (let i = 0; i < 6; i++) {
      await client.sendMessage(m.chat, {
        image: { url: data.result.result.result[i].images.original }
      })
      await new Promise(resolve => setTimeout(resolve, 1000)) 
    }
  }
}