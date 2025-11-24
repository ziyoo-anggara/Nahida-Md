export default {
  id: ['addowner', 'delowner'],
  owner: true,
  run: async ({ client, m, itsMe, command, text }) => {
    if (!text) return m.reply(mess.query)

    let nomor = text.replace(/[^0-9]/g, '');
    let jid = nomor + '@s.whatsapp.net';
    let info = await client.onWhatsApp(jid);
    let lid = info[0].lid;
    
    if (!info || info.length === 0) return
    if (!global.db.data.users[lid]) global.db.data.users[lid] = {}
    if (!lid) return 
    if (command == 'addowner') {
       global.db.data.users[lid].Owner = true;
       global.db.data.users[lid].Premium = true;
    } else {
       global.db.data.users[lid].Owner = false;
       global.db.data.users[lid].Premium = false;
    }
    
    m.reply(mess.succes)
  }
}
