export default {
  id: ['promote', 'demote', 'demoteall', 'promoteall'],
  group: true,
  admin: true,
  botadmin: true,
  run: async ({ client, m, command, text }) => {
    const groupe = await client.groupMetadata(m.chat);
    const members = groupe.participants;  
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    let target;

    if (m.quoted) {
      target = m.quoted.key?.participant; 
    } else if (mentioned.length > 0) {
      target = mentioned[0]; 
    } else if (text) {
      const num = text.replace(/[^0-9]/g, '');
      if (num) target = `${num}@lid`;   
    }

    if (!target) return m.reply('Enter number / tag / reply the chat');

    switch (command) {
      case "promote":
        await client.groupParticipantsUpdate(m.chat, [target], 'promote')
          .catch(e => m.reply("Failed to promote: " + e));
        break
        
      case "demote":
        await client.groupParticipantsUpdate(m.chat, [target], 'demote')
          .catch(e => m.reply("Failed to demote: " + e));
        break
    }
  }
}
