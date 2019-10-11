module.exports = (client, member) => {
  const welcomeBlock = client.data.get('serverSpecificSettings.' + member.guild.id + '.welcome')
  if (welcomeBlock !== undefined) {
    if (welcomeBlock.channel !== undefined && welcomeBlock.message !== undefined) {
      client.channels.get(welcomeBlock.channel).send(welcomeBlock.message.replace(/{mention}/gm, '<@' + member.id + '>'))
    }
    if (welcomeBlock.role) {
    	// TODO: Just really need to add the role.
    }
  }
}
