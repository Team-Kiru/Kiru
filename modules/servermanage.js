exports.stalk = {
  info: (client, message) => {
    return client.extraFunction.getLocalizedCommand(client, message, 'stalk').info
  },
  run: (client, message) => {
    let local = client.extraFunction.getLocalizedCommand(client, message, 'stalk' )
    if (message.mentions.members.array().length !== 1) {
      client.commands.get('help').command(client, message, 'stalk')
    } else {
      let member = message.mentions.members.array()[0]
      let RoleList = null
      member.roles.array().forEach(role => {
        if (RoleList === null) RoleList = '<@&' + role.id + '>'
        else RoleList += ', <@&' + role.id + '>'
      })
      const embed = {
        title: local.title.replace('{user}', member.user.username),
        color: 8242229,
        footer: {
          text: local.footer.replace('{user}', message.author.username)
        },
        thumbnail: {
          url: member.user.displayAvatarURL
        },
        fields: [
          {
            name: local.joined_discord,
            value: member.user.createdAt.toUTCString()
          },
          {
            name: local.joined_server,
            value: member.joinedAt.toUTCString(),
            inline: true
          },
          {
            name: local.goes_by,
            value: member.displayName,
            inline: true
          },
          {
            name: local.roles,
            value: RoleList,
            inline: true
          },
          {
            name: local.ID,
            value: member.user.id,
            inline: true
          },
          {
            name: local.avatar,
            value: local.avatarLink.replace('{url}', member.user.displayAvatarURL)
          }
        ]
      }
      message.channel.send({ embed })
    }
  }
}

exports.ban = {
  info: (client, message) => {
    return client.extraFunction.getLocalizedCommand(client, message, 'ban').info
  },
  run: (client, message) => {
    const local = client.extraFunction.getLocalizedCommand(client, message, 'ban')
    if (!message.member.permissions.has('BAN_MEMBERS')) message.reply(local.cant_ban_others)
    else if (message.mentions.members.array().length === 0) client.commands.get('help').command(client, message, 'ban')
    else {
      let membersBanned = 0
      const firstMember = Math.max(message.member.roles.array())

      message.mentions.members.array().forEach(member => {
        if (message.member.user.id === member.id) message.reply(local.cant_ban_self)
         else if (member === message.guild.me) message.channel.send(local.cant_ban_kiru)
         else if (message.guild.owner === member) message.reply(local.cant_ban_owner)
         else if (member.manageable === false) message.reply(local.cant_ban_higher_than_kiru.replace('{username}',member.user.username))
         else {
          if (Math.max(member.roles.array()) >= firstMember) message.reply(local.cant_ban_higher_than_user.replace('{username}',member.user.username))
          else {
            member.ban()
            membersBanned++
          }
        }
      })
      if (membersBanned > 1) message.reply(local.banedmembers.replace('{amount}', membersBanned))
      else if ( membersBanned === 0 && message.mentions.members.array().length === 1 ) {}
      else if (membersBanned === 0) message.reply(local.banedNone)
      else message.channel.send(local.banedOne.replace('{user}', message.mentions.users.array()[0].username))
    }
  }
}

exports.kick = {
  info: (client, message) => {
    return client.extraFunction.getLocalizedCommand(client, message, 'kick').info
  },
  run: (client, message) => {
    const local = client.extraFunction.getLocalizedCommand(client, message, 'kick')
    if (!message.member.permissions.has('KICK_MEMBERS') &&!message.member.permissions.has('BAN_MEMBERS')) message.reply(local.cant_kick_others)
    else if (message.mentions.members.array().length === 0) client.commands.get('help').command(client, message, 'kick')
    else {
      let membersBanned = 0
      const firstMember = Math.max(message.member.roles.array())

      message.mentions.members.array().forEach(member => {
        if (message.member.user.id === member.id) message.reply(local.cant_kick_self)
        else if (member === message.guild.me) message.channel.send(local.cant_kick_kiru)
        else if (message.guild.owner === member) message.reply(local.cant_kick_owner)
        else if (member.manageable === false) message.reply(local.cant_kick_higher_than_kiru.replace('{username}', member.user.username))
        else {
          const otherMember = Math.max(member.roles.array())
          if (otherMember >= firstMember) message.reply(local.cant_kick_higher_than_user.replace('{username}', member.user.username))
          else {
            member.kick()
            membersBanned++
          }
        }
      })
      if (membersBanned > 1) message.reply(local.kickedmembers.replace('{amount}', membersBanned))
      else if (membersBanned === 0 &&message.mentions.members.array().length === 1) {}
      else if (membersBanned === 0) message.reply(local.kickedNone)
      else message.channel.send(local.kickedOne.replace('{user}', message.mentions.users.array()[0].username))
    }
  }
}
exports.say = {
  info: (client, message) => {
    return client.extraFunction.getLocalizedCommand(client, message, 'say').info
  },

  run: (client, message) => {
    let local = client.extraFunction.getLocalizedCommand(client, message, 'say')
    let say = message.content.replace(
      client.extraFunction.getPrefix(client, message) + 'say ',
      ''
    )
    if (say === client.extraFunction.getPrefix(client, message) + 'say') client.commands.get('help').command(client, message, 'say')
    else if (client.params.get('owners').includes(message.author.id)) {
      message.delete()
      message.channel.send(say)
    } else {
      const embed = {
        description: say,
        color: 8974259,
        footer: {
          text: local.no_responsibility
        }
      }
      message.channel.send({ embed })
    }
  }
}
