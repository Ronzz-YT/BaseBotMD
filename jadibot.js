const { modul } = require('./function/module');
const { baileys, boom, chalk, fs, path, process } = modul;
const { Boom } = boom
const { default: makeWaSocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, generateWAMessage, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = baileys
const { color, bgcolor } = require('./function/console')
const logg = (pino = require("pino"));
const qrcode = require('qrcode');
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize } = require('./function/myfunc');
let welcome = JSON.parse(fs.readFileSync('./database/bot/welcome.json'));
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const jadibot = async (ronzz, msg, from) => {
const { sendImage, sendMessage } = ronzz;
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, `./database/jadibot/${sender.split("@")[0]}.json`), logg({ level: "silent" }));
try {
async function start() {
let { version, isLatest } = await fetchLatestBaileysVersion();
const ronzz = await makeWaSocket({
auth: state,
printQRInTerminal: true,
browser: ['Jadi Bot [ By Ronzz YT ]', "Chrome", "1.0.0"],
logger: logg({ level: "silent" }),
version,
})

ronzz.ev.on('messages.upsert', async chatUpdate => {
try {
kay = chatUpdate.messages[0]
if (!kay.message) return
kay.message = (Object.keys(kay.message)[0] === 'ephemeralMessage') ? kay.message.ephemeralMessage.message : kay.message
if (kay.key && kay.key.remoteJid === 'status@broadcast') return
if (!ronzz.public && !kay.key.fromMe && chatUpdate.type === 'notify') return
if (kay.key.id.startsWith('BAE5') && kay.key.id.length === 16) return
m = smsg(ronzz, kay, store)
msg.isBaileys = kay.key.id.startsWith('BAE5') || kay.key.id.startsWith('3EB0')
require('./index')(ronzz, m, store, welcome)
} catch (err) {
console.log(err)}
})

store.bind(ronzz.ev);
ronzz.ev.on("creds.update", saveCreds);
ronzz.ev.on("connection.update", async up => {
const { lastDisconnect, connection } = up;
if (connection == "connecting") return
if (connection){
if (connection != "connecting") console.log("Connecting to jadibot..")
}
if (up.qr) await sendImage(from, await qrcode.toDataURL(up.qr,{scale : 8}), 'Scan QR ini untuk jadi bot sementara\n\n1. Klik titik 3 di pojok kanan atas\n2. Klik Perangkat Tertaut\n3. Scan QR ini\n\n*Note :*\nQR Expired dalam 30 detik', msg)
console.log(connection)
if (connection == "open") {
await ronzz.sendMessage(from, { text: `*Connected to Whatsapp - Bot*\n\n*User :*\n _*× ID : ${ronzz.decodeJid(ronzz.user.id)}*_`}, { quoted: msg })
let user = `${ronzz.decodeJid(ronzz.user.id)}`
let txt = `*Terdeteksi menumpang Jadibot*\n\n _× User : @${user.split("@")[0]}_`
ronzz.sendMessage('628817839722@s.whatsapp.net', {text: txt, mentions : [user]})
}

if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode
if (reason === DisconnectReason.badSession) { 
console.log(`Bad Session File, Please Delete Session and Scan Again`); ronzz.logout(); }
else if (reason === DisconnectReason.connectionClosed) { 
console.log("Connection closed, reconnecting...."); start(); }
else if (reason === DisconnectReason.connectionLost) { 
console.log("Connection Lost from Server, reconnecting..."); start(); }
else if (reason === DisconnectReason.connectionReplaced) { 
console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); ronzz.logout(); }
else if (reason === DisconnectReason.loggedOut) { 
console.log(`Device Logged Out, Please Scan Again And Run.`); ronzz.logout(); }
else if (reason === DisconnectReason.restartRequired) { 
console.log("Restart Required, Restarting..."); start(); }
else if (reason === DisconnectReason.timedOut) { 
console.log("Connection TimedOut, Reconnecting..."); start(); }
else ronzz.end(`Unknown DisconnectReason: ${reason}|${connection}`)
}
})

        ronzz.spam = []

        ronzz.ev.on('group-participants.update', async (update) =>{
           const isWelcome = welcome
           if(!isWelcome.includes(update.id)) return
           if(isWelcome.includes(update.id)) {
           const metadata = await ronzz.groupMetadata(update.id)
for (let participant of update.participants) {
try{
let dnew = new Date(new Date + 3600000)
let hari = dnew.toLocaleDateString('id', { weekday: 'long' })
const d = new Date
const tanggal = d.toLocaleDateString('id', { 
day: 'numeric', 
month: 'long', 
year: 'numeric' 
})
const jamwib = moment.tz('asia/jakarta').format('HH:mm:ss')
let metadata = await ronzz.groupMetadata(update.id)
let participants = update.participants
for (let num of participants) {
if (update.action == 'demote') {
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'Selamat🎉'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{ 
text: `*@${num.split("@")[0]} Demote From ${metadata.subject}*`,
buttons: button, 
footer: `${botName} © 2022`,
mentions: [num] })
}
if (update.action == 'promote') {
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'Selamat🎉'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{ 
text: `*@${num.split("@")[0]} Promote From ${metadata.subject}*`,
buttons: button, 
footer: `${botName} © 2022`,
mentions: [num] })
}
if (update.action == 'add') {
try {
var ppuser = await ronzz.profilePictureUrl(num, 'image')
} catch {
var ppuser = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
}
const bio = (await ronzz.fetchStatus(num).catch(console.error) || {}).status || 'Tidak ada bio, mungkin kamu private🙏'
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'Welcome👋'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{ 
image: { url: ppuser },
caption: `*Welcome To ${metadata.subject}*

📛 : _@${num.split("@")[0]}_
🔢 : _${num.split("@")[0]}_
💌 : _${bio ? bio : '-'}_
🏅 : _${metadata.participants.length ? metadata.participants.length : "Undefined"}_
📆 : _${hari}, ${tanggal}_
⏰ : _${jamwib} *WIB*_

📄 *Deskripsi :*
${metadata.desc ? metadata.desc : 'Tidak ada deskripsi🙏'}`,
buttons: button, 
footer: `${botName} © 2022`,
mentions: [num] })
}
if (update.action == 'remove'){
try {
var ppuser = await ronzz.profilePictureUrl(num, 'image')
} catch {
var ppuser = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
}
const bio = (await ronzz.fetchStatus(num).catch(console.error) || {}).status || 'Tidak ada bio, mungkin kamu private🙏'
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'GoodBye👋'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{
image: { url: ppuser },
caption: `*Leave From Grup ${metadata.subject}*

📛 : _@${num.split("@")[0]}_
🔢 : _${num.split("@")[0]}_
💌 : _${bio ? bio : '-'}_
🏅 : _${metadata.participants.length ? metadata.participants.length : "Undefined"}_
📆 : _${hari}, ${tanggal}_
⏰ : _${jamwib} *WIB*_

*┗━━ ❑ GoodBye👋*`,
buttons: button,
footer: `${botName} © 2022`, 
mentions: [num] })
}
}
} catch (err) {
console.log(err)
}
}
           console.log(update)
           }
        })

        ronzz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
           let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
           return await ronzz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
        }
        
        ronzz.ev.on('group-update', async (anu) => {
           updateGroup(ronzz, anu, MessageType)
        })

        ronzz.ev.on('creds.update', () => saveState)

        ronzz.reply = (from, content, msg) => ronzz.sendMessage(from, { text: content }, { quoted: msg })

        ronzz.ws.on('CB:call', async (json) => {
           const callerId = json.content[0].attrs['call-creator']
           const idCall = json.content[0].attrs['call-id']
           const Id = json.attrs.id
           const T = json.attrs.t
           ronzz.sendNode({
  tag: 'call',
    attrs: {
      from: `${ownerNomer}@s.whatsapp.net`,
      id: Id,
      t: T
    },
    content: [
      {
        tag: 'reject',
        attrs: {
          'call-creator': callerId,
          'call-id': idCall,
          count: '0'
        },
        content: null
      }
    ]
})
if (json.content[0].tag == 'offer') {
           ronzz.sendMessage(callerId, { text: `Kamu telah di blok oleh bot, karena kamu menelpon bot!!\n\nJika tidak sengaja silahkan hubungi owner agar dibuka blocknya!!\nNomor owner : https://wa.me/${ownerNomer}` })
           setTimeout(() => {
       	ronzz.updateBlockStatus(callerId, 'block')
           },1000)
           }
        })

        ronzz.decodeJid = (jid) => {
           if (!jid) return jid
           if (/:\d+@/gi.test(jid)) {
             let decode = jidDecode(jid) || {}
             return decode.user && decode.server && decode.user + '@' + decode.server || jid
           } else return jid
        }

        ronzz.ev.on('contacts.update', update => {
           for (let contact of update) {
             let id = ronzz.decodeJid(contact.id)
             if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
           }
        })

        ronzz.getName = (jid, withoutContact = false) => {
           var id = ronzz.decodeJid(jid)
           withoutContact = ronzz.withoutContact || withoutContact
           let v
           if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
             v = store.contacts[id] || {}
             if (!(v.name || v.subject)) v = ronzz.groupMetadata(id) || {}
             resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
           })
            else v = id === '0@s.whatsapp.net' ? {
             id,
             name: 'WhatsApp'
            } : id === ronzz.decodeJid(ronzz.user.id) ?
             ronzz.user :
             (store.contacts[id] || {})
             return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
        }

        ronzz.setStatus = (status) => {
           ronzz.query({
              tag: 'iq',
              attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
              },
              content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
              }]
            })
           return status
        }

        ronzz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
           let list = []
           for (let i of kon) {
             list.push({
               lisplayName: `${ownerNomer.includes(i) ? ownerName : await ronzz.getName(i + '@s.whatsapp.net')}`, 
               vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${ownerNomer.includes(i) ? ownerName : await ronzz.getName(i + '@s.whatsapp.net')}\nFN:${ownerNomer.includes(i) ? ownerName : await ronzz.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${email}\nitem2.X-ABLabel:Email\nitem3.URL:${youtube}\nitem3.X-ABLabel:YouTube\nitem4.ADR:;;;;;${region}\nitem4.X-ABLabel:Region\nEND:VCARD`
             })
           }
	         list.push({
               lisplayName: "Ronzz YT", 
               vcard: "BEGIN:VCARD\nVERSION:3.0\nN:Ronzz YT\nFN:Ronzz YT\nitem1.TEL;waid=16784037437:+1 (678) 403 7437\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:ronzzyt8598@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://youtube.com/c/RonzzYT\nitem3.X-ABLabel:YouTube\nitem4.ADR:;;;;;Indonesia\nitem4.X-ABLabel:Region\nEND:VCARD"
             })
           return ronzz.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
        }
        
        ronzz.sendTextMentions = async (jid, teks, mention, quoted = '') => {
        	return ronzz.sendMessage(jid, { text: teks, mentions: mention }, { quoted })
        }

        ronzz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
           let vtype
           if (options.readViewOnce) {
             message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
             vtype = Object.keys(message.message.viewOnceMessage.message)[0]
             delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
             delete message.message.viewOnceMessage.message[vtype].viewOnce
             message.message = {
               ...message.message.viewOnceMessage.message
             }
           }
           let mtype = Object.keys(message.message)[0]
           let content = await generateForwardMessageContent(message, forceForward)
           let ctype = Object.keys(content)[0]
           let context = {}
           if (mtype != "conversation") context = message.message[mtype].contextInfo
           content[ctype].contextInfo = {
             ...context,
             ...content[ctype].contextInfo
           }
           const waMessage = await generateWAMessageFromContent(jid, content, options ? {
             ...content[ctype],
             ...options,
             ...(options.contextInfo ? {
               contextInfo: {
                 ...content[ctype].contextInfo,
                 ...options.contextInfo
               }
             } : {})
           } : {})
           await ronzz.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
           return waMessage
        }

        ronzz.sendMessageFromContent = async(jid, message, options = {}) => {
           var option = { contextInfo: {}, ...options }
           var prepare = await generateWAMessageFromContent(jid, message, option)
           await ronzz.relayMessage(jid, prepare.message, { messageId: prepare.key.id })
           return prepare
        }

        ronzz.downloadAndSaveMediaMessage = async(msg, type_file, path_file) => {
           if (type_file === 'image') {
             var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'video') {
             var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'sticker') {
             var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'audio') {
             var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           }
        }

        /**
        * @param {*} jid
        * @param {*} path
        * @param {*} quoted
        * @param {*} options
        * @returns
        */
        ronzz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
           let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
           let buffer
           if (options && (options.packname || options.author)) {
             buffer = await writeExifImg(buff, options)
           } else {
             buffer = await imageToWebp(buff)
           }
           await ronzz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
           .then( response => {
              fs.unlinkSync(buffer)
              return response
           })
        }

        /**
        * @param {*} jid
        * @param {*} path
        * @param {*} quoted
        * @param {*} options
        * @returns
        */
        ronzz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
           let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
           let buffer
           if (options && (options.packname || options.author)) {
             buffer = await writeExifVid(buff, options)
           } else {
             buffer = await videoToWebp(buff)
           }
           await ronzz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
           .then( response => {
              fs.unlinkSync(buffer)
              return response
           })
        }
        return ronzz

}
start()
} catch (e) {
console.log(e)
}
}

module.exports = { jadibot }