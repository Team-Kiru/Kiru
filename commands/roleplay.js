const checkPhoto = photo => {
  return (
    photo === undefined ||
    (!photo.startsWith('http://') &&
      !photo.startsWith('https://') &&
      ['.png', '.jpg', '.bmp'].includes(photo))
  )
}

exports.roll = {
  info: () => {
    return {
      name: 'Roll', // The name of the command.
      author: 'Kio', // Who wrote this? Put "Team Kiru", if you want to remain Anonymous.
      category: 'Fun', // What category should Kiru put this command under?
      description: 'Roll a [d]!', // What is the focus of this command?
      syntax:
        'roll\n#d - number of dice\nd# - highest face (can also be %)\nb# - highest number(s) (optional)\nexample - d6, 4d8b2, 5d20+4, 2d20+d6'
    }
  },
  run: (client, message) => {
    const Roll = require('roll')
    const dice = new Roll()
    const diceRoll = message.content.replace(
      client.extraFunction.getPrefix(client, message) + 'roll ',
      ''
    )
    if (!dice.validate(diceRoll)) {
      message.reply('Please use a proper syntax, like 1d20, or 1d6+5...')
    } else {
      message.reply('you got a ' + dice.roll(diceRoll).result + '!')
    }
  }
}

exports.mimic = {
  info: () => {
    return {
      name: 'Mimic', // The name of the command.
      author: 'Kio', // Who wrote this? Put "Team Kiru", if you want to remain Anonymous.
      category: 'Fun', // What category should Kiru put this command under?
      description: 'Let me play as a mimic!', // What is the focus of this command?
      syntax: 'See inside the command.'
    }
  },
  run: (client, message) => {
    const ConfGrab = require('node-json-config')
    const chars = new ConfGrab('./config/characters.json')
    const argument = message.content
      .replace(client.extraFunction.getPrefix(client, message) + 'mimic', '')
      .trim()
      .split(' ')
    switch (argument[0]) {
      case 'help':
        message.channel.send({
          embed: client.extraFunction.getLocalizedCommand(
            client,
            message,
            'mimic'
          ).help
        })
        break

      case 'create':
        if (argument.length === 4) {
          // Check Prefix to see if it exists with the user, or if it is the globally assigned prefix.
          if (
            chars.get(
              message.guild.id + '.' + message.author.id + '.' + argument[1].toString('base64')
            ) !== undefined
          ) {
            message.reply(
              'I already have ' +
                chars.get(
                  message.guild.id +
                    '.' +
                    message.author.id +
                    '.' +
                    argument[1] +
                    '.username'
                ) +
                ' being mimicked with that prefix!'
            )
            return
          }
          if (argument[1] === client.extraFunction.getPrefix(client, message)) {
            message.reply("Sorry, that's my prefix. :c")
          }
          // Check URL to see if it's a URL.
          if (checkPhoto(argument[3])) {
            message.reply(
              'You need to give me a photo as a URL! Need to upload it? use <https://imgur.com/upload>.'
            )
            return
          }

          // Save!~
          chars.put(
            message.guild.id + '.' + message.author.id + '.' + argument[1].toString('base64'),
            { username: argument[2].toString('base64'), avatar_url: argument[3].toString('base64') }
          )
          chars.save()
          message.reply(
            'Gotcha! ' + argument[2] + ' has been saved to the... mimic..dex...'
          )
        } else {
          message.reply(
            'I need 3 items, seperated by spaces. A prefix, a name, and a URL, in that order.'
          )
        }

        break

      case 'edit':
        // Editing; my favorite. Let's make this unneccesarily complicated, shall we?

        // Standard stuff; Check for the character prefix, and if they listed for one of the edit types.
        if (message.length === 1) {
          message.reply(
            "I need the character's _prefix_ before I can edit them, silly!"
          )
          return
        }
        if (message.length === 2) {
          message.channel.send({
            embed: client.extraFunction.getLocalizedCommand(
              client,
              message,
              'mimic'
            ).edit.notspec
          })
          return
        }
        if (
          !Object.keys(
            chars.get(message.guild.id + '.' + message.author.id)
          ).includes(argument[1])
        ) {
          message.reply("I don't know anyone by that prefix!")
          return
        }
        switch (argument[2].toLowerCase()) {
          case 'prefix':
            // Check Prefix to see if it exists with the user, or if it is the globally assigned prefix.
            if (
              chars.get(
                message.guild.id + '.' + message.author.id + '.' + argument[3]
              ) !== undefined
            ) {
              message.reply(
                'I already have ' +
                  chars.get(
                    message.guild.id +
                      '.' +
                      message.author.id +
                      '.' +
                      argument[3] +
                      '.username'
                  ) +
                  ' being mimicked with that prefix!'
              )
              return
            }
            if (argument[3] === conf.get('prefix')) {
              message.reply("Sorry, that's my prefix. :c")
              return
            }
            chars.put(
              message.guild.id + '.' + message.author.id + '.' + argument[3],
              message.guild.id + '.' + message.author.id + '.' + argument[1]
            )
            chars.put(
              message.guild.id + '.' + message.author.id + '.' + argument[1],
              undefined
            )
            chars.save()
            break

          case 'name':
            chars.put(
              message.guild.id +
                '.' +
                message.author.id +
                '.' +
                argument[1] +
                '.username'
            )
            /*
                        TODO:
                            1. Check name for identical names (report if neccessary)
                            2. change
            */
            break

          case 'image':
            // Check URL to see if it's a URL.
            if (checkPhoto(argument[3])) {
              message.reply(
                'You need to give me a link to your photo! Need to upload your photo? use <https://imgur.com/upload>. (Gifs are not allowed. Sorry.)'
              )
              return
            }
            chars.put(
              message.guild.id +
                '.' +
                message.author.id +
                '.' +
                argument[1] +
                '.avatar_url',
              argument[3]
            )
            chars.save()
            message.reply('Saved!')

            break

          default:
            message.channel.send({
              embed: client.extraFunction.getLocalizedCommand(
                client,
                message,
                'mimic'
              ).edit.invalid
            })
            break
        }
        break

      case 'delete':
        if (argument.length === 2) {
          // Check Prefix to see if it exists with the user
          if (
            !Object.keys(
              chars.get(message.guild.id + '.' + message.author.id)
            ).includes(argument[1])
          ) {
            message.reply("I don't know anyone by that prefix!")
          }
          // Annnnd Delete.
          chars.put(
            message.guild.id + '.' + message.author.id + '.' + argument[1],
            undefined
          )
          chars.save()
          message.reply(
            'Up. I already forgot about... uhm.. who was it? I forgot.'
          )
        } else message.reply('I need the prefix of who you want me to forget!')

        break

      case 'list':
        if (
          chars.get(message.guild.id + '.' + message.author.id) === undefined ||
          chars.get(message.guild.id + '.' + message.author.id).length === 0
        ) {
          message.reply("You don't have any characters that I mimic!")
          return
        }
        let content = null; let i
        for (i = 0; i < Object.keys(chars.get(message.guild.id + '.' + message.author.id)).length; i++) {
          content +=
            Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i] +
            '   ---   ' +
            chars.get(message.guild.id + '.' + message.author.id + '.' +
                Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i] + '.username') + '   ---   <' +
            chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i] + '.avatar_url') + '>\n'
        }
        message.channel.send(content)
        break
    }
  },
  On_message: (client, message) => {
    const Char = require('node-json-config')
    const chars = new Char('./config/characters.json')
    if (
      message.guild !== undefined &&
      chars.get(message.guild.id + '.' + message.author.id) !== undefined
    ) {
      let i
      for (i = 0; i < Object.keys(chars.get(message.guild.id + '.' + message.author.id)).length; i++) {
        if (
          message.content.startsWith(
            Buffer.from(Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i]), 'Base64').toString()) {
          message.delete().then(() => {
            message.channel
              .createWebhook(
                chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i]).username,
                chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i]).avatar_url
              )
              .then(wh => {
                wh.send(
                  message.content.replace(Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i], '')
                ).then(() => {
                  wh.delete()
                })
              })
          })
          break
        } else {
          continue
        }
      }
    }
  }
}
/* I'm going to admit, I have no idea what I'm doing in regards to Lazy moduling.

let
*/
