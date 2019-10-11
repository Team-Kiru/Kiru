const fs = require('fs')
const { URLSearchParams } = require('url')
const { PlayerManager } = require('discord.js-lavalink')
const queue = {}
let playerman

exports.load = client => {
  if (fs.existsSync('./Lavalink.jar')) {
    const lthree = require('child_process').spawn('java', [
      '-jar',
      require('path').join(__dirname, '/../') + 'Lavalink.jar'
    ])
    lthree.stdout.on('data', data => {
      if (
        data.toString().includes('Started Launcher in') ||
        data.toString().includes('Port 2333 was already in use.')
      ) {
        console.log('Lavalink is locked and loaded!')
        loadMusic(client)
      }
    })

    lthree.stderr.on('data', data => {
      console.log(data.toString())
    })
  } else {
    console.log('I need to download Lavalink. One moment!~')

    var file = fs.createWriteStream('Lavalink.jar')
    require('https').get(
      'https://ci.fredboat.com/guestAuth/repository/download/Lavalink_Build/.lastSuccessful/Lavalink.jar',
      function(response) {
        response.pipe(file)
        file.on('finish', function() {
          file.close()
          const childProcess = require('child_process').spawn('java', [
            '-jar',
            'Lavalink.jar'
          ])

          childProcess.stdout.on('data', data => {
            if (
              data.toString().includes('Started Launcher in') ||
              data.toString().includes('Port 2333 was already in use.')
            ) {
              console.log('Lavalink is locked and loaded!')
              loadMusic(client)
            }
          })
        })
      }
    )
  }
  const loadMusic = client => {
    playerman = new PlayerManager(
      client,
      [{ host: 'localhost', port: 2333, password: 'youshallnotpass' }],
      {
        user: client.user.id, // Client id
        shards: client.shard.count // Total number of shards your bot is operating on
      }
    )
    console.log('Music now available for use.')
  }
}

exports.info = () => {
  return {
    name: 'Music',
    author: 'Team Kiru',
    category: 'Fun',
    description: 'Listen to some music! [beta]',
    syntax: 'music [subcommands]'
  }
}
exports.run = (client, message) => {
  const argument = message.content.replace(
    client.extraFunction.getPrefix(client, message) + 'music ',
    ''
  )
  if (
    argument === client.extraFunction.getPrefix(client, message) + 'music' ||
    argument === '' ||
    argument === 'help'
  ) {
    const embed = {
      description:
        'Music is in a beta stage, and will be rather... rudimentary. please bare with me. >~<',
      author: {
        name: 'I noticed you needed some help!'
      },
      color: 53380,
      fields: [
        {
          name: 'Current Commands:',
          value: '```play, pause, stop, leave```',
          inline: true
        }
      ]
    }
    message.channel.send({ embed })
  } else {
    const switchfind = argument.split(' ')
    switch (switchfind[0]) {
      case 'play':
        if (!message.member || !message.member.voiceChannel) {
          message.reply('you need to be in a voice channel.')
        } else {
          const node = playerman.nodes.first()
          const params = new URLSearchParams()
          params.append(
            'identifier',
            'ytsearch: ' +
              message.content.replace(
                client.extraFunction.getPrefix(client, message) + 'music play ',
                ''
              )
          )
          require('node-fetch')(
            `http://${node.host}:${node.port}/loadtracks?${params.toString()}`,
            { headers: { Authorization: node.password } }
          )
            .then(res => res.json())
            .then(data => {
              const [musicTracks] = data.tracks

              if (!musicTracks) {
                message.reply("there's no videos on youtube by that name! :c")
                return false
              }
              const player = playerman.join({
                guild: message.guild.id,
                channel: message.member.voiceChannelID,
                host: playerman.nodes.first().host
              })
              if (!player) return message.reply("I couldn't join!")
              if (player.playing) {
                if (typeof queue[message.guild.id] === 'undefined') {
                  queue[message.guild.id] = new Array(musicTracks)
                } else queue[message.guild.id].push(musicTracks)
                message.reply('Queued ' + musicTracks.info.title + '!')
              } else {
                player.play(musicTracks.track)
                message.reply("I'm playing " + musicTracks.info.title + '!')
              }
              player.once('end', info => {
                if (info.reason !== 'replaced') {
                  if (
                    queue[message.guild.id] &&
                    queue[message.guild.id].length >= 1
                  ) {
                    const qdsong = queue[message.guild.id].shift()
                    console.log(qdsong)
                    player.play(qdsong.track)
                    message.channel.send(
                      "I'm now playing " + qdsong.info.title + '!'
                    )
                  }
                }
              })
              return false
            })
        }
        break
      case 'skip':
        if (!playerman.get(message.guild.id)) {
          return message.reply(
            "I don't mean to sound like a broken record, but you can't skip air, can't skip air, can't skip..."
          )
        }
        const NewSong = queue[message.guild.id].shift()
        playerman.get(message.guild.id).play(NewSong.track)
        message.reply('Skipped to ' + NewSong.info.title + '!')
        break
      case 'pause':
        if (!playerman.get(message.guild.id)) {
          return message.reply('I got nothing for you to pause! ;;')
        }
        let paused = false
        paused = !playerman.get(message.guild.id).paused
        playerman.get(message.guild.id).pause(paused)
        if (playerman.get(message.guild.id).paused) {
          message.reply('the music is paused! Be quick! >~<')
        } else message.reply("Yay! It's time for more music!")
        break
      case 'stop':
        if (!playerman.get(message.guild.id)) {
          return message.reply(
            'I got nothing for you to stop! (E-Except my heart...)'
          )
        }
        playerman.get(message.guild.id).stop()
        message.reply('The music has been stopped. I was enjoying that track..')
        break
      case 'leave':
        if (!playerman.get(message.guild.id)) {
          return message.reply(
            "That's confusing.. how do I leave, if I never even joined?"
          )
        }
        playerman.leave(message.guild.id)
        message.reply('I left the channel. Bye!~')
        break
    }
  }
}
