// This file is __VERY__ Important to the operation of Kiru.
// Not only does it contain the "help" command, it also has localization settings, and information about Kiru.
// If edited, Team Kiru will not support you!

exports.settings = {
  On_guildMemberJoin: (client, member) => {
    const welcomeBlock = client.data.get('serverSpecificSettings.' + member.guild.id + '.welcome')
    if (welcomeBlock !== undefined) {
      if (
        welcomeBlock.channel !== undefined &&
          welcomeBlock.message !== undefined
      ) {
        client.channels
          .get(welcomeBlock.channel)
          .send(
            welcomeBlock.message.replace(
              /{mention}/gm,
              '<@' + member.id + '>'
            )
          )
      }
      if (welcomeBlock.role) {
        // TODO: Just really need to add the role.
      }
    }
  },
  On_guildMemberRemove: (client, member) => {
    const welcomeBlock = client.data.get(
      'serverSpecificSettings.' + member.guild.id + '.goodbye'
    )
    if (welcomeBlock !== undefined) {
      if (
        welcomeBlock.channel !== undefined &&
          welcomeBlock.message !== undefined
      ) {
        client.channels
          .get(welcomeBlock.channel)
          .send(
            welcomeBlock.message.replace(
              /{mention}/gm,
              '@' + member.user.username + '#' + member.user.tag
            )
          )
      }
    }
  },
  info: (client, message) => client.extraFunction.getLocalizedCommand(client, message, 'core').settings.info,
  run: (client, message) => {
    const local = client.extraFunction.getLocalizedCommand(client, message, 'core').settings
    const args = message.content.replace(client.extraFunction.getPrefix(client, message) + 'settings','').trim().split(' ')
    if (message.member.permissions.has('MANAGE_GUILD')) {
      if (args.length === 0 || args[0].toLowerCase() === 'help' || args[0] === '') {
        const embed = {
          title: local.no_command_title,
          description: local.no_command_description,
          color: 8311585,
          footer: {
            text: local.footer_title.replace('{user}', message.author.username)
          },
          fields: [
            {
              name: "Prefix",
              value: local.prefix_content
            },
            {
              name: 'OnJoin',
              value: local.onjoin_content
            },
            {
              name: 'OnLeave',
              value: local.onleave_content
            }
          ]
        }
        message.channel.send({ embed })
      } else switch (args[0].toLowerCase()) {
          case local.prefix:
            if (args[1] === undefined) return
            else if (args[1].toLowerCase() === 'revert') {
              client.data.put('serverSpecificSettings.' + message.guild.id + '.prefix', undefined)
              client.data.save()
              message.reply(local.revert)
            } else {
              client.data.put('serverSpecificSettings.' + message.guild.id + '.prefix', args[1] )
              client.data.save()
              message.reply(local.update)
            }
            break
          case 'onleave':
            onMember(client, message, args, 'leave', local)
            break
          case 'onjoin':
            onMember(client, message, args, 'join', local)
            break
          }
    } else message.reply(local.cant_change_settings)
  }
}
/* Sorry to those who can't read english yet... ugh. Kiru just isn't ready for that. Need more localized files to be ready.
exports.language = {
  info: (client, message) => client.extraFunction.getLocalizedCommand(client, message, 'core').language.info,

  run: (client, message) => {
    let args = message.content.replace(client.extraFunction.getPrefix(client, message) + "language", "").trim().split(" ").filter(Boolean)
    console.log(args)
    let localization = JSON.parse(require('fs').readFileSync('./modules/localization/generic.json','utf8'))
    if (args.length === 0) {
      let msg = 'Hi there! Need a language change?'
      if (message.member.permissions.has('MANAGE_GUILD') || message.member.id === message.guild.ownerID) msg +="\nType ``server``, then the language code, to change the server's default language."
      msg += '\n'
      Object.keys(localization.languages).forEach(lang => {
      msg += '\n' + localization.languages[lang].replace('{prefix}', client.extraFunction.getPrefix(client, message))})
      message.channel.send(msg)
    } else {
      if (args[0].toLowerCase() === 'server') {
        client.data.put('serverSpecificSettings.' + message.guild.id + '.language', args[1].toLowerCase())
        client.data.save()
        message.reply(client.extraFunction.getLocalizedCommand(client, message,'language')['ok'])
      } else if (Object.keys(localization.languages).includes(args[0].toLowerCase())) {
        client.data.put('userSpecificSettings.' + message.author.id + '.language',args[0].toLowerCase())
        client.data.save()
        message.reply(client.extraFunction.getLocalizedCommand(client, message,'language')['ok'])
      } else message.reply("That's not a proper language. :c")
    }
  }
}
*/
exports.about = {
  info: (client, message) => client.extraFunction.getLocalizedCommand(client, message, 'core').about.info,
  run: (client, message) => {
    let local = client.extraFunction.getLocalizedCommand(client, message, 'core').about
    let embed = {
      title: local.command.aboutBot.replace(
        '{bot.name}',
        client.params.get('aboutme.name')
      ),
      color: 4040592,
      timestamp: Date.now(),
      fields: [
        {
          name: local.command.greetingFromLead,
          value: local.command.leadSpeaking
        },
        {
          name: local.command.developers,
          value: '```Kio```'
        },
        {
          name: local.command.contentMakers,
          value: '```LoveIsAGhost, Allen```'
        }
      ]
    }

    if (local.command.translate === true) {
      embed.fields.push({
        name: local.command.translator,
        value: local.command.translators
      })
    }

    embed.fields.push({
      name: local.command.version,
      value: local.command.versionText.replace('{version}', process.versions.node),
      inline: true
    })
    embed.fields.push({
      name: local.command.specialThanks,
      value: local.command.specialThanksUnder.replace('{bot.name}', client.params.get('aboutme.name')),
      inline: true
    })

    message.channel.send({ embed }).catch(console.error)
  }
}

