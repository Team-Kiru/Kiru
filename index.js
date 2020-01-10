console.log('Kiru is booting! One sec~')

// Require config.json. Require can (and needs to be) synchronus in this case.
const conf = require('./config/config.json')

// Load D.js's Sharding Manager, and load the token into it, as required by the config.
const { ShardingManager } = require('discord.js')
const shardManager = new ShardingManager('./bot.js', { token: conf['token'] })

// Spawn shards.
shardManager.spawn()
shardManager.on('launch', shard => console.log(`Launched shard ${shard.id}`))
