export default {
  id: 'kalkulator',
  run: async ({ client, m, text, quoted, mime, command }) => {    
        let chp
        chp = text
            .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π|pi/gi, 'Math.PI')
            .replace(/e/gi, 'Math.E')
            .replace(/\/+/g, '/')
            .replace(/\++/g, '+')
            .replace(/-+/g, '-')
        let format = chp
            .replace(/Math\.PI/g, 'π')
            .replace(/Math\.E/g, 'e')
            .replace(/\//g, '÷')
            .replace(/\*×/g, '×')
        try {
            let result = (new Function('return ' + chp))()
            if (!result) throw result
            m.reply(`*${format}* = ${result}`)
        } catch (e) {
            if (e == undefined) return
            m.reply('Incorrect format, only 0-9 and Symbols -, +, *, /, ×, ÷, π, e, (, ) yang disupport')
        }
  }
}
        