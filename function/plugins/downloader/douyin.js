import { douyin } from 'btch-downloader';

export default {
  id: 'douyin',
  run: async ({ client, m, args }) => {
  if (!args[0]) return m.reply(mess.query)

  const res = await douyin(args[0])
  await client.sendFile(m.chat, res.result.data.links[0].url, "igdkkbct", res.result.data.title);
  }
}
