const { Router } = require('express')
const assert = require('assert')
const jwt = require('jsonwebtoken')
const Redis = require('ioredis')
const shortid = require('shortid')
const config = require('./config')

const router = Router()
const redis = new Redis(process.env.REDIS_URL)
const room = (x, y) => x < y ? `${x}:${y}` : `${y}:${x}`
module.exports = router

router.get('/sign', async (req, res) => {
  assert(shortid.isValid(req.query.id))
  assert.strictEqual(await redis.setnx(req.query.id, ''), 1)
  res.send(jwt.sign({ id: req.query.id }, process.env.SECRET))
  await redis.pexpire(req.query.id, config.accountPX)
})

router.get('/text', async (req, res) => {
  const { id } = jwt.verify(req.get('Authorization'), process.env.SECRET)
  assert(id && shortid.isValid(req.query.id))
  const name = room(id, req.query.id)
  res.send(await redis.lrange(name, 0, config.textMX))
})

router.post('/text', async (req, res) => {
  const { id } = jwt.verify(req.get('Authorization'), process.env.SECRET)
  assert(req.body.text.length < config.textSZ)
  assert(id && shortid.isValid(req.body.id))
  res.send()
  const name = room(id, req.body.id)
  await redis.lpush(name, `${id}:${req.body.text}`)
  await redis.ltrim(name, 0, config.textMX)
  await redis.pexpire(name, config.textPX)
})
