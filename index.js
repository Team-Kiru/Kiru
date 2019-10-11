console.log('Kiru is booting! One sec~')

const ConfigGrab = require('node-json-config')
const conf = new ConfigGrab('./config/config.json')
const { ShardingManager } = require('discord.js')
const manager = new ShardingManager('./bot.js', { token: conf.get('token') })

manager.spawn()
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`))
