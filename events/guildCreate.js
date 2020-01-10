module.exports = (client, guild) => {
  if (client.function['guildCreate'] !== undefined) client.function['guildCreate'].forEach(fun => fun(client, guild))

  const embed = {
    title: 'New Server!',
    color: 7320862,
    timestamp: Date.now(),
    thumbnail: {
      url: guild.iconURL
    },
    fields: [
      {
        name: 'Server Name',
        value: guild.name,
        inline: true
      },
      {
        name: 'Member Count',
        value: guild.memberCount - 1,
        inline: true
      },
      {
        name: 'Owner',
        value: client.users.get(guild.ownerID).tag + ' <' + guild.ownerID + '>',
        inline: true
      }
    ]
  }
  client.channels.get(client.params.logs.guildReporter).send({ embed })
}
