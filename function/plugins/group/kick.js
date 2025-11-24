export default {
  id: 'kick',
  group: true,
  admin: true,
  botadmin: true,
  run: async ({ client, m, command, text }) => {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    let target;

    if (m.quoted) {
        target = m.quoted.key?.participant; 
    } 
    else if (mentioned.length > 0) {
        target = mentioned[0]; 
    } 
    else if (text) {
        const num = text.replace(/[^0-9]/g, '');
        if (!num) return
        target = `${num}@lid`;
    }

    if (!target) return m.reply('Enter number / tag / reply the chat');

    await client.groupParticipantsUpdate(m.chat, [target], 'remove')
    .catch(e => m.reply("Failed to kick: " + e));
  }
}
