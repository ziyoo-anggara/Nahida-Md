import { soundcloud } from 'btch-downloader';

export default {
  id: 'soundcloud',
  run: async ({ client, m, args }) => {
  if (!args[0]) return m.reply(mess.query)
  const res = await soundcloud(args[0])

  await client.sendImage(m.chat, res.result.thumbnail, res.result.title)

  await client.sendMessage(m.chat, {
      audio: {
          url: res.result.audio
      },
      fileName: `kvygfchh-soundcloud.mp3`,
      mimetype: 'audio/mp4'
  })
  }
}