export default {
  id: ['restart', 'shutdown'],
  owner: true,
  run: async ({ client, m, itsMe, command, text }) => {
    await m.reply("*Tunggu beberapa detik dan " + command + " akan berhasil*")
    setTimeout(() => {
        if (command == "restart") {
            process.send("reset")
        } else {
            process.exit(2)
        }
    }, 3000)
  }
}