exports.ping = {
  info: (client, message) => client.extraFunction.getLocalizedCommand(client, message, 'core').ping.info,

  run: (client, message) => {
    const local = client.extraFunction.getLocalizedCommand(client, message, 'core').ping
    const timeInvoked = client.timeInvoked
    message.channel.send(local.retrieve_ping).then(mg => {
      mg.edit(local.time + (Date.now() - timeInvoked) + 'ms')
    })
  }
}

exports.help = {
  command: (client, message, command) => {
    let local = client.extraFunction.getLocalizedCommand(client, message, 'core').help
    let x = client.commands.get(command).info(client, message)
    const embed = {
      title: local.info.name,
      color: 13632027,
      fields: [
        {
          name: local.not_how_to_use.replace('{command}', command),
          value: '```' +client.extraFunction.getPrefix(client, message) +x.syntax +'```'
        }
      ]
    }
    message.channel.send({ embed })
  },

  info: (client, message) => client.extraFunction.getLocalizedCommand(client, message, 'core').help.info,

  run: (client, message) => {
    let local = client.extraFunction.getLocalizedCommand(client, message, 'core').help
    let command = message.content.replace(client.extraFunction.getPrefix(client, message) + 'help', '').trim()
    if (command.length === 0) {
      let commandList = {}
      Array.from(client.commands.keys()).forEach(function (key) {
        let info = client.commands.get(key).info(client, message)
        if (info !== undefined) {
          if (info.hidden === undefined) {
            if (commandList[info.category] === undefined) commandList[info.category] = []
            commandList[info.category].push(key)
          }
        }
      })

      Object.keys(commandList).forEach(key => {commandList[key] = commandList[key].sort()})
      let embed = {
        title: local.help_top,
        color: 3797101,
        footer: {
          text: client.extraFunction.getLocalizedCommand(client, message, 'core').help.footer.replace('{username}', message.author.username)
        },
        fields: []
      }
      Object.keys(commandList).forEach(key => {
        let properDisplay = ''
        commandList[key].forEach(item => {properDisplay += ' ``' + item + '``, '})
        properDisplay = properDisplay.substring(0, properDisplay.length - 2)
        let final = { name: key, value: properDisplay }
        embed['fields'].push(final)
      })
      message.channel.send({ embed })
    } else {
      const cmd = client.commands.get(command)
      if (!cmd) {
        message.channel.send(local.not_a_command)
        return
      }
      let object = cmd.info(client, message)
      if (object.hidden !== undefined) {
        return
      }
      const embed = {
        color: 3797101,
        footer: {
          text: client.extraFunction
            .getLocalizedCommand(client, message, 'core').help
            .footer.replace('{username}', message.author.username)
        },
        fields: [
          {
            name: object.name,
            value: object.description,
            inline: true
          },
          {
            name: local.author,
            value: object.author,
            inline: true
          },
          {
            name: local.syntax,
            value: '```' + client.extraFunction.getPrefix(client, message) + object.syntax + '```'
          }
        ]
      }
      message.channel.send({ embed })
    }
  }
}

