import Boom from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import pino from 'pino'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import {
    fileURLToPath
} from 'url'
import {
    toAudio,
    toPTT,
    toVideo
} from '../converter.js'
import {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} from '../exif.js'
import {
    useMultiFileAuthState,
    makeWASocket,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    jidDecode,
    Browsers,
    downloadContentFromMessage,
    fetchLatestBaileysVersion
} from '@breakbeat/baileys'
import {
    bytesToSize,
    checkBandwidth,
    formatSize,
    getBuffer,
    isUrl,
    jsonformat,
    nganuin,
    pickRandom,
    runtime,
    shorturl,
    formatp,
    Fetch,
    color,
    getGroupAdmins
} from '../myfunc.js'
import {
    serialize
} from './serialize.js'
import {
    fileTypeFromBuffer
} from "file-type";
import {
    database_loader
} from '../handler.js'
import util from 'util';
import {
    exec
} from 'child_process';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const session = path.join(__dirname, '../../data/@etc/session')
const logger = pino({
    level: 'silent'
})
const {
    version,
    isLatest
} = await fetchLatestBaileysVersion()
const art = path.join(__dirname, "../../data/ascii.txt")
const ascii = await fs.promises.readFile(art, "utf8")

const eventMap = {
    "creds.update": "./event/creds-update.js",
    "connection.update": "./event/connection-update.js",
    "messages.upsert": "./event/messages-upsert.js"
};
const qs = (text) => new Promise((resolve) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question(text, (answer) => {
        rl.close()
        resolve(answer.trim())
    })
})

let client
let authState
let usePairing

console.log(ascii)
console.log(`
 ㅤ ㅤㅤㅤㅤㅤ${chalk.blueBright.bold("Breakbeat base - start")}
 ㅤ ㅤ${chalk.bold("client-esm V1.0.0 - plugin ")}${chalk.blueBright.bold("[Starting]")}

`)

export async function initSocket() {
    const kosong = !fs.existsSync(session) || fs.readdirSync(session).length === 0

    if (!authState) {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState(session)
        authState = {
            state,
            saveCreds
        }
    }

    if (kosong) {
        while (true) {
            const type = await qs(`${chalk.bgBlue("[SYSTEM]")} -> choose your method:\n\n1. [Scan QR]\n2. [Pairing code] : `)
            if (type === '1') {
                usePairing = false;
                break
            }
            if (type === '2') {
                usePairing = true;
                break
            }
            console.log(`${chalk.bgRed("[SYSTEM]")} -> Sir, please choose 1 or 2:\n`)
        }
    }

    const auth = {
        creds: authState.state.creds,
        keys: makeCacheableSignalKeyStore(authState.state.keys, logger),
    }

    client = makeWASocket({
        browser: Browsers.windows("Chrome"),
        version,
        auth,
        logger
    })

    if (usePairing && !client.authState.creds.registered) {
        let nomor
        while (true) {
            nomor = await qs(`${chalk.bgBlue("[SYSTEM]")} -> Enter your number: `)
            if (nomor && nomor.length >= 10) break
            console.log(`${chalk.bgYellow("[SYSTEM]")} -> Are you serious ?\n`)
        }
        const code = await client.requestPairingCode(nomor.replace(/[^0-9]/g, ''))
        console.log(`${chalk.bgBlue("[SYSTEM]")} -> Pairing Code: [ ${chalk.cyan(code)} ]`)
    }

    for (const [event, path] of Object.entries(eventMap)) {
        client.ev.on(event, async (...args) => {
            const module = await import(path);
            module.default(...args, client, authState, usePairing);
        });
    }

    return client
}

export function getSocket() {
    return client
}
export function getAuthState() {
    return authState
}