const db = require('./database')
const keywords = ['insert', 'select', 'update', 'delete', 'clear', 'exit']
const examples = ['insert id:hash', 'select id', 'update id:text', 'delete id']
const reducer = (p, c) => [...p, `select ${c}`, `update ${c}`, `delete ${c}`]

exports.isKeyword = e => keywords.includes(e)
exports.refresh = () => {
  db.store.hints = Object.keys(db.store.friends).reduce(reducer, [])
  db.store.hints = [...examples, ...keywords, ...db.store.hints]
}
