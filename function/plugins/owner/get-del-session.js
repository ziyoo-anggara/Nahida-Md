import fs from 'fs'

export default {
  id: ['delsession', 'getsession'],
  owner: true,
  run: async ({ client, m, itsMe, command, text }) => {
     switch(command) {
         case 'delsession':
            case 'clearsession': {
                fs.readdir("./data/@etc/session", async function(err, files) {        
                    let filter = await files.filter(item => item.startsWith("pre-key") ||
                        item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")
                    )
                    
                    let teks;
                    if (filter.length == 0) return
                    filter.map(function(e, i) {
                        teks += (i + 1) + `. ${e}\n`
                    })
                    
                    
                    await filter.forEach(function(file) {
                        fs.unlinkSync(`./data/@etc/session/${file}`)
                    });
                    m.reply(mess.done)
                });
            }
            break
        case 'getsession':              
                const sesi = fs.readFileSync('./data/@etc/session/creds.json')
                client.sendMessage(m.chat, {
                    document: sesi,
                    mimetype: 'application/json',
                    fileName: 'creds.json',
                    caption: mess.done
                }, {
                    quoted: m
                })
           break
        }
    }
}
