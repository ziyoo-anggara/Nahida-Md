import fs from 'fs'

/*
  Reply Default bot
*/
global.mess = {
    succes: '*Request completed ✅*',
    done: '*Request completed ✅*',
    query: '*Enter a text, Ex: .(cmd) text/link ❗*',
    owner: '*For owner only 👑*',
    private: '*For private messages only ‼️*',
    group: '*For group only ‼️*',
    wait: '*🟢 Processing request...*',
    premium: '*For premium users only ☘️*',
    jadibot: '*You are not a jadibot user ❌*',
    admin: '*You are not an admin ❌*',
    botAdmin: '*(◍•ᴗ•◍) Please make me an admin*',
    banned: '*This chat has been banned ❌*',
    error: '*🔴 Your request failed*',
} 

/* 
  Path thumbnail 
*/
global.thumurl = '_'
global.thumb1 = fs.readFileSync("./data/@etc/ui/thumb:1.jpeg")
global.thumb2 = fs.readFileSync("./data/@etc/ui/thumb:2.jpeg")
global.thumb1x1 = fs.readFileSync("./data/@etc/ui/thumb1:1.jpeg") // wajib d bawah 10kb, kompres di: image.pi7.org

/*
  Tampilan munu & reply
*/
global.urls = "https://whatsapp.com/channel/0029Vb5jfyKBqbr7GIkkii1Y"
global.sourceurl = "https://chat.whatsapp.com/BSmzS9MStAx8cUa33oNeVz"
global.ids = "120363399405036720@newsletter"
global.nems = "© ᴢɪʏᴏᴏꜰꜰᴄ"
global.title = "Physic of Purity - "
global.xone = "☘️ 𝗡𝗮𝗵𝗶𝗱𝗮 𝗠𝗱"
global.body = "૮₍  • . • ⑅ ₎ა"
global.filename = "-"
global.packname = 'ㅤㅤ'
global.author = 'ㅤㅤ'
global.jpegfile = "𝚁𝚎𝚌𝚑𝚊𝚗𝚐𝚎 𝚝𝚑𝚎 𝚜𝚎𝚕𝚕𝚎𝚌𝚝𝚒𝚘𝚗"

/*
  Setting an Default bot
*/
global.owner = '6283117190494' // tambah manual pake: .addowner di nomor bot
global.pairkey = "AMBARUWO"
