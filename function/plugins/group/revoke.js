export default {
  id: ['revoke', 'resetlinkgc'],
  group: true,
  admin: true,
  botadmin: true,
  run: async ({ client, m, command, text }) => {
    await client.groupRevokeInvite(m.chat)
    await m.reply(mess.done)
  }
}
