module.exports = (client, member) => {
  if (client.function['guildMemberRemove'] !== undefined) {
    client.function['guildMemberRemove'].forEach(fun => {
      fun(client, member)
    })
  }
}
