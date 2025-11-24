import { mediafire } from 'btch-downloader';

export default {
  id: ['mf', 'mediafire'],
  run: async ({ client, m, args }) => {
  if (!args[0]) return m.reply(mess.query)
  
  const data = await fetch('https://api-faa.my.id/faa/mediafire?url=' + args[0]);
  const res = await data.json();
  
  await client.sendFile(m.chat, res.result.download_url, res.result.filename, mess.done);
  }
}
