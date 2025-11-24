import os from 'os';
import fs from 'fs';

export default {
  id: ['menu', '9172738', 'listmenu', '8643665'],
  run: async ({ client, m, username, runtime, userdb, command }) => {
  let thumb = command === 'menu' ? global.thumb2 : global.thumb1
  let listmenu
  let infouser = `
╔┅━━―ᡣ𐭩─┈┈┈─―「 *ɪɴꜰᴏ ʙᴏᴛ* 」───────┈┈ᡣ𐭩──╕_
╠─────―────────―─────―─────―────―──
│   Nama Creator : *${author}*
│   OS running : *${os.platform()}*
┃   Runtime  Bot : ${runtime(process.uptime())} 
┃   Total user : -
╠◌𑀈.━━┈┈────୨「 *ɪɴꜰᴏ ᴜꜱᴇʀ* 」ৎ─────―─┈┈──•
┃   Premium user : *${userdb.Premium ? "yes" : "no"}*
┃   User : *${username}*
│   Cloverbits : 0
╽   Hit : ${userdb.hitcmd}
╚━┈┈───────━━━━• ▹▹▹`

  if (command == 'menu') {
    listmenu = `   
   
ʜᴀʟᴏ! ☘️ ꜱᴀʏᴀ ᴀᴅᴀʟᴀʜ (ʙᴏᴛ ᴡʜᴀᴛꜱᴀᴩᴩ) ᴏᴛᴏᴍᴀᴛɪꜱ yᴀɴɢ ᴅᴀᴩᴀᴛ ᴍᴇᴍʙᴀɴᴛᴜ ᴍᴇʟᴀᴋᴜᴋᴀɴ ꜱᴇꜱᴜᴀᴛᴜ, ᴍᴇɴᴄᴀʀɪ ᴅᴀɴ ᴍᴇɴᴅᴀᴩᴀᴛᴋᴀɴ ᴅᴀᴛᴀ ᴀᴛᴀᴜ ɪɴꜰᴏʀᴍᴀꜱɪ ᴍᴇʟᴀʟᴜɪ ᴡʜᴀᴛꜱᴀᴩᴩ.

╔在𑁥───── 「 ɢʀᴏᴜᴘ ᴍᴇɴᴜ 」 ────── • • •
┊  ┏┈┈─────━○∙··
┊  ┊  ◦  revoke
│  ┊  ◦  kick
│  │  ◦  promote
│  │  ◦  demote
│  │  ◦  closegc
│  │  ◦  opengc
│  │  ◦  linkgc
│  │  ◦  editsubjek
│  │  ◦  editdesk
┊  │  ◦  joingc
┊  ┊  ◦  editgroup
┊  ┊  ◦  tagall
│  └━──┈┈┈𐔌 . ⋮ ˶• ༝ •˶ ♡ ֹ ₊ ꒱────◌𑀈._
╚━͜͡}─══━━━──────────━━━━══───͜͡}━༻¨*:·

╔在𑁥───── 「 ᴏᴡɴᴇʀ ᴍᴇɴᴜ 」 ────── • • •
┊  ┏┈┈─────━○∙··
┊  ┊  ◦  $
│  ┊  ◦  =>
│  │  ◦  >
│  │  ◦  addowner
│  │  ◦  addprem
│  │  ◦  delowner
│  │  ◦  delprem
┊  │  ◦  restart
┊  ┊  ◦  shutdown
│  └━──┈┈┈𐔌 . ⋮ .ꉂ ˵˃ ᗜ ˂˵ . ₊ ꒱────◌𑀈._
╚━͜͡}─══━━━──────────━━━━══───͜͡}━༻¨*:·

╔在𑁥───── 「 ᴛᴏᴏʟꜱ ᴍᴇɴᴜ 」 ────── • • •
┊  ┏┈┈─────━○∙··
┊  ┊  ◦  toptt
│  ┊  ◦  toaudio
│  │  ◦  tovid
│  │  ◦  get
│  │  ◦  qc
│  │  ◦  iqc
│  │  ◦  remini
│  │  ◦  cls
│  │  ◦  post
│  │  ◦  kalulator
┊  │  ◦  toimg
┊  ┊  ◦  sticker
│  └━──┈┈┈𐔌 . ⋮  ˶ᵔ ᵕ ᵔ˶ .ᐟ ֹ ₊ ꒱────◌𑀈._
╚━͜͡}─══━━━──────────━━━━══───͜͡}━༻¨*:·

╔在𑁥───── 「 ᴍᴀɪɴ ᴍᴇɴᴜ 」 ────── • • •
┊  ┏┈┈─────━○∙··
┊  ┊  ◦  runtime
│  │  ◦  sc
│  │  ◦  listmenu
┊  ┊  ◦  credits
│  └━──┈┈┈𐔌 . ⋮ ｡•̀ ᴗ - ✧ ֹ ₊ ꒱────◌𑀈._
╚━͜͡}─══━━━──────────━━━━══───͜͡}━༻¨*:·

╔在𑁥───── 「 ᴅᴏᴡɴʟᴏᴀᴅᴇʀ ᴍᴇɴᴜ 」 ────── • • •
┊  ┏┈┈─────━○∙··
┊  ┊  ◦  tiktok
│  ┊  ◦  youtube
│  │  ◦  gdrive
│  │  ◦  facebook
│  │  ◦  soundcloud
│  │  ◦  gitclone
│  │  ◦  twitter
│  │  ◦  spotify
│  │  ◦  douyin
│  │  ◦  mediafire
│  │  ◦  pinterest
┊  │  ◦  xiaohongshu
┊  ┊  ◦  instagram
│  └━──┈┈┈𐔌 . ⋮  ˃ ⤙ ˂  ֹ ₊ ꒱────◌𑀈._
╚━͜͡}─══━━━──────────━━━━══───͜͡}━༻¨*:·
`
  } else {
    listmenu = `

╔𐙚─━┈┈──•┈๑⋅⋯ *｢ List menu ｣* ⋯⋅๑┈•──┈┈━──━━
│ ┏┈┈───═ ═┈┈─────―┈══─────━━━×•
│ │  ◦   Ownermenu
┊ │  ◦   Downloadmenu
│ │  ◦   Toolsmenu
┊ │  ◦   Groupmenu
┊ │  ◦   Mainmenu
┊ ╚═┈┈─────━┈┈───━━ ⋯
┗━` + '૮₍ ´ ꒳ ` ₎ა' + `─────┈┈─────―━•ৎ˚⟡˖`
  }

  await client.sendMessage(m.chat, {
    text: infouser + listmenu,
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: ids,
        serverMessageId: null,
        newsletterName: nems
      },
      externalAdReply: {
        title: title,
        body: body,
        thumbnail: thumb,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  })
 }
}
