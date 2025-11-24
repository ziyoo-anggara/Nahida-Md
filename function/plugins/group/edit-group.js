export default {
  id: ['editsubjek', 'editdesk', 'editgroup'],
  group: true,
  botadmin: true,
  admin: true,
  run: async ({ client, m, command, text }) => {
    const groupe = await client.groupMetadata(m.chat);
    const members = groupe.participants;
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (command == 'editsubjek') {
      client.groupUpdateSubject(m.chat, text).then(() => {
        m.reply('Successfully changed the group subject');
      }).catch((err) => m.reply(err))
    } else if (command == 'editdesk') {
      client.groupUpdateDescription(m.chat, text).then(() => {
        m.reply('Successfully changed the group description');
      }).catch((err) => m.reply(err))
    } else {
      if (text === 'on' || text === 'off') {
        await client.groupSettingUpdate(m.chat, text === 'on' ? 'unlocked' : 'locked')
          .then(() => m.reply(`Succes ${text === 'on' ? 'Opening' : 'Close'} Edit Group Info for all members`))
          .catch(err => m.reply(err));
      } else {
        m.reply("*on / off*");
      }
    }
  }
}