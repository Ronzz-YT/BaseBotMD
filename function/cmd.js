const fs = require('fs')

exports.addCmd = function(command, hit, _db){
let position = false
Object.keys(_db).forEach((i) => {
if (_db[i].id === command) {
position = i
}
})
if (position !== false) {
_db[position].total += hit
fs.writeFileSync('./database/bot/dashboard.json', JSON.stringify(_db))
} else {
const bulin = ({
id: command,
total: hit
})
_db.push(bulin)
fs.writeFileSync('./database/bot/dashboard.json', JSON.stringify(_db))
}
}