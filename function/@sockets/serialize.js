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
    proto,
    getContentType,
    areJidsSameUser,
    generateWAMessage,
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
    Subject
} from 'rxjs'
import {
    fileTypeFromBuffer
} from "file-type";
import util from 'util';
import {
    exec
} from 'child_process';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const serialize = async (client, m, store = null) => {
    try {
        client.decodeJid = (jid) => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {};
                return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
            } else return jid;
        };

        client.getFile = async (PATH, returnAsFilename) => {
            let res, filename;

            const data = Buffer.isBuffer(PATH) ?
                PATH :
                /^data:.*?\/.*?;base64,/i.test(PATH) ?
                Buffer.from(PATH.split`,` [1], "base64") :
                /^https?:\/\//.test(PATH) ?
                await (res = await fetch(PATH)).arrayBuffer().then(b => Buffer.from(b)) :
                fs.existsSync(PATH) ?
                (filename = PATH, fs.readFileSync(PATH)) :
                typeof PATH === "string" ?
                Buffer.from(PATH) :
                Buffer.alloc(0);

            if (!Buffer.isBuffer(data))
                throw new TypeError("Result is not a buffer");

            const type = await fileTypeFromBuffer(data) || {
                mime: "application/octet-stream",
                ext: "bin",
            };

            if (data && returnAsFilename && !filename) {
                filename = path.join(
                    __dirname,
                    "../../data/trash/" + Date.now() + "." + type.ext
                );
                await fs.promises.writeFile(filename, data);
            }

            return {
                res,
                filename,
                mime: type.mime,
                ext: type.ext,
                data,
                deleteFile() {
                    return filename && fs.promises.unlink(filename);
                },
            };
        };

        client.waitEvent = (eventName, is = () => true, maxTries = 25) => {
            return new Promise((resolve, reject) => {
                let tries = 0
                let on = (...args) => {
                    if (++tries > maxTries) reject('Max tries reached')
                    else if (is()) {
                        client.ev.off(eventName, on)
                        resolve(...args)
                    }
                }
                client.ev.on(eventName, on)
            })
        }

        client.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

        client.filter = (text) => {
            let mati = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
            if (/[aiueo][aiueo]([qwrtypsdfghjklzxcvbnm])?$/i.test(text)) return text.substring(text.length - 1)
            else {
                let res = Array.from(text).filter(v => mati.includes(v))
                let resu = res[res.length - 1]
                for (let huruf of mati) {
                    if (text.endsWith(huruf)) {
                        resu = res[res.length - 2]
                    }
                }
                let misah = text.split(resu)
                return resu + misah[misah.length - 1]
            }
        }

        client.msToDate = (ms) => {
            let days = Math.floor(ms / (24 * 60 * 60 * 1000));
            let daysms = ms % (24 * 60 * 60 * 1000);
            let hours = Math.floor((daysms) / (60 * 60 * 1000));
            let hoursms = ms % (60 * 60 * 1000);
            let minutes = Math.floor((hoursms) / (60 * 1000));
            let minutesms = ms % (60 * 1000);
            let sec = Math.floor((minutesms) / (1000));
            return days + " Hari " + hours + " Jam " + minutes + " Menit";
        }

        client.rand = async (isi) => {
            return isi[Math.floor(Math.random() * isi.length)]
        }

        client.sendMedia = async (jid, path, quoted, options = {}) => {
            let {
                ext,
                mime,
                data
            } = await client.getFile(path)
            messageType = mime.split("/")[0]
            pase = messageType.replace('application', 'document') || messageType
            return await client.sendMessage(jid, {
                [`${pase}`]: data,
                mimetype: mime,
                ...options
            }, {
                quoted
            })
        }

        client.adReply = (jid, text, title = '', body = '', buffer, source = '', quoted, options) => {
                let {
                    data
                } = client.getFile(buffer, true)
                return client.sendMessage(jid, {
                    text: text,
                    contextInfo: {
                        mentionedJid: client.parseMention(text),
                        externalAdReply: {
                            showAdAttribution: true,
                            mediaType: 1,
                            title: title,
                            body: body,
                            thumbnailUrl: 'https://telegra.ph/file/dc25ebc5fe9ccf01.jpg',
                            renderLargerThumbnail: true,
                            sourceUrl: source
                        }
                    }
                }, {
                    quoted: quoted,
                    ...options,
                    ...ephemeral
                })

                enumerable: true
            },

            client.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
                let type = await client.getFile(path, true)
                let {
                    res,
                    data: file,
                    filename: pathFile
                } = type

                if (res && res.status !== 200 || file.length <= 65536) {
                    try {
                        throw {
                            json: JSON.parse(file.toString())
                        }
                    } catch (e) {
                        if (e.json) throw e.json
                    }
                }

                let opt = {}
                if (quoted) opt.quoted = quoted
                if (!type) options.asDocument = true

                let mtype = '',
                    mimetype = type.mime,
                    convert

                if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
                else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
                else if (/video/.test(type.mime)) mtype = 'video'
                else if (/audio/.test(type.mime))(
                    convert = await (ptt ? toPTT : toAudio)(file, type.ext),
                    file = convert.data,
                    pathFile = convert.filename,
                    mtype = 'audio',
                    mimetype = 'audio/ogg; codecs=opus'
                )
                else mtype = 'document'

                if (options.asDocument) mtype = 'document'

                let message = {
                    ...options,
                    caption,
                    ptt,
                    [mtype]: {
                        url: pathFile
                    },
                    fileName: filename || path.basename(pathFile),
                    mimetype
                }

                let m
                try {
                    m = await client.sendMessage(jid, message, {
                        ...opt,
                        ...options
                    })
                } catch (e) {
                    console.error(e)
                    m = null
                } finally {
                    if (!m) {
                        m = await client.sendMessage(
                            jid, {
                                ...message,
                                [mtype]: file
                            }, {
                                ...opt,
                                ...options
                            }
                        )
                    }
                    return m
                }
            }


        client.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let buffer
            if (options && (options.packname || options.author)) {
                buffer = await writeExifImg(buff, options)
            } else {
                buffer = await imageToWebp(buff)
            }

            await client.sendMessage(jid, {
                sticker: {
                    url: buffer
                },
                ...options
            }, {
                quoted
            })
            return buffer
        }

        client.sendContact = async (jid, data, quoted, options) => {
                if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
                let contacts = []
                for (let [number, name] of data) {
                    number = number.replace(/[^0-9]/g, '')
                    let njid = number + '@s.whatsapp.net'
                    let biz = await client.getBusinessProfile(njid).catch(_ => null) || {}
                    let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
ORG:
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:Ponsel${biz.description ? `
item2.EMAIL;type=INTERNET:${(biz.email || '').replace(/\n/g, '\\n')}
item2.X-ABLabel:Email
PHOTO;BASE64:${(await client.getFile(await client.profilePictureUrl(njid)).catch(_ => ({})) || {}).number?.toString('base64')}
X-WA-BIZ-DESCRIPTION:${(biz.description || '').replace(/\n/g, '\\n')}
X-WA-BIZ-NAME:${name.replace(/\n/g, '\\n')}
` : ''}
END:VCARD
`.trim()
                    contacts.push({
                        vcard,
                        displayName: name
                    })

                }
                return client.sendMessage(jid, {
                    ...options,
                    contacts: {
                        ...options,
                        displayName: (contacts.length >= 2 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
                        contacts,
                    }
                }, {
                    quoted,
                    ...options
                })
                enumerable: true
            },

            client.sendList = async (jid, header, footer, separate, buttons, rows, quoted, options) => {
                    const inputArray = rows.flat()
                    const result = inputArray.reduce((acc, curr, index) => {
                        if (index % 2 === 1) {
                            const [title, rowId, description] = curr[0]
                            acc.push({
                                title,
                                rowId,
                                description
                            })
                        }
                        return acc
                    }, [])
                    let teks = result
                        .map((v, index) => {
                            return `${v.title || ''}\n${v.rowId || ''}\n${v.description || ''}`.trim()
                        })
                        .filter(v => v)
                        .join("\n\n")
                    return client.sendMessage(jid, {
                        ...options,
                        text: teks
                    }, {
                        quoted,
                        ...options
                    })
                },

                client.reply = (jid, text = '', quoted, options = {}) => {
                    const mentions = client.parseMention(text)
                    if (Buffer.isBuffer(text)) {
                        return client.sendFile(jid, text, 'file', '', quoted, false, options)
                    } else {
                        return client.sendMessage(
                            jid, {
                                text,
                                mentions,
                                ...options
                            }, {
                                quoted,
                                ...options,
                                mentions
                            }
                        )
                    }
                }

        client.sendImage = async (jid, path, caption = '', quoted = '', options = {}) => {

            let buffer

            if (Buffer.isBuffer(path)) {
                buffer = path

            } else if (/^data:.*?\/.*?;base64,/i.test(path)) {
                buffer = Buffer.from(path.split`,` [1], 'base64')

            } else if (/^https?:\/\//.test(path)) {
                const res = await fetch(path)
                if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
                buffer = Buffer.from(await res.arrayBuffer())

            } else if (fs.existsSync(path)) {
                buffer = fs.readFileSync(path)

            } else {
                buffer = Buffer.alloc(0)
            }

            return await client.sendMessage(
                jid, {
                    image: buffer,
                    caption,
                    ...options
                }, {
                    quoted
                }
            )
        }

        client.resize = async (image, width, height) => {
            let oyy = await Jimp.read(image)
            let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG)
            return kiyomasa
        }

        client.fakeReply = (jid, text = '', fakeJid = client.user.jid, fakeText = '', fakeGroupJid, options) => {
            return client.sendMessage(jid, {
                text: text
            }, {
                ephemeralExpiration: 86400,
                quoted: {
                    key: {
                        fromMe: fakeJid == client.user.jid,
                        participant: fakeJid,
                        ...(fakeGroupJid ? {
                            remoteJid: fakeGroupJid
                        } : {})
                    },
                    message: {
                        conversation: fakeText
                    },
                    ...options
                }
            })
        }

        client.sendText = (jid, text, quoted = '', options) => client.sendMessage(jid, {
            text: text,
            ...options
        }, {
            quoted
        })

        client.sendGroupV4Invite = async (jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', options = {}) => {
            let msg = proto.Message.fromObject({
                groupInviteMessage: proto.GroupInviteMessage.fromObject({
                    inviteCode,
                    inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date + (3 * 86400000)),
                    groupJid: jid,
                    groupName: groupName ? groupName : this.getName(jid),
                    caption
                })
            })
            let message = await this.prepareMessageFromContent(participant, msg, options)
            await this.relayWAMessage(message)
            return message
        }

        client.cMod = (jid, message, text = '', sender = client.user.jid, options = {}) => {
            let copy = message.toJSON()
            let mtype = Object.keys(copy.message)[0]
            let isEphemeral = false
            if (isEphemeral) {
                mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
            }
            let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
            let content = msg[mtype]
            if (typeof content === 'string') msg[mtype] = text || content
            else if (content.caption) content.caption = text || content.caption
            else if (content.text) content.text = text || content.text
            if (typeof content !== 'string') msg[mtype] = {
                ...content,
                ...options
            }
            if (copy.participant) sender = copy.participant = sender || copy.participant
            else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
            if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
            else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
            copy.key.remoteJid = jid
            copy.key.fromMe = areJidsSameUser(sender, client.user.id) || false
            return proto.WebMessageInfo.fromObject(copy)
        }

        client.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
            let m = generateForwardMessageContent(message, !!forwardingScore)
            let mtype = Object.keys(m)[0]
            if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
            m = generateWAMessageFromContent(jid, m, {
                ...options,
                userJid: client.user.id
            })
            await client.relayMessage(jid, m.message, {
                messageId: m.key.id,
                additionalAttributes: {
                    ...options
                }
            })
            return m
        }

        client.loadMessage = client.loadMessage || (async (messageID) => {
            return Object.entries(client.chats)
                .filter(([_, {
                    messages
                }]) => typeof messages === 'object')
                .find(([_, {
                        messages
                    }]) => Object.entries(messages)
                    .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
                ?.[1].messages?.[messageID]
        })

        client.downloadM = async (m, type, saveToFile) => {
            if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
            const stream = await downloadContentFromMessage(m, type)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            if (saveToFile) var {
                filename
            } = await client.getFile(buffer, true)
            return saveToFile && fs.existsSync(filename) ? filename : buffer
        }


        client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
            let quoted = message.msg ? message.msg : message
            let mime = (message.msg || message).mimetype || ''
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
            const stream = await downloadContentFromMessage(quoted, messageType)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            let type = await FileType.fromBuffer(buffer)
            trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
            await fs.writeFileSync(trueFileName, buffer)
            return trueFileName
        }


        client.parseMention = (text = '') => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }

        client.chatRead = async (jid, participant = client.user.jid, messageID) => {
            return await client.sendReadReceipt(jid, participant, [messageID])
        }

        client.sendStimg = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let buffer
            if (options && (options.packname || options.author)) {
                buffer = await writeExifImg(buff, options)
            } else {
                buffer = await imageToWebp(buff)
            }
            await client.sendMessage(jid, {
                sticker: {
                    url: buffer
                },
                ...options
            }, {
                quoted
            })
            return buffer
        }

        client.downloadMediaMessage = async (message) => {
            let mime = (message.msg || message).mimetype || ''
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
            const stream = await downloadContentFromMessage(message, messageType)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            return buffer
        }

        client.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let buffer
            if (options && (options.packname || options.author)) {
                buffer = await writeExifVid(buff, options)
            } else {
                buffer = await videoToWebp(buff)
            }
            await client.sendMessage(jid, {
                sticker: {
                    url: buffer
                },
                ...options
            }, {
                quoted
            })
            return buffer
        }

        client.parseMention = (text = '') => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }

        client.sendTextWithMentions = async (jid, text, quoted, options = {}) => client.sendMessage(jid, {
            text: text,
            contextInfo: {
                mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
            },
            ...options
        }, {
            quoted
        })

        client.getName = (jid, withoutContact = false) => {
            id = client.decodeJid(jid);
            withoutContact = client.withoutContact || withoutContact;
            let v;
            if (id.endsWith("@g.us"))
                return new Promise(async (resolve) => {
                    v = store.contacts[id] || {};
                    if (!(v.name || v.subject)) v = client.groupMetadata(id) || {};
                    resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
                });
            else
                v =
                id === "0@s.whatsapp.net" ? {
                    id,
                    name: "WhatsApp",
                } :
                id === client.decodeJid(client.user.id) ?
                client.user :
                store.contacts[id] || {};
            return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
        };

        client.sendPoll = async (jid, name = '', optiPoll, options) => {
            if (!Array.isArray(optiPoll[0]) && typeof optiPoll[0] === 'string') optiPoll = [optiPoll];
            if (!options) options = {};
            const pollMessage = {
                name: name,
                options: optiPoll.map(btn => ({
                    optionName: btn[0] || ''
                })),
                selectableOptionsCount: 1
            };
            return client.relayMessage(jid, {
                pollCreationMessage: pollMessage
            }, {
                ...options
            });
        };

        client.setBio = async (status) => {
            return await client.query({
                tag: 'iq',
                attrs: {
                    to: 's.whatsapp.net',
                    type: 'set',
                    xmlns: 'status',
                },
                content: [{
                    tag: 'status',
                    attrs: {},
                    content: Buffer.from(status, 'utf-8')
                }]
            })
        }

        client.format = (...args) => {
            return util.format(...args)
        }

        client.getBuffer = async (url, options) => {
            try {
                options ? options : {}
                const res = await axios({
                    method: "get",
                    url,
                    headers: {
                        'DNT': 1,
                        'Upgrade-Insecure-Request': 1
                    },
                    ...options,
                    responseType: 'arraybuffer'
                })
                return res.data
            } catch (e) {
                console.log(`Error : ${e}`)
            }
        }

        client.public = true;
        client.serializeM = (m) => serialize(client, m, store)

        if (!m) return m;
        let M = proto.WebMessageInfo;
        if (m.key) {
            m.id = m.key.id;
            m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
            m.chat = m.key.remoteJid;
            m.fromMe = m.key.fromMe;
            m.isGroup = m.chat.endsWith('@g.us');
            m.sender = client.decodeJid(m.fromMe && client.user.id || m.participant || m.key.participant || m.chat || '');
            if (m.isGroup) m.participant = client.decodeJid(m.key.participant) || '';
        }
        if (m.message) {
            m.mtype = getContentType(m.message);
            m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
            m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text;
            let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null;
            m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
            if (m.msg.caption) {
                m.caption = m.msg.caption;
            }
            if (m.quoted) {
                let type = Object.keys(m.quoted)[0];
                m.quoted = m.quoted[type];
                if (['productMessage'].includes(type)) {
                    type = Object.keys(m.quoted)[0];
                    m.quoted = m.quoted[type];
                }
                if (typeof m.quoted === 'string') m.quoted = {
                    text: m.quoted
                };
                m.quoted.mtype = type;
                m.quoted.id = m.msg.contextInfo.stanzaId;
                m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
                m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false;
                m.quoted.sender = client.decodeJid(m.msg.contextInfo.participant);
                m.quoted.fromMe = m.quoted.sender === client.decodeJid(client.user.id);
                m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
                m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
                m.getQuotedObj = m.getQuotedMessage = async () => {
                    if (!m.quoted.id) return false;
                    let q = await store.loadMessage(m.chat, m.quoted.id, inf);
                    return serialize(client, q, store);
                };
                let vM = m.quoted.fakeObj = M.fromObject({
                    key: {
                        remoteJid: m.quoted.chat,
                        fromMe: m.quoted.fromMe,
                        id: m.quoted.id
                    },
                    message: quoted,
                    ...(m.isGroup ? {
                        participant: m.quoted.sender
                    } : {})
                });
                m.quoted.delete = () => client.sendMessage(m.quoted.chat, {
                    delete: vM.key
                });
                m.quoted.copyNForward = (jid, forceForward = false, options = {}) => client.copyNForward(jid, vM, forceForward, options);
                m.quoted.download = () => client.downloadMediaMessage(m.quoted);
            }
        }
        if (m.msg.url) m.download = () => client.downloadMediaMessage(m.msg);
        m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || '';
        m.reply = (mess, chatId = m.chat, options = {}) => {
       /*     return client.sendMessage(chatId, {
                text: mess,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: xone,
                        body: nems,
                        thumbnail: thumb1x1,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, {
                quoted: m
            })*/
            return client.sendMessage(chatId, {
               document: fs.readFileSync("./package.json"),
               fileName: xone,
               fileLength: 99999999999999,
               mimetype: 'image/png',
               jpegThumbnail: thumb1x1,
               caption: mess,
            }, { 
                quoted: m,
            });
        };
        m.copy = () => serialize(client, M.fromObject(M.toObject(m)));
        m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => client.copyNForward(jid, m, forceForward, options);
        client.appenTextMessage = async (text, chatUpdate) => {
            let messages = await generateWAMessage(m.chat, {
                text: text,
                mentions: m.mentionedJid
            }, {
                userJid: client.user.id,
                quoted: m.quoted && m.quoted.fakeObj
            });
            messages.key.fromMe = areJidsSameUser(m.sender, client.user.id);
            messages.key.id = m.key.id;
            messages.pushName = m.pushName;
            if (m.isGroup) messages.participant = m.sender;
            let msg = {
                ...chatUpdate,
                messages: [proto.WebMessageInfo.fromObject(messages)],
                type: 'append'
            };
            client.ev.emit('messages.upsert', msg);
        };

        return m;
    } catch (err) {
        console.error(err)
        return m
    }
}