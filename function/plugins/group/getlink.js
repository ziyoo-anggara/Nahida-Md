export default {
  id: ['linkgc', 'linkgroup'],
  group: true,
  botadmin: true,
  run: async ({ client, m, command, text }) => {
    const groupe = await client.groupMetadata(m.chat);
    const members = groupe.participants;  
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const response = await client.groupInviteCode(m.chat)
    
    m.reply(`*\`[ ${groupe.subject} ]\`*\n\n*Link:* https://chat.whatsapp.com/${response}`)
  }
}
