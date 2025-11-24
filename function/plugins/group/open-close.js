export default {
  id: ['opengc', 'closegc'],
  group: true,
  admin: true,
  botadmin: true,
  run: async ({ client, m, command, text }) => {
    const groupe = await client.groupMetadata(m.chat);
    const members = groupe.participants;  
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    if (command == 'closegc') {
        await client.groupSettingUpdate(m.chat, 'announcement')
        m.reply(mess.done)
    } else {
        await client.groupSettingUpdate(m.chat, 'not_announcement')
        m.reply(mess.done)
    }
  }
}