const onMember = (client, message, args, selector, lang) => {
  let select = { join: ['onjoin', 'welcome'], leave: ['onleave', 'goodbye'] }
  if (Object.keys(select).includes(selector)) select = select[selector]
  if (args[1] === undefined || args[1].toLowerCase() === 'help') {
    const embed = {
      title: 'So you want me to say hello to people? >3<',
      color: 8311585,
      fields: [
        {
          name: 'Channel (required)',
          value: 'Set the channel where Kiru will say things!'
        },
        {
          name: 'Message',
          value:
            'What do you want me to say? write ``reset`` to set it back to nothing. Use {mention} to mention them!'
        },
        {
          name: 'Validate',
          value:
            'Want me to show you what it might look like if someone joined?'
        }
      ]
    }
    message.channel.send({ embed })
  } else {
    switch (args[1].toLowerCase()) {
      case 'channel':
        if (message.mentions.channels.array().length !== 1) {
          const embed = {
            title: local.info.name,
            color: 13632027,
            fields: [
              {
                name: client.extraFunction
                  .getLocalizedCommand(client, message, 'core').help
                  .not_how_to_use.replace('{command}', 'channel'),
                value: '```' + client.extraFunction.getPrefix(client, message) + 'settings ' + select[0] + ' channel <channel>' + '```'
              }
            ]
          }
          message.channel.send({ embed })
        } else {
          client.data.put('serverSpecificSettings.' + message.guild.id + '.' + select[1] + '.channel', message.mentions.channels.array()[0].id)
          client.data.save()
          message.reply('saved!')
        }
        break
      case 'message':
        const regex = new RegExp(client.extraFunction.getPrefix(client, message) + 'settings ' + select[0] + ' message ', 'gi')
        const msg = message.content.replace(regex, '').trim()
        if (msg === 'reset') {
          client.data.put('serverSpecificSettings.' + message.guild.id + '.' + select[1] + '.message', undefined)
          client.data.save()
          message.reply('Reset!')
        } else {
          client.data.put('serverSpecificSettings.' + message.guild.id + '.' + select[1] + '.message', msg)
          client.data.save()
          message.reply('saved!')
        }
        break
      case 'validate':
        // Just use the code from events/guildmemberadd
        const welcomeBlock = client.data.get(
          'serverSpecificSettings.' + member.guild.id + '.' + select[1]
        )
        if (welcomeBlock !== undefined) {
          if (welcomeBlock.channel !== undefined && welcomeBlock.message !== undefined) client.channels.get(welcomeBlock.channel).send(welcomeBlock.message.replace(/{mention}/gm,'<@' + message.guild.me.user.id + '>'))
          else message.reply("I can't really validate your message if I have nothing to.. y'know.")
        }
        break

      // TODO: Actually get the roles in
    }
  }
}
