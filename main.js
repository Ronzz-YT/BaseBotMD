"use strict";
const {
        default: makeWASocket,
        BufferJSON,
        initInMemoryKeyStore,
        DisconnectReason,
        AnyMessageContent,
        useSingleFileAuthState,
        makeInMemoryStore,
        delay,
        downloadContentFromMessage,
        jidDecode,
        generateForwardMessageContent,
        generateWAMessageFromContent,
        proto,
        prepareWAMessageMedia
} = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const PhoneNumber = require('awesome-phonenumber')
const { Spinner } = clui
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, TelegraPh } = require('./function/uploader')
const { serialize, fetchJson, getBuffer, makeid, reSize } = require("./function/myfunc");
const { color, mylog, infolog } = require("./function/console");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY');
let welcome = JSON.parse(fs.readFileSync('./database/bot/welcome.json'));
const { botName, sessionName, ownerNomer, ownerName, email, youtube, region, footer } = require("./options/setting");
let session = `./${sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

function title() {
      console.clear()
      console.log(chalk.bold.green(figlet.textSync('Base Bot', {
         font: 'Standard',
         horizontalLayout: 'default',
         verticalLayout: 'default',
         width: 80,
         whitespaceBreak: false
      })))
console.log(chalk.yellow(`${chalk.red('[ Made By RonzzYT ]')}\n\n${chalk.italic.magenta('â€¢ Author')} : ${chalk.white('RonzzOfc')}\n${chalk.italic.magenta('â€¢ YouTube')} : ${chalk.white('Ronzz YT')}\n${chalk.italic.magenta('â€¢ Caption')} : ${chalk.white('Terus Berkarya Hingga Suatu Saat Menjadi Orang Kaya')}\n${chalk.italic.magenta('â€¢ Donate')} : ${chalk.white('https://saweria.co/RonzzYT')}\n`))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
        console.log(`Module ${module} sedang diperhatikan terhadap perubahan`)
        fs.watchFile(require.resolve(module), async () => {
          await uncache(require.resolve(module))
          cb(module)
        })
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
        return new Promise((resolve, reject) => {
          try {
            delete require.cache[require.resolve(module)]
            resolve()
          } catch (e) {
            reject(e)
          }
        })
}

const getPosiSaying = (from, _db) => {
    let posi = null
    Object.keys(_db).forEach((i) => {
      if (_db[i].jid === from) {
        posi = i
      }
    })
    if (posi !== null) {
      return posi
    }
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
        const ronzz = makeWASocket({
            printQRInTerminal: true,
            logger: logg({ level: 'fatal' }),
            browser: ['Base Bot By Ronzz YT','Safari','1.0.0'],
            auth: state
        })
        title()
        store.bind(ronzz.ev)

        /* Auto Update */
        require('./options/setting')
        require('./function/myfunc')
        require('./index')
        nocache('./options/setting', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
        nocache('./function/myfunc', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
        nocache('./index', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
        
        ronzz.spam = []
        
        ronzz.public = true
        
        ronzz.ev.on('messages.upsert', async m => {
           var msg = m.messages[0]
           if (!m.messages) return;
           //msg.message = (Object.keys(msg.message)[0] == "ephemeralMessage") ? msg.message.ephemeralMessage.message : msg.message
           if (msg.key && msg.key.remoteJid == "status@broadcast") return
           msg = serialize(ronzz, msg)
           msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
           require('./index')(ronzz, msg, m, store, welcome)
        })

        ronzz.ev.on('connection.update', (update) => {
           const { connection, lastDisconnect } = update
           if (connection === 'close') {
              status.stop()
              reconnect.stop()
              starting.stop()
              console.log(mylog('Server Ready'))
              lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut 
              ? connectToWhatsApp() 
              : console.log(mylog('Wa web terlogout...'))
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
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'Kasian😆'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{ 
text: `*@${num.split("@")[0]} Demote From ${metadata.subject}*`,
buttons: button, 
footer: footer,
mentions: [num] })
}
if (update.action == 'promote') {
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'Selamat🎉'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{ 
text: `*@${num.split("@")[0]} Promote From ${metadata.subject}*`,
buttons: button, 
footer: footer,
mentions: [num] })
}
if (update.action == 'add') {
try {
var ppuser = await ronzz.profilePictureUrl(num, 'image')
} catch {
var ppuser = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
}
var stream = await getBuffer(ppuser) 
let buffer = Buffer.from([])
buffer = Buffer.concat([buffer, stream])
fs.writeFileSync('./options/sticker/welcome.jpg', buffer)
let ppnya = await TelegraPh('./options/sticker/welcome.jpg')
let namenya = await ronzz.getName(num.split('@')[0]+"@s.whatsapp.net")
let welcomenya = `https://api.popcat.xyz/welcomecard?background=https://cdn.discordapp.com/attachments/850808002545319957/859359637106065408/bg.png&text1=${namenya}&text2=Welcome+To+${metadata.subject}&text3=Member+${metadata.participants.length ? metadata.participants.length : "Undefined"}&avatar=${ppnya}`
const bio = (await ronzz.fetchStatus(num).catch(console.error) || {}).status || 'Tidak ada bio, mungkin kamu privateðŸ™'
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'Welcome👋'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{ 
image: { url: welcomenya },
caption: `*Welcome To ${metadata.subject}*

📛 : _@${num.split("@")[0]}_
🔢 : _${num.split("@")[0]}_
💌 : _${bio ? bio : '-'}_
🏅 : _${metadata.participants.length ? metadata.participants.length : "Undefined"}_
📆 : _${hari}, ${tanggal}_
⏰ : _${jamwib} *WIB*_

📄 *Deskripsi :*
${metadata.desc ? metadata.desc : 'Tidak ada deskripsi'}`,
buttons: button, 
footer: footer,
mentions: [num] })
}
if (update.action == 'remove'){
try {
var ppuser = await ronzz.profilePictureUrl(num, 'image')
} catch {
var ppuser = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
}
var stream = await getBuffer(ppuser) 
let buffer = Buffer.from([])
buffer = Buffer.concat([buffer, stream])
fs.writeFileSync('./options/sticker/left.jpg', buffer)
let ppnya = await TelegraPh('./options/sticker/left.jpg')
let namenya = await ronzz.getName(num.split('@')[0]+"@s.whatsapp.net")
let leftnya = `https://api.popcat.xyz/welcomecard?background=https://cdn.discordapp.com/attachments/850808002545319957/859359637106065408/bg.png&text1=${namenya}&text2=Leave+From+${metadata.subject}&text3=Member+${metadata.participants.length ? metadata.participants.length : "Undefined"}&avatar=${ppnya}`
const bio = (await ronzz.fetchStatus(num).catch(console.error) || {}).status || 'Tidak ada bio, mungkin kamu privateðŸ™'
var button = [{ buttonId: '!text_grup', buttonText: { displayText: 'GoodBye👋'}, type: 1 }]
await ronzz.sendMessage(
update.id, 
{
image: { url: leftnya },
caption: `*Leave From Grup ${metadata.subject}*

📛 : _@${num.split("@")[0]}_
🔢 : _${num.split("@")[0]}_
💌 : _${bio ? bio : '-'}_
🏅 : _${metadata.participants.length ? metadata.participants.length : "Undefined"}_
📆 : _${hari}, ${tanggal}_
⏰ : _${jamwib} *WIB*_

*┗━━ ❑ GoodBye👋*`,
buttons: button,
footer: footer, 
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
             var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'video') {
             var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage, 'video')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'sticker') {
             var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
             let buffer = Buffer.from([])
             for await(const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
             }
             fs.writeFileSync(path_file, buffer)
             return path_file
           } else if (type_file === 'audio') {
             var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage, 'audio')
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

connectToWhatsApp()
.catch(err => console.log(err))