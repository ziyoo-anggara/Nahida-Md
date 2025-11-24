import { fbdown } from 'btch-downloader';

export default {
  id: ['fbdl', 'facebook'],
  run: async ({ client, m, args }) => {
  if (!args[0]) return m.reply(mess.query)

  try {
    const res = await fbdown(args[0])
    await client.sendFile(m.chat, res.Normal_video, "igdkkbct", mess.done);
  } catch { m.reply("Just take a screenshot man..") }
  }
}
