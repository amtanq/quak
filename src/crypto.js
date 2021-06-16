const crypto = require('crypto')
exports.hash = e => crypto.createHash('MD5')
  .update(e).digest('hex')

exports.encrypt = (e, k) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(k), iv)
  const res = Buffer.concat([cipher.update(e), cipher.final()])
  return iv.toString('hex') + res.toString('hex')
}

exports.decrypt = (e, k) => {
  const [_, iv, data] = /(.{32})(.*)/.exec(e).map(e => Buffer.from(e, 'hex'))
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(k), iv)
  const res = Buffer.concat([decipher.update(data), decipher.final()])
  return res.toString()
}
