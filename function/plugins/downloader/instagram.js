import { igdl } from 'btch-downloader';

export default {
  id: ['igdl', 'instagram'],
  run: async ({ client, m, args }) => {
  if (!args[0]) return m.reply(mess.query)
  
  try {
  const res = await igdl(args[0])
  await client.sendFile(m.chat, res.result[0].url, "igdkkbct", mess.done);
  } catch { m.reply("Just take a screenshot man..") }
  }
}
