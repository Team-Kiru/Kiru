module.exports = (client, member) => {
  const welcomeBlock = client.data.get('serverSpecificSettings.' + member.guild.id + '.goodbye')
  if (welcomeBlock !== undefined) {
    if (welcomeBlock.channel !== undefined && welcomeBlock.message !== undefined) {
      client.channels.get(welcomeBlock.channel).send(welcomeBlock.message.replace(/{mention}/gm, '@' + member.user.username + '#' + member.user.tag))
    }
  }
}
