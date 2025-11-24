export default {
  id: ['git', 'gitclone'],
  run: async ({ client, m, args }) => {
    if (!args[0].includes('github.com')) return m.reply(mess.query)
    let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    let [, user, repo] = args[0].match(regex1) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, {
        method: 'HEAD'
    })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    client.sendMessage(m.chat, {
        document: {
            url: url
        },
        fileName: filename + '.zip',
        mimetype: 'application/zip'
    }).catch((err) => (err))
  }
}