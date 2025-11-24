import { gdrive } from 'btch-downloader';

export default {
  id: ['gdrive', 'googledrive'],
  run: async ({ client, m, args }) => {
  if (!args[0]) return m.reply(mess.query)

  const res = await gdrive(args[0])
  await client.sendFile(m.chat, res.result.data.downloadUrl, res.result.data.filename, mess.done);
  }
}
