import { xiaohongshu } from 'btch-downloader';

export default {
  id: 'xiaohongshu',
  run: async ({ client, m, args }) => {
  if (!args[0]) return m.reply(mess.query)

  const res = await xiaohongshu(args[0])
  const caption = `Title: ${res.result.title}\nDesc: ${res.result.desc}\nDuration: ${res.result.duration}`
  await client.sendFile(m.chat, res.result.downloads[0].url, "igdkkbct", caption);
  }
}
