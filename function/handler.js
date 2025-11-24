import {
    command$
} from './@sockets/event/messages-upsert.js';
import fs from 'fs';
import path from 'path';
import _ from "lodash";
import {
    Low
} from "lowdb";
import {
    JSONFile
} from "lowdb/node";
import yargs from "yargs/yargs";
import {
    fileURLToPath
} from 'url'
import chalk from 'chalk'
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
} from './myfunc.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const folderPlugin = path.join(__dirname, 'plugins')
const plugins = new Map()
const isPlugin = name => typeof name === 'string' && name.endsWith('.js')

const dbFolder = path.join(__dirname, "../data");
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, {
    recursive: true
});

const dbFile = path.join(dbFolder, "database.json");
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, "{}");

const adapter = new JSONFile(dbFile);
const __default = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {}
};

global.db = new Low(adapter, __default);

global.opts = yargs(process.argv.slice(2))
    .exitProcess(false)
    .parse();

global.loadDatabase = async function loadDatabase() {
    global.db.READ = true;
    await global.db.read();
    global.db.READ = false;

    if (!global.db.data || Object.keys(global.db.data).length === 0) {
        global.db.data = __default;
        await global.db.write();
    }

    global.db.chain = _.chain(global.db.data);
};

await global.loadDatabase();

export const database_loader = async (m, bot) => {
    await global.loadDatabase();

    const __data_user = {
        Owner: false,
        isBanned: false,
        Premium: false,
        hitcmd: 0
    };

    const __data_chat = {
        mute: false
    };

    const __data_setting = {
        autoread: false,
        prefix: '.'
    };

    global.db.data.users[m.sender] = {
        ...__data_user,
        ...global.db.data.users[m.sender]
    };

    global.db.data.chats[m.chat] = {
        ...__data_chat,
        ...global.db.data.chats[m.chat]
    };

    global.db.data.settings[bot] = {
        ...__data_setting,
        ...global.db.data.settings[bot]
    };
};

async function loadPlugin(filePath) {
    try {

        const mod = await import(filePath + `?update=${Date.now()}`)
        if (!mod?.default) return

        const plugin = mod.default
        if (!plugin.id || typeof plugin.run !== 'function') return

        if (Array.isArray(plugin.id)) {
            plugin.id.forEach(cmd => plugins.delete(cmd))
            plugin.id.forEach(cmd => plugins.set(cmd, plugin))
        } else {
            plugins.delete(plugin.id)
            plugins.set(plugin.id, plugin)
        }

    } catch (err) {
        console.log(chalk.bgRed("[PLUGIN ERROR]"), filePath, err)
    }
}

function scanPlugin(dir) {
    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file)
        const stat = fs.statSync(full)

        if (stat.isDirectory()) {
            scanPlugin(full)
        } else if (isPlugin(file)) {
            loadPlugin(full)
        }
    }
}

scanPlugin(folderPlugin)

function watchRecursive(dir) {
    fs.watch(dir, (event, filename) => {
        if (!filename) return
        const full = path.join(dir, filename)
        if (fs.existsSync(full)) {
            const stat = fs.statSync(full)
            if (stat.isDirectory()) return watchRecursive(full)
        }
        if (isPlugin(filename)) loadPlugin(full)
    })

    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file)
        if (fs.statSync(full).isDirectory()) watchRecursive(full)
    }
}

watchRecursive(folderPlugin)

command$.subscribe(async system => {
    try {
        const plugin = plugins.get(system.command)
        const {
            m,
            client,
            botLid,
            jid
        } = system
        if (!plugin) return

        const isGroup = m?.key?.remoteJid?.endsWith("@g.us");
        const groupMetadata = isGroup ?
            await client.groupMetadata(jid).catch(e => ({})) : {};
        const groupName = isGroup ? groupMetadata.subject || '' : '';
        const participants = isGroup ? groupMetadata.participants || [] : [];
        const groupAdmins = isGroup ? getGroupAdmins(participants) : [];
        const senderLid = m.key.participant;
        const isBotAdmins = isGroup ? groupAdmins.includes(botLid) : false;
        const isAdmins = isGroup ? groupAdmins.includes(senderLid) : false;
        const isOwner = global.db.data.users[m.sender]?.Owner || false;
        const isPremium = global.db.data.users[m.sender]?.Premium || false;

        const botNumber = await client.decodeJid(client.user.id);
        const itsMe = (m.sender == botNumber) || false;

        if (!global.db.data.users[botNumber]) {
            global.db.data.users[botNumber] = {
                Owner: true,
                Premium: true,
                isBanned: false,
                hitcmd: 0
            }
        } else {
            global.db.data.users[botNumber].Owner = true
            global.db.data.users[botNumber].Premium = true
        }


        if (plugin.group && !m.isGroup) {
            return m.reply(mess.group)
        }

        if (plugin.owner && !isOwner) {
            return m.reply(mess.owner)
        }

        if (plugin.premium && !isPremium) {
            return m.reply(mess.premium)
        }

        if (plugin.admin && !isAdmins) {
            return m.reply(mess.admin)
        }

        if (plugin.botadmin && !isBotAdmins) {
            return m.reply(mess.botAdmin)
        }

        global.db.data.users[m.sender].hitcmd += 1;
        await plugin.run(system);
        await global.db.write();

    } catch (err) {
        console.log(chalk.bgRed("[PLUGIN ERROR]"), system.command, err)
    }
})