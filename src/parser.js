const db = require('./database')
const hints = require('./hints')
const crypto = require('./crypto')

module.exports = {
  async insert (more) {
    const [id, hash] = more.split(':')
    const hashed = crypto.hash(hash)
    db.file.set(`friends.${id}`, hashed).write()
    db.store.friends[id] = hashed
    hints.refresh()
  },
  async select (more) {
    const snap = await db.http.get(`text?id=${more}`)
    for (const row of snap.data.reverse()) {
      const [id, text] = row.split(':')
      const sender = id === more ? '>' : '<'
      const secret = crypto.decrypt(text, db.store.friends[more])
      console.log(sender, secret)
    }
  },
  async update (more) {
    const [id, ...text] = more.split(':')
    const secret = crypto.encrypt(text.join(':'), db.store.friends[id])
    await db.http.post('text', { id, text: secret })
  },
  async delete (more) {
    db.file.unset(`friends.${more}`).write()
    delete db.store.friends[more]
    hints.refresh()
  }
}
