<p align="center">
<img src="https://github.com/Ronzz-Ofc/BaseBotMD/blob/master/options/image/thumbnail.jpg" alt="Base Bot" width="500"/>


</p>
<p align="center">
<a href="#"><img title="BASE BOT MULTI DEVICE" src="https://img.shields.io/badge/BASE BOT MULTI DEVICE-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge"></a>
</p>
<p align="center">
<a href="https://github.com/Ronzz-Ofc"><img title="Author" src="https://img.shields.io/badge/Author-Ronzz YT-red.svg?style=for-the-badge&logo=github"></a>
</p>
<p align="center">
<a href="https://github.com/Ronzz-Ofc/followers"><img title="Followers" src="https://img.shields.io/github/followers/Ronzz-Ofc?color=red&style=flat-square"></a>
<a href="https://github.com/Ronzz-Ofc/BaseBotMD/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/Ronzz-Ofc/BaseBotMD?color=blue&style=flat-square"></a>
<a href="https://github.com/Ronzz-Ofc/BaseBotMD/network/members"><img title="Forks" src="https://img.shields.io/github/forks/Ronzz-Ofc/BaseBotMD?color=red&style=flat-square"></a>
<a href="https://github.com/Ronzz-Ofc/BaseBotMD/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/Ronzz-Ofc/BaseBotMD?label=Watchers&color=blue&style=flat-square"></a>
<a href="https://github.com/Ronzz-Ofc/BaseBotMD"><img title="Open Source" src="https://badges.frapsoft.com/os/v2/open-source.svg?v=103"></a>
<a href="https://github.com/Ronzz-Ofc/BaseBotMD/"><img title="Size" src="https://img.shields.io/github/repo-size/Ronzz-Ofc/BaseBotMD?style=flat-square&color=green"></a>
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FRonzz-Ofc%2FBaseBotMD&count_bg=%2379C83D&title_bg=%23555555&icon=probot.svg&icon_color=%2300FF6D&title=hits&edge_flat=false"/></a>
<a href="https://github.com/Ronzz-Ofc/BaseBotMD/graphs/commit-activity"><img height="20" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg"></a>&nbsp;&nbsp;
</p>
</div>

---

## Contents:
- [Information](#information)
- [Language Support](#support-language)
- [Buildpack Heroku](#heroku-buildpack)
- [Command For Termux](#command-for-termux)
- [Mongodb Account](#how-to-get-mongodb-uri)
- [Mongodb Connect](#how-to-connect-to-mongodb)
- [Edit Owner](#edit-owner)
- [Deploy To Heroku](#how-to-deploy)
- [Donate](#donate)
- [Official Group](#official-group)
- [Thanks To](#thanks-to)

---

## Information
> Base ini adalah base dalam tahap perkembangan. Base Bot is a bot whatsapp using a [Baileys](https://github.com/adiwajshing/baileys) library.

## Support Language

- [x] Indonesia
- [x] English

But some I haven't changed the language 🛐

## Heroku Buildpack
```bash
heroku/nodejs
https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest
https://github.com/clhuang/heroku-buildpack-webp-binaries.git
```

## Command For Termux
```bash
pkg upgrade && pkg update
pkg install nodejs
pkg install libwebp
pkg install ffmpeg
pkg install imagemagick
pkg install yarn
pkg install git
git clone https://github.com/Ronzz-Ofc/BaseBotMD
termux-setup-storage
cd /sdcard
cd BaseBotMD
yarn install
npm start
```

- Download [Termux V18](https://sharelink.pw/apktermuxmod)

## How to Get Mongodb URI

- Belum Support

## HOW TO CONNECT TO MONGODB

- Belum Support

## Edit Owner 

<details>
    <summary> <b>Edit Owner options/setting.js</b></summary><br/>

```ts
//Website api (jangan di ganti tomlol)
const api = "https://ronzxapis.my.id" //Apabila link api error segera lapor ke owner

//Free apikey (Apikey expired silahkan login terus ganti APIKEY dgn apikey lu)
const apikey = "APIKEY" //login di https://ronzxapis.my.id to get apikey || login di https://ronzxapis.my.id untuk mendapatkan apikey

//Other
const botName = "VelzzyBotz" //Nama bot
const owner = ["628817839722","16784037437"] //Ganti agar fitur owner bisa digunakan
const ownerNomer = "628817839722" //Nomor lu
const ownerName = "Ronzz YT" //Nama lu
const email = "ronzzyt8598@gmail.com" //Email lu
const youtube = "https://youtube.com/c/RonzzYT" //Youtube lu kalau ngga punya kasih tanda strip "-"
const region = "Indonesia" //Region lu
const footer = "VelzzyBotz © 2022" //Seterah
const packname = "© VelzzyBotz" //Sticker wm ubah
const author = "Di Buat Oleh Ronzz YT" //Sticker wm ubah nama lu
const sessionName = "session" //Ngga usah di ganti

//Image
const thumbnail = "./options/image/thumbnail.jpg" //Ngga usah di ganti
const qris = "./options/image/qris.jpg" //Ngga usah di ganti
const menfess = "./options/image/menfess.jpg" //Ngga usah di ganti
const source = "./options/image/source.jpg" //Ngga usah di ganti
const bc = "./options/image/bc.jpg" //Ngga usah di ganti
const responP = "./options/image/responP.jpg" //Ngga usah di ganti

//Message
const sp = "⭔"
const mess = {
	sukses: "Done🤗",
	admin: "Command ini hanya bisa digunakan oleh Admin Grup",
	botAdmin: "Bot Harus menjadi admin",
	owner: "Command ini hanya dapat digunakan oleh owner bot",
	prem: "Command ini khusus member premium",
	group: "Command ini hanya bisa digunakan di grup",
	private: "Command ini hanya bisa digunakan di Private Chat",
	wait: "⏳ Mohon tunggu sebentar...",
	errorLv: "Link yang kamu berikan tidak valid",
	errorApi: "Maaf terjadi kesalahan"
}

module.exports = { api, apikey, botName, owner, ownerNomer, ownerName, email, youtube, region, footer, packname, author, sessionName, thumbnail, qris, menfess, source, bc, responP, sp, mess }
```

</details>

## ```HOW TO DEPLOY```

[`Click Here For Tutorial`](https://youtu.be/RaUQUTrXK90?t=4m28s)<br>

----------

<p align="center">
  <a href="https://youtu.be/SdKHkld2NcI"><img src="https://a.top4top.io/p_2081imvxm1.jpg" />
</p>

## Donate
<details>
<summary> <b>Qris All Payment</b></summary><br/>
<img src="https://telegra.ph/file/3c485ff201d9337be14ef.jpg" />
</details>

- Dana / Gopay / Ovo : 08817839722
- [Saweria](https://saweria.co/RonzzYT)
- [SociaBuzz](https://sociabuzz.com/ronzzofc/donate)

# Official Group
<a href="https://chat.whatsapp.com/Eamzpgum2MXFUch9TBx75M"><img src="https://img.shields.io/badge/Official Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />

# Thanks to
- Allah SWT.
- Nabi Muhammad SAW.
- Orang Tua
- Ronzz YT ( Base & Author ) 
- Saipul Anuar ( Mastah )
- Danzz Coding ( Mastah )
- Bochil Team ( Mastah )
- My Subscriber
- All Konten Kreator Bot
