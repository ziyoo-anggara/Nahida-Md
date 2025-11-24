export default {
  id: 'tagall',
  group: true,
  run: async ({ client, m, command, text }) => {
    const metadata = await client.groupMetadata(m.chat);
    const members = metadata.participants.map(p => p.id);

    client.sendMessage(m.chat, {
      text: "@" + m.chat,
        contextInfo: {
        groupMentions: [{ groupJid: m.chat, groupSubject: 'everyone' }],
        mentionedJid: members
      }
    })
  }
}
