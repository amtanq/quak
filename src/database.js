const { SocksProxyAgent } = require('socks-proxy-agent')
const axios = require('axios')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

try {
  const adapter = new FileSync('store')
  const database = low(adapter)
  const proxy = database.get('proxy').value()
  const baseURL = database.get('server').value()
  const agent = proxy ? new SocksProxyAgent(proxy) : null
  exports.http = http = axios.create({ baseURL, httpsAgent: agent })
  exports.file = database
} catch (_) {
  process.exit()
}

exports.store = {}
exports.http.interceptors.request.use(config => {
  if (!exports.store.token) return config
  config.headers.Authorization = exports.store.token
  return config
})
