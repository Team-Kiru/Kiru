const checkPhoto = photo => (photo === undefined || (!photo.startsWith('http://') && !photo.startsWith('https://') && ['.png', '.jpg', '.bmp'].includes(photo)))

exports.roll = {
  info: (client, message) => client.extraFunction.getLocalizedCommand(client, message, 'roleplay').roll.info,
  run: (client, message) => {
    const diceRoll = message.content.replace(client.extraFunction.getPrefix(client, message) + 'roll ', '')
  Parsed = diceRoll.trim().split("d")
  let newarray = [], total = [], totalnum = 0
  Parsed.forEach(itm => newarray.push(Number(itm.trim())))
  if (newarray[0] === 0 ) newarray[0] = 1
  if (newarray[0] >= 101) {message.reply("Don't be mean to me!"); return false;}
  else if (newarray[1] >= 1001) {message.reply("Don't be mean to me!"); return false;}
  for ( i = 0; i < newarray[0]; i++) {
    q = Math.floor( Math.random() * newarray[1] ) + 1
    if (newarray[0] !== 1) total.push(q)
    totalnum += q
  }
  if (newarray[0] === 1) message.channel.send("**Your Total** " + totalnum) 
  else message.channel.send("**Your Total:** "+totalnum+"\nYou got the following numbers,\n"+JSON.stringify(total))
  }
}

