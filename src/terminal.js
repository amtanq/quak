const { Terminal } = require('terminal-kit')
const db = require('./database')
const hints = require('./hints')
const parser = require('./parser')
const term = Terminal()
const title = `
                     __
  ____ ___  ______ _/ /__
 / __ \`/ / / / __ \`/ //_/
/ /_/ / /_/ / /_/ / ,<
\\__, /\\__,_/\\__,_/_/|_|
  /_/`.substr(1)

function input (options) {
  return new Promise((resolve, reject) =>
    term.inputField(options, (err, data) =>
      err ? reject(err) : resolve(data)))
}

function tokenHook (token, end, prev, term, config) {
  config.style = prev.length === 0 && hints.isKeyword(token)
    ? term.brightBlue
    : term.defaultColor
}

function clear () {
  term.clear()
  exports.intro()
  term.brightGreen('quak: ')
  console.log(db.store.id)
}

async function iteration () {
  term.brightGreen('quak: ')
  const options = { autoComplete: db.store.hints, autoCompleteHint: true, autoCompleteMenu: true, tokenHook }
  const stdin = await input(options)
  const [_, cmd, more] = stdin.trim().match(/(\S*)(.*)/)
  console.log()
  if (cmd === 'exit') return true
  if (cmd === 'clear') clear()
  else await parser[cmd](more.trim())
}

exports.intro = (subtitle = 'TOR MESSENGER') => {
  const width = (title.indexOf('\n') + subtitle.length) / 2
  term.brightGreen(title)
  term.grey(`${subtitle.padStart(width)}\n\n`)
}

exports.repl = async () => {
  db.store.friends = db.file.get('friends').value() || {}
  hints.refresh()
  term.brightGreen('quak: ')
  console.log(db.store.id)
  while (true) {
    try {
      if (await iteration()) return
    } catch (_) { }
  }
}
