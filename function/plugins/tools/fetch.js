import { Fetch } from '../../myfunc.js'

export default {
  id: ['get', 'post'],
  run: async ({ client, m, args, isMedia, quoted, mime, command }) => {
  if (!args[0]) return m.reply("Enter the URL...");
      switch (command) {
          case "get":             
              try {
                  const result = await Fetch.get(args[0]);
                  m.reply(JSON.stringify(result, null, 2));
              } catch (e) {
                  m.reply(`Error: ${e.message}`);
              }
              break

          case "post":
              if (!isMedia) return m.reply("Send file with caption: .post link");
              try {
                  let media = await quoted.download()
                  const result = await Fetch.post(args[0], media);
                  m.reply(JSON.stringify(result, null, 2));
              } catch (e) {
                  m.reply(`Error: ${e.message}`);
              }
              break
      }
  }
}
