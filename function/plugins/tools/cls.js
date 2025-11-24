import { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } from '../../exif.js'

export default {
  id: 'cls',
  run: async ({ client, m, text }) => {    
    if (!m.quoted) return m.reply('Reply with a sticker!');

    let stiker = false;
    try {
      let [packname, ...author] = (text || '').split('|');
      author = (author || []).join('|');

      const mime = m.quoted.mimetype || '';
      if (!/webp/.test(mime)) throw 'Reply with a sticker!';

      const img = await m.quoted.download();
      if (!img || !Buffer.isBuffer(img)) throw 'Failed to download sticker!';

      stiker = await addExif(img, packname || global.packname, author || global.author);
      if (!stiker || !Buffer.isBuffer(stiker)) throw 'Conversion failed';
      
    } catch (e) {
      return m.reply('❌ ' + (typeof e === 'string' ? e : e.message || e));
    }

    await client.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true });
  }
}
