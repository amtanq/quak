const shortid = require('shortid')
const db = require('./database')
const terminal = require('./terminal')

async function authenticate () {
  const store = db.file.get('account').value()
  if (store) return store
  const id = shortid()
  const res = await db.http.get(`sign?id=${id}`)
  const account = { id, token: res.data }
  db.file.set('account', account).write()
  return account
}

async function main () {
  terminal.intro()
  const account = await authenticate()
  db.store.token = account.token
  db.store.id = account.id
  await terminal.repl()
  process.stdin.destroy()
} main().catch(() => {})