exports.mimic = {
  info: (client, message) => client.extraFunction.getLocalizedCommand(client, message, 'roleplay').mimic.info,
  run: (client, message) => {
    const ConfGrab = require('node-json-config')
    const chars = new ConfGrab('./config/characters.json')
    const argument = message.content
      .replace(client.extraFunction.getPrefix(client, message) + 'mimic', '')
      .trim()
      .split(' ')
    switch (argument[0]) {
      case 'help':
        message.channel.send({ embed: client.extraFunction.getLocalizedCommand(client, message, 'roleplay').mimic.help })
        break

      case 'create':
        if (argument.length === 4) {
          // Check Prefix to see if it exists with the user, or if it is the globally assigned prefix.
          if (chars.get(message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[1]).toString('Base64')) !== undefined) {
            message.reply('I already have ' + Buffer.from(chars.get(message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[1]).toString('Base64') + '.username'), 'base64').toString() + ' being mimicked with that prefix!')
            return
          }
          if (argument[1] === client.extraFunction.getPrefix(client, message)) {
            message.reply("Sorry, that's my prefix. :c")
            return
          }
          // Check URL to see if it's a URL.
          if (checkPhoto(argument[3])) {
            message.reply('You need to give me a photo as a URL! Need to upload it? use <https://imgur.com/upload>.')
            return
          }

          // Save!~
          chars.put(message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[1]).toString('Base64'), { username: Buffer.from(argument[2]).toString('Base64'), avatar_url: Buffer.from(argument[3]).toString('Base64') })
          chars.save()
          message.reply('Gotcha! ' + argument[2] + ' has been saved to the... mimic..dex...')
        } else message.reply('I need 3 items, seperated by spaces. A prefix, a name, and a URL, in that order.')

        break

      case 'edit':
        // Editing; my favorite. Let's make this unneccesarily complicated, shall we?

        // Standard stuff; Check for the character prefix, and if they listed for one of the edit types.
        if (message.length === 1) {
          message.reply("I need the character's _prefix_ before I can edit them, silly!")
          return
        }
        if (message.length === 2) {
          message.channel.send({ embed: client.extraFunction.getLocalizedCommand(client, message, 'roleplay').mimic.edit.notspec })
          return
        }
        if (
          !Object.keys(
            chars.get(message.guild.id + '.' + message.author.id)
          ).includes(Buffer.from(argument[1]).toString('base64'))
        ) {
          message.reply("I don't know anyone by that prefix!")
          return
        }
        switch (argument[2].toLowerCase()) {
          case 'prefix':
            // Check Prefix to see if it exists with the user, or if it is the globally assigned prefix.
            if (
              chars.get(message.guild.id + '.' + message.author.id + '.' + argument[3]) !== undefined
            ) {
              message.reply('I already have ' + chars.get(message.guild.id + '.' + message.author.id + '.' + argument[3] + '.username') + ' being mimicked with that prefix!')
              return
            }
            if (argument[3] === client.params.get('prefix')) {
              message.reply("Sorry, that's my prefix. :c")
              return
            }
            chars.put(message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[3]).toString('base64'), message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[1]).toString('base64'))
            chars.put(message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[1]).toString('base64'), undefined)
            chars.save()
            break

          case 'name':
            chars.put(message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[1]).toString('base64') + '.username', Buffer.from(argument[3]).toString('base64'))
            /*
                        TODO:
                            1. Check name for identical names (report if neccessary)
                            2. change
            */
            break

          case 'image':
            // Check URL to see if it's a URL.
            if (checkPhoto(argument[3])) {
              message.reply('You need to give me a link to your photo! Need to upload your photo? use <https://imgur.com/upload>. (Gifs are not allowed. Sorry.)')
              return
            }
            chars.put(message.guild.id + '.' + message.author.id + '.' + Buffer.from(argument[1]).toString('base64') + '.avatar_url', argument[3].toString('base64'))
            chars.save()
            message.reply('Saved!')

            break

          default:
            message.channel.send({
              embed: client.extraFunction.getLocalizedCommand(
                client, message, 'mimic'
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
          } else {
          // Annnnd Delete.
            chars.put(message.guild.id + '.' + message.author.id + '.' + argument[1].toString('base64'), undefined)
            chars.save()
            message.reply('Up. I already forgot about... uhm.. who was it? I forgot.')
          }
        } else message.reply('I need the prefix of who you want me to forget!')

        break

      case 'list':
        if (chars.get(message.guild.id + '.' + message.author.id) === undefined || chars.get(message.guild.id + '.' + message.author.id).length === 0) {
          message.reply("You don't have any characters that I mimic!")
          return
        }
        let content = ''; let i
        for (i = 0; i < Object.keys(chars.get(message.guild.id + '.' + message.author.id)).length; i++) {
          content +=
            Buffer.from(Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i], 'Base64').toString() + '   ---   ' +
            Buffer.from(chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i] + '.username'), 'Base64').toString() + '   ---   <' +
            Buffer.from(chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i] + '.avatar_url'), 'Base64').toString() + '>\n'
        }
        message.channel.send(content)
        break
    }
  },
  On_message: (client, message) => {
    const Char = require('node-json-config')
    const chars = new Char('./config/characters.json')
    if (message.guild === undefined || message.guild.id === undefined || message.author.id === undefined || message.author.id === undefined) return
    if (chars.get(message.guild.id + '.' + message.author.id) !== undefined) {
      for (let i = 0; i < Object.keys(chars.get(message.guild.id + '.' + message.author.id)).length; i++) {
        if (message.content.startsWith(Buffer.from(Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i], 'Base64').toString())) {
          message.delete().then(() =>
            message.channel
              .createWebhook(
                Buffer.from(chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i]).username, 'Base64').toString(),
                Buffer.from(chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i]).avatar_url, 'Base64').toString())
              .then(wh => wh.send(message.content.replace(Buffer.from(Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i], 'base64').toString(), '')).then(() => wh.delete()))
              .catch(e => { message.reply("Sorry, I don't have permissions to create webhooks; which is vital to using Kiru's Mimic Feature.") })
          ).catch(() => message.channel
            .createWebhook(
              Buffer.from(chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i]).username, 'Base64').toString(),
              Buffer.from(chars.get(message.guild.id + '.' + message.author.id + '.' + Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i]).avatar_url, 'Base64').toString())
            .then(wh => wh.send(message.content.replace(Buffer.from(Object.keys(chars.get(message.guild.id + '.' + message.author.id))[i], 'base64').toString(), '')).then(() => wh.delete()))
            .catch(e => { message.reply("Sorry, I don't have permissions to create webhooks; which is vital to using Kiru's Mimic Feature.") }))
          break
        } else {
          continue
        }
      }
    }
  }
}
