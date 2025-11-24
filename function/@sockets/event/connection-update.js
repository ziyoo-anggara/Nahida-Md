import Boom from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import chalk from 'chalk'
import {
    makeWASocket,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    jidDecode,
    Browsers,
    downloadContentFromMessage,
    fetchLatestBaileysVersion
} from '@breakbeat/baileys'
import { 
    initSocket
} from '../socket.js'

export default async function(update, client, authState, usePairing) {
    const {
        connection,
        lastDisconnect,
        qr
    } = update
    if (qr && !usePairing) {
        console.log(`${chalk.bgYellow("[SYSTEM]")} -> Scan this QR:`)
        qrcode.generate(qr, {
            small: true
        })
    }

    if (connection === 'close') {
        const reason = Boom.boomify(lastDisconnect?.error)?.output?.statusCode
        console.log(`${chalk.bgRed("[SYSTEM]")} -> Connection closed, reason: ${reason}`)

        switch (reason) {
            case DisconnectReason.connectionLost:
            case DisconnectReason.connectionReplaced:
            case DisconnectReason.restartRequired:
            case DisconnectReason.timedOut:
                console.log(`${chalk.bgYellow("[SYSTEM]")} -> Restarting socket...`)
                try {
                    if (client?.ws) client.ws.close()
                    if (client?.end) client.end()
                } catch (e) {
                    console.log(`${chalk.bgRed("[SYSTEM]")} -> Error while closing connection:`, e)
                }

                setTimeout(async () => {
                    await initSocket()
                    console.log(`${chalk.bgGreen("[SYSTEM]")} -> Socket restarted successfully`)
                }, 3000)
                break

            case DisconnectReason.loggedOut:
                console.log(`${chalk.bgRed("[SYSTEM]")} -> Device Logged Out, please scan again.`)
                client.logout()
                break

            default:
                setTimeout(async () => {
                    await initSocket()
                }, 3000)
                break
        }
    } else if (connection === "connecting") {
        console.log(`${chalk.bgYellow("[SYSTEM]")} -> Connecting to WhatsApp...`)
    } else if (connection === "open") {
        console.log(`${chalk.bgBlue("[SYSTEM]")} -> Successfully connected to the previous session`)
    }
}