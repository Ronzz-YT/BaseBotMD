const chalk = require('chalk')

const color = (text, color) => {
return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

const mylog = (text, color) => {
	return !color ? chalk.greenBright('[ WHATSAPP BOT ] ') + chalk.magentaBright(text) : chalk.greenBright('[ WHATSAPP BOT ] ') + chalk.keyword(color)(text)
}

const infolog = (text) => {
	return chalk.greenBright('[ WHATSAPP BOT ] ') + chalk.magentaBright(text)
}

const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}

const randomNomor = (min, max = null) => {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

module.exports = { color, bgcolor, mylog, infolog, pickRandom, randomNomor }