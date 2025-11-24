import fetch from 'node-fetch'

export default {
  id: 'iqc',
  run: async ({ client, m, command, text }) => {
    if (!text) return m.reply(mess.query)
    try {
      const res = await fetch('https://api-faa.my.id/faa/iqc?prompt=' + encodeURIComponent(text));
      if (!res.ok) return m.reply('there was a problem with the server')
     
      const buffer = await res.buffer();

      await client.sendFile(m.chat, buffer, 'iqc.jpg', mess.done, m);

    } catch (e) {
      m.reply('Error: ' + (e.message || e));
    }
  }
}
